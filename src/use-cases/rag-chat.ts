import { generateEmbedding } from "~/lib/openai";
import { createChatCompletion, type ChatMessage } from "~/lib/openai-chat";
import { searchByEmbedding, type SearchResult } from "~/data-access/transcript-chunks";

const CONTEXT_CHUNK_LIMIT = 10;
const MAX_HISTORY_MESSAGES = 10;

export interface VideoSource {
  segmentId: number;
  segmentTitle: string;
  segmentSlug: string;
  moduleTitle: string;
  chunkText: string;
  similarity: number;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: VideoSource[];
}

export interface RagChatInput {
  userMessage: string;
  conversationHistory: ConversationMessage[];
}

export interface RagChatResult {
  response: string;
  sources: VideoSource[];
}

const SYSTEM_PROMPT = `You are a helpful course assistant for an online learning platform. Your role is to answer questions about the course content based on the provided transcript excerpts from video lessons.

IMPORTANT GUIDELINES:
1. Answer questions based on the provided context from video transcripts
2. Each source includes a relevance percentage - use sources with higher relevance as primary references, but also consider lower-relevance sources if they contain useful information
3. When referencing information, mention which video it comes from (e.g., "In the video about [topic]...")
4. Be concise but thorough in your explanations
5. If the context contains related information, share it even if it's not a perfect match to the question
6. Only say you don't have information if the context truly contains nothing relevant to the question
7. Format your responses using markdown for better readability:
   - Use **bold** for emphasis
   - Use bullet points for lists
   - Use code blocks for any code snippets mentioned in transcripts

Answer the user's question based on the context provided. If multiple videos discuss the topic, synthesize the information while crediting each source.`;

function formatContextForPrompt(searchResults: SearchResult[]): string {
  if (searchResults.length === 0) {
    return "No relevant course content found for this query.";
  }

  return searchResults
    .map((result, index) => {
      return `[Source ${index + 1}]
Video: "${result.segmentTitle}" (Module: ${result.moduleTitle})
Relevance: ${(result.similarity * 100).toFixed(1)}%
Content:
${result.chunkText}`;
    })
    .join("\n\n---\n\n");
}

function searchResultsToSources(searchResults: SearchResult[]): VideoSource[] {
  const uniqueSources = new Map<number, VideoSource>();

  for (const result of searchResults) {
    if (!uniqueSources.has(result.segmentId)) {
      uniqueSources.set(result.segmentId, {
        segmentId: result.segmentId,
        segmentTitle: result.segmentTitle,
        segmentSlug: result.segmentSlug,
        moduleTitle: result.moduleTitle,
        chunkText: result.chunkText,
        similarity: result.similarity,
      });
    }
  }

  return Array.from(uniqueSources.values()).sort(
    (a, b) => b.similarity - a.similarity
  );
}

function buildMessages(
  systemPrompt: string,
  context: string,
  userMessage: string,
  conversationHistory: ConversationMessage[]
): ChatMessage[] {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];

  const recentHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  const userMessageWithContext = `CONTEXT FROM COURSE TRANSCRIPTS:
---
${context}
---

USER QUESTION: ${userMessage}`;

  messages.push({
    role: "user",
    content: userMessageWithContext,
  });

  return messages;
}

export async function ragChatUseCase(input: RagChatInput): Promise<RagChatResult> {
  const { userMessage, conversationHistory } = input;

  console.log("[RAG Chat] Starting RAG chat", {
    userMessageLength: userMessage.length,
    historyLength: conversationHistory.length,
  });

  const startTime = Date.now();

  console.log("[RAG Chat] Generating embedding for user message...");
  const embedding = await generateEmbedding(userMessage);

  console.log("[RAG Chat] Searching for relevant chunks...");
  const searchResults = await searchByEmbedding(embedding, CONTEXT_CHUNK_LIMIT);

  console.log("[RAG Chat] Found relevant chunks", {
    totalResults: searchResults.length,
    topSimilarity: searchResults[0]?.similarity ?? 0,
    results: searchResults.map((r) => ({
      title: r.segmentTitle,
      similarity: r.similarity,
    })),
  });

  const context = formatContextForPrompt(searchResults);
  const sources = searchResultsToSources(searchResults);

  const messages = buildMessages(
    SYSTEM_PROMPT,
    context,
    userMessage,
    conversationHistory
  );

  console.log("[RAG Chat] Calling chat completion...");
  const completion = await createChatCompletion(messages, {
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 2048,
  });

  const durationMs = Date.now() - startTime;
  console.log("[RAG Chat] Completed", {
    durationMs,
    responseLength: completion.content.length,
    sourcesCount: sources.length,
    usage: completion.usage,
  });

  return {
    response: completion.content,
    sources,
  };
}
