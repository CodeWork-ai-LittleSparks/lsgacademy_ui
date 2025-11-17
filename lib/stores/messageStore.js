import { create } from "zustand";

export const useMessageStore = create((set) => ({
  unreadCount: 0,
  activeConversationId: null,
  typingUsers: new Map(),
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setUserTyping: (userId, isTyping) => set((state) => {
    const newTypingUsers = new Map(state.typingUsers);
    if (isTyping) newTypingUsers.set(userId, true);
    else newTypingUsers.delete(userId);
    return { typingUsers: newTypingUsers };
  }),
  addNewMessage: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));