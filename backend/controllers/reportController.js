const Report = require('../models/reportSchema');
const SoldItem = require('../models/soldItemSchema');

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { soldItems } = req.body;

    // Calculate total amount from sold items
    let totalAmount = 0;
    for (const itemId of soldItems) {
      const soldItem = await SoldItem.findById(itemId);
      if (soldItem) {
        totalAmount += soldItem.total;
      }else{
        res.status(500).json({message:'no sold items founds'})
      }
 
    }

    // Create and save the new report
    const newReport = new Report({ soldItems, totalAmount });
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error });
  }
};



// Get a report by date
exports.getReportByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const report = await Report.findOne({ date: new Date(date) }).populate('soldItems');
    if (!report) {
      return res.status(404).json({ message: 'No report found for this date' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error });
  }
};

exports.editReport = async (req, res) => {
    const { reportId } = req.params;
    const { soldItems } = req.body;
  
    try {
      // Find the report
      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Update sold items and recalculate total amount
      report.soldItems = soldItems;
  
      let totalAmount = 0;
      for (const itemId of soldItems) {
        const soldItem = await SoldItem.findById(itemId);
        if (soldItem) {
          totalAmount += soldItem.total;
        }
      }
      report.totalAmount = totalAmount;
  
      // Save the updated report
      const updatedReport = await report.save();
      res.status(200).json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: 'Error updating report', error });
    }
  };
  

// Delete a report
exports.deleteReport = async (req, res) => {
    const { reportId } = req.params;
    try {
      await Report.findByIdAndDelete(reportId);
      res.status(200).json({ message: 'Report deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting report', error });
    }
  };
  

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('soldItem');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};
