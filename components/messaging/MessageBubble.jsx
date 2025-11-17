import Avatar from "@/components/ui/Avatar";
import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import { format } from "date-fns";

export default function MessageBubble({ message, isOwnMessage, avatarUrl, avatarInitials, isNew = false }) {
  const time = message?.created_at ? format(new Date(message.created_at), "p") : "";
  const attachments = Array.isArray(message?.attachments) ? message.attachments : [];
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} ${isNew ? "animate-pulse" : ""}`}>
      {!isOwnMessage && (<Avatar src={toPublicAssetUrl(avatarUrl)} fallback={avatarInitials} className="h-8 w-8 mr-2" />)}
      <div className={`max-w-[75%] rounded-xl px-3 py-2 ${isOwnMessage ? "bg-blue-600 text-white" : "bg-white border"} ${isNew ? "ring-2 ring-green-400 ring-opacity-50 shadow-lg" : ""}`}>
        {isNew && (
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs font-semibold text-green-600">New</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          </div>
        )}
        {message?.content && <div className="whitespace-pre-wrap break-words text-sm">{message.content}</div>}
        {!!attachments.length && (
          <div className="mt-2 space-y-1">
            {attachments.map((a) => (
              <a key={a.id || a.url} href={toPublicAssetUrl(a.url)} target="_blank" rel="noreferrer" className="block text-xs underline">
                {a.filename || a.url}
              </a>
            ))}
          </div>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className={`text-[10px] ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>{time}</span>
          {isOwnMessage && (
            <span className={`text-[10px] ${message?.is_read || message?.read_at ? "text-blue-100" : "text-blue-200"}`}>{message?.is_read || message?.read_at ? "✓✓" : "✓"}</span>
          )}
        </div>
      </div>
    </div>
  );
}