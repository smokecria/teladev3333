import { useState, useEffect } from 'react';
import styles from "../../styles/Informacoes.module.scss";

interface StoreConfig {
  storeName: string;
  storeAddress: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  contact: {
    whatsapp: string;
    email: string;
  };
}

function Funcionamento() {
  const [config, setConfig] = useState<StoreConfig>({
    storeName: 'PC Shop',
    storeAddress: {
      street: 'Rua xxxxxxxxxx',
      number: '100',
      neighborhood: 'Bairro xxxxxxx',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '11111-111'
    },
    workingHours: {
      weekdays: 'Segunda à Sexta-feira de 8:00h às 18h',
      saturday: 'Fechado devido ao Coronavírus (COVID-19)',
      sunday: 'Fechado'
    },
    contact: {
      whatsapp: '',
      email: ''
    }
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('storeConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  return (
    <div className={styles.funcionanento}>
      <h1>ATENDIMENTO</h1>
      <p>
        <strong>Horário de Atendimento:</strong> {config.workingHours.weekdays}
      </p>
      <p>
        <strong>Sábado:</strong> {config.workingHours.saturday}
      </p>
      {config.contact.whatsapp && (
        <p>
          <strong>WhatsApp:</strong> {config.contact.whatsapp}
        </p>
      )}
      <p>
        <strong>LOJA FÍSICA</strong>
      </p>
      <p>
        {config.storeAddress.street} nº {config.storeAddress.number}, {config.storeAddress.neighborhood} - {config.storeAddress.city} - {config.storeAddress.zipCode}
      </p>
    </div>
  );
}

export default Funcionamento;
