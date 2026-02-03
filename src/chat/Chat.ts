import type { IChatStrategy } from './IChatStrategy';
import type { ChatOptions, ChatResponse, Message } from './types';

export class Chat {
  private strategy: IChatStrategy;

  constructor(strategy: IChatStrategy) {
    this.strategy = strategy;
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
    return this.strategy.chat(messages, options);
  }

  setStrategy(strategy: IChatStrategy): void {
    this.strategy = strategy;
  }

  getStrategy(): IChatStrategy {
    return this.strategy;
  }
}
