import React, { useState, useEffect } from 'react';
import { useDebtsApi } from '../api/debtsApi';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modals';
import Input from '../components/Input';
import Table from '../components/Table';
import Notification from '../components/Notification';

const DebtsPage = () => {
    const { getDebts, addDebt, updateDebt, deleteDebt } = useDebtsApi();
    const [debts, setDebts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [currentDebt, setCurrentDebt] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        items: [{ itemName: '', price: '', quantity: '' }],
    });

    useEffect(() => {
        fetchDebts();
    }, []);

    const fetchDebts = async () => {
        try {
            const data = await getDebts();
            setDebts(data);
        } catch (error) {
            setNotification({ message: error, type: 'error' });
        }
    };

    const handleAddDebt = async () => {
        try {
            await addDebt(formData);
            setNotification({ message: 'Debt added successfully!', type: 'success' });
            fetchDebts();
            setShowModal(false);
        } catch (error) {
            setNotification({ message: error, type: 'error' });
        }
    };

    const handleEditDebt = async () => {
        try {
            await updateDebt(currentDebt._id, formData);
            setNotification({ message: 'Debt updated successfully!', type: 'success' });
            fetchDebts();
            setShowModal(false);
        } catch (error) {
            setNotification({ message: error, type: 'error' });
        }
    };

    const handleDeleteDebt = async (id) => {
        if (!window.confirm('Are you sure you want to delete this debt?')) return;
        try {
            await deleteDebt(id);
            setNotification({ message: 'Debt deleted successfully!', type: 'success' });
            fetchDebts();
        } catch (error) {
            setNotification({ message: error, type: 'error' });
        }
    };

    const handleSearch = () => {
        if (!searchQuery) {
            fetchDebts();
            return;
        }
        const filteredDebts = debts.filter(debt => debt.name.includes(searchQuery));
        setDebts(filteredDebts);
    };

    const openModal = (type, debt = null) => {
        setModalType(type);
        if (type === 'edit') {
            setFormData({ ...debt });
            setCurrentDebt(debt);
        } else {
            setFormData({ name: '', amount: '', items: [{ itemName: '', price: '', quantity: '' }] });
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { itemName: '', price: '', quantity: '' }],
        }));
    };

    const removeItem = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: updatedItems }));
    };

    return (
        <div className="debts-page">
            <h1>Debts Management</h1>
            {notification.message && (
                <Notification message={notification.message} type={notification.type} />
            )}
            <div className="actions">
                <Input
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch} variant="primary">Search</Button>
                <Button onClick={() => openModal('add')} variant="success">Add Debt</Button>
            </div>
            <Table
                columns={['Name', 'Amount', 'items', 'Date', 'Actions']}
                data={debts.map(debt => ({
                    Name: debt.name,
                    Amount: debt.amount,
                    Items: debt.items, // This will be handled by the Table component
                    Date: new Date(debt.date).toLocaleDateString(),
                    Actions: (
                        <>
                            <Button onClick={() => openModal('edit', debt)} variant="secondary">Edit</Button>
                            <Button onClick={() => handleDeleteDebt(debt._id)} variant="danger">Delete</Button>
                        </>
                    ),
                }))}
            />
            <Modal show={showModal} handleClose={closeModal}>
                <h2>{modalType === 'add' ? 'Add New Debt' : 'Edit Debt'}</h2>
                <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
                {formData.items.map((item, index) => (
                    <div key={index} className="item-inputs">
                        <Input
                            label="Item Name"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        />
                        <Input
                            label="Price"
                            type="number"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        />
                        <Input
                            label="Quantity"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        />
                        <Button variant="danger" onClick={() => removeItem(index)}>Remove</Button>
                    </div>
                ))}
                <Button onClick={addItem} variant="info">Add Item</Button>
                <Button
                    onClick={modalType === 'add' ? handleAddDebt : handleEditDebt}
                    variant="success"
                >
                    {modalType === 'add' ? 'Add Debt' : 'Update Debt'}
                </Button>
            </Modal>
        </div>
    );
};

export default DebtsPage;
