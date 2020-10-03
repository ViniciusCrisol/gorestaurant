import React, { useState, useEffect, useCallback } from 'react';

import api from '../../services/api';

import Food from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, []);

  const handleAddFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>) => {
      try {
        const response = await api.post('/foods', food);

        setFoods(prevFoods => [...prevFoods, response.data]);
      } catch (err) {
        console.log(err);
      }
    },
    [],
  );

  const handleUpdateFood = useCallback((updatedFood: IFoodPlate) => {
    api.put(`/foods/${updatedFood.id}`, updatedFood);

    setFoods(prevFoods =>
      prevFoods.map(food => {
        if (food.id === updatedFood.id) {
          return updatedFood;
        }

        return food;
      }),
    );
  }, []);

  const handleDeleteFood = useCallback((id: number) => {
    api.delete(`/foods/${id}`);

    setFoods(prevFoods => prevFoods.filter(food => food.id !== id));
  }, []);

  const toggleModal = useCallback(() => {
    setModalOpen(prevState => !prevState);
  }, []);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [editModalOpen]);

  const handleEditFood = useCallback(
    (food: IFoodPlate) => {
      toggleEditModal();
      setEditingFood(food);
    },
    [toggleEditModal],
  );

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleUpdateFood={handleUpdateFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
