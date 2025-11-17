"use client";
import { createContext, useContext, useEffect } from "react";
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { isConnected, lastMessage, isUserOnline, onlineUsers, sendMessage, reconnect } = useWebSocket();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!lastMessage) return;
    switch (lastMessage.type) {
      case "new_message":
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        if (lastMessage.conversation_id) {
          queryClient.invalidateQueries({ queryKey: ["conversation", lastMessage.conversation_id] });
        }
        toast.success("New message received", {
          action: { label: "View", onClick: () => router.push(`/messages?conversation=${lastMessage.conversation_id}`) },
        });
        break;
      case "announcement_received":
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        const fn = lastMessage.priority === "urgent" ? toast.error : toast.info;
        fn(`New announcement: ${lastMessage.subject}`, {
          action: { label: "View", onClick: () => {
            const base = (typeof window !== "undefined" && window.localStorage.getItem("lsg_user_data"))
              ? (JSON.parse(window.localStorage.getItem("lsg_user_data") || "{}")?.role === "school_admin" ? "/school-announcements" : "/announcements")
              : "/announcements";
            router.push(`${base}/${lastMessage.announcement_id || ""}`);
          } },
        });
        break;
      case "message_read":
        if (lastMessage.conversation_id) {
          queryClient.invalidateQueries({ queryKey: ["conversation", lastMessage.conversation_id] });
        }
        break;
    }
  }, [lastMessage]);

  return <WebSocketContext.Provider value={{ isConnected, lastMessage, isUserOnline, onlineUsers, sendMessage, reconnect }}>{children}</WebSocketContext.Provider>;
}

export function useWebSocketStatus() {
  return useContext(WebSocketContext);
}