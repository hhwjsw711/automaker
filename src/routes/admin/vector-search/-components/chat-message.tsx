import { User, Bot } from "lucide-react";
import Markdown from "react-markdown";
import { Badge } from "~/components/ui/badge";
import type { ConversationMessage } from "~/hooks/use-rag-chat";

interface ChatMessageProps {
  message: ConversationMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-theme-500 text-white" : "bg-muted"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`flex max-w-[80%] flex-col gap-2 rounded-lg px-4 py-3 ${
          isUser
            ? "bg-theme-500 text-white"
            : "bg-muted"
        }`}
      >
        <div className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : "dark:prose-invert"}`}>
          {isUser ? (
            <p className="m-0">{message.content}</p>
          ) : (
            <Markdown>{message.content}</Markdown>
          )}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-border/50">
            {message.sources.slice(0, 3).map((source) => (
              <Badge
                key={source.segmentId}
                variant="secondary"
                className="text-xs"
              >
                {source.segmentTitle}
              </Badge>
            ))}
            {message.sources.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{message.sources.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
