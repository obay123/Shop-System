const Item = require('../models/itemSchema');

//get all items
exports.getItems = async(req,res)=>{
  try{
  const items = await Items.find()
  if(items.length===0){
    return res.status(404).json({message:"no items found"})
  }
  res.status(200).json(items)
  }catch(error){
    res.status(500).json({message:'error while fetching items',error})
  }
}
// Add a new item
exports.addItem = async (req, res) => {
    const { name, price, image } = req.body;

    try {
        // Create a new item
        const newItem = new Item({
            name,
            price,
            image // URL of the image (optional)
        });

        // Save the item to the database
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error while adding item', error });
    }
};

// Edit an existing item
exports.editItem = async (req, res) => {
    const { id } = req.params;

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
