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

import "stream-chat-react/dist/css/v2/index.css";
import MyChannelHeader from "../components/MyChannelHeader";
import MyAIStateIndicator from "../components/MyAIStateIndicator";
import useAuthStore from "../store/authStore";

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

  

  if (!client) return <div>Setting up client & connection...</div>;

    

  return (
    <Chat client={client}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <Window>
          <MyChannelHeader />
          <MessageList />
          <MyAIStateIndicator />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
