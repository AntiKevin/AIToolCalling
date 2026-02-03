import { getTime, getWeather } from "./functions";

type ToolName = "get_weather" | "get_time";

type ToolFunction = (args: Record<string, any>) => string;

const AItoolSelector: Record<ToolName, ToolFunction> = {
    "get_weather": getWeather,
    "get_time": getTime
};

async function callTool(toolName: ToolName, parameters: any): Promise<string> {
    const tool = AItoolSelector[toolName];
    
    if (!tool) {
        throw new Error(`Tool "${toolName}" not found`);
    }
    
    return tool(parameters);
}

export { callTool, ToolName };
