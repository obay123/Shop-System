import React, { useState, useEffect } from 'react';
import { useDebtsApi } from '../api/debtsApi';
import Input from '../components/Input';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modals';
import FormLayout from '../components/FormLayout';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { logoutShop } from '../api/authApi';
import UpdateDebtModal from '../components/updateDebtModal';
import { useItemsApi } from '../api/itemsApi';

const DebtsPage = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [debtToEdit, setDebtToEdit] = useState(null);
    const { getDebts, addDebt, updateDebt, deleteDebt } = useDebtsApi();
    const navigate = useNavigate();
    const [debts, setDebts] = useState([]);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newDebt, setNewDebt] = useState({
        name: '',
        items: [],
    });
    const [itemOptions, setItemOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [selectedDebt, setSelectedDebt] = useState(null);
    const [showDebtDetailsModal, setShowDebtDetailsModal] = useState(false);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const { getItems } = useItemsApi();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const items = await getItems();
                setItemOptions(items);
            } catch (error) {
                console.error('Error fetching items:', error);
                showNotification('خطأ في جلب السلع', 'error');
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const fetchDebts = async () => {
            setIsLoading(true);
            try {
                const data = await getDebts();
                setDebts(data);
                showNotification('تم جلب الديون بنجاح','success')
            } catch (error) {
                showNotification(error.message || 'خطأ في جلب الديون', 'info');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDebts();
    }, []);

    const handleItemSelect = (itemId) => {
        const selectedItem = itemOptions.find((item) => item._id === itemId);
        if (selectedItem) {
            setNewDebt((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        itemId: itemId,
                        quantity: 1,
                        _itemName: selectedItem.name
                    }
                ],
            }));
        }
    };

    const handleItemQuantityChange = (index, quantity) => {
        const updatedItems = newDebt.items.map((item, i) =>
            i === index ? { ...item, quantity } : item
        );
        setNewDebt((prev) => ({
            ...prev,
            items: updatedItems,
        }));
    };

    const handleAddDebt = async (e) => {
        e.preventDefault();
        if (!newDebt.name || newDebt.items.length === 0) {
            showNotification('املأ جميع الحقول', 'error');
            return;
        }

        const debtToAdd = {
            name: newDebt.name,
            items: newDebt.items.map(item => ({
                itemId: item.itemId,
                quantity: item.quantity
            }))
        };

        try {
            await addDebt(debtToAdd);
            showNotification('تم اضافة الدين بنجاح !', 'success');
            setShowAddModal(false);
            setNewDebt({
                name: '',
                items: [],
            });
            const updatedDebts = await getDebts();
            setDebts(updatedDebts);
        } catch (error) {
            showNotification(error.message || 'خطأ في اضافة الدين', 'error');
        }
    };

    const handleUpdateDebt = async (id, updatedData) => {
        try {
            await updateDebt(id, updatedData);
            showNotification('تم تحديث الدين بنجاح !', 'success');
            const updatedDebts = await getDebts();
            setDebts(updatedDebts);
            setShowEditModal(false);
        } catch (error) {
            showNotification(error.message || 'خطأ في تحديث الدين', 'error');
        }
    };

    const handleDeleteDebt = async (id) => {
        if (window.confirm('هل تريد بالفعل في مسح الدين ؟')) {
            try {
                await deleteDebt(id);
                showNotification('!تم مسح الدين بنجاح', 'success');
                setDebts(debts.filter((debt) => debt._id !== id));
            } catch (error) {
                showNotification(error.message || 'خطأ في مسح الدين ', 'error');
            }
        }
    };

    // const handleLogout = async () => {
    //     try {
    //         await logoutShop();
    //         localStorage.removeItem('token');
    //         navigate('/login');
    //     } catch (error) {
    //         console.error('Error during logout', error);
    //     }
    // };

    const handleShowDebtDetails = (debt) => {
        setSelectedDebt(debt);
        setShowDebtDetailsModal(true);
    };

    const handleEditClick = (debt) => {
        setDebtToEdit(debt);
        setShowEditModal(true);
    };

    return (
        <div className="page-container">
        <div className="page-header">
            <h1 className="page-title">إدارة الديون</h1>
            <div className="header-actions">
            <Input 
                    placeholder="ابحث باسم العميل"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <Button onClick={() => setShowAddModal(true)} className="add-button">
                    إضافة عنصر جديد
                </Button>
            </div>
        </div>
            {notification.message && (
                <Notification message={notification.message} type={notification.type} />
            )}

            {isLoading ? (
                <p>جاري التحميل...</p>
            ) : (
                <Table
                    columns={['اسم المشتري', 'المجموع', 'الإجراءات']}
                    data={debts
                        .filter((debt) =>
                            debt.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((debt) => ({
                            id: debt._id,
                            'اسم المشتري': debt.name,
                            'المجموع': debt.amount,
                            'الإجراءات': (
                                <div key={`actions-${debt._id}`}>
                                    <Button
                                        key={`details-${debt._id}`}
                                        onClick={() => handleShowDebtDetails(debt)}
                                        variant="primary"
                                    >
                                         التفاصيل
                                    </Button>
                                    <Button
                                        key={`edit-${debt._id}`}
                                        onClick={() => handleEditClick(debt)}
                                        variant="secondary"
                                    >
                                        تعديل
                                    </Button>
                                    <Button
                                        key={`delete-${debt._id}`}
                                        onClick={() => handleDeleteDebt(debt._id)}
                                        variant="danger"
                                    >
                                        حذف
                                    </Button>
                                </div>
                            ),
                        }))}
                />
            )}

            <Modal show={showAddModal} handleClose={() => setShowAddModal(false)}>
                <FormLayout title="إضافة دين جديد">
                    <Input
                        label="اسم المشتري"
                        name="name"
                        value={newDebt.name}
                        onChange={(e) =>
                            setNewDebt((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        placeholder="أدخل اسم المشتري"
                        required
                    />

                    <div>
                        <label>اختر العناصر</label>
                        <select
                            onChange={(e) => handleItemSelect(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                اختار السلع
                            </option>
                            {itemOptions.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name} (السعر: {item.price})
                                </option>
                            ))}
                        </select>
                    </div>

                    {newDebt.items.length > 0 && (
                        <div>
                            <h4>العناصر التي اخترتها</h4>
                            {newDebt.items.map((item, index) => (
                                <div key={index}>
                                    <p>{item._itemName}</p>
                                    <label>الكمية:</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleItemQuantityChange(index, e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <button type="submit" onClick={handleAddDebt}>اضافة</button>
                </FormLayout>
            </Modal>

            <Modal
                show={showDebtDetailsModal}
                handleClose={() => setShowDebtDetailsModal(false)}
            >
                {selectedDebt && (
                    <div>
                        <h3>تفاصيل الدين</h3>
                        <p>
                            <strong>اسم المشتري:</strong> {selectedDebt.name}
                        </p>
                        <h4>المشتريات</h4>
                        <ul>
                            {selectedDebt.items?.map((item) => (
                                <li key={`detail-${item.itemId._id}-${item.quantity}`}>
                                    {item.itemId.name} (الكميات: {item.quantity}) - ${item.itemId.price}
                                </li>
                            ))}
                        </ul>
                        <p>
                            <strong>المجموع:</strong>{' '}
                            {selectedDebt.items?.reduce(
                                (acc, item) => acc + item.quantity * item.itemId.price,
                                0
                            )}
                        </p>
                        <p>
                            <strong> القيمة المدفوعة: </strong>
                            {selectedDebt.items.reduce(
                                (acc, item) => acc + item.quantity * item.itemId.price,
                                0
                            ) - selectedDebt.amount}
                        </p>
                        <p>
                            <strong>المجموع بعد الدفع :</strong>
                            {selectedDebt.amount || 0}
                        </p>
                    </div>
                )}
            </Modal>

            <UpdateDebtModal
                debt={debtToEdit}
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                onUpdate={handleUpdateDebt}
                itemOptions={itemOptions}
            />
        </div>
    );
};

export default DebtsPage;