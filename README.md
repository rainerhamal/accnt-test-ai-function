# accnt-test-ai-function

A Next.js project that demonstrates AI-powered SQL query generation and execution for a financial transactions database. This project uses OpenAI's GPT models to help users interact with a PostgreSQL database, generating and running queries for common CRUD operations on transactions, categories, and payees.

## Features

- **AI SQL Query Generation**: Uses OpenAI's GPT-4o to generate SQL queries based on user input, with built-in safeguards against destructive operations (e.g., DROP, TRUNCATE).
- **PostgreSQL Integration**: Connects to a PostgreSQL database using environment variables for secure configuration.
- **Schema Awareness**: The AI is aware of the database schema for transactions, categories, and payees, and can clarify vague user requests before generating queries.
- **Safe Execution**: Only allows SELECT, INSERT, UPDATE, and DELETE queries. Forbidden operations are blocked and reported.
- **Seed Data**: Includes CSV files for seeding categories, payees, and financial transactions.

## Usage

1. **Configure Environment**: Set your `POSTGRES_URL` in environment variables.
2. **Seed Data**: Use the provided CSV files to seed your database.
3. **Run the App**: Start the Next.js server and interact with the UI to generate and execute SQL queries using natural language.

## Safeguards
- The AI will clarify vague requests before generating queries.
- Destructive operations (DROP, TRUNCATE, etc.) are blocked.
- Only safe SQL actions (SELECT, INSERT, UPDATE, DELETE) are allowed.

## Technologies Used
- Next.js
- PostgreSQL
- OpenAI GPT-4o
- TypeScript

## Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/<your-username>/accnt-test-ai-function.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your `.env` file with your PostgreSQL connection string.
4. Start the development server:
   ```sh
   npm run dev
   ```

## License

MIT
