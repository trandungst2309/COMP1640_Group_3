import React, { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import Modal from "react-modal";
import io from "socket.io-client";

Modal.setAppElement("#root");

const socket = io("http://localhost:3001");

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    } else {
      const newUser = { name: "Socket" + Math.floor(Math.random() * 1000) };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    }
  });

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      socket.emit("user_connected", user.name);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        const chatMessages = prev[data.senderId] || [];
        return {
          ...prev,
          [data.senderId]: [...chatMessages, { senderId: data.senderId, message: data.message }],
        };
      });

      if (currentChat !== data.senderId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1,
        }));
      }
    });

    socket.on("online_users", (users) => {
      const filtered = users.filter((u) => u.username !== user.name);
      setOnlineUsers(filtered);
    });

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
    };
  }, [currentChat, user.name]);

  const sendMessage = () => {
    if (inputMessage.trim() && currentChat) {
      socket.emit("send_message", inputMessage, currentChat);
      setMessages((prev) => {
        const chatMessages = prev[currentChat] || [];
        return {
          ...prev,
          [currentChat]: [...chatMessages, { senderId: "me", message: inputMessage }],
        };
      });
      setInputMessage("");
    }
  };

  const startPrivateChat = (userSocketId) => {
    setCurrentChat(userSocketId);
    setActiveUser(userSocketId);
    setUnreadCounts((prev) => ({
      ...prev,
      [userSocketId]: 0,
    }));
  };

  return (
    <div>
      <div
        onClick={toggleModal}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "50%",
          padding: "15px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <FaComment size={30} />
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="Chat Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "500px",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "row",
          },
        }}
      >
        <div className="chat-container" style={{ display: "flex", width: "100%" }}>
          <div className="left-column" style={{ flex: 1, paddingRight: "20px" }}>
            <h3>Người online</h3>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {onlineUsers.map((user) => (
                <li
                  key={'onlineUsers_' + user.socketId}
                  onClick={() => startPrivateChat(user.socketId)}
                  style={{
                    cursor: "pointer",
                    marginBottom: "10px",
                    padding: "5px",
                    backgroundColor: user.socketId === activeUser ? "#007bff" : "#f0f0f0",
                    color: user.socketId === activeUser ? "#fff" : "#000",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{user.username}</span>
                  {unreadCounts[user.socketId] > 0 && (
                    <sup
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        fontSize: "10px",
                      }}
                    >
                      {unreadCounts[user.socketId]}
                    </sup>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="right-column" style={{ flex: 2 }}>
            <h2>Chat Online</h2>
            <div className="chat-box" style={{ maxHeight: "350px", overflowY: "scroll" }}>
              <div className="message-container" style={{ display: "flex", flexDirection: "column" }}>
                {(messages[currentChat] || []).map((msg, index) => (
                  <div
                    key={'Online_' + index}
                    style={{
                      backgroundColor: msg.senderId === "me" ? "#007bff" : "#e0e0e0",
                      color: msg.senderId === "me" ? "#fff" : "#000",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "10px",
                      maxWidth: "70%",
                      alignSelf: msg.senderId === "me" ? "flex-end" : "flex-start",
                    }}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginTop: "10px",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
