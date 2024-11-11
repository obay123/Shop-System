const Milk = require('../models/milkSchema');

exports.getMilk = async (req, res) => {
    try {
        const milks = await Milk.find();
        if (!milks) {
            return res.status(404).json({ message: 'No milk entries found' });
        }
        res.status(200).json(milks);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching milk entries', error });
    }
};

exports.addMilk = async (req, res) => {
    const { quantity, price, date } = req.body;
    if (!quantity) {
        return res.status(400).json({ message: 'Quantity is required' });
    }
    try {
        const newMilk = new Milk({
            date,
            price,
            quantity
        });
        const savedMilk = await newMilk.save();
        res.status(201).json(savedMilk);
    } catch (error) {
        res.status(500).json({ message: 'Error while adding milk entry', error });
    }
};

exports.editMilk = async (req, res) => { 
    const { id } = req.params;
    try {
        const updatedMilk = await Milk.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMilk) {
            return res.status(404).json({ message: `No milk entry found with id = ${id}` });
        }
        res.status(200).json(updatedMilk);
    } catch (error) {
        res.status(500).json({ message: 'Error while editing milk entry', error });
    }
};

exports.deleteMilk = async (req, res) => { 
    const { id } = req.params;
    try {
        const deletedMilk = await Milk.findByIdAndDelete(id);
        if (!deletedMilk) {
            return res.status(404).json({ message: 'Milk entry not found' });
        }
        res.status(200).json({ message: 'Milk entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error while deleting the milk entry', error });
    }
};
