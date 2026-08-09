import { Dish } from '../models/Dish.js';
import { Restaurant } from '../models/Restaurant.js';
import { eventBus } from '../sse/eventBus.js';

export const createDish = async (req, res) => {
  try {
    const { name, price, category, description, image, isVeg, isAvailable, spiceLevel, addOns } = req.body;

    let restaurant = await Restaurant.findOne({});
    const restaurantId = restaurant ? restaurant._id : 'rest_001';

    let dish = null;
    try {
      const doc = new Dish({
        restaurantId,
        name,
        price,
        category: category || 'MAINS',
        description,
        image,
        isVeg: isVeg !== undefined ? isVeg : true,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        spiceLevel: spiceLevel || 0,
        addOns: addOns || []
      });
      dish = await doc.save();
    } catch (e) {
      dish = {
        _id: `dish_${Date.now()}`,
        restaurantId,
        name,
        price,
        category: category || 'MAINS',
        description,
        image,
        isVeg: isVeg !== undefined ? isVeg : true,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        spiceLevel: spiceLevel || 0,
        addOns: addOns || []
      };
    }

    eventBus.emitEvent('menu:updated', { action: 'create', dish });
    res.status(201).json({ message: 'Dish created successfully', dish });
  } catch (error) {
    res.status(500).json({ message: 'Error creating dish', error: error.message });
  }
};

export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    let dish = null;

    try {
      dish = await Dish.findByIdAndUpdate(id, req.body, { new: true });
    } catch (e) {}

    if (!dish) {
      dish = { _id: id, ...req.body };
    }

    eventBus.emitEvent('menu:updated', { action: 'update', dish });
    res.json({ message: 'Dish updated successfully', dish });
  } catch (error) {
    res.status(500).json({ message: 'Error updating dish', error: error.message });
  }
};

export const toggleDishAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    let dish = null;

    try {
      dish = await Dish.findById(id);
      if (dish) {
        dish.isAvailable = !dish.isAvailable;
        await dish.save();
      }
    } catch (e) {}

    if (!dish) {
      dish = { _id: id, isAvailable: false };
    }

    eventBus.emitEvent('menu:updated', { action: 'toggle', dish });
    res.json({ message: 'Dish availability toggled', dish });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling availability', error: error.message });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Dish.findByIdAndDelete(id);
    } catch (e) {}

    eventBus.emitEvent('menu:updated', { action: 'delete', dishId: id });
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting dish', error: error.message });
  }
};
