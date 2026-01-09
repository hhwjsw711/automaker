import OpenAI from "openai";
import { env } from "~/utils/env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const CHAT_MODEL = "gpt-4o";
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  model?: "gpt-4o-mini" | "gpt-4o";
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionResult {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class ChatCompletionError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ChatCompletionError";
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  context: Record<string, unknown>
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      const isRetryable =
        error instanceof OpenAI.APIError &&
        (error.status === 429 ||
          error.status === 500 ||
          error.status === 502 ||
          error.status === 503);

      if (!isRetryable || attempt === MAX_RETRIES - 1) {
        break;
      }

      const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
      console.warn(
        `Chat completion API call failed (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delay}ms...`,
        { error: lastError.message, ...context }
      );
      await sleep(delay);
    }
  }

  if (lastError instanceof OpenAI.APIError) {
    throw new ChatCompletionError(
      `OpenAI API error: ${lastError.message}`,
      lastError.code ?? undefined,
      lastError.status,
      context
    );
  }

  throw new ChatCompletionError(
    `Chat completion failed: ${lastError?.message ?? "Unknown error"}`,
    undefined,
    undefined,
    context
  );
}

export async function createChatCompletion(
  messages: ChatMessage[],
  options?: ChatCompletionOptions
): Promise<ChatCompletionResult> {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new ChatCompletionError(
      "Messages must be a non-empty array",
      undefined,
      undefined,
      { messagesLength: messages?.length ?? 0 }
    );
  }

  const model = options?.model ?? CHAT_MODEL;
  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 2048;

  return withRetry(
    async () => {
      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const choice = response.choices[0];
      if (!choice?.message?.content) {
        throw new ChatCompletionError(
          "Invalid API response: missing message content",
          undefined,
          undefined,
          { choicesLength: response.choices.length }
        );
      }

      return {
        content: choice.message.content,
        usage: response.usage
          ? {
              promptTokens: response.usage.prompt_tokens,
              completionTokens: response.usage.completion_tokens,
              totalTokens: response.usage.total_tokens,
            }
          : undefined,
      };
    },
    { model, messagesCount: messages.length }
  );
}
