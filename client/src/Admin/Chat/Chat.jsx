import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import {
  FaPaperPlane,
  FaImage,
  FaFile,
  FaTimes,
  FaEye,
  FaSearch,
  FaVideo,
  FaMusic,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
  FaDownload,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { BsTrashFill } from "react-icons/bs";
import { BASE_URL } from "../../Config";
import Swal from "sweetalert2";
import axios from "axios";

const MESSAGE_TYPES = {
  TEXT: 1,
  IMAGE: 2,
  PDF: 3,
  DOCUMENT: 4,
  CSV: 5,
  EXCEL: 6,
  VIDEO: 7,
  AUDIO: 8,
};

const FILE_TYPE_NAMES = {
  1: "message",
  2: "image",
  3: "PDF",
  4: "document",
  5: "CSV file",
  6: "Excel file",
  7: "video",
  8: "audio",
};

const FILE_ICONS = {
  2: <FaImage className="text-primary" />,
  3: <FaFilePdf className="text-danger" />,
  4: <FaFileWord className="text-primary" />,
  5: <FaFileExcel className="text-success" />,
  6: <FaFileExcel className="text-success" />,
  7: <FaVideo className="text-info" />,
  8: <FaMusic className="text-warning" />,
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const Chat = () => {
  const { socket, isConnected, sendMessage, getChatList, getMessageList } =
    useSocket();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const [fileTypeFilter, setFileTypeFilter] = useState("");

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {}
    }
  }, []);

  const formatChatTime = useCallback((timestamp) => {
    if (!timestamp) return "Just now";

    const messageDate = new Date(timestamp);
    if (isNaN(messageDate.getTime())) return "Just now";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDateStart = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate(),
    );

    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (messageDateStart.getTime() === today.getTime()) return "Today";
    if (messageDateStart.getTime() === yesterday.getTime()) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return messageDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }, []);

  const formatMessageDate = useCallback((dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const diffDays = Math.floor((now - date) / 86400000);

    if (dateStart.getTime() === today.getTime()) return "Today";
    if (dateStart.getTime() === yesterday.getTime()) return "Yesterday";
    if (diffDays < 7) {
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return dayNames[date.getDay()];
    }

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }, []);

  const formatMessageTime = useCallback((dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const loadChatList = useCallback(() => {
    if (socket && currentUser?.id) {
      setLoading(true);
      getChatList({
        senderId: currentUser.id,
        search: searchTerm,
      });
    }
  }, [socket, currentUser, searchTerm, getChatList]);

  useEffect(() => {
    if (!socket || !currentUser?.id) return;

    const handleChatList = (data) => {
      setLoading(false);
      if (data.success && data.constantList) {
        const formattedChats = data.constantList.map((chat) => ({
          id: chat.id,
          chatConstantId: chat.id,
          senderId: chat.senderId,
          receiverId: chat.receiverId,
          senderName: chat.UserName || "Unknown User",
          senderImage:
            chat.UserImage || "https://randomuser.me/api/portraits/men/1.jpg",
          lastMessage: chat.lastMessage || "No messages yet",
          timestamp: chat.lastMessageCreatedAt || new Date().toISOString(),
          formattedTime: formatChatTime(
            chat.lastMessageCreatedAt || chat.updatedAt,
          ),
          unreadCount: chat.unreadMsg || 0,
          isOnline: chat.UserOnlineStatus === "1",
          messageType: chat.messageType || MESSAGE_TYPES.TEXT,
          lastMessageSenderId: chat.lastMessageSenderId,
        }));
        setChats(formattedChats);
      }
    };

    socket.on("index", handleChatList);
    loadChatList();

    return () => {
      socket.off("index", handleChatList);
    };
  }, [socket, currentUser, formatChatTime, loadChatList]);

  const formatMessage = useCallback(
    (msg) => {
      const isSenderCurrentUser =
        currentUser && msg.senderId === currentUser.id;
      const chat = chats.find((c) => c.senderId === msg.senderId);

      const senderName = isSenderCurrentUser
        ? "You"
        : msg.SenderName || msg.senderName || chat?.senderName || "User";

      const senderImage = isSenderCurrentUser
        ? currentUser?.image || "https://randomuser.me/api/portraits/men/10.jpg"
        : msg.SenderImage ||
          msg.senderImage ||
          chat?.senderImage ||
          "https://randomuser.me/api/portraits/men/1.jpg";

      const isFileMessage =
        msg.messageType && msg.messageType !== MESSAGE_TYPES.TEXT;
      const filePath = isFileMessage ? msg.message : null;
      const fileName =
        msg.fileName || (isFileMessage ? filePath?.split("/").pop() : null);

      return {
        id: msg.id || Date.now(),
        message: msg.message,
        senderName,
        senderImage,
        timestamp: msg.createdAt || new Date().toISOString(),
        formattedTime: formatMessageTime(msg.createdAt),
        formattedDate: formatMessageDate(msg.createdAt),
        isCurrentUser: isSenderCurrentUser,
        messageType: msg.messageType || MESSAGE_TYPES.TEXT,
        fileName,
        filePath,
        originalTimestamp: msg.createdAt
          ? new Date(msg.createdAt).getTime()
          : Date.now(),
        isOptimistic: msg.isOptimistic || false,
      };
    },
    [chats, currentUser, formatMessageTime, formatMessageDate],
  );

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      const isForSelectedChat =
        selectedChat && data.chatConstantId === selectedChat.chatConstantId;
      const isCurrentUserReceiver =
        currentUser && data.receiverId === currentUser.id;

      if (isForSelectedChat) {
        setMessages((prev) => {
          const currentMessages = prev[selectedChat.chatConstantId] || [];
          const formattedMessage = formatMessage(data);

          const optimisticIndex = currentMessages.findIndex(
            (msg) =>
              msg.isOptimistic &&
              ((msg.message === data.message &&
                data.messageType === MESSAGE_TYPES.TEXT) ||
                (msg.fileName && data.messageType !== MESSAGE_TYPES.TEXT)),
          );

          if (optimisticIndex !== -1) {
            const updatedMessages = [...currentMessages];
            updatedMessages[optimisticIndex] = {
              ...formattedMessage,
              id: data.id || formattedMessage.id,
            };
            return { ...prev, [selectedChat.chatConstantId]: updatedMessages };
          }

          const messageExists = currentMessages.some(
            (msg) => data.id && msg.id === data.id,
          );
          if (!messageExists) {
            return {
              ...prev,
              [selectedChat.chatConstantId]: [
                ...currentMessages,
                formattedMessage,
              ],
            };
          }

          return prev;
        });

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        if (isCurrentUserReceiver) {
          socket.emit("readMessage", {
            senderId: data.senderId,
            receiverId: currentUser.id,
          });
        }
      } else if (isCurrentUserReceiver) {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.chatConstantId === data.chatConstantId) {
              const fileTypes = {
                [MESSAGE_TYPES.IMAGE]: "📷 Image",
                [MESSAGE_TYPES.PDF]: "📄 PDF",
                [MESSAGE_TYPES.DOCUMENT]: "📝 Document",
                [MESSAGE_TYPES.CSV]: "📊 CSV",
                [MESSAGE_TYPES.EXCEL]: "📈 Excel",
                [MESSAGE_TYPES.VIDEO]: "🎬 Video",
                [MESSAGE_TYPES.AUDIO]: "🎵 Audio",
              };

              const previewMessage =
                data.messageType === MESSAGE_TYPES.TEXT
                  ? data.message
                  : fileTypes[data.messageType] || "📎 File";

              return {
                ...chat,
                unreadCount: chat.unreadCount + 1,
                lastMessage: previewMessage,
                timestamp: data.createdAt || new Date().toISOString(),
                formattedTime: formatChatTime(
                  data.createdAt || new Date().toISOString(),
                ),
                lastMessageSenderId: data.senderId,
              };
            }
            return chat;
          }),
        );
      }

      loadChatList();
    };

    socket.on("sendMessage", handleNewMessage);
    return () => socket.off("sendMessage", handleNewMessage);
  }, [
    socket,
    selectedChat,
    currentUser,
    formatMessage,
    formatChatTime,
    loadChatList,
  ]);

  const loadMessages = useCallback(
    (chat) => {
      if (socket && currentUser?.id && chat) {
        setMessageLoading(true);
        getMessageList({
          senderId: currentUser.id,
          receiverId:
            chat.senderId === currentUser.id ? chat.receiverId : chat.senderId,
        });
      }
    },
    [socket, currentUser, getMessageList],
  );

  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleMessageList = (data) => {
      setMessageLoading(false);
      if (data.data) {
        const sortedMessages = [...data.data].sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeA - timeB;
        });

        const formattedMessages = sortedMessages.map(formatMessage);
        setMessages((prev) => ({
          ...prev,
          [selectedChat.chatConstantId]: formattedMessages,
        }));

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    socket.on("getMessageList", handleMessageList);
    return () => socket.off("getMessageList", handleMessageList);
  }, [socket, selectedChat, formatMessage]);

  const handleSelectChat = useCallback(
    (chat) => {
      setSelectedChat(chat);

      setChats((prevChats) =>
        prevChats.map((c) =>
          c.chatConstantId === chat.chatConstantId
            ? { ...c, unreadCount: 0 }
            : c,
        ),
      );

      if (socket && currentUser?.id) {
        socket.emit("readMessage", {
          senderId: currentUser.id,
          receiverId:
            chat.senderId === currentUser.id ? chat.receiverId : chat.senderId,
        });
      }

      loadMessages(chat);
    },
    [socket, currentUser, loadMessages],
  );

  useEffect(() => {
    if (selectedChat && messages[selectedChat.chatConstantId]) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, selectedChat]);

  const getMessageTypeFromFile = useCallback((file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    const typeMap = {
      jpg: MESSAGE_TYPES.IMAGE,
      jpeg: MESSAGE_TYPES.IMAGE,
      png: MESSAGE_TYPES.IMAGE,
      gif: MESSAGE_TYPES.IMAGE,
      webp: MESSAGE_TYPES.IMAGE,
      bmp: MESSAGE_TYPES.IMAGE,
      svg: MESSAGE_TYPES.IMAGE,
      pdf: MESSAGE_TYPES.PDF,
      doc: MESSAGE_TYPES.DOCUMENT,
      docx: MESSAGE_TYPES.DOCUMENT,
      txt: MESSAGE_TYPES.DOCUMENT,
      rtf: MESSAGE_TYPES.DOCUMENT,
      csv: MESSAGE_TYPES.CSV,
      xls: MESSAGE_TYPES.EXCEL,
      xlsx: MESSAGE_TYPES.EXCEL,
      mp4: MESSAGE_TYPES.VIDEO,
      avi: MESSAGE_TYPES.VIDEO,
      mov: MESSAGE_TYPES.VIDEO,
      mkv: MESSAGE_TYPES.VIDEO,
      wmv: MESSAGE_TYPES.VIDEO,
      webm: MESSAGE_TYPES.VIDEO,
      mp3: MESSAGE_TYPES.AUDIO,
      wav: MESSAGE_TYPES.AUDIO,
      aac: MESSAGE_TYPES.AUDIO,
      ogg: MESSAGE_TYPES.AUDIO,
      m4a: MESSAGE_TYPES.AUDIO,
    };
    return typeMap[extension] || MESSAGE_TYPES.DOCUMENT;
  }, []);

  const uploadFile = useCallback(
    async (file) => {
      if (!file) return null;

      try {
        setUploading(true);
        const messageType = getMessageTypeFromFile(file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("messageType", messageType.toString());
        formData.append("fileName", file.name);

        const response = await axios.post(
          `${BASE_URL}/api/fileupload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        if (response.data.success && response.data.data) {
          return {
            path: response.data.data.filePath,
            publicUrl: response.data.data.publicUrl,
            messageType: parseInt(response.data.data.messageType),
            fileType: response.data.data.fileType,
          };
        }

        return null;
      } catch (error) {
        Swal.fire({
          title: "Upload Failed",
          text:
            error.response?.data?.message ||
            "Failed to upload file. Please try again.",
          icon: "error",
        });
        return null;
      } finally {
        setUploading(false);
      }
    },
    [getMessageTypeFromFile],
  );

  const addOptimisticFileMessage = useCallback(
    (file, messageType) => {
      const tempMessageId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const fileTypes = {
        [MESSAGE_TYPES.IMAGE]: "📷 Image",
        [MESSAGE_TYPES.PDF]: "📄 PDF",
        [MESSAGE_TYPES.DOCUMENT]: "📝 Document",
        [MESSAGE_TYPES.CSV]: "📊 CSV",
        [MESSAGE_TYPES.EXCEL]: "📈 Excel",
        [MESSAGE_TYPES.VIDEO]: "🎬 Video",
        [MESSAGE_TYPES.AUDIO]: "🎵 Audio",
      };

      const optimisticMsg = {
        id: tempMessageId,
        message: fileTypes[messageType] || "📎 File",
        senderId: currentUser.id,
        senderName: "You",
        senderImage:
          currentUser?.image ||
          "https://randomuser.me/api/portraits/men/10.jpg",
        timestamp: new Date().toISOString(),
        formattedTime: formatMessageTime(new Date()),
        formattedDate: formatMessageDate(new Date()),
        isCurrentUser: true,
        messageType,
        fileName: file.name,
        filePath: URL.createObjectURL(file),
        isOptimistic: true,
        tempId: tempMessageId,
      };

      setMessages((prev) => ({
        ...prev,
        [selectedChat.chatConstantId]: [
          ...(prev[selectedChat.chatConstantId] || []),
          optimisticMsg,
        ],
      }));

      return tempMessageId;
    },
    [currentUser, selectedChat, formatMessageTime, formatMessageDate],
  );

  const removeOptimisticMessage = useCallback(
    (tempId) => {
      setMessages((prev) => {
        const currentMessages = prev[selectedChat.chatConstantId] || [];
        return {
          ...prev,
          [selectedChat.chatConstantId]: currentMessages.filter(
            (msg) => msg.tempId !== tempId,
          ),
        };
      });
    },
    [selectedChat],
  );

  const handleSendMessage = useCallback(async () => {
    if (!selectedChat || !currentUser?.id) return;
    if (!newMessage.trim() && !selectedFile) return;

    const receiverId =
      selectedChat.senderId === currentUser.id
        ? selectedChat.receiverId
        : selectedChat.senderId;

    let messageContent = newMessage;
    let messageType = MESSAGE_TYPES.TEXT;
    let fileName = null;
    let tempMessageId = null;

    if (selectedFile) {
      messageType = getMessageTypeFromFile(selectedFile);
      tempMessageId = addOptimisticFileMessage(selectedFile, messageType);

      const uploadResult = await uploadFile(selectedFile);
      if (!uploadResult) {
        removeOptimisticMessage(tempMessageId);
        return;
      }

      messageContent = uploadResult.path;
      messageType = uploadResult.messageType;
      fileName = selectedFile.name;
    }

    const messageData = {
      senderId: currentUser.id,
      receiverId,
      message: messageContent,
      messageType,
      fileName,
    };

    sendMessage(messageData);

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatConstantId === selectedChat.chatConstantId
          ? {
              ...chat,
              lastMessage:
                messageType === MESSAGE_TYPES.TEXT
                  ? messageContent
                  : fileName || "File",
              timestamp: new Date().toISOString(),
              formattedTime: formatChatTime(new Date()),
              unreadCount: 0,
              lastMessageSenderId: currentUser.id,
              messageType,
            }
          : chat,
      ),
    );

    setNewMessage("");
    setSelectedFile(null);
    setPreviewUrl("");
    setFileTypeFilter("");

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [
    selectedChat,
    currentUser,
    newMessage,
    selectedFile,
    getMessageTypeFromFile,
    addOptimisticFileMessage,
    uploadFile,
    removeOptimisticMessage,
    sendMessage,
    formatChatTime,
  ]);

  const isFileTypeValid = (file, filterType) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();

    switch (filterType) {
      case "image":
        return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
          fileExtension,
        );
      case "video":
        return ["mp4", "avi", "mov", "mkv", "wmv", "webm"].includes(
          fileExtension,
        );
      case "audio":
        return ["mp3", "wav", "aac", "ogg", "m4a"].includes(fileExtension);
      case "pdf":
        return ["pdf"].includes(fileExtension);
      case "document":
        return ["doc", "docx", "txt", "rtf"].includes(fileExtension);
      case "excel":
        return ["csv", "xls", "xlsx"].includes(fileExtension);
      default:
        return true;
    }
  };

  const getFileTypeLabel = (filterType) => {
    const labels = {
      image: "image (jpg, png, gif, etc.)",
      video: "video (mp4, avi, mov, etc.)",
      audio: "audio (mp3, wav, aac, etc.)",
      pdf: "PDF",
      document: "document (doc, docx, txt, etc.)",
      excel: "Excel/CSV (csv, xls, xlsx)",
    };
    return labels[filterType] || "file";
  };

  const getAcceptAttribute = (filterType) => {
    switch (filterType) {
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      case "audio":
        return "audio/*";
      case "pdf":
        return ".pdf";
      case "document":
        return ".doc,.docx,.txt,.rtf";
      case "excel":
        return ".csv,.xls,.xlsx";
      default:
        return "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.rtf,.csv,.xls,.xlsx";
    }
  };

  const handleFileSelect = useCallback((event, filterType = "") => {
    const file = event.target.files[0];
    if (!file) return;

    if (filterType && !isFileTypeValid(file, filterType)) {
      Swal.fire({
        title: "Invalid File Type",
        text: `Please select a ${getFileTypeLabel(filterType)} file`,
        icon: "error",
      });
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      Swal.fire({
        title: "File Too Large",
        text: "Maximum file size is 10MB",
        icon: "error",
      });
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else if (file.type.startsWith("audio/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }

    event.target.value = "";
  }, []);

  const triggerFileInput = (filterType) => {
    setFileTypeFilter(filterType);

    const tempInput = document.createElement("input");
    tempInput.type = "file";
    tempInput.accept = getAcceptAttribute(filterType);
    tempInput.style.display = "none";

    tempInput.onchange = (e) => handleFileSelect(e, filterType);

    document.body.appendChild(tempInput);
    tempInput.click();
    document.body.removeChild(tempInput);
  };

  const filteredChats = useMemo(
    () =>
      chats.filter(
        (chat) =>
          chat.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [chats, searchTerm],
  );

  const formatUnreadCount = useCallback(
    (count) => (count > 99 ? "+99" : count.toString()),
    [],
  );

  const handleDeleteChat = useCallback(
    (chatId) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this chat!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const chatToDelete = chats.find((chat) => chat.id === chatId);
          if (!chatToDelete || !currentUser?.id) {
            Swal.fire(
              "Error!",
              "Unable to delete chat. Missing information.",
              "error",
            );
            return;
          }

          const fallbackTimeout = setTimeout(() => {
            Swal.fire({
              title: "Success!",
              text: "Chat deletion request sent.",
              icon: "success",
              confirmButtonColor: "#3085d6",
            });
            setChats((prevChats) =>
              prevChats.filter((chat) => chat.id !== chatId),
            );
            if (selectedChat?.id === chatId) setSelectedChat(null);
          }, 2000);

          const receiverId =
            chatToDelete.senderId === currentUser.id
              ? chatToDelete.receiverId
              : chatToDelete.senderId;

          socket.emit("deleteChat", {
            senderId: currentUser.id,
            receiverId,
            chatConstantId: chatToDelete.chatConstantId,
          });

          socket.once("deleteChat", (response) => {
            clearTimeout(fallbackTimeout);
            if (response.successmessage) {
              setChats((prevChats) =>
                prevChats.filter((chat) => chat.id !== chatId),
              );
              if (selectedChat?.id === chatId) setSelectedChat(null);
              Swal.fire({
                title: "Deleted!",
                text: "Chat has been deleted.",
                icon: "success",
              });
            } else if (response.error) {
              Swal.fire({
                title: "Error!",
                text: response.error,
                icon: "error",
              });
            }
          });
        } else {
          Swal.fire({
            title: "Cancelled",
            text: "Chat deletion has been cancelled",
            icon: "info",
          });
        }
      });
    },
    [chats, currentUser, selectedChat, socket],
  );

  const handleAudioPlay = useCallback(
    (messageId, audioUrl) => {
      if (audioPlaying === messageId) {
        audioRef.current?.pause();
        setAudioPlaying(null);
      } else {
        if (audioRef.current) audioRef.current.pause();
        if (videoRef.current) videoRef.current.pause();

        const audio = new Audio(`${BASE_URL}${audioUrl}`);
        audioRef.current = audio;
        audio.play();
        setAudioPlaying(messageId);
        audio.onended = () => setAudioPlaying(null);
      }
    },
    [audioPlaying],
  );

  const renderMessageContent = useCallback(
    (msg) => {
      if (msg.messageType === MESSAGE_TYPES.TEXT) {
        return (
          <div className="mb-1" style={{ whiteSpace: "pre-line" }}>
            {msg.message}
          </div>
        );
      }

      const fileUrl = msg.filePath ? `${BASE_URL}${msg.filePath}` : null;
      const fileName = msg.fileName || msg.message?.split("/").pop() || "File";
      const fileTypeName = FILE_TYPE_NAMES[msg.messageType] || "file";

      return (
        <div className="mb-2">
          <div className="d-flex align-items-center mb-2">
            {FILE_ICONS[msg.messageType] || (
              <FaFileAlt className="text-secondary" />
            )}
            <small className="ms-2 text-muted">
              <span className="text-muted">{fileTypeName}</span>
            </small>
          </div>

          {msg.messageType === MESSAGE_TYPES.IMAGE && fileUrl && (
            <div className="mt-2">
              <img
                src={fileUrl}
                alt={fileName}
                className="img-fluid rounded cursor-pointer"
                style={{ maxWidth: "300px", maxHeight: "200px" }}
                onClick={() => window.open(fileUrl, "_blank")}
              />
            </div>
          )}

          {msg.messageType === MESSAGE_TYPES.VIDEO && fileUrl && (
            <div className="mt-2">
              <video
                src={fileUrl}
                className="img-fluid rounded"
                style={{ maxWidth: "300px", maxHeight: "200px" }}
                controls
              />
            </div>
          )}

          {msg.messageType === MESSAGE_TYPES.AUDIO && fileUrl && (
            <div className="mt-2">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => handleAudioPlay(msg.id, msg.filePath)}
                >
                  {audioPlaying === msg.id ? <FaPause /> : <FaPlay />}
                </button>
                <span className="small">{fileName}</span>
              </div>
            </div>
          )}

          {[
            MESSAGE_TYPES.PDF,
            MESSAGE_TYPES.DOCUMENT,
            MESSAGE_TYPES.CSV,
            MESSAGE_TYPES.EXCEL,
          ].includes(msg.messageType) &&
            fileUrl && (
              <div className="mt-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-secondary"
                  download
                >
                  <FaDownload className="me-1" />
                  Download {fileTypeName}
                </a>
              </div>
            )}
        </div>
      );
    },
    [audioPlaying, handleAudioPlay],
  );

  const renderGroupedMessages = useCallback(
    (messagesArray) => {
      let lastDate = "";
      const groupedMessages = [];

      messagesArray.forEach((msg, index) => {
        const messageDate =
          msg.formattedDate || formatMessageDate(msg.timestamp);

        if (messageDate && messageDate !== lastDate) {
          groupedMessages.push(
            <div
              key={`date-${msg.id}-${index}`}
              className="flex justify-center my-4"
            >
              <div className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full text-center">
                {messageDate}
              </div>
            </div>,
          );
          lastDate = messageDate;
        }

        groupedMessages.push(
          <div
            key={msg.id}
            className={`d-flex mb-3 ${msg.isCurrentUser ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`d-flex align-items-start ${msg.isCurrentUser ? "flex-row-reverse" : ""}`}
              style={{ maxWidth: "80%" }}
            >
              <img
                src={`${BASE_URL}${msg.senderImage}`}
                alt={msg.senderName}
                className="rounded-circle"
                style={{ width: "35px", height: "35px", objectFit: "cover" }}
              />
              <div
                className={`mx-2 p-3 rounded ${msg.isCurrentUser ? "bg-primary text-white" : "bg-light"}`}
                style={{ maxWidth: "100%" }}
              >
                {renderMessageContent(msg)}
                <small
                  className={`d-block text-end ${msg.isCurrentUser ? "text-white-50" : "text-muted"}`}
                >
                  {msg.formattedTime}
                </small>
              </div>
            </div>
          </div>,
        );
      });

      return groupedMessages;
    },
    [renderMessageContent, formatMessageDate],
  );

  return (
    <div id="layout-wrapper">
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="title-box pb-1">
              <h4 className="mb-0 page-title">Chat</h4>
              <nav aria-label="breadcrumb" className="mt-1">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard" className="new">
                      <i className="ri-home-4-fill me-1" /> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Chat
                  </li>
                </ol>
              </nav>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="row">
                  {/* Chat List Sidebar */}
                  <div className="col-md-4 col-lg-3">
                    <div className="card chat-list-card">
                      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Chats</h5>
                        {loading && (
                          <div
                            className="spinner-border spinner-border-sm text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 border-bottom">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && loadChatList()
                            }
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={loadChatList}
                          >
                            <FaSearch />
                          </button>
                        </div>
                      </div>

                      <div className="card-body p-0">
                        <div
                          className="list-group list-group-flush"
                          style={{ maxHeight: "500px", overflowY: "auto" }}
                        >
                          {filteredChats.map((chat) => (
                            <div
                              key={chat.id}
                              className={`list-group-item list-group-item-action chat-list-item ${selectedChat?.chatConstantId === chat.chatConstantId ? "active" : ""}`}
                              onClick={() => handleSelectChat(chat)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="d-flex align-items-center">
                                <div className="position-relative">
                                  <img
                                    src={`${BASE_URL}${chat.senderImage}`}
                                    alt={chat.senderName}
                                    className="rounded-circle me-3"
                                    style={{
                                      width: "45px",
                                      height: "45px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h6 className="mb-0">{chat.senderName}</h6>
                                    {chat.unreadCount > 0 &&
                                      selectedChat?.chatConstantId !==
                                        chat.chatConstantId && (
                                        <span className="badge bg-danger rounded-pill">
                                          {formatUnreadCount(chat.unreadCount)}
                                        </span>
                                      )}
                                  </div>
                                  <p
                                    className="mb-0 text-muted text-truncate"
                                    style={{ maxWidth: "150px" }}
                                  >
                                    {chat.messageType === MESSAGE_TYPES.TEXT ? (
                                      chat.lastMessage
                                    ) : (
                                      <>
                                        {FILE_ICONS[chat.messageType]}
                                        <span className="ms-1">
                                          {FILE_TYPE_NAMES[chat.messageType]}
                                        </span>
                                      </>
                                    )}
                                  </p>
                                  <small className="text-muted">
                                    {chat.formattedTime}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Window */}
                  <div className="col-md-8 col-lg-9">
                    <div className="card chat-window-card h-100">
                      {selectedChat ? (
                        <>
                          <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="position-relative me-3">
                                <img
                                  src={`${BASE_URL}${selectedChat.senderImage}`}
                                  alt={selectedChat.senderName}
                                  className="rounded-circle"
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    objectFit: "cover",
                                  }}
                                />
                                {selectedChat.isOnline && (
                                  <span
                                    className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                                    style={{
                                      width: "10px",
                                      height: "10px",
                                      border: "2px solid white",
                                    }}
                                  />
                                )}
                              </div>
                              <div>
                                <h5 className="mb-0">
                                  {selectedChat.senderName}
                                </h5>
                                <small
                                  className={
                                    selectedChat.isOnline
                                      ? "text-success"
                                      : "text-muted"
                                  }
                                >
                                  {selectedChat.isOnline ? "Online" : "Offline"}
                                </small>
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  handleDeleteChat(selectedChat.id)
                                }
                              >
                                <BsTrashFill />
                              </button>
                            </div>
                          </div>

                          <div
                            className="card-body chat-messages-container"
                            style={{ height: "400px", overflowY: "auto" }}
                          >
                            {messageLoading ? (
                              <div className="text-center py-4">
                                <div
                                  className="spinner-border text-primary"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading messages...
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="chat-messages">
                                {messages[selectedChat.chatConstantId] &&
                                  renderGroupedMessages(
                                    messages[selectedChat.chatConstantId],
                                  )}
                                <div ref={messagesEndRef} />
                              </div>
                            )}
                          </div>

                          <div className="card-footer bg-white border-top">
                            {selectedFile && (
                              <div className="mb-2 p-2 bg-light rounded">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                    {
                                      FILE_ICONS[
                                        getMessageTypeFromFile(selectedFile)
                                      ]
                                    }
                                    <span className="ms-2 small">
                                      {selectedFile.name} (
                                      {Math.round(selectedFile.size / 1024)} KB)
                                    </span>
                                  </div>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => {
                                      setSelectedFile(null);
                                      setPreviewUrl("");
                                      setFileTypeFilter("");
                                    }}
                                    disabled={uploading}
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                                {previewUrl &&
                                  selectedFile.type.startsWith("image/") && (
                                    <img
                                      src={previewUrl}
                                      alt="Preview"
                                      className="img-fluid rounded mt-2"
                                      style={{ maxWidth: "100px" }}
                                    />
                                  )}
                              </div>
                            )}

                            <div className="input-group">
                              <div className="btn-group">
                                <button
                                  className="btn btn-outline-secondary dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  disabled={uploading}
                                >
                                  <FaFile />
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => triggerFileInput("image")}
                                    >
                                      <FaImage className="me-2" />
                                      Image
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => triggerFileInput("video")}
                                    >
                                      <FaVideo className="me-2" />
                                      Video
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => triggerFileInput("audio")}
                                    >
                                      <FaMusic className="me-2" />
                                      Audio
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => triggerFileInput("pdf")}
                                    >
                                      <FaFilePdf className="me-2" />
                                      PDF
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        triggerFileInput("document")
                                      }
                                    >
                                      <FaFileWord className="me-2" />
                                      Document
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => triggerFileInput("excel")}
                                    >
                                      <FaFileExcel className="me-2" />
                                      Excel/CSV
                                    </button>
                                  </li>
                                </ul>
                              </div>

                              <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handleFileSelect(e, fileTypeFilter)
                                }
                                accept={getAcceptAttribute(fileTypeFilter)}
                              />

                              <textarea
                                className="form-control"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                  }
                                }}
                                style={{ resize: "none" }}
                                rows="2"
                                disabled={uploading}
                              />

                              <button
                                className="btn btn-primary"
                                onClick={handleSendMessage}
                                disabled={
                                  (!newMessage.trim() && !selectedFile) ||
                                  !isConnected ||
                                  uploading
                                }
                              >
                                {uploading ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  <FaPaperPlane />
                                )}
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div
                          className="card-body d-flex flex-column justify-content-center align-items-center"
                          style={{ height: "500px" }}
                        >
                          <FaEye className="display-1 text-muted mb-4" />
                          <h4 className="text-muted mb-3">
                            Select a chat to start messaging
                          </h4>
                          <p className="text-muted text-center">
                            {isConnected
                              ? "Choose a conversation from the list to view messages"
                              : "Connecting to chat server..."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
