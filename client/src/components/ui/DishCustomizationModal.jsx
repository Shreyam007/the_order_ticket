import React, { useState } from 'react';
import { X, Flame } from 'lucide-react';
import QtyStepper from './QtyStepper';

export default function DishCustomizationModal({ dish, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!dish) return null;

  const toggleAddOn = (addOn) => {
    if (selectedAddOns.some((a) => a.name === addOn.name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addOn.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + (a.price || 0), 0);
  const totalPrice = (dish.price + addOnTotal) * quantity;

  const handleAdd = () => {
    onAdd(dish, quantity, selectedAddOns, specialInstructions);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-none">
      <div className="bg-surface-container-lowest border-2 border-primary w-full max-w-md clip-zigzag p-6 relative shadow-none animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-primary pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 border flex items-center justify-center rounded-sm ${
                  dish.isVeg ? 'border-green-700' : 'border-red-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-green-700' : 'bg-red-700'}`}></span>
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-primary">{dish.name}</h3>
            </div>
            <p className="font-mono text-xs text-on-surface-variant mt-1">₹{dish.price} BASE PRICE</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-high border border-outline-variant">
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Add-ons list */}
        {dish.addOns && dish.addOns.length > 0 && (
          <div className="mb-4">
            <h4 className="font-display text-xs font-bold uppercase text-on-surface-variant mb-2">CUSTOMIZE ADD-ONS</h4>
            <div className="flex flex-col gap-2">
              {dish.addOns.map((addOn) => {
                const isSelected = selectedAddOns.some((a) => a.name === addOn.name);
                return (
                  <label
                    key={addOn.name}
                    className={`flex items-center justify-between p-2.5 border border-outline-variant cursor-pointer transition-colors ${
                      isSelected ? 'bg-secondary-container/20 border-primary font-bold' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAddOn(addOn)}
                        className="w-4 h-4 border-2 border-primary text-primary focus:ring-0 rounded-none"
                      />
                      <span className="font-body text-sm text-primary">{addOn.name}</span>
                    </div>
                    <span className="font-mono text-xs text-primary">+₹{addOn.price}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Special instructions */}
        <div className="mb-4">
          <label className="block font-display text-xs font-bold uppercase text-on-surface-variant mb-1">
            SPECIAL KITCHEN INSTRUCTIONS
          </label>
          <textarea
            rows={2}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g. Extra crispy, sauce on the side..."
            className="w-full border border-outline-variant p-2 font-body text-xs text-primary outline-none focus:border-primary resize-none"
          ></textarea>
        </div>

        {/* Quantity & Add Action */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-primary">
          <QtyStepper value={quantity} onChange={(q) => setQuantity(q)} />
          <button
            onClick={handleAdd}
            className="bg-secondary-container text-on-secondary-container border-2 border-primary px-6 py-2.5 font-display text-sm font-bold uppercase hover:bg-primary hover:text-white transition-colors"
          >
            ADD TO CART — ₹{totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
