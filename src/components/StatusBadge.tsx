import React from 'react'
import { IonBadge } from '@ionic/react'
import { Order } from '../types'

interface StatusBadgeProps {
  status: Order['status']
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'accepted':
        return 'primary'
      case 'completed':
        return 'success'
      case 'declined':
        return 'danger'
      default:
        return 'medium'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'accepted':
        return 'Aceito'
      case 'completed':
        return 'Concluído'
      case 'declined':
        return 'Recusado'
      default:
        return status
    }
  }

  return <IonBadge color={getStatusColor()}>{getStatusText()}</IonBadge>
}
