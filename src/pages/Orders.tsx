import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { arrowBackOutline, refreshOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserOrders } from '../hooks/useOrders';
import { OrderCard } from '../components/OrderCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Order } from '../types';
import './Orders.css';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const { orders, isLoading, mutate } = useUserOrders(user?._id || null);

  const handleRefresh = async (event: CustomEvent) => {
    await mutate();
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Meus Pedidos</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => mutate()}>
              <IonIcon icon={refreshOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="orders-container">
          <div className="orders-header">
            <h2>Acompanhe seus pedidos</h2>
            <p>Os pedidos são atualizados automaticamente</p>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Carregando pedidos..." />
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <p>Você ainda não fez nenhum pedido</p>
              <IonButton onClick={() => history.push('/products')}>
                Ver Cardápio
              </IonButton>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order: Order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Orders;
