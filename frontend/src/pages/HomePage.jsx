import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemsApi } from '../api/itemsApi';
import { useReportsApi } from '../api/reportsApi';
import { useDebtsApi } from '../api/debtsApi';
import Button from '../components/Button';
import Card from '../components/Card';
import Notification from '../components/Notification';

const StatsCard = ({ title, value, icon, color }) => (
  <div className="stats-card">
    <div className="stats-card-content">
      <h3 className="stats-card-title">{title}</h3>
      <p className="stats-card-value" style={{ color }}>{value}</p>
    </div>
    <span className="stats-card-icon">{icon}</span>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { getItems } = useItemsApi();
  const { getReports } = useReportsApi();
  const { getDebts } = useDebtsApi();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalReports: 0,
    todayRevenue: 0,
    debtsTotal: 0
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [shopName, setShopName] = useState('');

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login');
  };

  useEffect(() => {
    const name = localStorage.getItem('name'); 
    setShopName(name || 'محل الألبان'); 

    const fetchDashboardData = async () => {
      try {
        const reports = await getReports();
        const items = await getItems();
        const debts = await getDebts();
        
        const today = new Date().toISOString().split('T')[0];
        const todayReport = reports.find(report => report.date.split('T')[0] === today);
        const debtsTotalCal = debts.reduce((total, debt) => total + debt.amount, 0);
        
        setStats({
          totalItems: items.length,
          totalReports: reports ? reports.length : 0,
          todayRevenue: todayReport ? todayReport.totalAmount : 0,
          debtsTotal: debtsTotalCal
        });
      } catch (error) {
        showNotification('لم يتم العثور على بيانات لعرضها', 'info');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickLinks = [
    {
      title: 'إضافة عنصر جديد',
      description: 'إضافة منتج جديد إلى المخزون',
      icon: '📦',
      action: () => navigate('/items'),
      color: '#4CAF50'
    },
    {
      title: 'عرض التقارير',
      description: 'عرض جميع تقارير المبيعات',
      icon: '📊',
      action: () => navigate('/reports'),
      color: '#2196F3'
    },
    {
      title: "عرض الديون",
      description: 'عرض جميع ديون الزبائن',
      icon: '📈',
      action: () => navigate('/debts'),
      color: '#FF9800'
    }
  ];

  const features = [
    {
      icon: '📊',
      title: 'تقارير المبيعات',
      description: 'تتبع مبيعاتك اليومية وإنشاء تقارير تفصيلية'
    },
    {
      icon: '📦',
      title: 'إدارة المخزون',
      description: 'تتبع المنتجات وإدارة المخزون بكفاءة'
    },
    {
      icon: '📱',
      title: 'واجهة سهلة',
      description: 'واجهة مستخدم بسيطة وسهلة الاستخدام'
    },
    {
      icon: '🔍',
      title: 'بحث متقدم',
      description: 'بحث سريع عن المنتجات والتقارير'
    }
  ];

  return (
    <div>
    <section className="welcome-section">
      <button className="logout-button" onClick={handleLogout}>
        <span>تسجيل الخروج</span>
      </button>
      <div className="welcome-content">
        <h1>مرحباً بك في نظام إدارة {shopName}</h1>
        <p>نظام متكامل لإدارة المخزون وتتبع المبيعات والديون</p>
      </div>
    </section>
      
      <div className="home-container">
        {notification.message && (
          <Notification message={notification.message} type={notification.type} />
        )}

        {loading ? (
          <div className="loading">جاري تحميل البيانات...</div>
        ) : (
          <>
            <section className="stats-section">
              <div className="stats-grid">
                <StatsCard
                  title="إجمالي المنتجات"
                  value={stats.totalItems}
                  icon="📦"
                  color="#4CAF50"
                />
                <StatsCard
                  title="تقارير المبيعات"
                  value={stats.totalReports}
                  icon="📊"
                  color="#2196F3"
                />
                <StatsCard
                  title="مبيعات اليوم"
                  value={`${stats.todayRevenue} ل.ل`}
                  icon="💰"
                  color="#FF9800"
                />
                <StatsCard
                  title="مجموع الديون"
                  value={`${stats.debtsTotal} ل.ل`}
                  icon="💸"
                  color="#f44336"
                />
              </div>
            </section>

            <section className="quick-links-section">
              <h2>الوصول السريع</h2>
              <div className="quick-links-grid">
                {quickLinks.map((link, index) => (
                  <div
                    key={index}
                    className="quick-link-card"
                    onClick={link.action}
                    style={{ backgroundColor: link.color }}
                  >
                    <span className="quick-link-icon">{link.icon}</span>
                    <h3>{link.title}</h3>
                    <p>{link.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="features-section">
              <h2>مميزات النظام</h2>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <span className="feature-icon">{feature.icon}</span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;