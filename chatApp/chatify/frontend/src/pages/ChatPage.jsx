import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let client;

    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        client.on("message.new", (event) => {
          if (event.user.id !== authUser._id) {
            toast.success(`💬 New message from ${event.user.name}`);
          }
        });

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Chat init failed:", error);
        toast.error("Failed to connect to chat. Try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
    return () => client?.disconnectUser();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (!channel) return;

    const callUrl = `${window.location.origin}/call/${channel.id}`;

    channel.sendMessage({
      text: `I've started a video call. Join here: ${callUrl}`,
    });

    toast.success("Video call link sent!");
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] relative bg-white">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">

            <CallButton handleVideoCall={handleVideoCall} />

            <Window>
              <ChannelHeader />
              <MessageList />

              {/* Show Input only if user clicks the toggle button */}
              {showKeyboard && (
                <div className="slide-up">
                  <MessageInput />
                </div>
              )}
            </Window>
          </div>

          <Thread />
        </Channel>
      </Chat>

      {/* Floating Button to Show Keyboard */}
      <button
        onClick={() => setShowKeyboard(!showKeyboard)}
        className="p-4 text-xl bg-green-600 text-white rounded-full shadow-lg fixed bottom-5 right-5"
      >
        💬
      </button>
    </div>
  );
};

export default ChatPage;
