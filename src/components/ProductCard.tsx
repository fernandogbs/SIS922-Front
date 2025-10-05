import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonIcon,
  IonBadge,
} from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isAdmin,
  onEdit,
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    }
  };

  return (
    <IonCard className="product-card" onClick={isAdmin ? handleEdit : undefined}>
      {product.imageUrl && (
        <div className="product-image-container">
          <img src={product.imageUrl} alt={product.name} />
        </div>
      )}
      <IonCardHeader>
        <div className="product-header">
          <IonCardTitle className="product-title">{product.name}</IonCardTitle>
          <IonBadge color={product.available ? 'success' : 'danger'} className="product-availability">
            {product.available ? 'Disponível' : 'Indisponível'}
          </IonBadge>
        </div>
        <IonCardSubtitle className="product-category">{product.category}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="product-price">
            R$ {product.price.toFixed(2)}
          </div>
          {!isAdmin && product.available && onAddToCart && (
            <IonButton size="small" onClick={handleAddToCart}>
              <IonIcon slot="start" icon={addCircleOutline} />
              Adicionar
            </IonButton>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};
