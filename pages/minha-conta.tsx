import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Informacoes/Index';
import styles from '../styles/Account.module.scss';

interface Customer {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
}

interface SavedCard {
  id: number;
  card_name: string;
  card_number_masked: string;
  card_brand: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

export default function MinhaContaPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const sessionId = localStorage.getItem('customerSession');
    if (!sessionId) {
      router.push('/');
      return;
    }
    
    loadCustomerData(sessionId);
  }, [router]);

  const loadCustomerData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/customers?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data.customer);
        // Carregar cartões salvos aqui se implementado
      } else {
        localStorage.removeItem('customerSession');
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerSession');
    router.push('/');
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.accountHeader}>
          <h1>Minha Conta</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Sair
          </button>
        </div>

        <div className={styles.tabs}>
          <button 
            className={activeTab === 'profile' ? styles.active : ''}
            onClick={() => setActiveTab('profile')}
          >
            Perfil
          </button>
          <button 
            className={activeTab === 'cards' ? styles.active : ''}
            onClick={() => setActiveTab('cards')}
          >
            Cartões Salvos
          </button>
          <button 
            className={activeTab === 'orders' ? styles.active : ''}
            onClick={() => setActiveTab('orders')}
          >
            Meus Pedidos
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'profile' && (
            <div className={styles.profileSection}>
              <h2>Dados Pessoais</h2>
              <div className={styles.profileInfo}>
                <p><strong>Nome:</strong> {customer.name}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                {customer.cpf && <p><strong>CPF:</strong> {customer.cpf}</p>}
                {customer.phone && <p><strong>Telefone:</strong> {customer.phone}</p>}
              </div>
              <button className={styles.editBtn}>Editar Dados</button>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className={styles.cardsSection}>
              <h2>Cartões Salvos</h2>
              <p>Funcionalidade em desenvolvimento</p>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={styles.ordersSection}>
              <h2>Meus Pedidos</h2>
              <p>Funcionalidade em desenvolvimento</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}