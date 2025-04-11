import React from "react";

const Message = ({ text, sender }) => {
  return (
    <div className={`message ${sender === "You" ? "my-message" : "other-message"}`}>
      <strong>{sender}:</strong> {text}
    </div>
  );
};

export default Message;
