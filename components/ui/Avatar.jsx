import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import { cn } from "@/lib/utils";

export default function Avatar({ src, fallback, className = "", isOnline = false, showOnlineStatus = false }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div className={`inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden w-full h-full`}>
        {src ? (
          <img src={toPublicAssetUrl(src)} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-semibold text-gray-700">{fallback}</span>
        )}
      </div>
      {showOnlineStatus && (
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-300 z-10",
          isOnline ? "bg-green-500" : "bg-gray-400"
        )}>
          {isOnline && (
            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
          )}
        </div>
      )}
    </div>
  );}