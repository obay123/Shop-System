import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReportsApi } from '../api/reportsApi';
import Button from '../components/Button';
import ReportCard from '../components/ReportCard';
import Notification from '../components/Notification';

const ReportsPage = () => {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasReportForToday, setHasReportForToday] = useState(false);
  const { getReports, deleteReport } = useReportsApi();
  const navigate = useNavigate();

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const checkTodayReport = (reports) => {
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    
    return reports.some(report => {
      // Extract YYYY-MM-DD from report date
      const reportDate = report.date.split('T')[0];
      return reportDate === today;
    });
  };

  useEffect(() => {
    const fetchReports = async () => {
      showNotification('جاري تحميل التقارير', 'info');
      try {
        const data = await getReports();
        setReports(data);
        
        const hasTodayReport = checkTodayReport(data);
        setHasReportForToday(hasTodayReport);
        
        showNotification('تم تحميل التقارير بنجاح', 'success');
      } catch (error) {
        showNotification(error.message || 'خطأ في تحميل التقارير', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('هل انت بالفعل تريد مسح التقرير ؟')) {
      try {
        await deleteReport(id);
        showNotification('تم مسح التقرير بنجاح', 'success');
        
        // Update reports state and recheck today's report
        const updatedReports = reports.filter((report) => report._id !== id);
        setReports(updatedReports);
        setHasReportForToday(checkTodayReport(updatedReports));
      } catch (error) {
        showNotification(error.message || 'خطأ في مسح التقرير', 'error');
      }
    }
  };

  const handleCreateReport = () => {
    if (hasReportForToday) {
      showNotification('لا يمكن إنشاء أكثر من تقرير في نفس اليوم', 'error');
      return;
    }
    navigate('/reports/new');
  };

  const handleView = (date) => {
    navigate(`/reports/${date}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">تقارير البيع</h1>
        <div className="header-actions">
          <Button 
            onClick={handleCreateReport}
            className="btn btn-primary"
            disabled={hasReportForToday}
            title={hasReportForToday ? "لا يمكن إنشاء أكثر من تقرير في نفس اليوم" : ""}
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
            <div className="no-data">لا يوجد تقارير</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;