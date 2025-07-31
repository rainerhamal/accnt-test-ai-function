import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { generateQuery, runGeneratedSQLQuery } from '@/app/actions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 20;

const generateQueryTool  = tool({
            description: "Generate a safe SQL query based on a user prompt",
            parameters: z.object({
                    input: z.string().describe("The user's natural language input"),
                    // required: [ "latitude", "longitude"],
                    // additionalProperties: false
            }),
            execute: async ({ input }) => {
              const query = await generateQuery(input);
              return { query };
            },
        });

const runGeneratedSQLQueryTool = tool({
            description: "Run a generated SQL query and return the results",
            parameters: z.object({
                query: z.string().describe("The SQL query to execute"),
            }),
            execute: async ({ query }) => {
                const data = await runGeneratedSQLQuery(query);
                return { data };
            },
        });

export async function POST(req: Request) {
  const { messages } = await req.json();
//   const messages = body.messages

  const result = streamText({
    model: openai('gpt-4o'),
    system: "You must always use the tool `generateQueryTool` for any request related to database, SQL, or data manipulation. Never generate SQL manually.",
    messages,
    maxSteps:5,
    tools: {
      generateQueryTool, 
      runGeneratedSQLQueryTool
    },
    toolChoice: 'required',
  });

  console.log('Generated route result:', result);

  return result.toDataStreamResponse();
}