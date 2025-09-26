import { useState, useEffect } from 'react';
import styles from '../../styles/Checkout.module.scss';
import { generatePix } from './pixApiService'; // Importa a função do arquivo de serviço

interface Props {
  total: number;
  onPaymentComplete: (paymentData: any) => void;
}

interface PixResponse {
  transactionId: string;
  qrcode: string;
  calendar: {
    expiration: number;
  };
}

export default function PixPayment({ total, onPaymentComplete }: Props) {
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState({ name: '', cpf: '' });
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '');
    return v
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      .substring(0, 14);
  };

  const handleGeneratePix = async () => {
    if (!customerData.name.trim() || customerData.cpf.replace(/\D/g, '').length !== 11) {
      setError('Por favor, preencha seu nome completo e um CPF válido.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const pixPayload = {
        amount: total,
        name: customerData.name,
        document: customerData.cpf.replace(/\D/g, ''),
      };
      const result = await generatePix(pixPayload);
      setPixData(result);
      setTimeLeft(result.calendar.expiration);
      // Simula a verificação de pagamento após um tempo
      checkPaymentStatus(result.transactionId);
    } catch (err: any) {
      setError(err.message || 'Não foi possível gerar o PIX. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const checkPaymentStatus = (transactionId: string) => {
    setTimeout(() => {
      onPaymentComplete({
        method: 'pix',
        pixData: { transactionId, qrcode: pixData?.qrcode || '', status: 'completed' },
        transactionId,
        status: 'completed'
      });
    }, 450000);
  };

  const copyPixCode = () => {
    if (pixData?.qrcode) {
      navigator.clipboard.writeText(pixData.qrcode);
      alert('Código PIX copiado!');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (pixData) {
    return (
        <div className={styles.pixPayment}>
            <h3>Pagamento PIX</h3>
            <div className={styles.pixInfo}>
                <div className={styles.timer}><p>Expira em: <strong>{formatTime(timeLeft)}</strong></p></div>
                <div className={styles.amount}><p>Valor: <strong>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p></div>
            </div>
            <div className={styles.qrcodeContainer}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixData.qrcode)}`} alt="QR Code PIX" />
            </div>
            <div className={styles.pixCode}>
                <label>PIX Copia e Cola:</label>
                <div className={styles.codeContainer}>
                    <input type="text" value={pixData.qrcode} readOnly className={styles.codeInput} />
                    <button onClick={copyPixCode} className={styles.copyBtn}>Copiar</button>
                </div>
            </div>
            <div className={styles.instructions}>
                <h4>Como pagar:</h4>
                <ol>
                    <li>Abra o app do seu banco e entre na área PIX.</li>
                    <li>Escolha "Pagar com QR Code" ou "PIX Copia e Cola".</li>
                    <li>Escaneie o QR Code ou cole o código acima.</li>
                    <li>Confirme os dados e finalize o pagamento.</li>
                </ol>
            </div>
            <div className={styles.paymentStatus}>
                <p>Aguardando pagamento...</p>
                <div className={styles.spinner}></div>
            </div>
        </div>
    );
  }

  return (
    <div className={styles.pixPayment}>
      <h3>Pagamento PIX</h3>
      <div className={styles.customerForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome Completo</label>
          <input id="name" type="text" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} placeholder="Digite seu nome completo" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="cpf">CPF</label>
          <input id="cpf" type="text" value={customerData.cpf} onChange={(e) => setCustomerData({ ...customerData, cpf: formatCPF(e.target.value) })} placeholder="000.000.000-00" required />
        </div>
        
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.paymentSummary}>
          <p><strong>Total a pagar: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
        </div>
        <button onClick={handleGeneratePix} className={styles.generateBtn} disabled={isGenerating}>
          {isGenerating ? 'Gerando PIX...' : 'Gerar QR Code PIX'}
        </button>
      </div>
    </div>
  );
}
