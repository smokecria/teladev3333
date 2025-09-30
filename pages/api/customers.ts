import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Função para hash de senha
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Função para verificar senha
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await getConnection();

    switch (req.method) {
      case 'POST':
        const { action } = req.body;

        if (action === 'register') {
          try {
            const { name, email, password, cpf, phone } = req.body;

            if (!name || !email || !password) {
              await connection.release();
              return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
            }

            // Verificar se email já existe
            const [existingUser] = await connection.execute(
              'SELECT id FROM customers WHERE email = ?',
              [email]
            );

            if ((existingUser as any[]).length > 0) {
              await connection.release();
              return res.status(400).json({ error: 'Email já cadastrado' });
            }

            // Criar novo cliente
            const passwordHash = hashPassword(password);
            const [result] = await connection.execute(`
              INSERT INTO customers (name, email, password_hash, cpf, phone)
              VALUES (?, ?, ?, ?, ?)
            `, [name, email, passwordHash, cpf || null, phone || null]);

            const customerId = (result as any).insertId;

            // Criar sessão
            const sessionId = uuidv4();
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

            await connection.execute(`
              INSERT INTO customer_sessions (id, customer_id, ip_address, user_agent, expires_at)
              VALUES (?, ?, ?, ?, ?)
            `, [
              sessionId,
              customerId,
              req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              req.headers['user-agent'],
              expiresAt
            ]);

            await connection.release();
            return res.status(201).json({
              success: true,
              customer: { id: customerId, name, email },
              sessionId
            });

          } catch (error) {
            console.error('Erro ao registrar cliente:', error);
            await connection.release();
            return res.status(500).json({ error: 'Erro ao criar conta' });
          }
        }

        if (action === 'login') {
          try {
            const { email, password } = req.body;

            if (!email || !password) {
              await connection.release();
              return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            // Buscar cliente
            const [customers] = await connection.execute(
              'SELECT id, name, email, password_hash, is_active FROM customers WHERE email = ?',
              [email]
            );

            const customer = (customers as any[])[0];
            if (!customer || !customer.is_active) {
              await connection.release();
              return res.status(401).json({ error: 'Email ou senha incorretos' });
            }

            // Verificar senha
            if (!verifyPassword(password, customer.password_hash)) {
              await connection.release();
              return res.status(401).json({ error: 'Email ou senha incorretos' });
            }

            // Criar sessão
            const sessionId = uuidv4();
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

            await connection.execute(`
              INSERT INTO customer_sessions (id, customer_id, ip_address, user_agent, expires_at)
              VALUES (?, ?, ?, ?, ?)
            `, [
              sessionId,
              customer.id,
              req.headers['x-forwarded-for'] || req.connection.remoteAddress,
              req.headers['user-agent'],
              expiresAt
            ]);

            await connection.release();
            return res.status(200).json({
              success: true,
              customer: { id: customer.id, name: customer.name, email: customer.email },
              sessionId
            });

          } catch (error) {
            console.error('Erro ao fazer login:', error);
            await connection.release();
            return res.status(500).json({ error: 'Erro ao fazer login' });
          }
        }

        break;

      case 'GET':
        try {
          const { sessionId } = req.query;

          if (!sessionId) {
            await connection.release();
            return res.status(401).json({ error: 'Sessão não fornecida' });
          }

          // Verificar sessão
          const [sessions] = await connection.execute(`
            SELECT cs.*, c.name, c.email 
            FROM customer_sessions cs
            JOIN customers c ON cs.customer_id = c.id
            WHERE cs.id = ? AND cs.expires_at > NOW() AND c.is_active = TRUE
          `, [sessionId]);

          const session = (sessions as any[])[0];
          if (!session) {
            await connection.release();
            return res.status(401).json({ error: 'Sessão inválida ou expirada' });
          }

          await connection.release();
          return res.status(200).json({
            customer: {
              id: session.customer_id,
              name: session.name,
              email: session.email
            }
          });

        } catch (error) {
          console.error('Erro ao verificar sessão:', error);
          await connection.release();
          return res.status(500).json({ error: 'Erro ao verificar sessão' });
        }

      default:
        await connection.release();
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de clientes:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}