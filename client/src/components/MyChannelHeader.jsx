import { useChannelStateContext } from 'stream-chat-react';
import { useWatchers } from '../useWatchers';
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function MyChannelHeader({client}) {
  const navigate = useNavigate();
  const auth = useAuthStore();
  
  const { channel } = useChannelStateContext();
  const { watchers } = useWatchers({ channel });

  const aiInChannel =
    (watchers ?? []).filter((watcher) => watcher.includes('ai-bot')).length > 0;
  return (
    <div className='my-channel-header'>
      <h2>{channel?.data?.name ?? 'Chat with an AI'}</h2>

      <button onClick={addOrRemoveAgent}>
        {aiInChannel ? 'Remove AI' : 'Add AI'}
      </button>
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

  async function addOrRemoveAgent() {
    if (!channel) return;
    const endpoint = aiInChannel ? 'stop-ai-agent' : 'start-ai-agent';
    await fetch(`http://127.0.0.1:3000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel_id: channel.id }),
    });
    console.log(`channel ${endpoint}`);
  }
}
