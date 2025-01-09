import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemsApi } from '../api/itemsApi';
import { useReportsApi } from '../api/reportsApi';
import Button from '../components/Button';
import Card from '../components/Card';
import Notification from '../components/Notification';


const HomePage = () => {
  const navigate = useNavigate();
  const { getItems } = useItemsApi();
  const { getReports } = useReportsApi();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalReports: 0,
    todayRevenue: 0,
    lowStockItems: 0
  });
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [items, reports] = await Promise.all([
          getItems(),
          getReports()
        ]);

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate stats
        const todayReport = reports.find(report => 
          report.date.split('T')[0] === today
        );

        setStats({
          totalItems: items.length,
          totalReports: reports.length,
          todayRevenue: todayReport ? todayReport.totalRevenue : 0,
          lowStockItems: items.filter(item => item.price < 10).length // Example threshold
        });

      } catch (error) {
        showNotification('خطأ في تحميل البيانات', 'error');
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
      title: "عرض الديون" ,
      description :'عرض جميع ديون الزبائن',
      icon: '📈',
      action: () => navigate('/debts'),
      color: '#FF9800'
    }
  ];

  return (
    <div className="home-container">
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <section className="welcome-section">
        <div className="welcome-content">
          <h1>مرحباً بك في نظام إدارة محل الألبان</h1>
          <p>نظام متكامل لإدارة المخزون وتتبع المبيعات</p>
        </div>
      </section>

      {loading ? (
        <div className="loading">جاري تحميل البيانات...</div>
      ) : (
        <>
          <section className="stats-section">
            <div className="stats-grid">
              <Card
                title="إجمالي المنتجات"
                value={stats.totalItems}
                icon="📦"
                color="#4CAF50"
              />
              <Card
                title="تقارير المبيعات"
                value={stats.totalReports}
                icon="📊"
                color="#2196F3"
              />
              <Card
                title="مبيعات اليوم"
                value={`${stats.todayRevenue} ل.ل`}
                icon="💰"
                color="#FF9800"
              />
              <Card
                title="منتجات منخفضة"
                value={stats.lowStockItems}
                icon="⚠️"
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
              <div className="feature-card">
                <span className="feature-icon">📊</span>
                <h3>تقارير المبيعات</h3>
                <p>تتبع مبيعاتك اليومية وإنشاء تقارير تفصيلية</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📦</span>
                <h3>إدارة المخزون</h3>
                <p>تتبع المنتجات وإدارة المخزون بكفاءة</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📱</span>
                <h3>واجهة سهلة</h3>
                <p>واجهة مستخدم بسيطة وسهلة الاستخدام</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🔍</span>
                <h3>بحث متقدم</h3>
                <p>بحث سريع عن المنتجات والتقارير</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;