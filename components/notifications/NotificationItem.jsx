import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";

export default function NotificationItem({ notification, onAfter }) {
  const router = useRouter();
  const handleClick = async () => {
    if (!notification.is_read) {
      try { await apiClient.put(`/notifications/${notification.id}/read`); } catch {}
    }
    if (notification.type === "new_message" && notification.related_data?.conversation_id) {
      router.push(`/messages?conversation=${notification.related_data.conversation_id}`);
    } else if (notification.type === "announcement_received" && notification.related_data?.announcement_id) {
      router.push(`/messages/announcements`);
    }
    onAfter?.();
  };
  return (
    <div onClick={handleClick} className={cn("flex items-start gap-3 p-3 cursor-pointer", !notification.is_read && "bg-blue-50")}>
      <div className={cn("h-2 w-2 rounded-full mt-2 flex-shrink-0", notification.is_read ? "bg-gray-300" : "bg-blue-500")} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{notification.title}</p>
        <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</p>
      </div>
    </div>
  );
}