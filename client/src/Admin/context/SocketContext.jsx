import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { BASE_URL } from "../../Config";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    let currentUserId = null;
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        currentUserId = parsedData.id || parsedData._id;
        setUserId(currentUserId);
      } catch (error) {
      }
    }

    const socketUrl = BASE_URL
      ? BASE_URL.replace("/admin", "")
      : "http://localhost:5800/admin";

    const socketInstance = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      
      if (currentUserId) {
        socketInstance.emit("connectUser", { userId: currentUserId });
      }
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
    });

    socketInstance.on("error", (error) => {
    });

    socketInstance.on("connectUser", (data) => {
    });

    socketInstance.on("userOnlineStatus", (data) => {
    });

    socketInstance.on("sendMessage", (data) => {
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  const connectUser = (userId) => {
    if (socket && userId) {
      socket.emit("connectUser", { userId });
      setUserId(userId);
    }
  };

  const sendMessage = (messageData) => {
    if (socket && messageData) {
      socket.emit("sendMessage", messageData);
    }
  };

  const getMessageList = (data) => {
    if (socket) {
      socket.emit("getMessageList", data);
    }
  };

  const getChatList = (data) => {
    if (socket) {
      socket.emit("index", data);
    }
  };

  const value = {
    socket,
    isConnected,
    userId,
    connectUser,
    sendMessage,
    getMessageList,
    getChatList,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};