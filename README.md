# AIToolCalling

AIToolCalling é um boilerplate TypeScript para implementação de chat com suporte a chamadas de ferramentas (tool calling). O projeto utiliza o padrão Strategy para permitir flexibilidade na implementação de diferentes provedores de chat, com suporte nativo para Ollama.

## 🚀 Funcionalidades

- **Padrão Strategy**: Arquitetura flexível que permite trocar facilmente entre diferentes provedores de chat
- **Suporte a Tool Calling**: Capacidade de executar funções baseadas em requisições do modelo de IA
- **Implementação Ollama**: Integração nativa com Ollama para modelos locais
- **TypeScript**: Tipagem completa para maior segurança no desenvolvimento
- **Sistema de Ferramentas**: Estrutura organizada para adicionar e gerenciar ferramentas customizadas
- **Fluxo de Conversação Completo**: Suporte a mensagens, respostas e chamadas de ferramentas

## 📋 Pré-requisitos

- [Bun](https://bun.sh/) v1.3.8 ou superior
- [Ollama](https://ollama.ai/) rodando localmente (padrão: `http://localhost:11434`)
- Modelo Ollama com suporte a funções (recomendado: `functiongemma`)

## 🔧 Instalação

Clone o repositório e instale as dependências:

```bash
git clone <seu-repositorio>
cd 2checkAI
bun install
```

## 🎯 Uso Básico

### Executar o Projeto

```bash
bun run dev
```

### Exemplo de Uso

```typescript
import { Chat, type Message } from "./chat";
import { OllamaChatStrategy } from "./chat/strategies";
import { tools } from "./tools";
import { callTool, type ToolName } from "./tools/toolSelector";

// Inicializa o chat com estratégia Ollama
const chat = new Chat(new OllamaChatStrategy());

// Define a mensagem inicial
const messages: Message[] = [{ role: 'user', content: 'Qual o clima em Paris?' }];

// Envia a mensagem com as ferramentas disponíveis
const response = await chat.chat(messages, { tools });

// Verifica se há chamadas de ferramentas
if (response.message.tool_calls?.length) {
  const tool = response.message.tool_calls[0];
  
  // Executa a ferramenta solicitada
  let result = '';
  const params = tool?.function.arguments;
  result = await callTool(tool?.function.name as ToolName, params);
  
  // Adiciona a resposta da ferramenta ao histórico
  messages.push(response.message);
  messages.push({ role: 'tool', content: result });
  
  // Obtém a resposta final
  const final = await chat.chat(messages, { tools });
  console.log('Response:', final.message.content);
} else {
  console.log('Response:', response.message.content);
}
```

## 🏗️ Arquitetura

### Componentes Principais

#### 1. Chat ([`src/chat/Chat.ts`](src/chat/Chat.ts))
Classe principal que gerencia as interações de chat. Utiliza o padrão Strategy para delegar a implementação concreta.

```typescript
const chat = new Chat(new OllamaChatStrategy());
const response = await chat.chat(messages, { tools });
```

#### 2. IChatStrategy ([`src/chat/IChatStrategy.ts`](src/chat/IChatStrategy.ts))
Interface que define o contrato para todas as estratégias de chat.

```typescript
export interface IChatStrategy {
  chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse>;
}
```

#### 3. OllamaChatStrategy ([`src/chat/strategies/OllamaChatStrategy.ts`](src/chat/strategies/OllamaChatStrategy.ts))
Implementação concreta para o provedor Ollama.

```typescript
const strategy = new OllamaChatStrategy(
  'http://localhost:11434',  // host
  'functiongemma'             // modelo
);
```

#### 4. Sistema de Ferramentas ([`src/tools/`](src/tools/))
Estrutura organizada para definir e executar ferramentas customizadas.

## 📁 Estrutura do Projeto

```
AIToolCalling/
├── src/
│   ├── chat/
│   │   ├── Chat.ts              # Classe principal de chat
│   │   ├── IChatStrategy.ts     # Interface de estratégia
│   │   ├── types.ts             # Tipos TypeScript
│   │   ├── index.ts             # Exportações do módulo chat
│   │   └── strategies/
│   │       ├── OllamaChatStrategy.ts  # Implementação Ollama
│   │       └── index.ts               # Exportações de estratégias
│   ├── tools/
│   │   ├── tools.ts             # Definição das ferramentas
│   │   ├── toolSelector.ts      # Seletor e executor de ferramentas
│   │   ├── index.ts             # Exportações do módulo tools
│   │   └── functions/
│   │       ├── getWeater.ts     # Implementação das funções
│   │       └── index.ts         # Exportações das funções
│   └── index.ts                 # Ponto de entrada da aplicação
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 Adicionando Novas Ferramentas

### 1. Definir a Função

Crie a função em [`src/tools/functions/`](src/tools/functions/):

```typescript
// src/tools/functions/customFunction.ts
export function customFunction(args: Record<string, any>): string {
  const { param1, param2 } = args;
  // Sua lógica aqui
  return JSON.stringify({ result: 'success', data: '...' });
}
```

### 2. Exportar a Função

Adicione ao [`src/tools/functions/index.ts`](src/tools/functions/index.ts):

```typescript
export { customFunction } from './customFunction';
```

### 3. Registrar no Seletor

Atualize [`src/tools/toolSelector.ts`](src/tools/toolSelector.ts):

```typescript
import { getTime, getWeather, customFunction } from "./functions";

type ToolName = "get_weather" | "get_time" | "custom_function";

const AItoolSelector: Record<ToolName, ToolFunction> = {
  "get_weather": getWeather,
  "get_time": getTime,
  "custom_function": customFunction
};
```

### 4. Definir a Ferramenta

Adicione ao [`src/tools/tools.ts`](src/tools/tools.ts):

```typescript
export const tools = [
  // ... ferramentas existentes
  {
    type: 'function',
    function: {
      name: 'custom_function',
      description: 'Descrição da sua função customizada',
      parameters: {
        type: 'object',
        properties: {
          param1: { type: 'string', description: 'Descrição do parâmetro 1' },
          param2: { type: 'number', description: 'Descrição do parâmetro 2' },
        },
        required: ['param1'],
      },
    },
  },
];
```

## 🎨 Adicionando Novas Estratégias

Para adicionar suporte a outros provedores de chat:

### 1. Criar a Classe de Estratégia

```typescript
// src/chat/strategies/CustomChatStrategy.ts
import type { IChatStrategy } from '../IChatStrategy';
import type { ChatOptions, ChatResponse, Message } from '../types';

export class CustomChatStrategy implements IChatStrategy {
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey: string, model: string = 'default-model') {
    this.apiKey = apiKey;
    this.defaultModel = model;
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<ChatResponse> {
    // Implementação específica do provedor
    const response = await fetch('https://api.custom-provider.com/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ 
        model: options?.model || this.defaultModel, 
        messages, 
        tools: options?.tools 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json() as Promise<ChatResponse>;
  }
}
```

### 2. Exportar a Estratégia

```typescript
// src/chat/strategies/index.ts
export { OllamaChatStrategy } from './OllamaChatStrategy';
export { CustomChatStrategy } from './CustomChatStrategy';
```

### 3. Usar a Nova Estratégia

```typescript
import { Chat } from "./chat";
import { CustomChatStrategy } from "./chat/strategies";

const chat = new Chat(new CustomChatStrategy('your-api-key'));
```

## 📚 Tipos e Interfaces

### Message
```typescript
interface Message {
  role: string;           // 'user', 'assistant', 'tool'
  content: string;        // Conteúdo da mensagem
  tool_calls?: {          // Chamadas de ferramentas (opcional)
    function: {
      name: string;
      arguments: Record<string, string>
    }
  }[];
}
```

### ChatResponse
```typescript
interface ChatResponse {
  message: Message;
}
```

### ChatOptions
```typescript
interface ChatOptions {
  model?: string;         // Modelo a ser utilizado
  tools?: any[];          // Ferramentas disponíveis
  temperature?: number;   // Temperatura de geração
  maxTokens?: number;     // Máximo de tokens
  [key: string]: any;     // Opções adicionais
}
```

## 🔧 Configuração

### Configurar Host e Modelo do Ollama

```typescript
const chat = new Chat(new OllamaChatStrategy(
  'http://localhost:11434',  // Host do Ollama
  'llama3'                    // Modelo desejado
));
```

### Configurar Modelos Diferentes por Requisição

```typescript
const response = await chat.chat(messages, { 
  tools,
  model: 'llama3',
  temperature: 0.7
});
```

## 📝 Exemplos de Uso

### Exemplo 1: Consulta Simples

```typescript
const chat = new Chat(new OllamaChatStrategy());
const messages: Message[] = [{ 
  role: 'user', 
  content: 'Olá, como você está?' 
}];
const response = await chat.chat(messages);
console.log(response.message.content);
```

### Exemplo 2: Usando Ferramentas

```typescript
const chat = new Chat(new OllamaChatStrategy());
const messages: Message[] = [{ 
  role: 'user', 
  content: 'Qual a hora em São Paulo?' 
}];
const response = await chat.chat(messages, { tools });

if (response.message.tool_calls?.length) {
  const tool = response.message.tool_calls[0];
  const result = await callTool(
    tool?.function.name as ToolName, 
    tool?.function.arguments
  );
  
  messages.push(response.message);
  messages.push({ role: 'tool', content: result });
  
  const final = await chat.chat(messages, { tools });
  console.log(final.message.content);
}
```

### Exemplo 3: Conversa com Contexto

```typescript
const chat = new Chat(new OllamaChatStrategy());
const messages: Message[] = [
  { role: 'user', content: 'Meu nome é João' },
  { role: 'assistant', content: 'Olá João! Como posso ajudar?' },
  { role: 'user', content: 'Qual o meu nome?' }
];

const response = await chat.chat(messages);
console.log(response.message.content); // Deve lembrar que o nome é João
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🔗 Links Úteis

- [Bun Documentation](https://bun.sh/docs)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório do projeto.

---

Desenvolvido com ❤️ usando TypeScript e Bun
