import React, { useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonToast,
} from '@ionic/react'
import {
  logOutOutline,
  refreshOutline,
  statsChartOutline,
  cartOutline,
  checkmarkCircleOutline,
  timeOutline,
} from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDashboard, useAdminOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { orderService } from '../services/orderService'
import { Order } from '../types'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const { user, logout } = useAuth()
  const history = useHistory()

  const { stats, isLoading: statsLoading, mutate: mutateStats } = useDashboard(user?._id || null)
  const { orders, isLoading: ordersLoading, mutate: mutateOrders } = useAdminOrders(
    user?._id || null,
    selectedStatus !== 'all' ? selectedStatus : undefined
  )

  const handleStatusChange = async (orderId: string, newStatus: 'accepted' | 'declined' | 'completed') => {
    if (!user) return

    try {
      await orderService.updateOrderStatus(user._id, orderId, newStatus)
      mutateOrders()
      mutateStats()
      setToastMessage('Status do pedido atualizado!')
      setShowToast(true)
    } catch (error) {
      console.error('Error updating order status:', error)
      setToastMessage('Erro ao atualizar status')
      setShowToast(true)
    }
  }

  const handleRefresh = async (event: CustomEvent) => {
    await Promise.all([mutateStats(), mutateOrders()])
    event.detail.complete()
  }

  const handleLogout = () => {
    logout()
    history.push('/login')
  }

  if (statsLoading) {
    return (
      <IonPage>
        <IonContent>
          <LoadingSpinner message="Carregando dashboard..." />
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard Admin</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/admin/products')}>
              Produtos
            </IonButton>
            <IonButton onClick={() => mutateStats()}>
              <IonIcon icon={refreshOutline} />
            </IonButton>
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Olá, {user?.name}!</h1>
            <p>Gerencie seu restaurante</p>
          </div>

          {stats && (
            <div className="stats-grid">
              <IonCard className="stat-card">
                <IonCardContent>
                  <div className="stat-icon">
                    <IonIcon icon={cartOutline} />
                  </div>
                  <div className="stat-value">{stats.totalOrders}</div>
                  <div className="stat-label">Total de Pedidos</div>
                </IonCardContent>
              </IonCard>

              <IonCard className="stat-card stat-card-warning">
                <IonCardContent>
                  <div className="stat-icon">
                    <IonIcon icon={timeOutline} />
                  </div>
                  <div className="stat-value">{stats.pendingOrders}</div>
                  <div className="stat-label">Pedidos Pendentes</div>
                </IonCardContent>
              </IonCard>

              <IonCard className="stat-card stat-card-success">
                <IonCardContent>
                  <div className="stat-icon">
                    <IonIcon icon={checkmarkCircleOutline} />
                  </div>
                  <div className="stat-value">{stats.completedOrders}</div>
                  <div className="stat-label">Pedidos Concluídos</div>
                </IonCardContent>
              </IonCard>

              <IonCard className="stat-card stat-card-primary">
                <IonCardContent>
                  <div className="stat-icon">
                    <IonIcon icon={statsChartOutline} />
                  </div>
                  <div className="stat-value">R$ {stats.totalRevenue.toFixed(2)}</div>
                  <div className="stat-label">Receita Total</div>
                </IonCardContent>
              </IonCard>
            </div>
          )}

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Gerenciar Pedidos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonSegment
                value={selectedStatus}
                onIonChange={(e) => setSelectedStatus(e.detail.value as string)}
              >
                <IonSegmentButton value="all">
                  <IonLabel>Todos</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="pending">
                  <IonLabel>Pendentes</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="accepted">
                  <IonLabel>Aceitos</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="completed">
                  <IonLabel>Concluídos</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCardContent>
          </IonCard>

          {ordersLoading ? (
            <LoadingSpinner message="Carregando pedidos..." />
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order: Order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isAdmin
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  )
}

export default AdminDashboard
