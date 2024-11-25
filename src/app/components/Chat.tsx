"use client";

import { useEffect, useState } from "react";
import { MessageT } from "../model/chat";
import MarkdownRenderer from "./MarkdownRenderer";

export default function Chat() {
  const [loading, setLoading] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [chatData, setChatData] = useState<MessageT[]>([]);

  const submitChat = async () => {
    if (userInput) {
      setLoading(true);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userInput }),
        });
        await response.json();
        await fetchChatData(); // Refresh chat data after submission
        setUserInput(""); // Clear input
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const fetchChatData = async () => {
    try {
      const response = await fetch("/api/chat");
      const data = await response.json();
      setChatData(data.messages); // Assuming `messages` is the array in the response
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChatData();
  }, []);

  return (
    <div>
      <div className="chat-container">
        <header className="chat-header">
          <h1>AI Chat Assistant</h1>
        </header>
        <main className="chat-messages">
          <div className="message-list">
            {chatData.map((message) => (
              <div key={message.id} className="message-item">
                <div className="message-user text-black">
                  <strong>User:</strong> {message.userInput}
                </div>
                <div
                  className="message-bot text-black"
                  style={{ padding: "1rem" }}
                >
                  <MarkdownRenderer content={message.botReply} />
                  {/* <strong>Bot:</strong> {message.botReply} */}
                </div>
                <div className="message-time text-black">
                  {new Date(message.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </main>
        <footer className="chat-input">
          <form className="input-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Type your message..."
              name="userInput"
              className="message-input text-black"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              type="button"
              className="send-button"
              onClick={submitChat}
              disabled={loading}
            >
              {loading ? "Loading..." : "Send"}
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
