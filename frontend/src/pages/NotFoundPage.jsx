import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';


const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">🥛</div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">عذراً، الصفحة غير موجودة</h2>
        <p className="not-found-message">
          يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو لم تعد متوفرة
        </p>
        <div className="not-found-actions">
          <Button 
            onClick={() => navigate('/')} 
            className="return-home-button"
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </div>
        <div className="not-found-decoration">
          <span className="milk-drop">💧</span>
          <span className="milk-drop">💧</span>
          <span className="milk-drop">💧</span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;