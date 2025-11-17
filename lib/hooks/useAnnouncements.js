import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import messageService from "@/lib/api/messageService";
import { toast } from "sonner";

export const useAnnouncements = (params) => {
  return useQuery({
    queryKey: ["announcements", params],
    queryFn: () => messageService.getAnnouncements(params),
    staleTime: 60000,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageService.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement sent successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to send announcement");
    },
  });
};

export const useMarkAnnouncementRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageService.markAnnouncementRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
};