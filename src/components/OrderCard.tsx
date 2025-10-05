import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonButton,
} from '@ionic/react'
import { StatusBadge } from './StatusBadge'
import { Order } from '../types'
import './OrderCard.css'

interface OrderCardProps {
  order: Order
  onStatusChange?: (orderId: string, status: 'accepted' | 'declined' | 'completed') => void
  isAdmin?: boolean
}

export const OrderCard= ({ order, onStatusChange, isAdmin }: OrderCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <IonCard className="order-card">
      <IonCardHeader>
        <div className="order-header">
          <div>
            <IonCardTitle className="order-title">
              Pedido #{order._id.slice(-6).toUpperCase()}
            </IonCardTitle>
            <IonCardSubtitle>{formatDate(order.createdAt)}</IonCardSubtitle>
          </div>
          <StatusBadge status={order.status} />
        </div>
        {isAdmin && (
          <div className="order-customer-info">
            <IonNote>Cliente: {order.userName}</IonNote>
            <IonNote>Tel: {order.userCellphone}</IonNote>
          </div>
        )}
      </IonCardHeader>

      <IonCardContent>
        <IonList className="order-items-list">
          {order.items.map((item, index) => (
            <IonItem key={index} lines="none" className="order-item">
              <IonLabel>
                <p className="item-name">{item.name}</p>
                <IonNote>Qtd: {item.quantity}</IonNote>
              </IonLabel>
              <IonNote slot="end" className="item-price">
                R$ {(item.price * item.quantity).toFixed(2)}
              </IonNote>
            </IonItem>
          ))}
        </IonList>

        {order.notes && (
          <div className="order-notes">
            <strong>Observações:</strong>
            <p>{order.notes}</p>
          </div>
        )}

        <div className="order-total">
          <strong>Total:</strong>
          <span className="total-amount">R$ {order.totalAmount.toFixed(2)}</span>
        </div>

        {isAdmin && order.status === 'pending' && onStatusChange && (
          <div className="admin-actions">
            <IonButton
              size="small"
              color="success"
              onClick={() => onStatusChange(order._id, 'accepted')}
            >
              Aceitar
            </IonButton>
            <IonButton
              size="small"
              color="danger"
              onClick={() => onStatusChange(order._id, 'declined')}
            >
              Recusar
            </IonButton>
          </div>
        )}

        {isAdmin && order.status === 'accepted' && onStatusChange && (
          <div className="admin-actions">
            <IonButton
              size="small"
              color="primary"
              onClick={() => onStatusChange(order._id, 'completed')}
            >
              Marcar como Concluído
            </IonButton>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  )
}
