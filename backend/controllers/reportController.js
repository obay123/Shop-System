const Report = require('../models/reportSchema');
const Item = require('../models/itemSchema');

exports.updateReport = async (req, res) => {
  try {
      const { id } = req.params;
      const { date, soldItems, totalAmount } = req.body;

      // Find and update the report
      const updatedReport = await Report.findByIdAndUpdate(
          id,
          {
              date,
              soldItems,
              totalAmount
          },
          { 
              new: true, // Return the updated document
              runValidators: true // Run schema validators
          }
      ).populate('soldItems.itemId'); // Populate the item details

      if (!updatedReport) {
          return res.status(404).json({ message: "Report not found" });
      }

      res.status(200).json(updatedReport);

  } catch (error) {
      console.error('Error updating report:', error);
      res.status(500).json({ 
          message: "Failed to update report", 
          error: error.message 
      });
  }
};


exports.createReport = async (req, res) => {
  try {
    const { soldItems = [] } = req.body;
    const shopId = req.shopId;

    if (!shopId) {
      return res.status(400).json({ message: 'shopId is required but not provided' });
    }

    // Get today's start and end dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find report for today using date range
    const existingReport = await Report.findOne({
      shopId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingReport) {
      return res.status(400).json({ 
        message: 'تقرير لهذا اليوم موجود بالفعل' 
      });
    }

    let totalAmount = 0;
    const reportSoldItems = [];

    if (soldItems.length > 0) {
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
          total: itemTotal,
        });
      }
    }

    const newReport = new Report({
      shopId,
      soldItems: reportSoldItems,
      totalAmount,
      date: new Date().toISOString().split('T')[0]  
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ 
      message: 'Error creating report', 
      error: error.message || error.toString() 
    });
  }
};

// Delete an entire report and its sold items
exports.deleteReport = async (req, res) => {
  const { reportId } = req.params;

  const shopId = req.shopId; // Extracted from authMiddleware
  if (!shopId) {
    return res.status(400).json({ message: 'shopId is required but not provided' });
  }
  
  try {
    const report = await Report.findOneAndDelete({ _id: reportId, shopId })
    if (!report) {
      return res.status(404).json({ message: 'التقرير ليس موجود' });
    }

    res.status(200).json({ message: 'تم حذف التقرير بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف التقرير', error });
  }
};

exports.getReports = async (req,res) => {
  const shopId = req.shopId; // Extracted from authMiddleware
  if (!shopId) {
    return res.status(400).json({ message: 'shopId is required but not provided' });
  }
  try{
    const reports = await Report.find({ shopId }).populate('soldItems.itemId');
    if (reports.length === 0) {
      return res.status(404).json({ message: "لم يتم العثور على تقارير" })
    }
    res.status(200).json(reports)
  }catch(error){
    return res.status(500).json({message: error.message || 'خطأ في تحميل التقارير'})
  }
}


//get report by id i dont know why i am adding so much functionality here : )
exports.getReportById = async (req, res) => {
  const { id } = req.params;
  const shopId = req.shopId; // Extracted from authMiddleware
  if (!shopId) {
    return res.status(400).json({ message: 'shopId is required but not provided' });
  }
  try {
      const report = await Report.findById(id).populate('soldItems.itemId');
      if (!report) {
          return res.status(404).json({ message: 'Report not found' });
      }
      res.status(200).json(report);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching report', error });
  }
};

// Get a report by date
exports.getReportByDate = async (req, res) => {
  const { date } = req.params;
  const shopId = req.shopId; // Extracted from authMiddleware
  if (!shopId) {
    return res.status(400).json({ message: 'shopId is required but not provided' });
  }
  try {
    // Parse the date parameter
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Start of the day
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1); // Start of the next day
    // Find reports within the date range
    const reports = await Report.find({
      shopId,
      date: { $gte: targetDate, $lt: nextDate }
    }).populate('soldItems.itemId');
    
    if (reports.length === 0) {
      return res.status(404).json({ message: 'ليس هنالك تقرير بهذا التاريخ' });
    }
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحميل التقرير', error });
  }
};


