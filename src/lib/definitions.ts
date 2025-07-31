export type Transactions = {
    id: number;
    date: string;
    payee: string;
    description: string;
    spent: number;
    received: number;
    category: string;
}

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  query: string;
};

export type Result = Record<string, string | number>;