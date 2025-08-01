import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { generateQuery, runGeneratedSQLQuery } from '@/app/actions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 20;

const runGeneratedSQLQueryTool = tool( {
  description: "Run a generated SQL query and return the results",
  parameters: z.object( {
    query: z.string().describe( "The SQL query to execute" ),
  } ),
  execute: async ( { query } ) =>
  {
    console.log( '[runGeneratedSQLQueryTool] Running query:', query );
    const data = await runGeneratedSQLQuery( query );
    console.log( '[runGeneratedSQLQueryTool] Query result:', data );
    return { data };
  },
} );

const systemPrompt = `You are an SQL (postgres) Supabase and database expeert. Your job is to help the user write an SQL query to create, read, update, and delete data from the transactions table in the database. 
                Do not allow user to delete or truncate the any table in the database.
                
                The table schema are as follows:
            
                transactions (
                    id uuid not null default extensions.uuid_generate_v4 (),
                    date date not null,
                    payee_id uuid null,
                    category_id uuid null,
                    description text null,
                    spent numeric(10, 2) null,
                    received numeric(10, 2) null,
                    constraint transactions_pkey primary key (id),
                    constraint transactions_category_id_fkey foreign KEY (category_id) references categories (id),
                    constraint transactions_payee_id_fkey foreign KEY (payee_id) references payees (id)
                );

                categories (
                    id uuid not null default extensions.uuid_generate_v4 (),
                    name character varying(255) not null,
                    type character varying(255) null,
                );

                payees (
                    id uuid not null default extensions.uuid_generate_v4 (),
                    name character varying(255) not null,
                    email text not null,
                ;)
                

                For things like payee, description and other string fields, use the ILIKE operator and convert both the search term and the field to lowercase using LOWER() function. For example: LOWER(industry) ILIKE LOWER('%search_term%').

                If the user's message is vague, then the AI should clarify it first. For instance, the user says "Add Mark" .. The AI should clarify if the user is trying to add a payee or a category.
                
                Vague user messages must be clarified before generating the query.

                Always confirm with the user if the informations are correct.
                Always confirm with the useer if the sql action is correct before executing it.
                If the user asks for a query that is not allowed, then tell them that table deletions are not allowed.
                If the user asks for a query that is not allowed, then tell them that table truncate is not allowed.

                To avoid updating or deleting data of multiple rows with similar values, do not allow single value inputs to be executed directly. Always ask follow up supporting values. Always ask for the transaction ID to update or delete a transaction.

                Here are the Categories:
                    name: Insurance, type: Expense,
                    name: Fixed Assets, type: COGS,
                    name: Current Assets, type: asset,
                    name: Sales, type: Income,
                    name: Advertising, type: Expense,
                    name: Utilities, type: Expense,
                    name: Merchandise, type: Expense,
                    name: Meals & Entertainment, type: Expense,
                    name: Google Ads, type: Expense,

                Here are the Payees:
                    name: Netflix, email: contact@netflix.com,
                    name: IBM, email: support@ibm.com,
                    name: Microsoft, email: support@microsoft.com,
                    name: Uber, email: ads-support@uber.com,
                    name: Apple", email: contact@apple.com,
                    name: Amazon", email: contact@amazon.com,
                    name: Walgreens", email: suppot@walgreens.com,
                    name: Paypal", email: contact@paypal.com,
                    name: Starbucks, email: support@starbucks.com,
                    name: Costco, email: contact@costco.com

            `

export async function POST ( req: Request )
{
  const { messages } = await req.json();
  console.log( '[POST] Incoming messages:', messages );
  //   const messages = body.messages

  const result = streamText( {
    model: openai( 'gpt-4o' ),
    system: systemPrompt,
    messages,
    maxSteps: 5,
    tools: {
      // generateQueryTool,
      runGeneratedSQLQueryTool
    },
    toolChoice: 'auto',
  } );

  console.log( 'Generated route result:', result );

  return result.toDataStreamResponse();
}