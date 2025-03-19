import { useChannelStateContext,  ChannelHeader,
 } from 'stream-chat-react';
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function MyChannelHeader({client}) {
  const navigate = useNavigate();
  const auth = useAuthStore();
  
  const { channel } = useChannelStateContext();

  return (
    <div className='my-channel-header'>
                <ChannelHeader live={true} title={auth.userId} />
      
      <h2>{channel?.data?.name ?? 'Chat with an AI'}</h2>
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
  );

}
