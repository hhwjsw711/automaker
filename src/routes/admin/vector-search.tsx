import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { PageHeader } from "./-components/page-header";
import { Page } from "./-components/page";
import { assertIsAdminFn } from "~/fn/auth";
import { useRagChat } from "~/hooks/use-rag-chat";
import { ChatContainer } from "./vector-search/-components/chat-container";
import { ChatInput } from "./vector-search/-components/chat-input";
import { SourceVideosPanel } from "./vector-search/-components/source-videos-panel";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/admin/vector-search")({
  beforeLoad: () => assertIsAdminFn(),
  component: CourseAssistantPage,
});

function CourseAssistantPage() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, sendMessage, clearChat, currentSources } =
    useRagChat();

  return (
    <Page>
      <PageHeader
        title={t("admin_pages.vectorSearch.title")}
        highlightedWord={t("admin_pages.vectorSearch.highlightedWord")}
        description={t("admin_pages.vectorSearch.description")}
        actions={
          messages.length > 0 ? (
            <Button variant="outline" onClick={clearChat}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t("admin_pages.vectorSearch.clearChat")}
            </Button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="flex flex-col">
            <ChatContainer messages={messages} isLoading={isLoading} onSelectPrompt={setInputValue} />
            <ChatInput onSend={sendMessage} isLoading={isLoading} value={inputValue} onChange={setInputValue} />
          </Card>
        </div>
        <div className="lg:col-span-1">
          <SourceVideosPanel sources={currentSources} />
        </div>
      </div>
    </Page>
  );
}
