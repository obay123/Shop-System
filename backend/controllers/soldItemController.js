const SoldItem = require('../models/soldItemSchema');
const Item = require('../models/itemSchema');

exports.getSoldItemsByDaysAgo = async (req, res) => {
    try {
      const daysAgo = parseInt(req.query.daysAgo) || 0;
      const startOfDay = new Date();
      startOfDay.setDate(startOfDay.getDate() - daysAgo);
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date();
      endOfDay.setDate(endOfDay.getDate() - daysAgo);
      endOfDay.setHours(23, 59, 59, 999);
  
      const soldItems = await SoldItem.find({
        date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });
  
      if (!soldItems.length) {
        return res.status(404).json({ message: `No sold items found for ${daysAgo} days ago` });
      }
      res.status(200).json(soldItems);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sold items', error });
    }
  };
  

// Add a sold item
exports.addSoldItem = async (req, res) => {
    const { itemId, quantitySold, date } = req.body;

    try {
        // Fetch the item by its ID to get the price
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Calculate the total price based on the item's price and quantity sold
        const total = item.price * quantitySold;

        // Create a new sold item record
        const newSoldItem = new SoldItem({
            item: itemId,
            quantitySold,
            total,
            date: date || new Date() // Set to today if not provided
        });

        // Save the sold item to the database
        const savedSoldItem = await newSoldItem.save();
        res.status(201).json(savedSoldItem);
    } catch (error) {
        res.status(500).json({ message: 'Error while adding sold item', error });
    }
};

// Edit an existing sold item
exports.editSoldItem = async (req, res) => {
    const { id } = req.params;
    const { itemId, quantitySold } = req.body;

    try {
        // Fetch the new item by ID (if it's changed) to get the updated price
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Calculate the new total price
        const total = item.price * quantitySold;

        // Update the sold item
        const updatedSoldItem = await SoldItem.findByIdAndUpdate(
            id,
            { item: itemId, quantitySold, total },
            { new: true }
        );

        if (!updatedSoldItem) {
            return res.status(404).json({ message: 'Sold item not found' });
        }

        res.status(200).json(updatedSoldItem);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating sold item', error });
    }
};

// Delete a sold item
exports.deleteSoldItem = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the sold item by ID and delete it
        const deletedSoldItem = await SoldItem.findByIdAndDelete(id);

        if (!deletedSoldItem) {
            return res.status(404).json({ message: 'Sold item not found' });
        }

        res.status(200).json({ message: 'Sold item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error while deleting sold item', error });
    }
};
