import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../stores/useChatStore.js";
import "../styles/CommunityPage.css";
import { Navbar } from "../componets/navbar.jsx";
import { io } from "socket.io-client";
import { useAuthStore } from "../stores/useAuthStore.js";
import { Footer } from "../componets/footer.jsx";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: false, // Disable autoConnect for manual control
  reconnection: true, // Enable automatic reconnection
  reconnectionAttempts: 3, // Retry up to 3 times
  reconnectionDelay: 1000, // Delay between retries (1 second)
});

export const CommunityPage = () => {
  const { authUser } = useAuthStore();
  const { messages, sendMessage, getMessages, addMessage, isSendingMsg } =
    useChatStore();
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messageBoxRef = useRef(null);

  // Get the current user ID from localStorage or your auth context
  const loggedInUserId = authUser._id || "defaultUserId";

  // Initial load of messages and socket setup
  useEffect(() => {
    // Load existing messages
    getMessages();

    // Socket event handlers
    const token = localStorage.getItem("token");
    if (token) {
      socket.auth = { token };
    }
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Handle incoming messages - make sure this event name matches what your server emits
    socket.on("receiveMessage", (newMsg) => {
      addMessage(newMsg);
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receiveMessage");
    };
  }, [getMessages, addMessage,sendMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message handler
  const handleSendMessage = async () => {
    if (message.trim() && isConnected) {
      try {
        // Prepare message data
        const msgData = {
          msg: message,
          userId: loggedInUserId,
          timestamp: new Date().toISOString(),
        };

        // Send to backend through the store
        // The backend will save to DB and broadcast to all clients including sender
        await sendMessage(msgData);
        socket.emit("sendMessage",msgData);
        getMessages();
        // Clear input
        setMessage("");
      } catch (error) {
        console.error("Error in handleSendMessage:", error);
      }
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
      <h2 className="chat-title">Community Chat</h2>

        {/* Messages display */}
        <div className="message-box" ref={messageBoxRef}>
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => {
              const isCurrentUser =
                msg.user?._id === loggedInUserId || msg.user === loggedInUserId;

              return (
                <div
                  key={msg._id || index}
                  className={`message-wrapper ${
                    isCurrentUser ? "sent-wrapper" : "received-wrapper"
                  }`}
                >
                  <div
                    className={`message ${isCurrentUser ? "sent" : "received"}`}
                  >
                    {!isCurrentUser && msg.user?.username && (
                      <div className="message-username">
                        {msg.user.username}
                      </div>
                    )}
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">
                      {formatTime(msg.createdAt || msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-messages">
              No messages yet. Start the conversation!
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="input-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="message-input"
            rows={1}
            disabled={isSendingMsg}
          />
          <button
            onClick={handleSendMessage}
            className="send-button"
            disabled={!message.trim() || !isConnected || isSendingMsg}
          >
            {isSendingMsg ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
};
