import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useReportsApi}  from '../api/reportsApi';
import  {useSoldItemsApi}  from '../api/soldItemsApi';
import { useItemsApi } from '../api/itemsApi';
import  Button  from '../components/Button';
import  Input  from '../components/Input';
import  Card  from '../components/Card';

const ReportForm = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [report, setReport] = useState({
    date: new Date().toISOString().split('T')[0],
    soldItems: [],
    totalAmount: 0
  });
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { getItems } = useItemsApi();
  const { addReport } = useReportsApi();
  const { addSoldItem, deleteSoldItem } = useSoldItemsApi();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    // Auto-save functionality
    const autoSaveInterval = setInterval(() => {
      if (report.soldItems.length > 0) {
        handleSave();
      }
    }, 300000); // Auto-save every 5 minutes

    // Check for midnight auto-save
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        handleSave();
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(autoSaveInterval);
      clearInterval(checkMidnight);
    };
  }, [report]);

  const calculateTotal = (item, qty) => {
    return item.price * qty;
  };

  const handleAddItem = async () => {
    const item = items.find(i => i._id === selectedItem);
    if (!item) return;

    const total = calculateTotal(item, quantity);
    const newSoldItem = {
      itemId: item._id,
      quantitySold: quantity,
      total
    };

    try {
      if (id) {
        await addSoldItem(id, newSoldItem);
      }

      setReport(prev => ({
        ...prev,
        soldItems: [...prev.soldItems, { ...newSoldItem, item }],
        totalAmount: prev.totalAmount + total
      }));

      setSelectedItem('');
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleSave = async () => {
    try {
      const reportData = {
        date: report.date,
        soldItems: report.soldItems.map(({ itemId, quantitySold, total }) => ({
          itemId,
          quantitySold,
          total
        })),
        totalAmount: report.totalAmount
      };

      await addReport(reportData);
      navigate('/reports');
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  const handleRemoveItem = async (index, soldItemId) => {
    try {
      if (id && soldItemId) {
        await deleteSoldItem(id, soldItemId);
      }

      setReport(prev => {
        const newSoldItems = [...prev.soldItems];
        const removedItem = newSoldItems.splice(index, 1)[0];
        return {
          ...prev,
          soldItems: newSoldItems,
          totalAmount: prev.totalAmount - removedItem.total
        };
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <Card>
        <div className="form-layout">
          <div className="page-header">
            <h1 className="page-title">
              {id ? 'عرض تقرير' : 'انشاء تقرير جديد'}
            </h1>
            <div className="input-container">
              <Input
                type="date"
                value={report.date}
                onChange={(e) => setReport(prev => ({ ...prev, date: e.target.value }))}
                disabled={!!id}
                className="input-field"
              />
            </div>
          </div>

          {!id && (
            <div className="form-row">
              <div className="input-container">
                <select
                  className="input-field"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  <option value="">اختار العناصر</option>
                  {items.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name} - {item.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-container">
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="الكمية"
                  className="input-field"
                />
              </div>
              <Button 
                onClick={handleAddItem} 
                disabled={!selectedItem}
                className="btn btn-primary"
              >
                اضافة العنصر
              </Button>
            </div>
          )}

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>العنصر</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                  <th>المجموع</th>
                  {!id && <th>الاجراءات</th>}
                </tr>
              </thead>
              <tbody>
                {report.soldItems.map((soldItem, index) => (
                  <tr key={index}>
                    <td>{soldItem.item.name}</td>
                    <td>${soldItem.item.price}</td>
                    <td>{soldItem.quantitySold}</td>
                    <td>${soldItem.total.toFixed(2)}</td>
                    {!id && (
                      <td>
                        <Button
                           variant='danger'
                          className="btn btn-danger"
                          onClick={() => handleRemoveItem(index, soldItem._id)}
                          disabled={selectedItem}
                        >
                          حذف
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="total-label">
                    Total Amount:
                  </td>
                  <td className="total-value">
                    ${report.totalAmount.toFixed(2)}
                  </td>
                  {!id && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="card-actions">
            <Button 
              className="btn btn-secondary" 
              onClick={() => navigate('/reports')}
            >
              Cancel
            </Button>
            {!id && (
              <Button 
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Report
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportForm;