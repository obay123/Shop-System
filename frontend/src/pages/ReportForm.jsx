import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReportsApi } from '../api/reportsApi';
import { useSoldItemsApi } from '../api/soldItemsApi';
import { useItemsApi } from '../api/itemsApi';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const ReportForm = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [report, setReport] = useState({
    _id: null,
    date: new Date().toISOString().split('T')[0],
    soldItems: [],
    totalAmount: 0,
    debtPaid: 0, 
});

  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  const { getItems } = useItemsApi();
  const { addReport, getReportByDate, updateReport } = useReportsApi();
  const { addSoldItem, deleteSoldItem } = useSoldItemsApi();

  // Check if editing is allowed based on date
  const checkEditPermissions = (reportDate) => {
    if (!reportDate) return false;
    const today = new Date().toISOString().split('T')[0];
    const reportDateFormatted = new Date(reportDate).toISOString().split('T')[0];
    return reportDateFormatted === today;
  };

  // Fetch report if date is provided
  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!date) {
          setCanEdit(true);
          setLoading(false);
          return;
        }

        const response = await getReportByDate(date);
        // Handle the case where response is an array with one report
        const fetchedReport = Array.isArray(response) ? response[0] : response;
        
        if (fetchedReport) {
          // Transform the sold items to match our needed structure
          const formattedSoldItems = fetchedReport.soldItems.map(item => ({
            _id: item._id,
            itemId: item.itemId._id, // Store the ID separately
            quantitySold: item.quantitySold,
            total: item.total,
            item: item.itemId // The full item object is in itemId
          }));

          setReport({
            _id: fetchedReport._id,
            date: fetchedReport.date,
            soldItems: formattedSoldItems,
            totalAmount: fetchedReport.totalAmount,
            debtPaid: fetchedReport.debtPaid
          });
          
          const isEditable = checkEditPermissions(fetchedReport.date);
          setCanEdit(isEditable);
        }
      } catch (error) {
        console.error('Failed to fetch report:', error);
        setError('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [date]);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error('Invalid items data received:', data);
          setError('Failed to load items data');
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
        setError('Failed to load items data');
      }
    };

    fetchItems();
  }, []);

  const calculateTotal = (item, qty) => {
    if (!item || !item.price || !qty) return 0;
    return item.price * Number(qty);
  };

  const handleAddItem = async () => {
    if (!canEdit || !selectedItem) return;

    const item = items.find(i => i._id === selectedItem);
    if (!item) {
      setError('Selected item not found');
      return;
    }

    const parsedQuantity = quantity;
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      setError('Invalid quantity');
      return;
    }

    const total = calculateTotal(item, parsedQuantity);
    const newSoldItem = {
      itemId: item._id,
      quantitySold: parsedQuantity,
      total,
      item
    };

    try {
      if (report._id) {
        const savedSoldItem = await addSoldItem(report._id, newSoldItem);
        if (savedSoldItem && savedSoldItem._id) {
          newSoldItem._id = savedSoldItem._id;
        }
      }

      setReport(prev => ({
        ...prev,
        soldItems: [...prev.soldItems, newSoldItem],
        totalAmount: (prev.totalAmount || 0) + total
      }));

      setSelectedItem('');
      setQuantity(1);
      setError(null);
    } catch (error) {
      console.error('Failed to add item:', error);
      setError('Failed to add item');
    }
  };

  const handleRemoveItem = async (index, soldItemId) => {
    if (!canEdit) return;

    try {
      // if (report._id && soldItemId) {
      //   console.log(report._id , soldItemId)
      //   await deleteSoldItem(report._id, soldItemId);
      // }

      setReport(prev => {
        const newSoldItems = [...prev.soldItems];
        const removedItem = newSoldItems.splice(index, 1)[0];
        return {
          ...prev,
          soldItems: newSoldItems,
          totalAmount: (prev.totalAmount || 0) - (removedItem.total || 0)
        };
      });
      setError(null);
      console.log(report._id , soldItemId)
    } catch (error) {
      console.error('Failed to remove item:', error);
      setError('Failed to remove item');
    }
  };

  const handleSave = async () => {
    if (!canEdit) return;

    try {
        const reportData = {
            date: report.date,
            soldItems: report.soldItems.map(({ itemId, quantitySold, total }) => ({
                itemId,
                quantitySold,
                total,
            })),
            totalAmount: report.totalAmount || 0,
            debtPaid: report.debtPaid || 0,
        };

        if (report._id) {
            await updateReport(report._id, reportData);
        } else {
            await addReport(reportData);
        }

        navigate('/reports');
    } catch (error) {
        console.error('Failed to save report:', error);
        setError('Failed to save report');
    }
};

  if (loading) {
    return (
      
        <Card>
          <div className="loading">جاري تحميل النموذج ...</div>
        </Card>
      
    );
  }

  return (
      <Card>
          {error && (
            <div className="error-message text-red-500 mb-4">
              {error}
            </div>
          )}
          
          <div className="page-header">
            <h1 className="page-title">
              {date ? (canEdit ? 'تعديل التقرير' : 'عرض تقرير') : 'انشاء تقرير جديد'}
            </h1>
            <div className="input-container">
              <Input
                type="date"
                value={report.date.split('T')[0]}
                onChange={(e) => setReport(prev => ({ ...prev, date: e.target.value }))}
                disabled={!!date}
                className="input-field"
              />
            </div>
          </div>

          {canEdit && (
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
                  {canEdit && <th>الاجراءات</th>}
                </tr>
              </thead>
              <tbody>
                {report.soldItems.map((soldItem, index) => (
                  <tr key={index}>
                    <td>{soldItem.item.name}</td>
                    <td>{soldItem.item.price}</td>
                    <td>{soldItem.quantitySold}</td>
                    <td>{soldItem.total}</td>
                    {canEdit && (
                      <td>
                        <Button
                          variant="danger"
                          className="btn btn-danger"
                          onClick={() => handleRemoveItem(index, soldItem._id)}
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
                    المجموع العام
                  </td>
                  <td className="total-value">
                    {report.totalAmount || 0}
                  </td>
                  {canEdit && <td></td>}
                </tr>
                <tr>
                  <td colSpan="3" className='total-label'>
                  دفوعات ديون
                  </td>
                  <td className='total-value'>
                    {report.debtPaid }
                  </td>
                </tr>
                <tr>
                <td colSpan='3' className="total-label" >
                  المجموع الشامل
                </td>
                <td  className='total-value'>
                  {Number(report.debtPaid) + Number(report.totalAmount)}
                </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="card-actions">
            <Button 
              variant="danger"
              className="btn btn-secondary" 
              onClick={() => navigate('/reports')}
            >
              الغاء
            </Button>
            {canEdit && (
              <Button 
                className="btn btn-primary"
                onClick={handleSave}
              >
                حفظ التقرير
              </Button>
            )}
          </div>
      </Card>
  );
};

export default ReportForm;