import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonButton,
  IonToast,
  IonLoading,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import './Login.css';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { login } = useAuth();
  const history = useHistory();

  const handleLogin = async () => {
    if (!name.trim() || !cellphone.trim()) {
      setError('Nome e telefone são obrigatórios');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        name: name.trim(),
        cellphone: cellphone.trim(),
      });

      if (response.success && response.user) {
        login(response.user);

        // Redirect based on user type
        if (response.user.type === 'admin') {
          history.push('/admin/dashboard');
        } else {
          history.push('/products');
        }
      } else {
        setError(response.message || 'Erro ao fazer login');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao conectar com o servidor');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <IonPage>
      <IonContent className="login-content">
        <div className="login-container">
          <div className="login-header">
            <h1>Restaurante</h1>
            <p>Bem-vindo! Faça login para continuar</p>
          </div>

          <IonCard className="login-card">
            <IonCardHeader>
              <IonCardTitle>Entrar</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="form-group">
                <IonInput
                  label="Nome"
                  labelPlacement="floating"
                  type="text"
                  value={name}
                  onIonInput={(e) => setName(e.detail.value!)}
                  onKeyPress={handleKeyPress}
                  className="custom-input"
                />
              </div>

              <div className="form-group">
                <IonInput
                  label="Telefone"
                  labelPlacement="floating"
                  type="tel"
                  value={cellphone}
                  onIonInput={(e) => setCellphone(e.detail.value!)}
                  onKeyPress={handleKeyPress}
                  className="custom-input"
                />
              </div>

              <IonButton
                expand="block"
                onClick={handleLogin}
                disabled={loading}
                className="login-button"
              >
                Entrar
              </IonButton>

              <p className="info-text">
                Novo por aqui? Sua conta será criada automaticamente!
              </p>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={loading} message="Entrando..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={error}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
