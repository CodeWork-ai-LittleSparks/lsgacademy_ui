"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useMarkAnnouncementRead } from "@/lib/hooks/useAnnouncements";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { format } from "date-fns";
import { useEffect } from "react";
import messageService from "@/lib/api/messageService";

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const announcementId = params?.id;
  const { data: raw, isLoading } = useQuery({
    queryKey: ["announcement", announcementId],
    queryFn: () => messageService.getAnnouncement(announcementId),
    enabled: !!announcementId,
  });
  const markRead = useMarkAnnouncementRead();

  useEffect(() => {
    const ann = raw?.announcement || raw?.data?.announcement || raw?.data || raw;
    if (ann && !ann.is_read) {
      markRead.mutate(announcementId);
    }
  }, [raw, announcementId]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  const announcement = raw?.announcement || raw?.data?.announcement || raw?.data || raw;
  if (!announcement) return <div className="p-6">Announcement not found</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">Back</Button>
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center ${announcement.priority === "urgent" ? "bg-red-100" : "bg-blue-100"}`}>
            <svg className={`h-8 w-8 ${announcement.priority === "urgent" ? "text-red-600" : "text-blue-600"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{announcement.subject}</h1>
              {announcement.priority === "urgent" && (<Badge>Urgent</Badge>)}
            </div>
            {announcement.sender && (
              <div className="flex items-center gap-2 text-gray-600">
                <Avatar className="h-6 w-6" fallback={announcement.sender.full_name?.[0]} />
                <span className="font-medium">{announcement.sender.full_name}</span>
                <span>•</span>
                <span>{format(new Date(announcement.created_at), "PPP")}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-6 pt-4 border-t">
          {typeof announcement.recipients_count !== "undefined" && (
            <div className="text-gray-600">{announcement.recipients_count} recipients</div>
          )}
          {typeof announcement.read_count !== "undefined" && (
            <div className="text-gray-600">{announcement.read_count} read</div>
          )}
          {announcement.expires_at && (
            <div className="text-gray-600">Expires: {format(new Date(announcement.expires_at), "PPP")}</div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg border p-8">
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{announcement.content}</p>
      </div>
    </div>
  );
}