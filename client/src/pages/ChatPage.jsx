import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";

import MyChannelHeader from "../components/MyChannelHeader";
import MyAIStateIndicator from "../components/MyAIStateIndicator";
import MyMessage from "../components/MyMessage";
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const auth = useAuthStore();
const navigate = useNavigate();
// const auth.token = auth.token;
// const auth.userId = auth.auth.userId;
const userName = "";
const [channel, setChannel] = useState(null);
const [isReady, setIsReady] = useState(false);

const user = {
  id: auth.userId,
  name: userName || "User",
  image:
    "https://vignette.wikia.nocookie.net/starwars/images/6/6f/Anakin_Skywalker_RotS.png",
};

const sort= { last_message_at: -1 };
const filters = {
  type: "messaging",
  members: { $in: [auth.userId] },
};
const options= {
  limit: 10,
};
 
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: auth.token,
    userData: user,
  });

  const Serverclient = StreamChat.getInstance(apiKey);

  useEffect(()=>{
    if (!auth.userId || !auth.token) {
      console.error("❌ No user or token in store! Redirecting to signup...");
      navigate("/auth");
      return;
    }

    const connectChat = async () => {
      try {
        if (Serverclient.userID && Serverclient.userID !== auth.userId) {
          console.log("🔄 Switching user: Disconnecting previous session...");
          await Serverclient.disconnectUser(); // ✅ Properly disconnect old user before switching
        }

        if (!Serverclient.userID || Serverclient.userID !== auth.userId) {
          console.log("🚀 Connecting to Stream Chat as:", auth.userId);
          await Serverclient.connectUser(
            { id: auth.userId, name: auth.userId },
            auth.token
          );
        }

        console.log("✅ Chat connected successfully!");

        const chatChannel = Serverclient.channel("messaging", `ai-coach-chat-${auth.userId}`, {
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
  },[auth.userId,auth.token])


  if (!client || !channel || !isReady || !Serverclient) return <div>Setting up client & connection...</div>;

    
    
      
  return (
    <Chat client={client}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel Message={MyMessage} channel={channel}>
        <Window>
          <MyChannelHeader client={Serverclient} />
          <MessageList />
          <MyAIStateIndicator />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
