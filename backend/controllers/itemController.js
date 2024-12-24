const Item = require('../models/itemSchema');


//get all items
exports.getItems = async (req, res) => {
  try {
    const shopId = req.shopId; // Extracted from authMiddleware

    if (!shopId) {
      return res.status(400).json({ message: 'shopId is required but not provided' });
    }
    const items = await Item.find()
    if (items.length === 0) {
      return res.status(404).json({ message: "لم يتم العثور على اي عناصر" })
    }
    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({ message: 'error while fetching items', error })
  }
}
// Add a new item
exports.addItem = async (req, res) => {
  const shopId = req.shopId;
  if (!shopId) {
    return res.status(400).json({ message: 'shopId is required but not provided' });
  }
  const { name, price, image } = req.body;
  //check if the item does exist in the db

  try {
    const isExist = await Item.findOne({ name, shopId });
    if (isExist) {
      return res.status(409).json({ message: "Item already exists in the database" }); 
    }
    const newItem = new Item({
      name,
      price,
      image,
      shopId,
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error while adding item', error });
  }
};

//edit items
exports.editItem = async (req, res) => {
  const { id } = req.params;
  const shopId = req.shopId; // Extracted from authMiddleware

  if (!shopId) {
    return res.status(400).json({ message: 'shopId is required but not provided' });
  }
  try {
    // Find item by ID and update
    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error while updating the item', error });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  const shopId = req.shopId; // Extracted from authMiddleware

  if (!shopId) {
    return res.status(400).json({ message: 'shopId is required but not provided' });
  }
  try {
    // Find the item by ID and delete it
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error while deleting the item', error });
  }
};
