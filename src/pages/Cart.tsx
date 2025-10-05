import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonTextarea,
  IonToast,
  IonLoading,
} from '@ionic/react';
import { arrowBackOutline, trashOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CartItem } from '../types';
import { useCart } from '../hooks/useCart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import './Cart.css';

const Cart: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const { user } = useAuth();
  const history = useHistory();
  const { cart, isLoading, mutate } = useCart(user?._id || null);

  const handleRemoveItem = async (productId: string) => {
    if (!user) return;

    try {
      await cartService.removeFromCart(user._id, productId);
      mutate();
      setToastMessage('Item removido do carrinho');
      setToastColor('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error removing item:', error);
      setToastMessage('Erro ao remover item');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const handleClearCart = async () => {
    if (!user) return;

    try {
      await cartService.clearCart(user._id);
      mutate();
      setToastMessage('Carrinho limpo');
      setToastColor('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setToastMessage('Erro ao limpar carrinho');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const handleCheckout = async () => {
    if (!user || !cart || cart.items.length === 0) return;

    setLoading(true);
    try {
      await orderService.createOrder({
        userId: user._id,
        notes: notes.trim() || undefined,
      });

      mutate();
      setToastMessage('Pedido realizado com sucesso!');
      setToastColor('success');
      setShowToast(true);

      setTimeout(() => {
        history.push('/orders');
      }, 1500);
    } catch (error) {
      console.error('Error creating order:', error);
      setToastMessage('Erro ao finalizar pedido');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonContent>
          <LoadingSpinner message="Carregando carrinho..." />
        </IonContent>
      </IonPage>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Carrinho</IonTitle>
          {!isEmpty && (
            <IonButtons slot="end">
              <IonButton onClick={handleClearCart} color="danger">
                Limpar
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="cart-container">
          {isEmpty ? (
            <div className="empty-cart">
              <p>Seu carrinho está vazio</p>
              <IonButton onClick={() => history.push('/products')}>
                Ver Cardápio
              </IonButton>
            </div>
          ) : (
            <>
              <IonList className="cart-items-list">
                {cart.items.map((item: CartItem, index: number) => (
                  <IonItem key={index} className="cart-item">
                    <IonLabel>
                      <h2>{item.name}</h2>
                      <p>R$ {item.price.toFixed(2)} x {item.quantity}</p>
                    </IonLabel>
                    <IonNote slot="end" className="item-total">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </IonNote>
                    <IonButton
                      slot="end"
                      fill="clear"
                      color="danger"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>

              <div className="cart-notes">
                <IonTextarea
                  label="Observações (opcional)"
                  labelPlacement="floating"
                  value={notes}
                  onIonInput={(e) => setNotes(e.detail.value!)}
                  placeholder="Ex: Sem cebola, bem passado, etc."
                  rows={3}
                />
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span className="summary-label">Total:</span>
                  <span className="summary-value">R$ {cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="cart-actions">
                <IonButton
                  expand="block"
                  size="large"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  Finalizar Pedido
                </IonButton>
              </div>
            </>
          )}
        </div>

        <IonLoading isOpen={loading} message="Finalizando pedido..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default Cart;
