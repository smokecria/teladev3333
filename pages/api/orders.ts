import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await getConnection();

    switch (req.method) {
      case 'GET':
        try {
          const [rows] = await connection.execute(`
            SELECT 
              id, customer_name, customer_email, customer_cpf, customer_address,
              items, total, payment_method, payment_status, card_data, pix_data,
              created_at, updated_at
            FROM orders 
            ORDER BY created_at DESC
          `);
          
          const orders = (rows as any[]).map(row => ({
            ...row,
            customer_address: row.customer_address ? JSON.parse(row.customer_address) : null,
            items: row.items ? JSON.parse(row.items) : [],
            card_data: row.card_data ? JSON.parse(row.card_data) : null,
            pix_data: row.pix_data ? JSON.parse(row.pix_data) : null
          }));

          await connection.end();
          return res.status(200).json(orders);
        } catch (error) {
          console.error('Erro ao buscar pedidos:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao buscar pedidos' });
        }

      case 'POST':
        try {
          const {
            customerName, customerEmail, customerCpf, customerAddress,
            items, total, paymentMethod, paymentStatus, cardData, pixData
          } = req.body;

          if (!customerName || !customerEmail || !customerCpf || !items || !total || !paymentMethod) {
            await connection.end();
            return res.status(400).json({ 
              error: 'Campos obrigatórios: customerName, customerEmail, customerCpf, items, total, paymentMethod' 
            });
          }

          const id = uuidv4();

          await connection.execute(`
            INSERT INTO orders (
              id, customer_name, customer_email, customer_cpf, customer_address,
              items, total, payment_method, payment_status, card_data, pix_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            id, customerName, customerEmail, customerCpf,
            customerAddress ? JSON.stringify(customerAddress) : null,
            JSON.stringify(items), total, paymentMethod,
            paymentStatus || 'pending',
            cardData ? JSON.stringify(cardData) : null,
            pixData ? JSON.stringify(pixData) : null
          ]);

          const newOrder = {
            id, customerName, customerEmail, customerCpf, customerAddress,
            items, total, paymentMethod, paymentStatus: paymentStatus || 'pending',
            cardData, pixData, createdAt: new Date().toISOString()
          };

          await connection.end();
          return res.status(201).json(newOrder);
        } catch (error) {
          console.error('Erro ao criar pedido:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao criar pedido' });
        }

      case 'PUT':
        try {
          const { id, paymentStatus, cardData, pixData } = req.body;

          if (!id) {
            await connection.end();
            return res.status(400).json({ error: 'ID do pedido é obrigatório' });
          }

          await connection.execute(`
            UPDATE orders SET
              payment_status = ?, card_data = ?, pix_data = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [
            paymentStatus,
            cardData ? JSON.stringify(cardData) : null,
            pixData ? JSON.stringify(pixData) : null,
            id
          ]);

          await connection.end();
          return res.status(200).json({ message: 'Pedido atualizado com sucesso' });
        } catch (error) {
          console.error('Erro ao atualizar pedido:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao atualizar pedido' });
        }

      default:
        await connection.end();
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de pedidos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}