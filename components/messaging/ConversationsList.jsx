"use client";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import { Megaphone, MessageCircle } from "lucide-react";

export default function ConversationsList({ conversations = [], isLoading = false, selectedId, onSelect, isUserOnline }) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 animate-pulse bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="h-12 w-12 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="inline-block p-5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl mb-4 shadow-inner">
          <MessageCircle className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
        </div>
        <p className="text-lg font-semibold text-gray-600 mb-2">No conversations yet</p>
        <p className="text-sm text-gray-500 max-w-md">Start a new conversation to begin messaging</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          className={cn(
            "flex items-center gap-4 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md",
            selectedId === conversation.id && "bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300 shadow-lg"
          )}
        >
          <Avatar
            src={toPublicAssetUrl(conversation.participant?.profile_picture_url || "")}
            fallback={conversation.participant?.full_name?.charAt(0)?.toUpperCase() || ""}
            className="h-12 w-12 ring-2 ring-white shadow-lg"
            isOnline={isUserOnline ? isUserOnline(conversation.participant?.id) : false}
            showOnlineStatus={true}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={cn("font-semibold text-sm truncate", conversation.unread_count > 0 && "font-bold text-gray-900")}>
                {conversation.participant?.full_name}
              </h3>
              {conversation.last_message && (
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0 font-medium">
                  {formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })}
                </span>
              )}
            </div>
            <div className="mb-2">
              <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200 shadow-sm">
                {(conversation.participant?.role || "").replace("_", " ")}
              </Badge>
            </div>
            {conversation.last_message && (
              <p className={cn("text-sm text-gray-600 truncate", conversation.unread_count > 0 && selectedId !== conversation.id && "font-medium text-gray-900")}>
                {conversation.last_message.content}
              </p>
            )}
            {conversation.unread_count > 0 && selectedId !== conversation.id && (
              <span className="inline-block mt-2 px-3 py-1 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold shadow-sm">
                {conversation.unread_count} new
              </span>
            )}
          </div>
          {conversation.type === "announcement" && (
            <div className="text-purple-600">
              <Megaphone className="h-5 w-5" strokeWidth={2} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}