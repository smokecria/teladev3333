import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { useEffect } from "react";

import { store } from "../store/store";

import "../styles/globals.css";

let persistor = persistStore(store);

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Inicializar banco de dados quando a aplicação carrega
    const initDatabase = async () => {
      try {
        const response = await fetch('/api/init-database', {
          method: 'POST',
        });
        const result = await response.json();
        if (result.success) {
          console.log('✅ Banco de dados inicializado com sucesso');
        } else {
          console.error('❌ Erro ao inicializar banco:', result.error);
        }
      } catch (error) {
        console.error('❌ Erro ao conectar com a API de inicialização:', error);
      }
    };

    initDatabase();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;