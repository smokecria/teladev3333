import mysql from 'mysql2/promise';

// Função para obter a conexão com o banco de dados
export async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  return connection;
}

// Função que garante que a tabela de produtos existe
export async function ensureProductsTableExists(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      name TEXT NOT NULL,
      modelo VARCHAR(255),
      categoria VARCHAR(255),
      fabricante VARCHAR(255),
      price DECIMAL(10, 2) NOT NULL,
      img TEXT,
      img2 TEXT,
      garantia VARCHAR(255),
      specs JSON,
      promo BOOLEAN DEFAULT FALSE,
      pathName TEXT,
      tags JSON,
      destaque BOOLEAN DEFAULT FALSE
    );
  `);
}
