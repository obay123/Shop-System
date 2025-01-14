import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReportsApi } from '../api/reportsApi';
import Button from '../components/Button';
import ReportCard from '../components/ReportCard';
import Notification from '../components/Notification';
import Input from '../components/Input';
import { Home, FileText, PiggyBank } from 'lucide-react';



const ReportsPage = () => {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasReportForToday, setHasReportForToday] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const { getReports, deleteReport } = useReportsApi();
  const navigate = useNavigate();

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleNavigate = (path) => {
    navigate(path);
};

  const checkTodayReport = (reports) => {
    const today = new Date().toISOString().split('T')[0];
    return reports.some(report => {
      const reportDate = report.date.split('T')[0];
      return reportDate === today;
    });
  };

  const filteredReports = reports.filter(report => {
    if (!searchDate) return true;
    const reportDate = report.date.split('T')[0];
    return reportDate.includes(searchDate);
  });

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
                <div className="navigation-icons">
                    <button 
                        className="nav-icon-button" 
                        onClick={() => handleNavigate('/')}
                        title="الصفحة الرئيسية"
                    >
                        <Home size={24} />
                    </button>
                    <button 
                        className="nav-icon-button" 
                        onClick={() => handleNavigate('/reports')}
                        title="التقارير"
                    >
                        <FileText size={24} />
                    </button>
                    <button 
                        className="nav-icon-button" 
                        onClick={() => handleNavigate('/debts')}
                        title="الديون"
                    >
                        <PiggyBank size={24} />
                    </button>
                </div>
        <h1 className="page-title">تقارير البيع</h1>
        <div className="header-actions">
          <Input 
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="search-input"
            placeholder="البحث حسب التاريخ..."
          />
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
          {filteredReports.map(report => (
            <ReportCard
              key={report._id}
              report={report}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
          {filteredReports.length === 0 && (
            <div className="no-data">
              {searchDate ? 'لا يوجد تقارير في هذا التاريخ' : 'لا يوجد تقارير'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;