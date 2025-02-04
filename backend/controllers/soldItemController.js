const Report = require('../models/reportSchema');
const Item = require('../models/itemSchema');

// Add a sold item to an existing report
exports.addSoldItemToReport = async (req, res) => {
  const { reportId } = req.params;
  const { itemId, quantitySold } = req.body;
  const shopId = req.shopId

  if (!shopId) {
    return res.status(400).json({ message: 'Shop ID is required.' });
  }

  try {
    // Find the report
     const report = await Report.findOne({ _id: reportId, shopId });
    if (!report) {
      return res.status(404).json({ message: `Report with ID ${reportId} not found` });
    }

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: `Item with ID ${itemId} not found` });
    }

    // Calculate the total for the sold item
    const itemTotal = item.price * quantitySold;

    // Create a new sold item document
    const newSoldItem = {
      itemId: item._id,
      quantitySold,
      total: itemTotal,
    };

    // Add the new sold item to the report's soldItems array
    report.soldItems.push(newSoldItem);

    // Update the total amount in the report
    report.totalAmount += itemTotal;

    // Save the updated report
    await report.save();

    res.status(201).json({ message: 'Sold item added to report', report });
  } catch (error) {
    console.error("Error adding sold items to report:", error);
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

    // Update the total amount in the report
    report.totalAmount -= soldItem.total;  // Deduct old total
    soldItem.quantitySold = quantitySold;
    soldItem.total = item.price * quantitySold;
    report.totalAmount += soldItem.total;  // Add new total

    // Save the updated report
    const updatedReport = await report.save();
    res.status(200).json({ message: 'Sold item updated in report', report: updatedReport });
  } catch (error) {
    console.error("Error updating sold item in report:", error);
    res.status(500).json({ message: 'Error updating sold item in report', error });
  }
};

// Delete a single sold item from a report
exports.deleteSingleSoldItemFromReport = async (req, res) => {
  try {
    const { reportId, soldItemId } = req.params;
    const shopId = req.shopId;

    const report = await Report.findOne({ _id: reportId, shopId });
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    const soldItem = report.soldItems.id(soldItemId);
    if (!soldItem) {
      return res.status(404).json({ message: 'Sold item not found.' });
    }

    report.totalAmount -= soldItem.total;
    soldItem.remove();

    const updatedReport = await report.save();
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sold item.', error });
  }
};
