// Este arquivo contém a lógica para chamar nossa própria API de backend.

interface PixPayload {
    amount: number;
    name: string;
    document: string;
}

export const generatePix = async (payload: PixPayload) => {
    try {
        // A chamada agora é para a nossa própria API, que está em /api/generate-pix
        const response = await fetch('/api/generate-pix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            // Se a API retornar um erro, nós o lançamos para o componente tratar.
            throw new Error(data.error || 'Falha ao gerar o QR Code.');
        }

        return data;

    } catch (error) {
        console.error('Erro de comunicação com a API interna:', error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Um erro de rede impediu a geração do PIX.');
    }
};
