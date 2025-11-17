"use client";
import { useState } from "react";
import { useSendMessage } from "@/lib/hooks/useConversations";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import AttachmentUpload from "./AttachmentUpload";

export default function MessageInput({ conversationId, recipientId }) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const sendMessage = useSendMessage();

  const handleSend = async () => {
    if (!content.trim() && attachments.length === 0) return;
    try {
      await sendMessage.mutateAsync({ recipient_id: recipientId, content: content.trim(), attachments });
      setContent("");
      setAttachments([]);
      setShowAttachments(false);
    } catch {}
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-2">
      {showAttachments && <AttachmentUpload attachments={attachments} onAttachmentsChange={setAttachments} />}
      <div className="flex gap-2">
        <Button variant="outline" size="md" onClick={() => setShowAttachments(!showAttachments)} type="button">Attach</Button>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 min-h-[42px] max-h-32 resize-none"
        />
        <Button onClick={handleSend} disabled={(!content.trim() && attachments.length === 0) || sendMessage.isPending} size="md">Send</Button>
      </div>
      <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
    </div>
  );
}