import { useEffect, useRef } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChatMessage } from "./chat-message";
import type { ConversationMessage } from "~/hooks/use-rag-chat";

interface ChatContainerProps {
  messages: ConversationMessage[];
  isLoading: boolean;
  onSelectPrompt: (prompt: string) => void;
}

const EXAMPLE_PROMPT_KEYS = [
  "admin_pages.vectorSearch.prompts.topicsCovered",
  "admin_pages.vectorSearch.prompts.gettingStarted",
  "admin_pages.vectorSearch.prompts.explainConcepts",
  "admin_pages.vectorSearch.prompts.prerequisites",
];

export function ChatContainer({ messages, isLoading, onSelectPrompt }: ChatContainerProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center text-center p-8">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t("admin_pages.vectorSearch.courseAssistant")}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {t("admin_pages.vectorSearch.emptyStateDescription")}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLE_PROMPT_KEYS.map((key) => (
            <button
              key={key}
              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              onClick={() => onSelectPrompt(t(key))}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex h-[500px] flex-col gap-4 overflow-y-auto p-4"
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
          <div className="flex items-center rounded-lg bg-muted px-4 py-3">
            <span className="text-sm text-muted-foreground">
              {t("admin_pages.vectorSearch.searchingTranscripts")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
