"use client";
import { useEffect, useRef, useState } from "react";
import { useConversation, useMarkConversationRead } from "@/lib/hooks/useConversations";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { format } from "date-fns";
import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import { MoreVertical } from "lucide-react";
import { useWebSocketStatus } from "@/app/providers/WebSocketProvider";

export default function MessageThread({ conversationId, isUserOnline }) {
  const messagesEndRef = useRef(null);
  const { data, isLoading } = useConversation(conversationId, { page: 1, limit: 50 });
  const markRead = useMarkConversationRead();
  const { lastMessage } = useWebSocketStatus() || {};
  const [newSeparatorTs, setNewSeparatorTs] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  useEffect(() => {
    if (conversationId) markRead.mutate(conversationId);
    setNewSeparatorTs(null);
  }, [conversationId]);

  useEffect(() => {
    if (!lastMessage || !conversationId) return;
    if (lastMessage.type === "new_message" && (lastMessage.conversation_id === conversationId || lastMessage.message?.conversation_id === conversationId)) {
      const ts = lastMessage.message?.created_at ? new Date(lastMessage.message.created_at).getTime() : Date.now();
      setNewSeparatorTs(ts);
      markRead.mutate(conversationId);
    }
  }, [lastMessage, conversationId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center space-y-4">
          <div className="inline-block p-5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg animate-pulse">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading conversation...</p>
        </div>
      </div>
    );
  }
  if (!data) return null;

  const { messages, participant } = data;
  const ordered = Array.isArray(messages)
    ? [...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    : [];
  let dividerRendered = false;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-purple-50/30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar 
            src={toPublicAssetUrl(participant?.profile_picture_url || "")} 
            fallback={participant?.full_name?.charAt(0)?.toUpperCase() || ""} 
            className="h-12 w-12 ring-2 ring-white shadow-lg"
            isOnline={isUserOnline ? isUserOnline(participant?.id) : false}
            showOnlineStatus={true}
          />
          <div>
            <h2 className="font-bold text-lg text-gray-900">{participant?.full_name}</h2>
            <span className="text-sm text-gray-600 font-medium">{(participant?.role || "").replace("_", " ")}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="md"
          className="hover:bg-purple-100 rounded-xl"
        >
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-gray-50">
        {ordered.map((message, index) => {
          const showDate = index === 0 || format(new Date(ordered[index - 1].created_at), "yyyy-MM-dd") !== format(new Date(message.created_at), "yyyy-MM-dd");
          const msgTs = new Date(message.created_at).getTime();
          const showNewDivider = newSeparatorTs && !dividerRendered && msgTs >= newSeparatorTs;
          if (showNewDivider) dividerRendered = true;
          return (
            <div key={message.id}>
              {showNewDivider && (
                <div className="flex justify-center my-4">
                  <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">New messages</span>
                </div>
              )}
              {showDate && (
                <div className="flex justify-center my-6">
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-sm font-semibold text-gray-700 shadow-sm border border-purple-200">
                    {format(new Date(message.created_at), "MMMM d, yyyy")}
                  </span>
                </div>
              )}
              <MessageBubble
                message={message}
                isOwnMessage={message.sender_id !== participant.id}
                avatarUrl={toPublicAssetUrl(participant?.profile_picture_url || "")}
                avatarInitials={participant?.full_name?.charAt(0)?.toUpperCase() || ""}
                isNew={!!newSeparatorTs && msgTs >= newSeparatorTs}
              />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-6 shadow-lg">
        <MessageInput conversationId={conversationId} recipientId={participant.id} />
      </div>
    </div>
  );
}