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
import EditDebtModal from '../components/EditDebtModal'
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

    // Helper function to show notifications
    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const { getItems } = useItemsApi();
    useEffect(() => {
        const fetchItems = async () => {
          try {
            const items = await getItems()
            setItemOptions(items); 
            
          } catch (error) {
            console.error('Error fetching items:', error);
          }
        };
      
        fetchItems();
      }, []);
      
    // Fetch debts on page load
    useEffect(() => {
        const fetchDebts = async () => {
            setIsLoading(true);
            try {
                const data = await getDebts();
                setDebts(data);
            } catch (error) {
                showNotification(error.message || 'Error fetching debts.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDebts();
    }, []);


    const handleAddDebt = async () => {
        try {
            await addDebt(newDebt);
            showNotification('Debt added successfully!', 'success');
            setShowAddModal(false);
            setNewDebt({ name: '', items: [] });
            const updatedDebts = await getDebts();
            setDebts(updatedDebts);
        } catch (error) {
            showNotification(error || 'Error adding debt.', 'error');
        }
    };

    const handleUpdateDebt = async (id, updatedData) => {
        try {
            await updateDebt(id, updatedData);
            showNotification('Debt updated successfully!', 'success');
            const updatedDebts = await getDebts();
            setDebts(updatedDebts);
            setShowEditModal(false);
        } catch (error) {
            showNotification(error.message || 'Error updating debt.', 'error');
        }
    };

    const handleDeleteDebt = async (id) => {
        if (window.confirm('Are you sure you want to delete this debt?')) {
            try {
                await deleteDebt(id);
                showNotification('Debt deleted successfully!', 'success');
                setDebts(debts.filter((debt) => debt._id !== id));
            } catch (error) {
                showNotification(error || 'Error deleting debt.', 'error');
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logoutShop();
            localStorage.removeItem('token');
            const token = localStorage.getItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Error during logout', error);
        }
    };

    // Open the debt details modal
    const handleShowDebtDetails = (debt) => {
        setSelectedDebt(debt);
        setShowDebtDetailsModal(true);
    };


    const handleEditClick = (debt) => {
        setDebtToEdit(debt);
        setShowEditModal(true);
    };

    return (
        <div className="debts-page" style={{ padding: '1rem' }}>
            <h1
                style={{
                    fontFamily: 'Cairo, sans-serif',
                    textAlign: 'center',
                }}
            >
                إدارة الديون
            </h1>
            {/* <button onClick={handleLogout}>Logout</button> */}

            {/* Notification Component */}
            {notification.message && (
                <Notification message={notification.message} type={notification.type} />
            )}

            <div style={{ marginBottom: '1rem' }}>
                <Input
                    label="البحث"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث باسم العميل"
                />
            </div>
            <Button onClick={() => setShowAddModal(true)} variant="primary">
                إضافة دين جديد
            </Button>

            {/* Debts Table */}
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
                            'اسم المشتري': debt.name,
                           
                            المجموع: debt.items?.reduce((acc, item) => {
                                const quantity = item?.quantity || 0;
                                const price = item?.itemId?.price || 0;
                                return acc + quantity * price;
                            }, 0),
                            الإجراءات: (
                                <>
                                    <Button
                                        onClick={() => handleShowDebtDetails(debt)}
                                        variant="primary"
                                    >
                                        عرض التفاصيل
                                    </Button>
                                    <Button
                                        onClick={() => handleEditClick(debt)}
                                        variant="secondary"
                                    >
                                        تعديل
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteDebt(debt._id)}
                                        variant="danger"
                                    >
                                        حذف
                                    </Button>
                                </>
                            ),
                        }))}
                />
            )}

            {/* Add Debt Modal */}
            <Modal show={showAddModal} handleClose={() => setShowAddModal(false)}>
                <FormLayout title="إضافة دين جديد">
                    <Input
                        label="اسم المشتري"
                        name="name"
                        value={newDebt.name}
                        onChange={(e) =>
                            setNewDebt({ ...newDebt, name: e.target.value })
                        }
                        placeholder="أدخل اسم المشتري"
                        required
                    />

                    <div>
                        <label>اختر العناصر</label>
                        <div>
                            {itemOptions.map((item) => (
                                <div key={item.itemId}>
                                    <div>{item.itemName} (${item.price})</div>
                                    <input
                                        type="number"
                                        min="1"
                                        value={
                                            newDebt.items.find((i) => i.itemId === item.itemId)?.quantity || 1
                                        }
                                        onChange={(e) =>
                                            setNewDebt((prev) => ({
                                                ...prev,
                                                items: prev.items.map((i) =>
                                                    i.itemId === item.itemId
                                                        ? { ...i, quantity: parseInt(e.target.value) }
                                                        : i
                                                ),
                                            }))
                                        }
                                    />
                                    <Button
                                        onClick={() =>
                                            setNewDebt((prev) => ({
                                                ...prev,
                                                items: [
                                                    ...prev.items.filter((i) => i.itemId !== item.itemId),
                                                    { itemId: item.itemId, quantity: 1 },
                                                ],
                                            }))
                                        }
                                        variant="outline-primary"
                                    >
                                        إضافة {item.itemName}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleAddDebt} variant="success">
                        إضافة
                    </Button>
                </FormLayout>
            </Modal>


            {/* Debt Details Modal */}
            <Modal
                show={showDebtDetailsModal}
                handleClose={() => setShowDebtDetailsModal(false)}
            >
                {selectedDebt && (
                    <div>
                        <h3>تفاصيل الدين</h3>
                        <p><strong>اسم المشتري:</strong> {selectedDebt.name}</p>
                        <h4>المشتريات</h4>
                        <ul>
                            {selectedDebt.items?.map((item, index) => (
                                <li key={index}>
                                    {item.itemId.name} (الكميات: {item.quantity}) - ${item.itemId.price}
                                </li>
                            ))}
                        </ul>
                        <p>
                            <strong>المجموع:</strong> {selectedDebt.items?.reduce(
                                (acc, item) => acc + item.quantity * item.itemId.price, 0
                            )}
                        </p>
                    </div>
                )}
            </Modal>
            <EditDebtModal
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
