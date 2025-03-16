import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useNavigate } from "react-router-dom";
import { getAIResponse } from "../api/chat";
import useAuthStore from "../store/authStore"; // ✅ Import store

const API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const client = StreamChat.getInstance(API_KEY); // ✅ Use a single client instance globally

export default function ChatPage() {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.userId || !auth.token) {
      console.error("❌ No user or token in store! Redirecting to signup...");
      navigate("/auth");
      return;
    }

    console.log("✅ Using Store User:", auth.userId);
    console.log("✅ Using Store Token:", auth.token);

    const connectChat = async () => {
      try {
        if (client.userID && client.userID !== auth.userId) {
          console.log("🔄 Switching user: Disconnecting previous session...");
          await client.disconnectUser(); // ✅ Properly disconnect old user before switching
        }

        if (!client.userID || client.userID !== auth.userId) {
          console.log("🚀 Connecting to Stream Chat as:", auth.userId);
          await client.connectUser(
            { id: auth.userId, name: auth.userId },
            auth.token
          );
        }

        console.log("✅ Chat connected successfully!");

        const chatChannel = client.channel("messaging", "ai-coach-chat", {
          members: [auth.userId, "ai_coach"],
        });

        await chatChannel.create();
        await chatChannel.watch();

        setChannel(chatChannel);
        setIsReady(true);
      } catch (error) {
        console.error("❌ Chat connection error:", error);
        navigate("/auth");
      }
    };

    connectChat();

    return () => {
      console.log("🔌 Cleaning up Stream Chat...");
      setIsReady(false);
    };
  }, [navigate, auth.userId, auth.token]);

  if (!client || !channel || !isReady)
    return <div className="flex justify-center items-center h-screen">Loading chat...</div>;

  const handleMessageSend = async (message) => {
    if (!message.text) return;
    console.log('enter :', message)

    console.log("📩 Sending message to AI Coach:", message.text);
    setLoading(true);

    // ✅ Send user message to the chat UI
    await channel.sendMessage({
      text: message.text,
      user_id: 'ai_coach', // ✅ Ensure the user message is sent
    });

    // ✅ Fetch AI response from backend
    const aiReply = await getAIResponse(message.text, auth.userId);

    console.log("🤖 AI Coach Response Received:", aiReply);
    setLoading(false);

    if (!aiReply) {
      console.error("❌ No response from AI");
      return;
    }

    // ✅ Send AI response to chat UI
    await channel.sendMessage({
      text: aiReply,
      user_id: "ai_coach", // ✅ Ensure the AI message appears in the chat
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">AI Coach Chat</h1>
        <button
          onClick={async () => {
            console.log("🔌 Disconnecting Stream Chat user...");
            await client.disconnectUser();
            auth.logout();
            navigate("/auth");
          }}
          className="bg-white text-blue-600 p-2 rounded shadow-md hover:bg-gray-200"
        >
          Logout
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-grow flex justify-center items-center">
        <div className="w-full bg-white shadow-lg p-4 rounded-lg">
          <Chat client={client} theme="messaging light">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput onSend={handleMessageSend} disabled={loading} />
              </Window>
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  );
}
