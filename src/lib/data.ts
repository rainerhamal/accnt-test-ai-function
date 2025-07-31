import { sql } from '@vercel/postgres';
import { Transactions } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function fetchFilteredTransactions(
    // query: string,
    // currentPage: number,
) {
    noStore();
    console.log("POSTGRES_URL from env:", process.env.POSTGRES_URL);

    try {
        const transactions = await pool.query<Transactions>(`
            SELECT
                t.id,
                t.date,
                p.name AS payee_name,
                c.name AS category_name,
                t.description,
                t.spent,
                t.received
            FROM transactions t
            LEFT JOIN payees p ON t.payee_id = p.id
            LEFT JOIN categories c ON t.category_id = c.id
        `);

        return transactions.rows;
    } catch (error) {
        console.error( 'Database Error:', error );
        throw new Error( 'Failed to fetch transactions.' );
    }
}

export async function fetchFilteredPayees(
    // query: string,
    // currentPage: number,
) {
    noStore();
    console.log("POSTGRES_URL from env:", process.env.POSTGRES_URL);

    try {
        const transactions = await pool.query<Transactions>(`
            SELECT
                id,
                name,
                email
            FROM payees
        `);

        return transactions.rows;
    } catch (error) {
        console.error( 'Database Error:', error );
        throw new Error( 'Failed to fetch transactions.' );
    }
}

export async function fetchFilteredCategories(
    // query: string,
    // currentPage: number,
) {
    noStore();
    console.log("POSTGRES_URL from env:", process.env.POSTGRES_URL);

    try {
        const transactions = await pool.query<Transactions>(`
            SELECT
                id,
                name,
                type
            FROM categories
        `);

        return transactions.rows;
    } catch (error) {
        console.error( 'Database Error:', error );
        throw new Error( 'Failed to fetch transactions.' );
    }
}