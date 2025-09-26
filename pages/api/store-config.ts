import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await getConnection();

    switch (req.method) {
      case 'GET':
        try {
          const { key } = req.query;
          
          if (key) {
            // Buscar configuração específica
            const [rows] = await connection.execute(
              'SELECT config_value FROM store_config WHERE config_key = ?',
              [key]
            );
            
            if ((rows as any[]).length === 0) {
              await connection.end();
              return res.status(404).json({ error: 'Configuração não encontrada' });
            }
            
            const config = (rows as any[])[0];
            await connection.end();
            return res.status(200).json(JSON.parse(config.config_value));
          } else {
            // Buscar todas as configurações
            const [rows] = await connection.execute('SELECT config_key, config_value FROM store_config');
            
            const configs: any = {};
            (rows as any[]).forEach(row => {
              configs[row.config_key] = JSON.parse(row.config_value);
            });
            
            await connection.end();
            return res.status(200).json(configs);
          }
        } catch (error) {
          console.error('Erro ao buscar configurações:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao buscar configurações' });
        }

      case 'POST':
      case 'PUT':
        try {
          const { key, value } = req.body;

          if (!key || !value) {
            await connection.end();
            return res.status(400).json({ error: 'Key e value são obrigatórios' });
          }

          // Verificar se a configuração já existe
          const [existing] = await connection.execute(
            'SELECT id FROM store_config WHERE config_key = ?',
            [key]
          );

          if ((existing as any[]).length > 0) {
            // Atualizar configuração existente
            await connection.execute(
              'UPDATE store_config SET config_value = ?, updated_at = CURRENT_TIMESTAMP WHERE config_key = ?',
              [JSON.stringify(value), key]
            );
          } else {
            // Criar nova configuração
            await connection.execute(
              'INSERT INTO store_config (config_key, config_value) VALUES (?, ?)',
              [key, JSON.stringify(value)]
            );
          }

          await connection.end();
          return res.status(200).json({ message: 'Configuração salva com sucesso', key, value });
        } catch (error) {
          console.error('Erro ao salvar configuração:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao salvar configuração' });
        }

      case 'DELETE':
        try {
          const { key } = req.body;

          if (!key) {
            await connection.end();
            return res.status(400).json({ error: 'Key é obrigatória' });
          }

          const [result] = await connection.execute('DELETE FROM store_config WHERE config_key = ?', [key]);
          
          if ((result as any).affectedRows === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Configuração não encontrada' });
          }

          await connection.end();
          return res.status(200).json({ message: 'Configuração deletada com sucesso' });
        } catch (error) {
          console.error('Erro ao deletar configuração:', error);
          await connection.end();
          return res.status(500).json({ error: 'Erro ao deletar configuração' });
        }

      default:
        await connection.end();
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de configurações:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}