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

import MyChannelHeader from "../components/MyChannelHeader";
import MyAIStateIndicator from "../components/MyAIStateIndicator";
import MyMessage from "../components/MyMessage";
import useAuthStore from "../store/authStore";
import { useEffect } from "react";

export default function ChatPage() {

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const auth = useAuthStore();
const userToken = auth.token;
const userId = auth.userId;
const userName = "Vivek Kumar";

const user = {
  id: userId,
  name: userName || "User",
  image:
    "https://vignette.wikia.nocookie.net/starwars/images/6/6f/Anakin_Skywalker_RotS.png",
};

const sort= { last_message_at: -1 };
const filters = {
  type: "messaging",
  members: { $in: [userId] },
};
const options= {
  limit: 10,
};
 
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  useEffect(()=>{
    const checkClient = async()=>{
          if(!client) return;
          const channel = client.channel("messaging", "travel", {
            name: "Awesome channel about traveling",
          });
          // Here, 'travel' will be the channel ID
          await channel.watch();
    }
    checkClient();
  },[client])

  console.log(client?.activeChannels);

  if (!client) return <div>Setting up client & connection...</div>;

    
    
      
  return (
    <Chat client={client}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel Message={MyMessage}>
        <Window>
          <MyChannelHeader client={client} />
          <MessageList />
          <MyAIStateIndicator />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
