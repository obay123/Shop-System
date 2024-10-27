const Debt = require('../models/debtSchema');
const Item = require('../models/itemSchema'); 

// Add a new debt entry
exports.addDebt = async (req, res) => {
    const { name, items } = req.body;

    try {
        // Calculate the total amount for the debt
        let totalAmount = 0;
        const debtItems = [];

        for (const item of items) {
            const itemDetails = await Item.findById(item.itemId); // Fetch item details
            if (!itemDetails) {
                return res.status(404).json({ message: `Item with ID ${item.itemId} not found` });
            }

            // Calculate total for this item
            const itemTotal = itemDetails.price * item.quantity;
            totalAmount += itemTotal;

            // Add item details to debtItems array
            debtItems.push({
                itemName: itemDetail,
                price: itemDetails.price,
                quantity: item.quantity
            });
        }

        // Create a new debt entry with items and total amount
        const newDebt = new Debt({
            name,
            amount: totalAmount,
            items: debtItems
        });

        const savedDebt = await newDebt.save();
        res.status(201).json(savedDebt);
    } catch (error) {
        res.status(500).json({ message: 'Error while adding debt', error });
    }
};

// Get all debts
exports.getDebts = async (req, res) => {
    try {
        const debts = await Debt.find();
        if (debts.length === 0) {
            return res.status(404).json({ message: "No debts found" });
        }
        res.status(200).json(debts);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching debts', error });
    }
};

// Delete a specific debt
exports.deleteDebt = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDebt = await Debt.findByIdAndDelete(id);
        if (!deletedDebt) {
            return res.status(404).json({ message: 'Debt not found' });
        }
        res.status(200).json({ message: 'Debt deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error while deleting the debt', error });
    }
};
