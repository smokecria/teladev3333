import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

// Tipos para as respostas da API externa
type TokenResponse = {
  access_token: string;
  expires_in: number;
};

type PixApiResponse = {
  transactionId: string;
  qrcode: string;
  calendar: {
    expiration: number;
  };
};

type ErrorResponse = {
  error: string;
  details?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PixApiResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { amount, name, document } = req.body;

    if (!amount || !name || !document) {
      return res.status(400).json({ error: 'Dados incompletos: amount, name e document são obrigatórios.' });
    }

    // 1. OBTER CREDENCIAIS SEGURAMENTE DAS VARIÁVEIS DE AMBIENTE
    const clientId = process.env.PIX_CLIENT_ID;
    const clientSecret = process.env.PIX_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("ERRO: Credenciais PIX_CLIENT_ID ou PIX_CLIENT_SECRET não estão configuradas no .env.local");
      return res.status(500).json({ error: 'Erro de configuração do servidor.' });
    }

    // 2. GERAR TOKEN DE ACESSO
    const credentials = `${clientId}:${clientSecret}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');

    // ✅ VERSÃO DEFINITIVA: URL como string pura.
      const tokenResponse = await fetch('https://api.pixupbr.com/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${base64Credentials}`
      }
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Erro ao obter token da PixUp:", errorData);
      return res.status(401).json({ error: `Falha na autenticação com a gateway: ${errorData.message || 'Credenciais inválidas'}` });
    }
    const tokenData: TokenResponse = await tokenResponse.json();

    // 3. GERAR QRCODE PIX COM O TOKEN
    const externalId = uuidv4();
    // ✅ VERSÃO DEFINITIVA: URL como string pura.
    const qrCodeResponse = await fetch('https://api.pixupbr.com/v2/pix/qrcode', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        external_id: externalId,
        payerQuestion: `Pagamento Loja - Pedido ${externalId.slice(0, 8)}`,
        payer: { name, document }
      })
    });

    if (!qrCodeResponse.ok) {
      const errorData = await qrCodeResponse.json();
      console.error("Erro ao gerar QR Code na PixUp:", errorData);
      return res.status(422).json({ error: `Gateway não pôde processar o PIX: ${errorData.message || 'Verifique os dados'}` });
    }

    const pixData: PixApiResponse = await qrCodeResponse.json();
    return res.status(200).json(pixData);

  } catch (error) {
    console.error("Erro inesperado no servidor ao gerar PIX:", error);
    return res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
}
