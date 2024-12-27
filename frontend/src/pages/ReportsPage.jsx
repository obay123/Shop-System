import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useReportsApi} from '../api/reportsApi';
import Button from '../components/Button';
import ReportCard from '../components/ReportCard';
import Notification from '../components/Notification'

const ReportsPage = () => {
  const [notification , setNotification] = useState({message : '', type:''})
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getReports, deleteReport } = useReportsApi();
  const navigate = useNavigate();

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
};

  useEffect(() => {
    const fetchReports = async ()=>{
      showNotification('جاري جلب التقارير', "info")
      try{
      const data = await getReports()
      setReports(data)
     showNotification('تم جلب التقارير بنجاح','success')
      }catch(error){
        showNotification(error.message || 'خطأ في جلب التقارير','error')
      }finally{
        setLoading(false)
      }
    }
    fetchReports()
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('هل انت بالفعل تريد مسح التقرير ؟  ')) {
      try {
        await deleteReport(id);
        showNotification('تم مسح التقرير بنجاح','success')
        setReports(reports.filter((report) => report._id !== id));
      } catch (error) {
        showNotification(error.message || 'خطأ في مسح التقرير','error')
      }
    }
  };

  const handleView = (id) => {
    navigate(`/reports/${id}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">تقارير البيع</h1>
        <div className="header-actions">
          <Button 
            onClick={() => navigate('/reports/new')}
            className="btn btn-primary"
          >
            انشاء تقرير جديد
          </Button>
        </div>
      </div>

      {notification.message && (
                <Notification message={notification.message} type={notification.type} />
            )}

      {loading ? (
        <div className="loading">جاري تحميل التقارير ...</div>
        
      ) : (
        <div className="items-grid">
          {reports.map(report => (
            <ReportCard
              key={report._id}
              report={report}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
          {reports.length === 0 && ( 
            <div className="no-data">
              
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;