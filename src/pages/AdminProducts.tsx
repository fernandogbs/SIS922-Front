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
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonLoading,
} from '@ionic/react';
import { arrowBackOutline, addOutline, closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { productService } from '../services/productService';
import { Product } from '../types';
import './AdminProducts.css';

const AdminProducts: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Prato Principal',
    imageUrl: '',
    available: true,
  });

  const { user } = useAuth();
  const history = useHistory();
  const { products, isLoading, mutate } = useProducts();

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Prato Principal',
      imageUrl: '',
      available: true,
    });
    setEditingProduct(null);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        imageUrl: product.imageUrl || '',
        available: product.available,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(resetForm, 300);
  };

  const handleSave = async () => {
    if (!user || !formData.name || !formData.description || !formData.price) {
      setToastMessage('Preencha todos os campos obrigatórios');
      setShowToast(true);
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setToastMessage('Preço inválido');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      if (editingProduct) {
        // Update existing product
        await productService.updateProduct(user._id, editingProduct._id, {
          name: formData.name,
          description: formData.description,
          price,
          category: formData.category,
          imageUrl: formData.imageUrl || undefined,
          available: formData.available,
        });
        setToastMessage('Produto atualizado com sucesso!');
      } else {
        // Create new product
        await productService.createProduct(user._id, {
          name: formData.name,
          description: formData.description,
          price,
          category: formData.category,
          imageUrl: formData.imageUrl || '',
          available: formData.available,
        });
        setToastMessage('Produto criado com sucesso!');
      }

      mutate();
      handleCloseModal();
      setShowToast(true);
    } catch (error) {
      console.error('Error saving product:', error);
      setToastMessage('Erro ao salvar produto');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!user) return;

    const confirmed = window.confirm(`Deseja realmente excluir "${product.name}"?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await productService.deleteProduct(user._id, product._id);
      mutate();
      setToastMessage('Produto excluído com sucesso!');
      setShowToast(true);
    } catch (error) {
      console.error('Error deleting product:', error);
      setToastMessage('Erro ao excluir produto');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
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
          <IonTitle>Gerenciar Produtos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="admin-products-container">
          {isLoading ? (
            <LoadingSpinner message="Carregando produtos..." />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum produto cadastrado</p>
              <IonButton onClick={() => handleOpenModal()}>
                Adicionar Primeiro Produto
              </IonButton>
            </div>
          ) : (
            <IonGrid>
              <IonRow>
                {products.map((product: Product) => (
                  <IonCol key={product._id} size="12" sizeMd="6" sizeLg="4">
                    <div className="product-wrapper">
                      <ProductCard
                        product={product}
                        isAdmin
                        onEdit={handleOpenModal}
                      />
                      <IonButton
                        expand="block"
                        color="danger"
                        size="small"
                        onClick={() => handleDelete(product)}
                        className="delete-button"
                      >
                        Excluir
                      </IonButton>
                    </div>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => handleOpenModal()}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={handleCloseModal}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonInput
                label="Nome *"
                labelPlacement="floating"
                value={formData.name}
                onIonInput={(e) => setFormData({ ...formData, name: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label="Descrição *"
                labelPlacement="floating"
                value={formData.description}
                onIonInput={(e) => setFormData({ ...formData, description: e.detail.value! })}
                rows={3}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Preço *"
                labelPlacement="floating"
                type="number"
                value={formData.price}
                onIonInput={(e) => setFormData({ ...formData, price: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonSelect
                label="Categoria *"
                labelPlacement="floating"
                value={formData.category}
                onIonChange={(e) => setFormData({ ...formData, category: e.detail.value })}
              >
                <IonSelectOption value="Entrada">Entrada</IonSelectOption>
                <IonSelectOption value="Prato Principal">Prato Principal</IonSelectOption>
                <IonSelectOption value="Sobremesa">Sobremesa</IonSelectOption>
                <IonSelectOption value="Bebida">Bebida</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonInput
                label="URL da Imagem"
                labelPlacement="floating"
                value={formData.imageUrl}
                onIonInput={(e) => setFormData({ ...formData, imageUrl: e.detail.value! })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </IonItem>

            <IonItem>
              <IonLabel>Disponível</IonLabel>
              <IonToggle
                checked={formData.available}
                onIonChange={(e) => setFormData({ ...formData, available: e.detail.checked })}
              />
            </IonItem>

            <IonButton
              expand="block"
              onClick={handleSave}
              disabled={loading}
              className="save-button"
            >
              {editingProduct ? 'Atualizar' : 'Criar'} Produto
            </IonButton>
          </IonContent>
        </IonModal>

        <IonLoading isOpen={loading} message="Salvando..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminProducts;
