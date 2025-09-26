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
              id, name, modelo, categoria, fabricante, price, img, img2, 
              garantia, specs, promo, pathName, tags, destaque,
              created_at, updated_at
            FROM products 
            ORDER BY created_at DESC
          `);
          
          const products = (rows as any[]).map(row => ({
            ...row,
            pPrazo: row.price, // Manter compatibilidade com o código existente
            specs: row.specs ? (typeof row.specs === 'string' ? JSON.parse(row.specs) : row.specs) : [],
            tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : []
          }));

          await connection.end();
          return res.status(200).json(products);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao buscar produtos' });
        }

      case 'POST':
        try {
          const {
            name, modelo, categoria, fabricante, price, img, img2,
            garantia, specs, promo, pathName, tags, destaque
          } = req.body;

          if (!name || !modelo || !price || !categoria) {
            await connection.end();
            return res.status(400).json({ error: 'Campos obrigatórios: name, modelo, categoria, price' });
          }

          const id = uuidv4();
          const generatedPathName = pathName || name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 100); // Limita o tamanho

          await connection.execute(`
            INSERT INTO products (
              id, name, modelo, categoria, fabricante, price, img, img2,
              garantia, specs, promo, pathName, tags, destaque
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            id, name, modelo, categoria, fabricante, price, img || '', img2 || '',
            garantia || '', JSON.stringify(specs || []), promo || false,
            generatedPathName, JSON.stringify(tags || []), destaque || false
          ]);

          const newProduct = {
            id, name, modelo, categoria, fabricante, price, img: img || '', img2: img2 || '',
            garantia: garantia || '', specs: specs || [], promo: promo || false,
            pathName: generatedPathName, tags: tags || [], destaque: destaque || false,
            pPrazo: price
          };

          await connection.end();
          return res.status(201).json(newProduct);
        } catch (error) {
          console.error('Erro ao criar produto:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao criar produto' });
        }

      case 'PUT':
        try {
          const {
            id, name, modelo, categoria, fabricante, price, img, img2,
            garantia, specs, promo, pathName, tags, destaque
          } = req.body;

          if (!id || !name || !modelo || !price || !categoria) {
            await connection.end();
            return res.status(400).json({ error: 'Campos obrigatórios: id, name, modelo, categoria, price' });
          }

          await connection.execute(`
            UPDATE products SET
              name = ?, modelo = ?, categoria = ?, fabricante = ?, price = ?,
              img = ?, img2 = ?, garantia = ?, specs = ?, promo = ?,
              pathName = ?, tags = ?, destaque = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [
            name, modelo, categoria, fabricante || '', price, img || '', img2 || '',
            garantia || '', JSON.stringify(specs || []), promo || false,
            pathName, JSON.stringify(tags || []), destaque || false, id
          ]);

          const updatedProduct = {
            id, name, modelo, categoria, fabricante: fabricante || '', price, 
            img: img || '', img2: img2 || '', garantia: garantia || '', 
            specs: specs || [], promo: promo || false, pathName, 
            tags: tags || [], destaque: destaque || false, pPrazo: price
          };

          await connection.end();
          return res.status(200).json(updatedProduct);
        } catch (error) {
          console.error('Erro ao atualizar produto:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao atualizar produto' });
        }

      case 'DELETE':
        try {
          const { id } = req.body;

          if (!id) {
            await connection.end();
            return res.status(400).json({ error: 'ID do produto é obrigatório' });
          }

          const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);
          
          if ((result as any).affectedRows === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Produto não encontrado' });
          }

          await connection.end();
          return res.status(200).json({ message: 'Produto deletado com sucesso' });
        } catch (error) {
          console.error('Erro ao deletar produto:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao deletar produto' });
        }

      default:
        await connection.end();
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de produtos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}