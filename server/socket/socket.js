let db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const helper = require("../helper/helper");
db.messages.belongsTo(db.users, {
  foreignKey: "senderId",
  as: "senderData",
});
db.messages.belongsTo(db.users, {
  foreignKey: "receiverId",
  as: "reciverData",
});
db.messages.belongsTo(db.chatConstant, {
  foreignKey: "chatConstantId",
  as: "chatConstantData",
});
db.chatConstant.belongsTo(db.users, {
  foreignKey: "senderId",
  as: "chatconstantDataSender",
});
db.chatConstant.belongsTo(db.users, {
  foreignKey: "receiverId",
  as: "chatconstantDataReciver",
});
db.chatConstant.hasMany(db.messages, {
  foreignKey: "chatConstantId",
  as: "messages",
});
module.exports = function (io) {
  io.on("connection", function (socket) {
    socket.on("connectUser", async (connectListener) => {
      try {
        const { userId } = connectListener;

        if (!userId) {
          return socket.emit("connectUser", {
            success: false,
            message: "User ID is required",
          });
        }

        const user = await db.users.findOne({
          where: { id: userId },
          raw: true,
        });

        if (!user) {
          return socket.emit("connectUser", {
            success: false,
            message: "User not found",
          });
        }

        await db.users.update(
          {
            socketId: socket.id,
            online: "1",
          },
          {
            where: { id: userId },
          },
        );

        socket.emit("connectUser", {
          success: true,
          message: "Connected successfully",
          socketId: socket.id,
        });

        io.emit("userOnlineStatus", {
          userId: userId,
          online: "1",
        });
      } catch (error) {
        console.error("Error in connectUser:", error);
        socket.emit("connectUser", {
          success: false,
          message: "Internal server error",
        });
      }
    });
    socket.on("disconnect", async () => {
      try {
        const user = await db.users.findOne({
          where: { socketId: socket.id },
          raw: true,
        });

        if (user) {
          await db.users.update(
            {
              online: "0",
              socketId: "",
            },
            {
              where: { id: user.id },
            },
          );

          io.emit("userOnlineStatus", {
            userId: user.id,
            online: "0",
          });
        }
      } catch (error) {
        console.error("Error in disconnect:", error);
      }
    });
    socket.on("sendMessage", async (getData) => {
      try {
        let findConstant = await db.chatConstant.findOne({
          where: {
            [Op.or]: [
              { senderId: getData.senderId, receiverId: getData.receiverId },
              { senderId: getData.receiverId, receiverId: getData.senderId },
            ],
          },
          raw: true,
        });

        let chatConstantId = 0;

        if (!findConstant) {
          const createConstant = await db.chatConstant.create({
            senderId: getData.senderId,
            receiverId: getData.receiverId,
          });
          chatConstantId = createConstant.id;
        } else {
          chatConstantId = findConstant.id;
        }

        let messageToSave = getData.message;
        let messageType = getData.messageType || 1;
        const fileName = getData.fileName || null;

        const createMessage = await db.messages.create({
          senderId: getData.senderId,
          receiverId: getData.receiverId,
          message: messageToSave,
          messageType: messageType,
          chatConstantId: chatConstantId,
          deletedId: 0,
        });

        await db.chatConstant.update(
          { lastmessageId: createMessage.id, deletedId: 0 },
          { where: { id: chatConstantId } },
        );

        const senderUser = await db.users.findOne({
          where: { id: getData.senderId },
          raw: true,
        });

        const getMsgData = {
          id: createMessage.id,
          senderId: getData.senderId,
          receiverId: getData.receiverId,
          message: messageToSave,
          messageType: messageType,
          chatConstantId: chatConstantId,
          SenderName: senderUser?.name || "",
          SenderImage: senderUser?.image || "",
          fileName: fileName,
          createdAt: createMessage.createdAt,
        };

        const socketUser = await db.users.findOne({
          where: { id: getData.receiverId },
          raw: true,
        });

        const messageData = await db.users.findOne({
          where: { id: getData.senderId },
          raw: true,
        });

        let title = "Agrivision";
        let messagePreview = "";
        let icon = "📱";

        switch (messageType) {
          case 1:
            icon = "💬";
            messagePreview =
              messageToSave.length > 20
                ? messageToSave.slice(0, 20) + "..."
                : messageToSave;
            break;
          case 2:
            icon = "📷";
            messagePreview = "Sent an image";
            break;
          case 3:
            icon = "📄";
            messagePreview = "Sent a PDF file";
            break;
          case 4:
            icon = "📝";
            messagePreview = "Sent a document";
            break;
          case 5:
            icon = "📊";
            messagePreview = "Sent a CSV file";
            break;
          case 6:
            icon = "📈";
            messagePreview = "Sent an Excel file";
            break;
          case 7:
            icon = "🎬";
            messagePreview = "Sent a video";
            break;
          case 8:
            icon = "🎵";
            messagePreview = "Sent an audio file";
            break;
          default:
            icon = "📎";
            messagePreview = "Sent a file";
        }

        title = `${messageData?.name || "User"}`;

        const notiData = {
          msg: `${messageData?.name} sent ${messageType === 1 ? "a message" : "a file"}`,
          title: title,
          message: `${icon} ${messagePreview}`,
          messageType: String(messageType),
          senderId: String(getData.senderId),
          senderName: `${messageData?.name || ""}`.trim(),
          countryCode: String(messageData?.countryCode || ""),
          senderImage: String(messageData?.image || ""),
          phoneNumber: String(messageData?.phoneNumber || ""),
          type: 1,
        };

        const chatConstantRecord = await db.chatConstant.findOne({
          where: { id: chatConstantId },
          raw: true,
        });

        if (chatConstantRecord?.status != "2") {
          if (
            socketUser &&
            socketUser.deviceToken &&
            messageData?.isNotification == "1"
          ) {
            helper.sendPushNotification(
              socketUser.deviceToken,
              notiData,
              "chat",
            );
          } else {
            console.log(
              "No device token found for the receiver or notifications disabled.",
            );
          }
        } else {
          console.log(
            "Push notification skipped because chatConstant.status is 2.",
          );
        }

        if (socketUser && socketUser.socketId) {
          io.to(socketUser.socketId).emit("sendMessage", getMsgData);
        } else {
          console.log("No active socket for receiver.");
        }

        socket.emit("sendMessage", getMsgData);
      } catch (error) {
        console.error("Error in send_message:", error.message);
        console.error("Error stack:", error.stack);
      }
    });
    socket.on("getMessageList", async (getData) => {
      try {
        const chatConstant = await db.chatConstant.findOne({
          where: {
            deletedId: { [Op.not]: getData.senderId },
            [Op.or]: [
              { senderId: getData.senderId, receiverId: getData.receiverId },
              { senderId: getData.receiverId, receiverId: getData.senderId },
            ],
          },
          raw: true,
        });

        if (!chatConstant) {
          return socket.emit("getMessageList", {
            data: [],
          });
        }

        const allMessages = await db.messages.findAll({
          attributes: {
            include: [
              [
                Sequelize.literal(
                  "(SELECT CONCAT(users.name, ' ') FROM users WHERE users.id = messages.senderId)",
                ),
                "SenderName",
              ],
              [
                Sequelize.literal(
                  "(SELECT image FROM users WHERE users.id = messages.senderId)",
                ),
                "SenderImage",
              ],
              [
                Sequelize.literal(
                  "(SELECT CONCAT(users.name, ' ') FROM users WHERE users.id = messages.receiverId)",
                ),
                "ReceiverName",
              ],
              [
                Sequelize.literal(
                  "(SELECT image FROM users WHERE users.id = messages.receiverId)",
                ),
                "ReceiverImage",
              ],
            ],
          },
          where: {
            chatConstantId: chatConstant.id,
            deletedId: {
              [Op.or]: [null, { [Op.not]: getData.senderId }],
            },
          },
          order: [["id", "DESC"]],
        });

        await db.messages.update(
          { isRead: 1 },
          {
            where: {
              chatConstantId: chatConstant.id,
              senderId: getData.receiverId,
              receiverId: getData.senderId,
              isRead: 0,
            },
          },
        );

        socket.emit("getMessageList", {
          data: allMessages,
        });
      } catch (error) {
        socket.emit("getMessageList", { error: "Something went wrong." });
      }
    });
    socket.on("index", async (getData) => {
      try {
        const senderId = getData.senderId;
        const search = getData.search?.trim() || "";

        if (!senderId) {
          return socket.emit("index", {
            success: false,
            message: "senderId is required",
          });
        }

        let whereClause = {
          [Op.or]: [{ senderId: senderId }, { receiverId: senderId }],
        };

        whereClause = {
          ...whereClause,
          [Op.and]: [
            {
              [Op.or]: [
                { deletedId: null },
                { deletedId: { [Op.not]: senderId } },
                { deletedId: "" },
              ],
            },
          ],
        };

        if (search) {
          whereClause[Op.and] = Sequelize.literal(`
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = (
            CASE 
              WHEN chatConstant.senderId = ${senderId} THEN chatConstant.receiverId 
              ELSE chatConstant.senderId 
            END
          )
          AND CONCAT(users.name, ' ') LIKE ${db.sequelize.escape("%" + search + "%")}
        )
      `);
        }

        const OtherUserName = [
          Sequelize.literal(`(
        SELECT CONCAT(users.name, ' ')
        FROM users 
        WHERE users.id = (
          CASE 
            WHEN chatConstant.senderId = ${senderId} THEN chatConstant.receiverId 
            ELSE chatConstant.senderId 
          END
        )
      )`),
          "UserName",
        ];

        const OtherUserImage = [
          Sequelize.literal(`(
        SELECT image FROM users 
        WHERE users.id = (
          CASE 
            WHEN chatConstant.senderId = ${senderId} THEN chatConstant.receiverId 
            ELSE chatConstant.senderId 
          END
        )
      )`),
          "UserImage",
        ];

        const OtherUserOnline = [
          Sequelize.literal(`(
        SELECT online FROM users 
        WHERE users.id = (
          CASE 
            WHEN chatConstant.senderId = ${senderId} 
            THEN chatConstant.receiverId 
            ELSE chatConstant.senderId 
          END
        )
      )`),
          "UserOnlineStatus",
        ];

        const LastMessageType = [
          Sequelize.literal(`(
        SELECT messageType FROM messages 
        WHERE messages.id = chatConstant.lastmessageId LIMIT 1
      )`),
          "messageType",
        ];

        const LastMessage = [
          Sequelize.literal(`(
        SELECT message FROM messages 
        WHERE messages.id = chatConstant.lastmessageId LIMIT 1
      )`),
          "lastMessage",
        ];

        const UnreadMessagesCount = [
          Sequelize.literal(`(
        SELECT COUNT(*)
        FROM messages
        WHERE 
          messages.receiverId = ${senderId}
          AND messages.chatConstantId = chatConstant.id
          AND messages.isRead = 0
          AND (messages.deletedId IS NULL OR messages.deletedId != ${senderId})
      )`),
          "unreadMsg",
        ];

        const LastMessageSenderId = [
          Sequelize.literal(`(
        SELECT senderId FROM messages 
        WHERE messages.id = chatConstant.lastmessageId LIMIT 1
      )`),
          "lastMessageSenderId",
        ];

        const LastMessageCreatedAt = [
          Sequelize.literal(`(
        SELECT createdAt FROM messages 
        WHERE messages.id = chatConstant.lastmessageId LIMIT 1
      )`),
          "lastMessageCreatedAt",
        ];

        const constantList = await db.chatConstant.findAll({
          attributes: {
            include: [
              OtherUserName,
              OtherUserImage,
              OtherUserOnline,
              LastMessageType,
              LastMessage,
              LastMessageSenderId,
              UnreadMessagesCount,
              LastMessageCreatedAt,
            ],
          },
          where: whereClause,
          order: [
            [Sequelize.literal("lastMessageCreatedAt"), "DESC"],
            ["id", "DESC"],
          ],
        });

        socket.emit("index", {
          success: true,
          constantList,
        });
      } catch (error) {
        console.error("Error in index:", error);
        socket.emit("index", {
          success: false,
          message: "Something went wrong while fetching chat list.",
        });
      }
    });
    socket.on("onlineStatus", async (data) => {
      try {
        const { senderId, receiverId, status } = data;

        if (![0, 1].includes(status)) {
          return socket.emit("onlineStatus", {
            error_message: "Invalid online status value",
            code: 400,
          });
        }

        const room = await db.chatConstant.findOne({
          where: {
            [Op.or]: [
              { senderId, receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
          raw: true,
        });

        if (!room) {
          return socket.emit("onlineStatus", {
            error_message: "Chat room not found",
          });
        }

        var newStatus = room.status;

        if (status == 1 && room.status == 0) {
          newStatus = 1;
        } else if (status == 1 && room.status == 1) {
          newStatus = 2;
        } else if (status == 0 && room.status == 1) {
          newStatus = 0;
        } else if (status == 0 && room.status == 2) {
          newStatus = 1;
        }

        if (newStatus !== room.status) {
          await db.chatConstant.update(
            { status: newStatus },
            { where: { id: room.id } },
          );
        }

        socket.emit("onlineStatus", {
          successMessage: "Status updated successfully",
          data: `${newStatus}`,
        });
      } catch (error) {
        console.error("Error:", error);
        socket.emit("onlineStatus", {
          error_message: "An error occurred",
        });
      }
    });
    socket.on("readMessage", async (data) => {
      try {
        const { senderId, receiverId } = data;

        const chatConstant = await db.chatConstant.findOne({
          where: {
            [Op.or]: [
              { senderId, receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
          raw: true,
        });

        if (chatConstant) {
          const updated = await db.messages.update(
            {
              isRead: 1,
            },
            {
              where: {
                chatConstantId: chatConstant.id,
                senderId: senderId,
                receiverId: receiverId,
                isRead: 0,
              },
            },
          );

          const senderUser = await db.users.findOne({
            where: { id: senderId },
            raw: true,
          });
          const receiverUser = await db.users.findOne({
            where: { id: receiverId },
            raw: true,
          });

          if (senderUser && senderUser.socketId) {
            io.to(senderUser.socketId).emit("readMessage", {
              successMessage: "Messages marked as read successfully",
              senderId,
              receiverId,
              updatedCount: updated[0],
            });
          }

          if (receiverUser && receiverUser.socketId) {
            io.to(receiverUser.socketId).emit("readMessage", {
              successMessage: "Messages marked as read successfully",
              senderId,
              receiverId,
              updatedCount: updated[0],
            });
          }

          if (senderUser && senderUser.socketId) {
            io.to(senderUser.socketId).emit("refreshChatList", {
              userId: senderId,
            });
          }
          if (receiverUser && receiverUser.socketId) {
            io.to(receiverUser.socketId).emit("refreshChatList", {
              userId: receiverId,
            });
          }
        } else {
          socket.emit("readMessage", {
            error_message: "Chat not found",
            code: 404,
          });
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
        socket.emit("readMessage", {
          error_message: "Failed to mark messages as read",
          code: 400,
          error: error.message,
        });
      }
    });
    socket.on("unreadMessageCount", async (data) => {
      try {
        const { receiverId } = data;

        const unreadCount = await db.messages.count({
          where: {
            receiverId: receiverId,
            isRead: 0,
          },
          raw: true,
        });

        socket.emit("unreadMessageCount", {
          successMessage: "Unread count retrieved successfully",
          count: unreadCount,
        });
      } catch (error) {
        console.log("Error fetching unread count:", error);

        socket.emit("unreadMessageCount", {
          errorMessage: "Failed to retrieve notification count",
          code: 400,
          error: error.message,
        });
      }
    });
    socket.on("reportMessage", async (data) => {
      try {
        const { reportedBy, reportedTo, reason } = data;

        const report = await db.reports.create({
          reportedBy: reportedBy,
          reportedTo: reportedTo,
          reason: reason,
        });

        socket.emit("reportMessage", {
          successMessage: "Reported successfully",
          reportId: report.id,
        });
      } catch (error) {
        console.log("Error reporting message:", error);
        socket.emit("reportMessage", {
          errorMessage: "Failed to report message",
          code: 400,
          error: error.message,
        });
      }
    });
    socket.on("unreadNotificationCount", async (data) => {
      try {
        const { receiverId } = data;

        const unreadCount = await db.notifications.count({
          where: {
            receiverId: receiverId,
            isRead: "0",
          },
          raw: true,
        });

        socket.emit("unreadNotificationCount", {
          successMessage: "Unread count retrieved successfully",
          count: unreadCount,
        });
      } catch (error) {
        socket.emit("unreadNotificationCount", {
          error_message: "Failed to retrieve notification count",
          code: 400,
          error: error.message,
        });
      }
    });
    socket.on("readNotification", async (data) => {
      try {
        const { receiverId } = data;

        const [updatedCount] = await db.notifications.update(
          {
            isRead: "1",
          },
          {
            where: {
              receiverId: receiverId,
              isRead: "0",
            },
          },
        );

        socket.emit("readNotification", {
          successMessage: "Notifications marked as read successfully",
          count: updatedCount,
        });
      } catch (error) {
        console.error("Error marking notifications as read:", error);
        socket.emit("readNotification", {
          error_message: "Failed to mark notifications as read",
          code: 400,
          error: error.message,
        });
      }
    });
    socket.on("unreadCardCount", async (data) => {
      try {
        const { userId } = data;

        const unreadCount = await db.bookingcart.count({
          where: {
            userId: userId,
            isRead: "0",
          },
          raw: true,
        });

        socket.emit("unreadCardCount", {
          successMessage: "Unread card count retrieved successfully",
          count: unreadCount,
        });
      } catch (error) {
        socket.emit("unreadCardCount", {
          error_message: "Failed to retrieve card count",
          code: 400,
          error: error.message,
        });
      }
    });
    socket.on("readCard", async (data) => {
      try {
        const { userId } = data;

        const [updatedCount] = await db.bookingcart.update(
          {
            isRead: "1",
          },
          {
            where: {
              userId: userId,
              isRead: "0",
            },
          },
        );

        socket.emit("readCard", {
          successMessage: "Card marked as read successfully",
          updatedCount: updatedCount,
        });
      } catch (error) {
        console.error("Error marking Card as read:", error);
        socket.emit("readCard", {
          error_message: "Failed to mark Card as read",
          code: 400,
          error: error.message,
        });
      }
    });
    socket.on("deleteChat", async (getData) => {
      try {
        const { senderId, receiverId } = getData;

        const findConstant = await db.chatConstant.findOne({
          where: {
            [Op.or]: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
          raw: true,
        });

        if (!findConstant) {
          socket.emit("deleteChat", { error: "Chat session not found." });
          return;
        }

        const chatConstantId = findConstant.id;

        const messages = await db.messages.findAll({
          where: { chatConstantId: chatConstantId },
        });

        for (const msg of messages) {
          if (!msg.deletedId) {
            await db.messages.update(
              { deletedId: senderId },
              { where: { id: msg.id } },
            );
          } else if (msg.deletedId === receiverId) {
            await db.messages.destroy({ where: { id: msg.id } });
          }
        }

        await db.chatConstant.update(
          { deletedId: senderId },
          { where: { id: chatConstantId } },
        );

        await db.chatConstant.update(
          { lastmessageId: 0 },
          { where: { id: chatConstantId } },
        );

        socket.emit("deleteChat", { successmessage: "Chat deleted" });
      } catch (error) {
        console.error("deleteChat error:", error);
        socket.emit("deleteChat", {
          error: "Something went wrong while clearing chat",
        });
      }
    });
  });
};
