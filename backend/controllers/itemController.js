const Item = require('../models/itemSchema')



getItemsByDaysAgo = async (req, res) => {
  try {
    const daysAgo = parseInt(req.query.daysAgo) || 0;
    const startOfDay = new Date();
    startOfDay.setDate(startOfDay.getDate() - daysAgo);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setDate(endOfDay.getDate() - daysAgo);
    endOfDay.setHours(23, 59, 59, 999); 

   
    const items = await Item.find({
      date: {
        $gte: startOfDay, 
        $lt: endOfDay    
      }
    });

    if (!items.length) {
      return res.status(404).json({ message: `No items found for ${daysAgo} days ago` });
    }
    res.status(200).json(items);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


addItem = async (req,res)=>{
    const {name ,price ,quantitySold} = req.body;
    try{
        const newItem = new Item({name ,price ,quantitySold})
        const savedItem = await newItem.save()
        res.status(201).json(savedItem)

    }catch(error){
        res.status(500).json({message:'error while adding item'})
    }

}

editItem  = async(req,res)=>{
    const {id} =req.params;
    try{
        const updatedItem = await Item.findByIdAndUpdate(id, req.body , {new : true})
        res.status(200).json(updatedItem)
    }catch(error){
        res.status(500).json({message:'error updating the item'})
    }
}

deleteItem = async(req,res)=>{
    const {id} = req.params
    try{
     await Item.findByIdAndDelete(id)
    res.status(200).json({message:'item deleted'})
    }catch(error){
        res.status(500).json({message:'error while deleting the item'})
    }
}



module.exports = {
    getItemsByDaysAgo,
    addItem,
    editItem,
    deleteItem
}