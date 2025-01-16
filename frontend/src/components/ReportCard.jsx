import React from 'react';
import Button from '../components/Button';

const ReportCard = ({ report, onView, onDelete }) => {
  const date = new Date(report.date).toLocaleDateString();
  
  return (
    <div className="card">
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">تقرير : {date}</h3>
        </div>
        
        {/* <div className="card-info">
          <div className="info-row">
            <span className="info-label">المجموع العام :</span>
            <span className="card-value">{report.totalAmount}ل.ل</span>
          </div> */}
          
          <div className="card-info">
          <div className="info-row">
            <span className="info-label">المجموع الشامل :</span>
            <span className="card-value">{(report.debtPaid)+(report.totalAmount)||report.totalAmount}ل.ل</span>
          </div>
          <div className="info-row">
            <span className="info-label">العناصر التي بيعت</span>
            <span className="card-value">{report.soldItems.length}</span>
          </div>
        </div>
        <div className="card-actions">
          <Button 
            onClick={() => onView(report.date.slice(0, 10))}
            className="btn btn-secondary"
          >
            عرض التفاصيل
          </Button>
          <Button 
            onClick={() => onDelete(report._id)}
            variant='danger'
          >
            مسح
          </Button>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ReportCard;