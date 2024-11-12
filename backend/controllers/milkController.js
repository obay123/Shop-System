const Milk = require('../models/milkSchema')

exports.getMilk = async (req, res) => {
    try {
        const milks = await Milk.find()
        if (!milks) {
            return res.status(404).json({ message: 'no Milk found' })
        }
        res.status(200).json(milks)
    } catch (error) {
        res.status(500).json({ message: 'error while fetching milks', error })
    }
}


exports.addMilk = async (req, res) => {
    const { quantity, price, date } = req.body
    if (!quantity) {
        return res.status(500).json({ message: 'no qunatity was provided' })
    }
    try {
        const newMilk = new Milk({
            date,
            price,
            quantity
        });
        const savedMilk = await newMilk.save()
        res.status(200).json({ savedMilk })
    } catch (error) {
        res.status(500).json({ message: 'error while adding milk', error })
    }
}


exports.editMilk = async (res, req) => {
    const { id } = req.params
    try {
        const updatedMilk = await Milk.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedMilk) {
            return res.status(404).json({ message: `no milk was found with id = ${id}` })
        }
        res.status(200).json(updatedMilk)
    } catch (error) {
        res.status(500).json({ message: 'error while editing milk', error })
    }
}

exports.deleteMilk = async (res, req) => {
    const { id } = req.params
    try {
        const deleteMilk = await Milk.findByIdAndDelete(id)
        if (!deleteMilk) {
            return (404).json({ message: 'milk not found' })
        }
        res.status(200).json({ message: 'milk deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error while deleting the milk', error });
    }
}


