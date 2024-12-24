import { useState, useEffect } from 'react';
import Modal from './Modals';
import FormLayout from './FormLayout';
import Input from './Input';
import Button from './Button';

const UpdateDebtModal = ({ debt, show, handleClose, onUpdate, itemOptions = [] }) => {

  const [updatedDebt, setUpdatedDebt] = useState({
      name: '',
      items: [],
      paidAmount: 0
  });

  useEffect(() => {
      if (debt) {
          setUpdatedDebt({
              name: debt.name ,
              paidAmount: 0
          });
      }
  }, [debt]);

  const handleSubmit = async () => {
      try {
          const dataToSend = {
              name: updatedDebt.name,
              paidAmount: updatedDebt.paidAmount,
              newItems: updatedDebt.items
          };
          await onUpdate(debt._id, dataToSend);
          handleClose();
      } catch (error) {
          showNotification("خطأ في تحديث الدين", "error");
      }
  };

  const handleItemSelect = (itemId) => {
      const selectedItem = itemOptions.find((item) => item._id === itemId);
      if (selectedItem) {
          setUpdatedDebt((prev) => ({
              ...prev,
              items: [
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
      const updatedItems = updatedDebt.items.map((item, i) =>
          i === index ? { ...item, quantity } : item
      );
      setUpdatedDebt((prev) => ({
          ...prev,
          items: updatedItems,
      }));
  };

  return (
      <Modal show={show} handleClose={handleClose}>
          <FormLayout title="تعديل الدين">
              <Input
                  label="اسم المشتري"
                  name="name"
                  value={updatedDebt.name}
                  onChange={(e) => setUpdatedDebt({ ...updatedDebt, name: e.target.value })}
                  placeholder="أدخل اسم المشتري"
                  required
              />
              <Input
                  label="المبلغ المدفوع"
                  type="number"
                  name="paidAmount"
                  // value={updatedDebt.paidAmount}
                  onChange={(e) => setUpdatedDebt({ ...updatedDebt, paidAmount: Number(e.target.value) })}
                  placeholder="أدخل المبلغ المدفوع"
                  min="0"
              />
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
              {updatedDebt.items?.length > 0 && (
                  <div>
                      <h4>العناصر التي اخترتها</h4>
                      {updatedDebt.items.map((item, index) => (
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

export default UpdateDebtModal;
