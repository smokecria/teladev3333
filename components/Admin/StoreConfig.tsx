import { useState, useEffect } from 'react';
import styles from '../../styles/Admin.module.scss';

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

interface PixConfig {
  clientId: string;
  clientSecret: string;
  isActive: boolean;
}

export default function StoreConfig() {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
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

  const [pixConfig, setPixConfig] = useState<PixConfig>({
    clientId: '',
    clientSecret: '',
    isActive: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('store');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      
      // Tenta carregar do banco de dados
      const response = await fetch('/api/store-config');
      if (response.ok) {
        const configs = await response.json();
        
        if (configs.store_info) {
          setStoreConfig(configs.store_info);
        }
        
        if (configs.pix_config) {
          setPixConfig(configs.pix_config);
        }
      } else {
        // Fallback para localStorage
        const savedStoreConfig = localStorage.getItem('storeConfig');
        if (savedStoreConfig) {
          setStoreConfig(JSON.parse(savedStoreConfig));
        }
        
        const savedPixConfig = localStorage.getItem('pixConfig');
        if (savedPixConfig) {
          setPixConfig(JSON.parse(savedPixConfig));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      
      // Fallback para localStorage
      const savedStoreConfig = localStorage.getItem('storeConfig');
      if (savedStoreConfig) {
        setStoreConfig(JSON.parse(savedStoreConfig));
      }
      
      const savedPixConfig = localStorage.getItem('pixConfig');
      if (savedPixConfig) {
        setPixConfig(JSON.parse(savedPixConfig));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Salva no banco de dados
      const storeResponse = await fetch('/api/store-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'store_info', value: storeConfig })
      });

      const pixResponse = await fetch('/api/store-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'pix_config', value: pixConfig })
      });

      if (storeResponse.ok && pixResponse.ok) {
        alert('Configurações salvas com sucesso!');
      } else {
        throw new Error('Erro ao salvar no banco de dados');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      
      // Fallback para localStorage
      localStorage.setItem('storeConfig', JSON.stringify(storeConfig));
      localStorage.setItem('pixConfig', JSON.stringify(pixConfig));
      alert('Configurações salvas localmente!');
    }
    
    setIsEditing(false);
  };

  const handleStoreInputChange = (section: string, field: string, value: string) => {
    setStoreConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof StoreConfig],
        [field]: value
      }
    }));
  };

  const handlePixInputChange = (field: string, value: string | boolean) => {
    setPixConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePixTest = async () => {
    if (!pixConfig.clientId || !pixConfig.clientSecret) {
      alert('Configure o Client ID e Client Secret primeiro!');
      return;
    }

    try {
      const credentials = `${pixConfig.clientId}:${pixConfig.clientSecret}`;
      const base64Credentials = btoa(credentials);
      
      const response = await fetch('https://api.pixupbr.com/v2/oauth/token', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Basic ${base64Credentials}`
        }
      });

      if (response.ok) {
        alert('Conexão com PIX API testada com sucesso!');
      } else {
        alert('Erro ao conectar com PIX API. Verifique as credenciais.');
      }
    } catch (error) {
      alert('Erro ao testar conexão: ' + error);
    }
  };

  if (loading) {
    return (
      <div className={styles.storeConfig}>
        <h2>Configurações da Loja</h2>
        <div className="text-center py-8">
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.storeConfig}>
      <h2>Configurações da Loja</h2>
      
      <div className={styles.configTabs}>
        <button 
          className={activeSection === 'store' ? styles.active : ''}
          onClick={() => setActiveSection('store')}
        >
          Informações da Loja
        </button>
        <button 
          className={activeSection === 'pix' ? styles.active : ''}
          onClick={() => setActiveSection('pix')}
        >
          Configuração PIX
        </button>
      </div>

      <div className={styles.configCard}>
        <div className={styles.configHeader}>
          <h3>
            {activeSection === 'store' ? 'Informações da Loja' : 'Configuração PIX'}
          </h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={styles.editBtn}
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className={styles.configForm}>
            {activeSection === 'store' && (
              <>
                <div className={styles.formGroup}>
                  <label>Nome da Loja:</label>
                  <input
                    type="text"
                    value={storeConfig.storeName}
                    onChange={(e) => setStoreConfig({...storeConfig, storeName: e.target.value})}
                    required
                  />
                </div>

                <h4>Endereço</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Rua:</label>
                    <input
                      type="text"
                      value={storeConfig.storeAddress.street}
                      onChange={(e) => handleStoreInputChange('storeAddress', 'street', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Número:</label>
                    <input
                      type="text"
                      value={storeConfig.storeAddress.number}
                      onChange={(e) => handleStoreInputChange('storeAddress', 'number', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Bairro:</label>
                    <input
                      type="text"
                      value={storeConfig.storeAddress.neighborhood}
                      onChange={(e) => handleStoreInputChange('storeAddress', 'neighborhood', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cidade:</label>
                    <input
                      type="text"
                      value={storeConfig.storeAddress.city}
                      onChange={(e) => handleStoreInputChange('storeAddress', 'city', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Estado:</label>
                    <input
                      type="text"
                      value={storeConfig.storeAddress.state}
                      onChange={(e) => handleStoreInputChange('storeAddress', 'state', e.target.value)}
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>CEP:</label>
                    <input
                      type="text"
                      value={storeConfig.storeAddress.zipCode}
                      onChange={(e) => handleStoreInputChange('storeAddress', 'zipCode', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <h4>Horário de Funcionamento</h4>
                <div className={styles.formGroup}>
                  <label>Segunda à Sexta:</label>
                  <input
                    type="text"
                    value={storeConfig.workingHours.weekdays}
                    onChange={(e) => handleStoreInputChange('workingHours', 'weekdays', e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Sábado:</label>
                  <input
                    type="text"
                    value={storeConfig.workingHours.saturday}
                    onChange={(e) => handleStoreInputChange('workingHours', 'saturday', e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Domingo:</label>
                  <input
                    type="text"
                    value={storeConfig.workingHours.sunday}
                    onChange={(e) => handleStoreInputChange('workingHours', 'sunday', e.target.value)}
                    required
                  />
                </div>

                <h4>Contato</h4>
                <div className={styles.formGroup}>
                  <label>WhatsApp:</label>
                  <input
                    type="text"
                    value={storeConfig.contact.whatsapp}
                    onChange={(e) => handleStoreInputChange('contact', 'whatsapp', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={storeConfig.contact.email}
                    onChange={(e) => handleStoreInputChange('contact', 'email', e.target.value)}
                    placeholder="contato@loja.com"
                  />
                </div>
              </>
            )}

            {activeSection === 'pix' && (
              <>
                <div className={styles.formGroup}>
                  <label>Client ID:</label>
                  <input
                    type="text"
                    value={pixConfig.clientId}
                    onChange={(e) => handlePixInputChange('clientId', e.target.value)}
                    placeholder="Digite o Client ID"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Client Secret:</label>
                  <input
                    type="password"
                    value={pixConfig.clientSecret}
                    onChange={(e) => handlePixInputChange('clientSecret', e.target.value)}
                    placeholder="Digite o Client Secret"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={pixConfig.isActive}
                      onChange={(e) => handlePixInputChange('isActive', e.target.checked)}
                    />
                    Ativar PIX como método de pagamento
                  </label>
                </div>
              </>
            )}

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn}>
                Salvar Configurações
              </button>
              {activeSection === 'pix' && (
                <button type="button" onClick={handlePixTest} className={styles.testBtn}>
                  Testar Conexão PIX
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className={styles.configDisplay}>
            {activeSection === 'store' && (
              <>
                <div className={styles.configSection}>
                  <h4>Informações Básicas</h4>
                  <p><strong>Nome da Loja:</strong> {storeConfig.storeName}</p>
                  <p><strong>WhatsApp:</strong> {storeConfig.contact.whatsapp || 'Não configurado'}</p>
                  <p><strong>Email:</strong> {storeConfig.contact.email || 'Não configurado'}</p>
                </div>

                <div className={styles.configSection}>
                  <h4>Endereço</h4>
                  <p>{storeConfig.storeAddress.street}, {storeConfig.storeAddress.number}</p>
                  <p>{storeConfig.storeAddress.neighborhood}</p>
                  <p>{storeConfig.storeAddress.city} - {storeConfig.storeAddress.state}</p>
                  <p>CEP: {storeConfig.storeAddress.zipCode}</p>
                </div>

                <div className={styles.configSection}>
                  <h4>Horário de Funcionamento</h4>
                  <p><strong>Segunda à Sexta:</strong> {storeConfig.workingHours.weekdays}</p>
                  <p><strong>Sábado:</strong> {storeConfig.workingHours.saturday}</p>
                  <p><strong>Domingo:</strong> {storeConfig.workingHours.sunday}</p>
                </div>
              </>
            )}

            {activeSection === 'pix' && (
              <>
                <p><strong>Client ID:</strong> {pixConfig.clientId || 'Não configurado'}</p>
                <p><strong>Client Secret:</strong> {pixConfig.clientSecret ? '••••••••••••' : 'Não configurado'}</p>
                <p><strong>Status:</strong> 
                  <span className={pixConfig.isActive ? styles.active : styles.inactive}>
                    {pixConfig.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {activeSection === 'pix' && (
        <div className={styles.instructions}>
          <h3>Instruções de Configuração PIX</h3>
          <ol>
            <li>Obtenha suas credenciais PIX (Client ID e Client Secret) do provedor</li>
            <li>Configure as credenciais acima</li>
            <li>Teste a conexão para verificar se está funcionando</li>
            <li>Ative o PIX como método de pagamento</li>
          </ol>
          
          <div className={styles.apiInfo}>
            <h4>Informações da API</h4>
            <p><strong>Endpoint:</strong> https://api.pixupbr.com/v2/oauth/token</p>
            <p><strong>Método:</strong> POST</p>
            <p><strong>Autenticação:</strong> Basic Auth (Base64)</p>
          </div>
        </div>
      )}
    </div>
  );
}