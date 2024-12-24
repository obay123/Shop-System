const Debt = require("../models/debtSchema");
const Item = require("../models/itemSchema");

exports.addDebt = async (req, res) => {
  const shopId = req.shopId;
  if (!shopId) {
    return res.status(404).json({ message: "Shop ID is required but not provided" });
  }
    
  try {
    let { name, items } = req.body;
    if(!name){
      return res.status(404).josn({message:"name is not provided"})
    }
    // Normalize the name: trim and replace multiple spaces with a single space
    name = name.trim().replace(/\s+/g, " ");

    // Check if a debt with the same name already exists in the database for this shop
    const existingDebt = await Debt.findOne({ name, shopId });
    if (existingDebt) {
      return res.status(400).json({ message: `A debt with the name "${name}" already exists for this shop` });
    }

    // Initialize total amount to 0
    let totalAmount = 0;
    const itemsWithDetails = [];

    // Loop through each item in the debt and fetch its details from the Item model
    for (const item of items) {
      const itemData = await Item.findById(item.itemId);
      if (!itemData) {
        return res.status(404).json({ message: `Item with ID ${item.itemId} not found` });
      }

    // Calculate the total cost for the item and add it to the totalAmount
      const itemTotal = itemData.price * item.quantity;
      totalAmount += itemTotal;

      // Push item details to the array (with item name and price)
      itemsWithDetails.push({
        itemId: item.itemId,
        itemName: itemData.name,
        price: itemData.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Create the new debt with calculated totalAmount
    const newDebt = new Debt({
      name,
      amount: totalAmount,
      items: itemsWithDetails,
      shopId,
    });

    const savedDebt = await newDebt.save();
    res.status(201).json(savedDebt);
  } catch (error) {
    res.status(500).json({ message: "Error while adding debt", error });
  }
};

exports.editDebt = async (req, res) => {
  const { id } = req.params;
  const { paidAmount, newItems, name } = req.body; // Include name in the body
  const shopId = req.shopId;

  console.log('Request params:', { id, paidAmount, newItems, name, shopId });

  if (!shopId) {
    return res.status(404).json({ message: "Shop ID is required but not provided" });
  }

  try {
    const debt = await Debt.findById(id);
    if (!debt) {
      return res.status(404).json({ message: "Debt not found" });
    }

    if (debt.shopId.toString() !== shopId.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this debt" });
    }

    // Handle name update
    if (name) {
      debt.name = name;  // Update the name if it's provided
    }

    // Handle paid amount update
    if (paidAmount) {
      if (paidAmount > debt.amount) {
        return res.status(400).json({ message: "Paid amount exceeds the total debt" });
      }
      debt.amount -= paidAmount;

      if (debt.amount === 0) {
        await Debt.findByIdAndDelete(id);
        return res.status(200).json({ message: "Debt fully paid and deleted" });
      }
    }

    // Add new items to debt
    if (newItems && newItems.length > 0) {
      for (const newItem of newItems) {
        if (!newItem.itemId || !newItem.quantity) {
          return res.status(400).json({ 
            message: "Each item must have both itemId and quantity",
            invalidItem: newItem 
          });
        }

        try {
          const itemDetails = await Item.findById(newItem.itemId);
          if (!itemDetails) {
            return res.status(404).json({ 
              message: `Item not found: ${newItem.itemId}` 
            });
          }

          if (itemDetails.shopId.toString() !== shopId.toString()) {
            return res.status(403).json({ 
              message: `Item ${newItem.itemId} does not belong to this shop` 
            });
          }

          const itemTotal = itemDetails.price * newItem.quantity;
          debt.items.push({
            itemId: itemDetails._id,
            quantity: newItem.quantity
          });

          debt.amount += itemTotal;
        } catch (itemError) {
          return res.status(400).json({ 
            message: "Invalid item ID format", 
            itemId: newItem.itemId 
          });
        }
      }
    }

    const updatedDebt = await debt.save();
    const populatedDebt = await Debt.findById(updatedDebt._id).populate('items.itemId');
    res.status(200).json(populatedDebt);

  } catch (error) {
    console.error('Error in editDebt:', error);
    res.status(500).json({ 
      message: "Error updating debt", 
      error: error.message,
    });
  }
};


exports.deleteDebt = async (req, res) => {
  const { id } = req.params;
  const shopId = req.shopId;
  if (!shopId) {
    return res.status(404).json({ message: "Shop ID is required but not provided" });
  }
  try {
    const deletedDebt = await Debt.findOneAndDelete({ _id: id, shopId });
    if (!deletedDebt) {
      return res.status(404).json({ message: "Debt not found" });
    }
    res.status(200).json({ message: "Debt deleted successfully", deletedDebt });
  } catch (error) {
    console.error("Error deleting debt:", error);
    res.status(500).json({ message: "Error deleting debt", error });
  }
};

exports.getDebtByName = async (req, res) => {
  const { name } = req.params; // Extract the name from the route parameter
  const shopId = req.shopId;
  if (!shopId) {
    return res.status(404).json({ message: "Shop ID is required but not provided" });
  }
  try {
    // Find the debt entry by name
    const debt = await Debt.findOne({ name, shopId }).populate("items.itemId", "name price");
    if (!debt) {
      return res.status(404).json({ message: `Debt for ${name} not found` });
    }
    res.status(200).json(debt);
  } catch (error) {
    console.error("Error retrieving debt by name:", error);
    res.status(500).json({ message: "Error retrieving debt", error });
  }
};

exports.getDebts = async (req, res) => {
  const shopId = req.shopId;
  if (!shopId) {
    return res.status(404).json({ message: "Shop ID is required but not provided" });
  }
  try {
    // Fetch all debts from the database
    const debts = await Debt.find({ shopId })
      .populate("items.itemId", "name price") // Populate item details from Item schema
      .sort({ date: -1 }); // Optional: Sort by date (most recent first)

    // If no debts are found
    if (!debts || debts.length === 0) {
      return res.status(404).json({ message: "No debts found" });
    }

    // Return the debts
    res.status(200).json(debts);
  } catch (error) {
    console.error("Error retrieving debts:", error);
    res.status(500).json({ message: "Error retrieving debts", error });
  }
};
