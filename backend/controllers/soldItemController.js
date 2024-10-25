const SoldItem = require('../models/soldItemSchema');
const Report = require('../models/reportSchema');
const Item = require('../models/itemSchema');

// Add sold items to an existing report
exports.addSoldItemsToReport = async (req, res) => {
    const { reportId } = req.params;
    const { soldItems } = req.body;
  
    try {
      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Add new sold items and calculate the total
      for (const soldItem of soldItems) {
        const item = await Item.findById(soldItem.itemId);
        if (!item) {
          return res.status(404).json({ message: `Item with ID ${soldItem.itemId} not found` });
        }
  
        const itemTotal = item.price * soldItem.quantitySold;
        report.totalAmount += itemTotal;
  
        report.soldItems.push({
          itemId: soldItem.itemId,
          quantitySold: soldItem.quantitySold,
          total: itemTotal
        });
      }
  
      const updatedReport = await report.save();
      res.status(200).json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: 'Error adding sold items to report', error });
    }
  };
  

  // Edit a single sold item in a report
exports.editSingleSoldItemInReport = async (req, res) => {
    const { reportId, soldItemId } = req.params;
    const { quantitySold } = req.body;
  
    try {
      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      const soldItemIndex = report.soldItems.findIndex(item => item._id.toString() === soldItemId);
      if (soldItemIndex === -1) {
        return res.status(404).json({ message: 'Sold item not found in report' });
      }
  
      const soldItem = report.soldItems[soldItemIndex];
      const item = await Item.findById(soldItem.itemId);
  
      report.totalAmount -= soldItem.total;  // Deduct old total
      soldItem.quantitySold = quantitySold;
      soldItem.total = item.price * quantitySold;
      report.totalAmount += soldItem.total;  // Add new total
  
      const updatedReport = await report.save();
      res.status(200).json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: 'Error updating sold item in report', error });
    }
  };
  

  // Delete a single sold item from a report
exports.deleteSingleSoldItemFromReport = async (req, res) => {
    const { reportId, soldItemId } = req.params;
  
    try {
      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      const soldItemIndex = report.soldItems.findIndex(item => item._id.toString() === soldItemId);
      if (soldItemIndex === -1) {
        return res.status(404).json({ message: 'Sold item not found in report' });
      }
  
      const soldItem = report.soldItems[soldItemIndex];
      report.totalAmount -= soldItem.total;  // Deduct item total from report total
      report.soldItems.splice(soldItemIndex, 1);  // Remove sold item from array
  
      const updatedReport = await report.save();
      res.status(200).json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting sold item from report', error });
    }
  };
  