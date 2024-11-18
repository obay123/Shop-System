import React, { useState, useEffect } from 'react';
import { useItemsApi } from '../api/itemsApi';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Modal from '../components/Modals';
import Notification from '../components/Notification';
import Table from '../components/Table';

const ItemsPage = () => {
    const { getItems, addItem, updateItem, deleteItem } = useItemsApi();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '' });

    const [editingItem, setEditingItem] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch items on load
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getItems();
                setItems(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleAddItem = async () => {
        try {
            const addedItem = await addItem(newItem);
            setItems([...items, addedItem]);
            setNewItem({ name: '', price: '', quantity: '' });
            setShowModal(false);
            setSuccessMessage('Item added successfully!');
        } catch (err) {
            setError(err);
        }
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setNewItem({ name: item.name, price: item.price, quantity: item.quantity });
        setShowModal(true);
    };

    const handleUpdateItem = async () => {
        try {
            const updatedItem = await updateItem(editingItem._id, newItem);
            setItems(items.map((item) => (item._id === editingItem._id ? updatedItem : item)));
            setEditingItem(null);
            setNewItem({ name: '', price: '', quantity: '' });
            setShowModal(false);
            setSuccessMessage('Item updated successfully!');
        } catch (err) {
            setError(err);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await deleteItem(id);
            setItems(items.filter((item) => item._id !== id));
            setSuccessMessage('Item deleted successfully!');
        } catch (err) {
            setError(err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setNewItem({ name: '', price: '', quantity: '' });
        setEditingItem(null);
    };

    return (
        <div className="items-page">
        
            <h1 style={{ fontFamily: 'Cairo, sans-serif', textAlign: 'center' }}>إدارة العناصر</h1>
            {loading && <Notification message="جارٍ تحميل البيانات..." type="info" />}
            {error && <Notification message={error} type="error" />}
            {successMessage && <Notification message={successMessage} type="success" />}
            
            <Button onClick={() => setShowModal(true)}>إضافة عنصر جديد</Button>
            
            <Table
                columns={['الاسم', 'السعر', 'الكمية', 'الإجراءات']}
                data={items.map((item) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    actions: (
                        <>
                            <Button variant="secondary" onClick={() => handleEditItem(item)}>تعديل</Button>
                            <Button variant="danger" onClick={() => handleDeleteItem(item._id)}>حذف</Button>
                        </>
                    ),
                }))}
            />

            <Modal show={showModal} handleClose={closeModal}>
                <h2>{editingItem ? 'تعديل العنصر' : 'إضافة عنصر جديد'}</h2>
                <Input
                    label="الاسم"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    label="السعر"
                    name="price"
                    type="number"
                    value={newItem.price}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    label="الكمية"
                    name="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={handleInputChange}
                    required
                />
                <Button
                    onClick={editingItem ? handleUpdateItem : handleAddItem}
                    variant="primary"
                >
                    {editingItem ? 'تحديث' : 'إضافة'}
                </Button>
            </Modal>
        </div>
    );
};

export default ItemsPage;
