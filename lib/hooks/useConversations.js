import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import messageService from "@/lib/api/messageService";
import { toast } from "sonner";

export const useConversations = (params) => {
  return useQuery({
    queryKey: ["conversations", params],
    queryFn: () => messageService.getConversations(params),
    staleTime: 30000,
  });
};

export const useConversation = (conversationId, params) => {
  return useQuery({
    queryKey: ["conversation", conversationId, params],
    queryFn: () => messageService.getConversation(conversationId, params),
    enabled: !!conversationId,
    staleTime: 0,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (data?.conversation_id) {
        queryClient.invalidateQueries({ queryKey: ["conversation", data.conversation_id] });
      }
      toast.success("Message sent");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to send message");
    },
  });
};

export const useMarkConversationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageService.markConversationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageService.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Conversation deleted");
    },
    onError: () => {
      toast.error("Failed to delete conversation");
    },
  });
};