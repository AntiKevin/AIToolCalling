import type { ChatOptions, ChatResponse, Message } from './types';

export interface IChatStrategy {
  chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>;
}
