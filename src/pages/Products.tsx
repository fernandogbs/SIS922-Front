import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonToast,
} from '@ionic/react';
import { cartOutline, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Product, CartItem } from '../types';
import { cartService } from '../services/cartService';
import { testAPI } from '../utils/testAPI';
import './Products.css';

const Products: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { user, logout } = useAuth();
  const history = useHistory();

  // Run API test on mount
  useEffect(() => {
    console.log('🧪 Running API test...');
    testAPI().then((result) => {
      console.log('🧪 API Test Result:', result);
    });
  }, []);

  // Remover o filtro available temporariamente para debug
  const filters = {
    search: searchText,
    category: category !== 'all' ? category : undefined,
    // available: true, // Comentado temporariamente para debug
  };

  const { products, isLoading, isError } = useProducts(filters);
  const { cart, mutate: mutateCart } = useCart(user?._id || null);

  // Debug logs
  console.log('📦 Products page - products:', products);
  console.log('📦 Products page - isLoading:', isLoading);
  console.log('📦 Products page - isError:', isError);
  console.log('📦 Products page - filters:', filters);

  const categories = ['all', 'Entrada', 'Prato Principal', 'Sobremesa', 'Bebida'];

  const handleAddToCart = async (product: Product) => {
    if (!user) return;

    try {
      await cartService.addToCart({
        userId: user._id,
        productId: product._id,
        quantity: 1,
      });

      mutateCart();
      setToastMessage(`${product.name} adicionado ao carrinho!`);
      setShowToast(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToastMessage('Erro ao adicionar ao carrinho');
      setShowToast(true);
    }
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const cartItemsCount = cart?.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cardápio</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/cart')}>
              <IonIcon icon={cartOutline} />
              {cartItemsCount > 0 && (
                <IonBadge color="danger" className="cart-badge">
                  {cartItemsCount}
                </IonBadge>
              )}
            </IonButton>
            <IonButton onClick={() => history.push('/orders')}>
              Pedidos
            </IonButton>
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="products-container">
          <div className="products-header">
            <h1>Bem-vindo, {user?.name}!</h1>
            <p>Escolha seus pratos favoritos</p>
          </div>

          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Buscar produtos..."
            className="products-searchbar"
          />

          <IonSegment
            value={category}
            onIonChange={(e) => setCategory(e.detail.value as string)}
            className="category-segment"
          >
            {categories.map((cat) => (
              <IonSegmentButton key={cat} value={cat}>
                <IonLabel>{cat === 'all' ? 'Todos' : cat}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>

          {isLoading ? (
            <LoadingSpinner message="Carregando produtos..." />
          ) : isError ? (
            <div className="empty-state">
              <p>❌ Erro ao carregar produtos</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--ion-color-danger)' }}>
                {isError?.message || 'Verifique se a API está rodando'}
              </p>
              <IonButton onClick={() => window.location.reload()}>
                Tentar Novamente
              </IonButton>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>⚠️ Nenhum produto encontrado</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--ion-color-medium)' }}>
                Filtros aplicados: {JSON.stringify(filters)}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--ion-color-medium)' }}>
                Verifique o console para mais detalhes (F12)
              </p>
            </div>
          ) : (
            <IonGrid>
              <IonRow>
                {products.map((product: Product) => (
                  <IonCol key={product._id} size="12" sizeMd="6" sizeLg="4">
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Products;
