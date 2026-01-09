import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { ragChatFn } from "~/fn/rag-chat";
import type { VideoSource, ConversationMessage } from "~/use-cases/rag-chat";

export type { VideoSource, ConversationMessage };

const STORAGE_KEY = "rag-chat-history";
const SOURCES_STORAGE_KEY = "rag-chat-sources";
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 20000;

const videoSourceSchema = z.object({
  segmentId: z.number(),
  segmentTitle: z.string(),
  segmentSlug: z.string(),
  moduleTitle: z.string(),
  chunkText: z.string(),
  similarity: z.number(),
});

const conversationMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.string(),
  sources: z.array(videoSourceSchema).optional(),
});

const conversationMessagesSchema = z.array(conversationMessageSchema);
const videoSourcesSchema = z.array(videoSourceSchema);

function loadFromStorage<T>(
  key: string,
  fallback: T,
  schema: z.ZodType<T>
): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      const result = schema.safeParse(parsed);
      if (result.success) {
        return result.data;
      }
      console.error(`[RAG Chat] Validation failed for ${key}:`, result.error);
    }
  } catch (error) {
    console.error(`[RAG Chat] Failed to load from sessionStorage:`, error);
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[RAG Chat] Failed to save to sessionStorage:`, error);
  }
}

function clearStorage(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SOURCES_STORAGE_KEY);
  } catch (error) {
    console.error(`[RAG Chat] Failed to clear sessionStorage:`, error);
  }
}

function trimConversationHistory(
  history: ConversationMessage[],
  maxLength: number
): ConversationMessage[] {
  if (history.length === 0) return history;

  const truncateMessage = (msg: ConversationMessage): ConversationMessage => ({
    ...msg,
    content: msg.content.slice(0, MAX_MESSAGE_LENGTH),
    sources: undefined,
  });

  let trimmed = history.map(truncateMessage);
  let serialized = JSON.stringify(trimmed);

  while (serialized.length > maxLength && trimmed.length > 0) {
    trimmed = trimmed.slice(1);
    serialized = JSON.stringify(trimmed);
  }

  return trimmed;
}

export interface UseRagChatReturn {
  messages: ConversationMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  currentSources: VideoSource[];
}

export function useRagChat(): UseRagChatReturn {
  const [messages, setMessages] = useState<ConversationMessage[]>(() =>
    loadFromStorage<ConversationMessage[]>(STORAGE_KEY, [], conversationMessagesSchema)
  );
  const [currentSources, setCurrentSources] = useState<VideoSource[]>(() =>
    loadFromStorage<VideoSource[]>(SOURCES_STORAGE_KEY, [], videoSourcesSchema)
  );
  const messagesRef = useRef<ConversationMessage[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, messages);
  }, [messages]);

  useEffect(() => {
    saveToStorage(SOURCES_STORAGE_KEY, currentSources);
  }, [currentSources]);

  const mutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const trimmedHistory = trimConversationHistory(
        messagesRef.current,
        MAX_HISTORY_LENGTH
      );
      const result = await ragChatFn({
        data: {
          userMessage,
          conversationHistory: trimmedHistory,
        },
      });
      return result;
    },
    onMutate: (userMessage) => {
      const userMsg: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setCurrentSources([]);
    },
    onSuccess: (result) => {
      const assistantMsg: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.response,
        timestamp: new Date().toISOString(),
        sources: result.sources,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setCurrentSources(result.sources);
    },
    onError: (error) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === "user") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      console.error("[RAG Chat] Error:", error);
    },
  });

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || mutation.isPending) return;
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        throw new Error(
          `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`
        );
      }
      await mutation.mutateAsync(trimmed);
    },
    [mutation]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentSources([]);
    clearStorage();
    mutation.reset();
  }, [mutation]);

  return {
    messages,
    isLoading: mutation.isPending,
    error: mutation.error,
    sendMessage,
    clearChat,
    currentSources,
  };
}
