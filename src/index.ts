import { Chat, type Message } from "./chat";
import { OllamaChatStrategy } from "./chat/strategies";
import { tools } from "./tools";
import { callTool, type ToolName } from "./tools/toolSelector";

async function main() {

  const chat = new Chat(new OllamaChatStrategy());

  const messages: Message[] = [{ role: 'user', content: 'Qual o clima em Paris?' }];

  const response = await chat.chat(messages, { tools });

  if (response.message.tool_calls?.length) {
    const tool = response.message.tool_calls[0];

    let result = '';
    const params = tool?.function.arguments;

    result = await callTool(tool?.function.name as ToolName, params);

    messages.push(response.message);
    messages.push({ role: 'tool', content: result });

    const final = await chat.chat(messages, { tools });
    console.log('Response:', final.message.content);
  } else {
    console.log('Response:', response.message.content);
  }
}

main().catch(console.error);
