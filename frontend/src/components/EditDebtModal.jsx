import { useState, useEffect } from 'react';
import Modal from './Modals';
import FormLayout from '../components/FormLayout';
import Input from '../components/Input';
import Button from '../components/Button';

const EditDebtModal = ({ debt, show, handleClose, onUpdate, itemOptions }) => {
  const [editedDebt, setEditedDebt] = useState({
    name: '',
    items: [],
    paidAmount: 0
  });

  useEffect(() => {
    if (debt) {
      setEditedDebt({
        name: debt.name,
        paidAmount: 0
      });
    }
  }, [debt]);


  const handleSubmit = async () => {
    try {
      const dataToSend = {
        name: editedDebt.name,
        paidAmount: editedDebt.paidAmount,
        newItems: editedDebt.items 
      };
      await onUpdate(debt._id, dataToSend);
      handleClose();
    } catch (error) {
      console.error('Error updating debt:', error);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setEditedDebt(prev => {
      const updatedItems = prev.items.map(item =>
        item.itemId === itemId
          ? { ...item, quantity: Math.max(0, quantity) }  // Ensure quantity is not negative
          : item
      );

      // If itemId not found, add it with the selected quantity
      if (!updatedItems.some(item => item.itemId === itemId) && quantity > 0) {
        updatedItems.push({ itemId, quantity });
      }

      return { ...prev, items: updatedItems };
    });
  };

  if (!show || !debt) return null;
  const handleItemSelect = (itemId) => {
    const selectedItem = itemOptions.find((item) => item._id === itemId);
    if (selectedItem) {
      setEditedDebt((prev) => ({
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
    const updatedItems = editedDebt.items.map((item, i) =>
        i === index ? { ...item, quantity } : item
    );
    setEditedDebt((prev) => ({
        ...prev,
        items: updatedItems,
    }));
};

const handleAddDebt = async (e) => {
    e.preventDefault();
    if (!editedDebt.name || editedDebt.items.length === 0) {
        showNotification('املأ جميع الحقول', 'error');
        return;
    }

    const debtToAdd = {
        name: editedDebt.name,
        items: editedDebt.items.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity
        }))
    };

    try {
        await addDebt(debtToAdd);
        showNotification('تم اضافة الدين بنجاح !', 'success');
        setShowAddModal(false);
        setEditedDebt({
            name: '',
            items: [],
        });
        const updatedDebts = await getDebts();
        setDebts(updatedDebts);
    } catch (error) {
        showNotification(error.message || 'خطأ في اضافة الدين', 'error');
    }
};

  return (
    <Modal show={show} handleClose={handleClose}>
      <FormLayout title="تعديل الدين">
        <Input
          label="اسم المشتري"
          name="name"
          value={editedDebt.name}
          onChange={(e) => setEditedDebt({ ...editedDebt, name: e.target.value })}
          placeholder="أدخل اسم المشتري"
          required
        />

        <Input
          label="المبلغ المدفوع"
          type="number"
          name="paidAmount"
          value={editedDebt.paidAmount}
          onChange={(e) => setEditedDebt({ ...editedDebt, paidAmount: Number(e.target.value) })}
          placeholder="أدخل المبلغ المدفوع"
          min="0"
        />

        <div>
          <label>إضافة عناصر جديدة</label>
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

                    {editedDebt.items.length > 0 && (
                        <div>
                            <h4>العناصر التي اخترتها</h4>
                            {editedDebt.items.map((item, index) => (
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
        </div>

        <div>
          <Button onClick={handleClose} variant="secondary">
            إلغاء
          </Button>
          <Button onClick={handleSubmit} variant="primary">
            حفظ التغييرات
          </Button>
        </div>
      </FormLayout>
    </Modal>
  );
};

export default EditDebtModal;
