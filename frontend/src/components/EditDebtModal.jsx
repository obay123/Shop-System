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
        items: debt.items.map(item => ({
          itemId: item.itemId._id,
          quantity: item.quantity
        })),
        paidAmount: 0
      });
    }
  }, [debt]);

  useEffect(() => {
    console.log('ItemOptions:', itemOptions);
  }, [itemOptions]);

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        name: editedDebt.name,
        paidAmount: editedDebt.paidAmount,
        newItems: editedDebt.items.filter(item =>
          !debt.items.some(existingItem => existingItem.itemId._id === item.itemId)
        )
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

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">إضافة عناصر جديدة</label>
          <div className="space-y-2">
            {Array.isArray(itemOptions) && itemOptions.map((item) => (
              <div key={item._id} className="flex items-center space-x-2">
                <span className="ml-2">{item.name} (${item.price})</span>
                <input
                  type="number"
                  min="0"
                  className="w-20 p-1 border rounded"
                  value={editedDebt.items.find(i => i.itemId === item._id)?.quantity || 0}
                  onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
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
