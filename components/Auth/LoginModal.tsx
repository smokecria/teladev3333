import { useState } from 'react';
import styles from '../../styles/Auth.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (customer: any, sessionId: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: Props) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 11) {
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 11) {
      return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        // Login
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('customerSession', data.sessionId);
          onLogin(data.customer, data.sessionId);
          onClose();
        } else {
          setError(data.error || 'Erro ao fazer login');
        }
      } else {
        // Registro
        if (formData.password !== formData.confirmPassword) {
          setError('Senhas não coincidem');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register',
            name: formData.name,
            email: formData.email,
            password: formData.password,
            cpf: formData.cpf.replace(/\D/g, ''),
            phone: formData.phone.replace(/\D/g, '')
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('customerSession', data.sessionId);
          onLogin(data.customer, data.sessionId);
          onClose();
        } else {
          setError(data.error || 'Erro ao criar conta');
        }
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isLoginMode ? 'Entrar' : 'Criar Conta'}</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.authTabs}>
            <button 
              className={isLoginMode ? styles.active : ''}
              onClick={() => setIsLoginMode(true)}
            >
              Entrar
            </button>
            <button 
              className={!isLoginMode ? styles.active : ''}
              onClick={() => setIsLoginMode(false)}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            {!isLoginMode && (
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {!isLoginMode && (
              <>
                <div className={styles.formGroup}>
                  <label>Confirmar Senha</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>CPF (opcional)</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Telefone (opcional)</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Aguarde...' : (isLoginMode ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}