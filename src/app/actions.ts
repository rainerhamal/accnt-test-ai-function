"use server";

import { Pool } from 'pg';
import { Transactions, Result } from '@/lib/definitions';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const pool = new Pool( {
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false },
} );

export const generateQuery = async ( input: string ) =>
{
    'use server';
    try
    {
        const result = await generateObject( {
            model: openai( 'gpt-4o' ),
            system: `You are an SQL (postgres) Supabase and database expeert. Your job is to help the user write an SQL query to create, read, update, and delete data from the transactions table in the database. 
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

            `,

            prompt: `Generate the query necessary to retrieve the data the user wants: ${ input }`,
            schema: z.object( {
                query: z.string(),
            } ),
        } );

        console.log( 'Generated Query:', result.object.query );
        return result.object.query;        

    } catch ( error )
    {
        console.error( error );
        throw new Error( 'Failed to generate query' );
    }
}

/**
 * Executes a SQL query and returns the result data
 * @param {string} query - The SQL query to execute
 * @returns {Promise<Result[]>} Array of query results
 * @throws {Error} If query is not a SELECT statement or table doesn't exist
 */

export const runGeneratedSQLQuery = async ( query: string ) =>
{
    "use server";
    // Ensure the query is a SELECT statement. Otherwise, throw an error
    const forbidden = [ 'drop', 'alter', 'truncate', 'create', 'grant', 'revoke' ];
    const queryType = query.trim().toLowerCase().split( /\s+/ )[ 0 ];

    if ( forbidden.some( keyword => query.toLowerCase().includes( keyword ) ) )
    {
        throw new Error( "Forbidden SQL operation detected" );
    }

    if ( ![ 'select', 'insert', 'update', 'delete' ].includes( queryType ) )
    {
        throw new Error( "Only SELECT, INSERT, UPDATE, and DELETE queries are allowed" );
    }

    let data: any;
    try
    {
        data = await pool.query( query );
    } catch ( e: any )
    {
        if ( e.message.includes( 'relation "transactions" does not exist' ) )
        {
            console.log(
                "Table does not exist, creating and seeding it with dummy data now...",
            );
            // throw error
            throw Error( "Table does not exist" );
        } else
        {
            throw e;
        }
    }

    return data.rows as Result[];
};