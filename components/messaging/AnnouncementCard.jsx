import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import { Megaphone, Users, Eye, Calendar } from "lucide-react";

export default function AnnouncementCard({ announcement, mode, onClick }) {
  const isUnread = mode === "received" && !announcement.is_read;
  const isExpired = announcement.expires_at && new Date(announcement.expires_at) < new Date();
  
  return (
    <div
      onClick={onClick}
      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
        isUnread 
          ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md" 
          : "bg-white border-gray-200 hover:border-gray-300"
      } ${isExpired ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ${
            announcement.priority === "urgent" 
              ? "bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-300" 
              : "bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300"
          }`}>
            <Megaphone className={`h-7 w-7 ${
              announcement.priority === "urgent" ? "text-red-600" : "text-blue-600"
            }`} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-xl text-gray-900 truncate">{announcement.subject}</h3>
              {isUnread && (
                <span className="h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0 animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
              {mode === "received" && announcement.sender && (
                <div className="flex items-center gap-2">
                  <Avatar 
                    className="h-6 w-6 ring-2 ring-white shadow-sm" 
                    fallback={announcement.sender.full_name?.[0]} 
                    src={toPublicAssetUrl(announcement.sender.profile_picture_url || "")}
                  />
                  <span className="font-semibold">{announcement.sender.full_name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {announcement.priority === "urgent" && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-sm">
              Urgent
            </Badge>
          )}
          {isExpired && (
            <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400 shadow-sm">
              Expired
            </Badge>
          )}
        </div>
      </div>
      
      <p className="text-gray-700 line-clamp-2 mb-6 text-sm leading-relaxed">{announcement.content}</p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          {mode === "sent" && (
            <>
              {typeof announcement.recipients_count !== "undefined" && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">{announcement.recipients_count} recipients</span>
                </div>
              )}
              {typeof announcement.read_count !== "undefined" && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span className="font-semibold">{announcement.read_count} read</span>
                </div>
              )}
            </>
          )}
        </div>
        {announcement.expires_at && (
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Expires: {new Date(announcement.expires_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}