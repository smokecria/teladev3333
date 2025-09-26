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
  pixConfig: {
    clientId: string;
    clientSecret: string;
    isActive: boolean;
  };
}

export default function StoreConfig() {
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
    },
    pixConfig: {
      clientId: '',
      clientSecret: '',
      isActive: false
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('store');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const savedConfig = localStorage.getItem('storeConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    
    // Load PIX config separately for backward compatibility
    const pixConfig = localStorage.getItem('pixConfig');
    if (pixConfig) {
      const parsedPixConfig = JSON.parse(pixConfig);
      setConfig(prev => ({
        ...prev,
        pixConfig: parsedPixConfig
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('storeConfig', JSON.stringify(config));
    
    // Save PIX config separately for backward compatibility
    localStorage.setItem('pixConfig', JSON.stringify(config.pixConfig));
    
    setIsEditing(false);
    alert('Configurações salvas com sucesso!');
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof StoreConfig],
        [field]: value
      }
    }));
  };

  const handlePixTest = async () => {
    if (!config.pixConfig.clientId || !config.pixConfig.clientSecret) {
      alert('Configure o Client ID e Client Secret primeiro!');
      return;
    }

    try {
      const credentials = `${config.pixConfig.clientId}:${config.pixConfig.clientSecret}`;
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
                    value={config.storeName}
                    onChange={(e) => setConfig({...config, storeName: e.target.value})}
                    required
                  />
                </div>

                <h4>Endereço</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Rua:</label>
                    <input
                      type="text"
                      value={config.storeAddress.street}
                      onChange={(e) => handleInputChange('storeAddress', 'street', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Número:</label>
                    <input
                      type="text"
                      value={config.storeAddress.number}
                      onChange={(e) => handleInputChange('storeAddress', 'number', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Bairro:</label>
                    <input
                      type="text"
                      value={config.storeAddress.neighborhood}
                      onChange={(e) => handleInputChange('storeAddress', 'neighborhood', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cidade:</label>
                    <input
                      type="text"
                      value={config.storeAddress.city}
                      onChange={(e) => handleInputChange('storeAddress', 'city', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Estado:</label>
                    <input
                      type="text"
                      value={config.storeAddress.state}
                      onChange={(e) => handleInputChange('storeAddress', 'state', e.target.value)}
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>CEP:</label>
                    <input
                      type="text"
                      value={config.storeAddress.zipCode}
                      onChange={(e) => handleInputChange('storeAddress', 'zipCode', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <h4>Horário de Funcionamento</h4>
                <div className={styles.formGroup}>
                  <label>Segunda à Sexta:</label>
                  <input
                    type="text"
                    value={config.workingHours.weekdays}
                    onChange={(e) => handleInputChange('workingHours', 'weekdays', e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Sábado:</label>
                  <input
                    type="text"
                    value={config.workingHours.saturday}
                    onChange={(e) => handleInputChange('workingHours', 'saturday', e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Domingo:</label>
                  <input
                    type="text"
                    value={config.workingHours.sunday}
                    onChange={(e) => handleInputChange('workingHours', 'sunday', e.target.value)}
                    required
                  />
                </div>

                <h4>Contato</h4>
                <div className={styles.formGroup}>
                  <label>WhatsApp:</label>
                  <input
                    type="text"
                    value={config.contact.whatsapp}
                    onChange={(e) => handleInputChange('contact', 'whatsapp', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={config.contact.email}
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
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
                    value={config.pixConfig.clientId}
                    onChange={(e) => handleInputChange('pixConfig', 'clientId', e.target.value)}
                    placeholder="Digite o Client ID"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Client Secret:</label>
                  <input
                    type="password"
                    value={config.pixConfig.clientSecret}
                    onChange={(e) => handleInputChange('pixConfig', 'clientSecret', e.target.value)}
                    placeholder="Digite o Client Secret"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={config.pixConfig.isActive}
                      onChange={(e) => handleInputChange('pixConfig', 'isActive', e.target.checked.toString())}
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
                  <p><strong>Nome da Loja:</strong> {config.storeName}</p>
                  <p><strong>WhatsApp:</strong> {config.contact.whatsapp || 'Não configurado'}</p>
                  <p><strong>Email:</strong> {config.contact.email || 'Não configurado'}</p>
                </div>

                <div className={styles.configSection}>
                  <h4>Endereço</h4>
                  <p>{config.storeAddress.street}, {config.storeAddress.number}</p>
                  <p>{config.storeAddress.neighborhood}</p>
                  <p>{config.storeAddress.city} - {config.storeAddress.state}</p>
                  <p>CEP: {config.storeAddress.zipCode}</p>
                </div>

                <div className={styles.configSection}>
                  <h4>Horário de Funcionamento</h4>
                  <p><strong>Segunda à Sexta:</strong> {config.workingHours.weekdays}</p>
                  <p><strong>Sábado:</strong> {config.workingHours.saturday}</p>
                  <p><strong>Domingo:</strong> {config.workingHours.sunday}</p>
                </div>
              </>
            )}

            {activeSection === 'pix' && (
              <>
                <p><strong>Client ID:</strong> {config.pixConfig.clientId || 'Não configurado'}</p>
                <p><strong>Client Secret:</strong> {config.pixConfig.clientSecret ? '••••••••••••' : 'Não configurado'}</p>
                <p><strong>Status:</strong> 
                  <span className={config.pixConfig.isActive ? styles.active : styles.inactive}>
                    {config.pixConfig.isActive ? 'Ativo' : 'Inativo'}
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