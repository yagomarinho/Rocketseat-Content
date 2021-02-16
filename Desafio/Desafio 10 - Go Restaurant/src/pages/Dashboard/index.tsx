import React, { useState, useEffect, useCallback } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
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
      api.get('foods').then(response => setFoods(response.data));
    }

    loadFoods();
  }, []);

  const handleAddFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>) => {
      try {
        const response = await api.post('foods', food);

        setFoods(oldState => [...oldState, response.data]);
      } catch (err) {
        console.log(err);
      }
    },
    [],
  );

  const handleUpdateFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>) => {
      let updateFood = { ...editingFood, ...food };

      const response = await api.put(`foods/${editingFood.id}`, updateFood);

      updateFood = response.data;

      const updateFoodList = foods.map(item =>
        item.id !== updateFood.id ? item : updateFood,
      );

      setFoods(updateFoodList);
    },
    [editingFood, foods],
  );

  const handleDeleteFood = useCallback(
    async (id: number) => {
      await api.delete(`foods/${id}`);

      const updatedFoodList = foods.filter(food => food.id !== id);

      setFoods(updatedFoodList);
    },
    [foods],
  );

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [editModalOpen]);

  const handleEditFood = useCallback(
    (food: IFoodPlate) => {
      setEditingFood(food);
      setEditModalOpen(!modalOpen);
    },
    [modalOpen],
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
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
