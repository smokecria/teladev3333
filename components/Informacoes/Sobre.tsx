import { useState, useEffect } from 'react';
import styles from "../../styles/Informacoes.module.scss";

function Sobre() {
  const [storeName, setStoreName] = useState('PC SHOP');

  useEffect(() => {
    const savedConfig = localStorage.getItem('storeConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setStoreName(config.storeName?.toUpperCase() || 'PC SHOP');
    }
  }, []);

  return (
    <div className={styles.lojaSobre}>
      <h1>{storeName}</h1>
      <div className={styles.lojaSobreDesc}>
        <p>
          A {storeName} é uma empresa especializada em componentes de Alta
          Performance para seu computador. Parcelamos suas compras em 12x sem
          juros no cartão. Estamos neste mercado a 5 Anos e já vendemos mais de
          10 mil componentes. Compre pelo site e receba com total segurança.
        </p>
        <p>{storeName} © - Todos os direitos reservados.</p>
      </div>
    </div>
  );
}

export default Sobre;
