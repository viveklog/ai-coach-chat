import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css"; // Ensure the latest Stream CSS is imported
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { getAIResponse } from "../api/chat";

const API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export default function ChatPage() {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.token) {
      console.error("❌ No token found! Redirecting to login...");
      navigate("/auth");
      return;
    }

    console.log("✅ Using Token for Chat:", auth.token);

    const client = StreamChat.getInstance(API_KEY);

    const connectChat = async () => {
      try {
        await client.connectUser(
          { id: auth.userId, name: auth.userId },
          auth.token
        );

        console.log("✅ Chat connected successfully!");

        const chatChannel = client.channel("messaging", "ai-coach-chat", {
          members: [auth.userId, "ai_coach"],
        });

        // await chatChannel.watch(); // ✅ Ensure channel is watched before sending messages

        setChatClient(client);
        setChannel(chatChannel);
        setIsReady(true);
      } catch (error) {
        console.error("❌ Chat connection error:", error);
        navigate("/auth");
      }
    };

    connectChat();

    return () => {
      if (chatClient) {
        console.log("🔌 Disconnecting Stream Chat user...");
        chatClient.disconnectUser();
      }
      setIsReady(false);
    };
  }, [auth.token, auth.userId, navigate]);

  if (!chatClient || !channel || !isReady) return <div className="flex justify-center items-center h-screen">Loading chat...</div>;

  const handleMessageSend = async (message) => {
    if (!message.text) return;

    console.log("📩 Sending message to AI Coach:", message.text);
    setLoading(true);

    const aiReply = await getAIResponse(message.text, auth.userId); // ✅ Fetch AI response

    console.log("🤖 AI Coach Response Received:", aiReply);
    setLoading(false);

    if (!aiReply) {
      console.error("❌ No response from AI");
      return;
    }

    // ✅ Send AI response as "ai_coach"
    await channel.sendMessage({
      text: aiReply,
      user_id: "ai_coach",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">AI Coach Chat</h1>
        <button
          onClick={() => {
            chatClient.disconnectUser();
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
          <Chat client={chatClient} theme="messaging light">
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
