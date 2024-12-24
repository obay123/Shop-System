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
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '' });
    const [editingItem, setEditingItem] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
  

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    // Fetch items on load
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getItems();
                setItems(data);
                console.log(data)
                showNotification('تم جلب السلع بنجاح', 'success')
            } catch (error) {
                showNotification(error.message || 'خطأ في جلب السلع','info')
            } finally {
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
            setNewItem({ name: '', price: '' });
            setShowModal(false);
           showNotification('تم اضافة العنصر بنجاح','success')
        } catch (error) {
            showNotification(error.message || 'خطأ في اضافة العنصر','error')
        }
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setNewItem({ name: item.name, price: item.price });
        setShowModal(true);
    };

    const handleUpdateItem = async () => {
        try {
            const updatedItem = await updateItem(editingItem._id, newItem);
            setItems(items.map((item) => (item._id === editingItem._id ? updatedItem : item)));
            setEditingItem(null);
            setNewItem({ name: '', price: '', quantity: '' });
            setShowModal(false);
            showNotification('تم تحديث العنصر بنجاح','success')
        } catch (error) {
            showNotification(error.message || 'خطأ في تحديث العنصر','error')
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('هل تريد بالفعل في مسح العنصر ؟')) {
        try {
            await deleteItem(id);
            setItems(items.filter((item) => item._id !== id));
            showNotification('تم حذف العنصر بنجاح','success')
        } catch (error) {
            showNotification(error.message || 'خطأ في حذف العنصر','error')
        }
    }
    };

    const closeModal = () => {
        setShowModal(false);
        setNewItem({ name: '', price: '' });
        setEditingItem(null);
    };

    return (

        <div className="items-page">

            <h1 style={{ fontFamily: 'Cairo, sans-serif', textAlign: 'center' }}>إدارة العناصر</h1>
            {loading && <Notification message="جارٍ تحميل البيانات..." type="info" />}
            {notification.message &&
                (<Notification message={notification.message} type={notification.type} />)}

            <Button onClick={() => setShowModal(true)}>إضافة عنصر جديد</Button>

            <Table
                columns={['الاسم', 'السعر', 'الإجراءات']}
                data={items.map((item) => ({
                    الاسم: item.name,
                    السعر: item.price,
                    الإجراءات: (
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
                    onChange={(e) =>
                        setNewItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    required
                />
                <Input
                    label="السعر"
                    name="price"
                    type="number"
                    value={newItem.price}
                    onChange={(e) =>
                        setNewItem((prev) => ({
                            ...prev,
                            price: e.target.value,
                        }))
                    }
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
