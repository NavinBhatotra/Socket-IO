import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        username: username,
        message: currentMessage,
        time: `${new Date(Date.now()).getHours()} : ${new Date(
          Date.now()
        ).getMinutes()}`,
      };
      await socket.emit("send_message", messageData);
      setMessageList((currentState) => [...currentState, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((currentState) => {
        return [...currentState, data];
      });
    });
    return () => {
      socket.off("receive_message", (data) => {
        setMessageList((currentState) => {
          return [...currentState, data];
        });
      });
    };
  }, [socket]);

  console.log({ messageList });

  return (
    <div>
      <div className="chat-window">
        <div className="chat-header">
          <p>Live Chat</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent, index) => {
              return (
                <div
                  className="message"
                  id={username === messageContent.username ? "you" : "other"}
                  key={index}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Message....."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyUp={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button type="submit" onClick={sendMessage}>
            &#9658;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
