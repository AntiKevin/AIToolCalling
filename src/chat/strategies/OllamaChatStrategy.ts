import type { IChatStrategy } from '../IChatStrategy';
import type { ChatOptions, ChatResponse, Message } from '../types';

export class OllamaChatStrategy implements IChatStrategy {
  private host: string;
  private defaultModel: string;

  constructor(host: string = 'http://localhost:11434', model: string = 'functiongemma') {
    this.host = host;
    this.defaultModel = model;
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
    const model = options?.model || this.defaultModel;
    const tools = options?.tools;

    const response = await fetch(`${this.host}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model, 
        messages, 
        tools,
        stream: false 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${await response.text()}`);
    }

    return response.json() as Promise<ChatResponse>;
  }

  getHost(): string {
    return this.host;
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }
}
