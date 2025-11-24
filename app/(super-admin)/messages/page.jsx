"use client";
import { useState, useEffect } from "react";
import { useConversations } from "@/lib/hooks/useConversations";
import { useWebSocketStatus } from "@/app/providers/WebSocketProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import ConversationsList from "@/components/messaging/ConversationsList";
import MessageThread from "@/components/messaging/MessageThread";
import ComposeModal from "@/components/messaging/ComposeModal";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { MessageCircle, Plus, RefreshCw } from "lucide-react";

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newMessageIds, setNewMessageIds] = useState(new Set());

  const { data: conversationsData, isLoading, refetch } = useConversations({ page: 1, limit: 20, type: activeTab, search: debouncedSearch || undefined });
  const { isConnected, isUserOnline, sendMessage } = useWebSocketStatus() || {};

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-amber-50/20 to-orange-50/20">
      <div className="max-w-full mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl shadow-lg">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  Messages
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">
                  Manage your conversations and communications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-gray-600">{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
              >
                <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                <span>Refresh</span>
              </Button>
              <Button 
                onClick={() => setIsComposeOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                <span>New Message</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Sidebar */}
          <div className="w-96 border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <Input 
                placeholder="Search conversations..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="border-b border-gray-200">
              <TabsList className="w-full justify-start h-14 bg-transparent px-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-100 data-[state=active]:to-orange-100">All</TabsTrigger>
                <TabsTrigger value="direct" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-100 data-[state=active]:to-orange-100">Direct</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex-1 overflow-y-auto">
              <ConversationsList conversations={conversationsData?.conversations || conversationsData || []} isLoading={isLoading} selectedId={selectedConversationId} onSelect={handleSelectConversation} isUserOnline={isUserOnline} requestPresence={sendMessage} />
            </div>
          </div>
          
          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {selectedConversationId ? (
              <MessageThread conversationId={selectedConversationId} isUserOnline={isUserOnline} requestPresence={sendMessage} />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-orange-50/30">
                <div className="text-center space-y-4">
                  <div className="inline-block p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-lg">
                    <MessageCircle className="h-12 w-12 text-orange-600" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">Select a conversation to start messaging</p>
                    <p className="text-sm text-gray-500 max-w-md">Choose a conversation from the sidebar or start a new message to begin communicating</p>
                  </div>
                  <Button 
                    onClick={() => setIsComposeOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
                  >
                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                    <span>New Message</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isComposeOpen && <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />}
    </div>
  );
}