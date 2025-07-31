const { db } = require('@vercel/postgres');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
require ('dotenv/config');

function parseDate(dateString){
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  console.warn(`Could not parse date: ${dateString}`);
  throw Error();
}

async function seedTransactions(client) {
  const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
      date DATE NOT NULL,
      payee_id UUID REFERENCES payees(id) ON DELETE SET NULL,
      category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
      description TEXT,
      spent DECIMAL(10, 2),
      received DECIMAL(10, 2)
    )
  `;

  console.log(`Created "transactions" table`);

  const results = [];
  const csvFilePath = path.join(process.cwd(), 'financial_seed_data.csv');

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of results) {
    const date  = parseDate(row.Date);
    const spent = parseFloat(row.Spent || '0') || 0;
    const received = parseFloat(row.Received || '0') || 0;

    // Get payee_id from payees table
    const payeeResult = await client.sql`
      SELECT id FROM payees WHERE TRIM(LOWER(name)) = TRIM(LOWER(${row.Payee}))
    `;
    const payee_id = payeeResult.rows[0]?.id || null;

    // Get category_id from categories table
    const categoryResult = await client.sql`
      SELECT id FROM categories WHERE TRIM(LOWER(name)) = TRIM(LOWER(${row.Category}))
    `;
    const category_id = categoryResult.rows[0]?.id || null;

    await client.sql`
      INSERT INTO transactions (date, payee_id, category_id, description, spent, received)
      VALUES (
        ${date},
        ${payee_id},       
        ${category_id},
        ${row.Description},
        ${spent},
        ${received}
      )
    `;
  }

  console.log(`Seeded ${results.length} transactions`);

  return {
    createTable,
    transactions: results,
  };
}

async function seedPayees(client) {
  const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS payees (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
      name VARCHAR(255) NOT NULL UNIQUE,
      email TEXT NOT NULL
    )
  `;

  console.log(`Created "payees" table`);

  const results = [];
  const csvFilePath = path.join(process.cwd(), 'payees_seed.csv');

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of results) {

    await client.sql`
      INSERT INTO payees (name, email)
      VALUES (
        ${row.name},
        ${row.email}
      )
    `;
  }

  console.log(`Seeded ${results.length} payees`);

  return {
    createTable,
    payees: results,
  };
}

async function seedCategories(client) {
  const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS categories (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY UNIQUE,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(255)
    )
  `;

  console.log(`Created "categories" table`);

  const results = [];
  const csvFilePath = path.join(process.cwd(), 'categories_seed.csv');

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of results) {

    await client.sql`
      INSERT INTO categories (name, type)
      VALUES (
        ${row.name},
        ${row.type}
      )
    `;
  }

  console.log(`Seeded ${results.length} categories`);

  return {
    createTable,
    categories: results,
  };
}



async function main() {
  const client = await db.connect();

  await seedPayees(client);
  await seedCategories(client);
  await seedTransactions(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});