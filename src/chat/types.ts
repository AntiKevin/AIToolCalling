export interface Message {
  role: string;
  content: string;
  tool_calls?: { function: { name: string; arguments: Record<string, string> } }[];
}

export interface ChatResponse {
  message: Message;
}

export interface ChatOptions {
  model?: string;
  tools?: any[];
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}
