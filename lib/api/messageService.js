import apiClient from "./client";

export const sendMessage = async ({ recipient_id, content, attachments }) => {
  const res = await apiClient.post("/messages", { recipient_id, content, attachments });
  return res.data || res;
};

export const markMessageRead = async (messageId) => {
  await apiClient.put(`/messages/${messageId}/read`);
};

export const getRecipients = async (search) => {
  const res = await apiClient.get("/messages/recipients", { params: { search } });
  return res.data || res;
};

export const getConversations = async (params) => {
  const res = await apiClient.get("/messages/conversations", { params });
  return res.data || res;
};

export const getConversation = async (conversationId, params) => {
  const res = await apiClient.get(`/messages/conversations/${conversationId}`, { params });
  return res.data || res;
};

export const markConversationRead = async (conversationId) => {
  await apiClient.put(`/messages/conversations/${conversationId}/read`);
};

export const deleteConversation = async (conversationId) => {
  await apiClient.delete(`/messages/conversations/${conversationId}`);
};

export const createAnnouncement = async (data) => {
  const res = await apiClient.post("/announcements", data);
  return res.data || res;
};

export const getAnnouncements = async (params) => {
  const res = await apiClient.get("/announcements", { params });
  return res.data || res;
};

export const getAnnouncement = async (announcementId) => {
  const res = await apiClient.get(`/announcements/${announcementId}`);
  return res.data || res;
};

export const markAnnouncementRead = async (announcementId) => {
  await apiClient.put(`/announcements/${announcementId}/read`);
};

export const uploadAttachment = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post("/messages/attachments/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data || res;
};

const messageService = {
  sendMessage,
  markMessageRead,
  getRecipients,
  getConversations,
  getConversation,
  markConversationRead,
  deleteConversation,
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  markAnnouncementRead,
  uploadAttachment,
};

export default messageService;