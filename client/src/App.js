import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3030");

function App() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userName && roomName) {
      socket.emit("join_room", roomName);
      setShowChat(true);
    } else {
      setShowChat(false);
    }
  };
  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h2>Join a Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(event) => setUserName(event.target.value)}
          />
          <input
            type="text"
            placeholder="Enter room name"
            onChange={(event) => setRoomName(event.target.value)}
          />
          <button type="submit" onClick={joinRoom}>
            Join a Room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={userName} room={roomName} />
      )}
    </div>
  );
}

export default App;
