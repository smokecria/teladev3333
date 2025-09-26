import { useState, useEffect } from 'react';
import styles from '../../styles/Admin.module.scss';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_cpf: string;
  customer_address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  items: any[];
  total: number;
  payment_method: 'credit_card' | 'pix';
  payment_status: 'pending' | 'completed' | 'failed';
  card_data?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cpf: string;
  };
  pix_data?: {
    transactionId: string;
    qrcode: string;
    status: string;
  };
  created_at: string;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Primeiro tenta carregar do banco de dados
      const response = await fetch('/api/orders');
      if (response.ok) {
        const dbOrders = await response.json();
        setOrders(dbOrders);
      } else {
        // Fallback para localStorage se a API falhar
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          const localOrders = JSON.parse(savedOrders);
          // Converte formato localStorage para formato do banco
          const convertedOrders = localOrders.map((order: any) => ({
            id: order.id,
            customer_name: order.customerName,
            customer_email: order.customerEmail,
            customer_cpf: order.customerCpf,
            customer_address: order.customerAddress,
            items: order.items,
            total: order.total,
            payment_method: order.paymentMethod,
            payment_status: order.paymentStatus,
            card_data: order.cardData,
            pix_data: order.pixData,
            created_at: order.createdAt
          }));
          setOrders(convertedOrders);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      // Fallback para localStorage
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const localOrders = JSON.parse(savedOrders);
        const convertedOrders = localOrders.map((order: any) => ({
          id: order.id,
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_cpf: order.customerCpf,
          customer_address: order.customerAddress,
          items: order.items,
          total: order.total,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus,
          card_data: order.cardData,
          pix_data: order.pixData,
          created_at: order.createdAt
        }));
        setOrders(convertedOrders);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'completed' | 'failed') => {
    try {
      // Tenta atualizar no banco de dados
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, paymentStatus: status })
      });

      if (response.ok) {
        // Atualiza o estado local
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, payment_status: status } : order
        );
        setOrders(updatedOrders);
      } else {
        // Fallback para localStorage
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, payment_status: status } : order
        );
        setOrders(updatedOrders);
        
        // Atualiza localStorage também
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          const localOrders = JSON.parse(savedOrders);
          const updatedLocalOrders = localOrders.map((order: any) => 
            order.id === orderId ? { ...order, paymentStatus: status } : order
          );
          localStorage.setItem('orders', JSON.stringify(updatedLocalOrders));
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      alert('Erro ao atualizar status do pedido');
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})\d{8}(\d{4})/, '$1 **** **** $2');
  };

  if (loading) {
    return (
      <div className={styles.ordersList}>
        <h2>Lista de Pedidos</h2>
        <div className="text-center py-8">
          <p>Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersList}>
      <h2>Lista de Pedidos</h2>
      
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <h3>Pedido #{order.id.slice(-8)}</h3>
                <span className={`${styles.status} ${styles[order.payment_status]}`}>
                  {order.payment_status === 'pending' && 'Pendente'}
                  {order.payment_status === 'completed' && 'Concluído'}
                  {order.payment_status === 'failed' && 'Falhou'}
                </span>
              </div>
              
              <div className={styles.orderInfo}>
                <p><strong>Cliente:</strong> {order.customer_name}</p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                <p><strong>CPF:</strong> {order.customer_cpf}</p>
                {order.customer_address && (
                  <p><strong>Endereço:</strong> {order.customer_address.street}, {order.customer_address.number} - {order.customer_address.neighborhood}</p>
                )}
                <p><strong>Total:</strong> {order.total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}</p>
                <p><strong>Pagamento:</strong> {order.payment_method === 'credit_card' ? 'Cartão de Crédito' : 'PIX'}</p>
                <p><strong>Data:</strong> {new Date(order.created_at).toLocaleString('pt-BR')}</p>
              </div>

              {order.payment_method === 'credit_card' && order.card_data && (
                <div className={styles.cardInfo}>
                  <h4>Dados do Cartão:</h4>
                  <p><strong>Número:</strong> {maskCardNumber(order.card_data.cardNumber)}</p>
                  <p><strong>Validade:</strong> {order.card_data.expiryDate}</p>
                  <p><strong>CVV:</strong> ***</p>
                  <p><strong>CPF:</strong> {order.card_data.cpf}</p>
                </div>
              )}

              {order.payment_method === 'pix' && order.pix_data && (
                <div className={styles.pixInfo}>
                  <h4>Dados do PIX:</h4>
                  <p><strong>Transaction ID:</strong> {order.pix_data.transactionId}</p>
                  <p><strong>Status:</strong> {order.pix_data.status}</p>
                </div>
              )}

              <div className={styles.orderActions}>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className={styles.viewBtn}
                >
                  Ver Detalhes
                </button>
                {order.payment_status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className={styles.approveBtn}
                    >
                      Aprovar
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'failed')}
                      className={styles.rejectBtn}
                    >
                      Rejeitar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Detalhes do Pedido #{selectedOrder.id.slice(-8)}</h3>
              <button onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.customerDetails}>
                <h4>Dados do Cliente</h4>
                <p><strong>Nome:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>CPF:</strong> {selectedOrder.customer_cpf}</p>
                {selectedOrder.customer_address && (
                  <div>
                    <p><strong>Endereço Completo:</strong></p>
                    <p>{selectedOrder.customer_address.street}, {selectedOrder.customer_address.number}</p>
                    <p>{selectedOrder.customer_address.neighborhood}</p>
                    <p>{selectedOrder.customer_address.city} - {selectedOrder.customer_address.state}</p>
                    <p>CEP: {selectedOrder.customer_address.cep}</p>
                  </div>
                )}
              </div>

              <div className={styles.itemsList}>
                <h4>Itens do Pedido</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <p><strong>{item.name}</strong></p>
                    <p>Quantidade: {item.quantity}</p>
                    <p>Preço: {item.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</p>
                  </div>
                ))}
              </div>

              {selectedOrder.payment_method === 'credit_card' && selectedOrder.card_data && (
                <div className={styles.paymentDetails}>
                  <h4>Dados do Cartão</h4>
                  <p><strong>Número:</strong> {formatCardNumber(selectedOrder.card_data.cardNumber)}</p>
                  <p><strong>Validade:</strong> {selectedOrder.card_data.expiryDate}</p>
                  <p><strong>CVV:</strong> {selectedOrder.card_data.cvv}</p>
                  <p><strong>CPF:</strong> {selectedOrder.card_data.cpf}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}