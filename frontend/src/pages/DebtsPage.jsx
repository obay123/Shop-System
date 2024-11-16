import React, { useEffect, useState } from 'react';
import { getDebts, addDebt, deleteDebt } from '../api/debtsApi';  // Import API functions
import Table from '../components/Table';  // Import Table component
import Button from '../components/Button';  // Import Button component
import Modal from '../components/Modal';  // Import Modal component
import Input from '../components/Input';  // Import Input component
import Notification from '../components/Notification';  // Import Notification component

const DebtsPage = () => {
  const [debts, setDebts] = useState([]);
  const [newDebt, setNewDebt] = useState({ name: '', amount: '' });
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch debts on component mount
  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const data = await getDebts();
        setDebts(data);
      } catch (error) {
        setNotification({ message: 'Failed to load debts', type: 'error' });
      }
    };

    fetchDebts();
  }, []);

  // Handle form submission to add a new debt
  const handleAddDebt = async () => {
    try {
      const response = await addDebt(newDebt);
      setDebts([...debts, response]);
      setShowModal(false);
      setNotification({ message: 'Debt added successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to add debt', type: 'error' });
    }
  };

  // Handle deleting a debt
  const handleDeleteDebt = async (id) => {
    try {
      await deleteDebt(id);
      setDebts(debts.filter(debt => debt._id !== id));
      setNotification({ message: 'Debt deleted successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to delete debt', type: 'error' });
    }
  };

  return (
    <div>
      <h1>Debts</h1>

      {notification && <Notification message={notification.message} type={notification.type} />}

      <Button onClick={() => setShowModal(true)} variant="primary">Add Debt</Button>

      <Table
        columns={['Name', 'Amount', 'Actions']}
        data={debts.map(debt => ({
          name: debt.name,
          amount: debt.amount,
          actions: (
            <>
              <Button variant="danger" onClick={() => handleDeleteDebt(debt._id)}>Delete</Button>
            </>
          ),
        }))}
      />

      {/* Modal for adding debt */}
      <Modal show={showModal} handleClose={() => setShowModal(false)}>
        <h2>Add Debt</h2>
        <Input
          label="Name"
          value={newDebt.name}
          onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
        />
        <Input
          label="Amount"
          value={newDebt.amount}
          onChange={(e) => setNewDebt({ ...newDebt, amount: e.target.value })}
          type="number"
        />
        <Button onClick={handleAddDebt} variant="primary">Add Debt</Button>
      </Modal>
    </div>
  );
};

export default DebtsPage;
