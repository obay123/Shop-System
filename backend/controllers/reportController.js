const Report = require('../models/reportSchema');
const SoldItem = require('../models/soldItemSchema');
const Item = require('../models/itemSchema');


// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { soldItems } = req.body;

    let totalAmount = 0;
    const reportSoldItems = [];

    // Populate reportSoldItems with item details and calculate the total amount
    for (const soldItem of soldItems) {
      const item = await Item.findById(soldItem.itemId);
      if (!item) {
        return res.status(404).json({ message: `Item with ID ${soldItem.itemId} not found` });
      }

      const itemTotal = item.price * soldItem.quantitySold;
      totalAmount += itemTotal;

      reportSoldItems.push({
        itemId: soldItem.itemId,
        quantitySold: soldItem.quantitySold,
        total: itemTotal
      });
    }

    const newReport = new Report({ soldItems: reportSoldItems, totalAmount });
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error });
  }
};

// Delete an entire report and its sold items
exports.deleteReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    const report = await Report.findByIdAndDelete(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report and associated sold items deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error });
  }
};

// Get a report by date
exports.getReportByDate = async (req, res) => {
  const { date } = req.params;

  try {
      // Convert the date string into a Date object
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0); // Set time to the start of the day

      // Find the report for the specified date and populate the sold items
      const report = await Report.findOne({ date: targetDate }).populate('soldItems');
      
      if (!report) {
          return res.status(404).json({ message: 'No report found for this date' });
      }

      res.status(200).json(report);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching report', error });
  }
};


