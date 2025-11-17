import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const onlineTTLRef = useRef(new Map());
  const MAX_RECONNECT_ATTEMPTS = 5;
  const HEARTBEAT_INTERVAL = 30000;

  const connect = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("lsg_access_token") : null;
    if (!token) return;
    try {
      const ws = new WebSocket(`${WS_BASE_URL}/api/v1/ws?token=${token}`);
      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "ping" }));
        }, HEARTBEAT_INTERVAL);
        try { ws.send(JSON.stringify({ type: "get_online_users" })); } catch {}
      };
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          
          // Handle online status updates
          if (message.type === "user_online") {
            const id = String(message.user_id);
            setOnlineUsers(prev => new Set([...prev, id]));
          } else if (message.type === "user_offline") {
            setOnlineUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(String(message.user_id));
              return newSet;
            });
          } else if (message.type === "online_users_list") {
            const ids = (message.user_ids || []).map((u) => String(u));
            setOnlineUsers(new Set(ids));
          }
          
          if (message.type === "new_message") {
            toast.info("New message received");
            const uid = String(message.sender_id || message.message?.sender_id);
            if (uid) {
              setOnlineUsers(prev => new Set([...prev, uid]));
              const prevTimer = onlineTTLRef.current.get(uid);
              if (prevTimer) clearTimeout(prevTimer);
              const timer = setTimeout(() => {
                setOnlineUsers(prev => {
                  const s = new Set(prev);
                  s.delete(uid);
                  return s;
                });
                onlineTTLRef.current.delete(uid);
              }, 60000);
              onlineTTLRef.current.set(uid, timer);
            }
          }
          if (message.type === "announcement_received") toast.info("New announcement received");
        } catch {}
      };
      ws.onerror = () => {};
      ws.onclose = () => {
        setIsConnected(false);
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connect();
          }, delay);
        }
      };
      wsRef.current = ws;
    } catch {}
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const isUserOnline = useCallback((userId) => {
    if (userId === undefined || userId === null) return false;
    return onlineUsers.has(String(userId));
  }, [onlineUsers]);

  return { isConnected, lastMessage, onlineUsers, isUserOnline, sendMessage, reconnect: connect };
};