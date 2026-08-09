import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ArrowRight, Scissors } from 'lucide-react';
import api from '../../api/client';
import SideNavBar from '../../components/ui/SideNavBar';

export default function MenuManagement() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('STARTERS');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [spiceLevel, setSpiceLevel] = useState(0);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get('/restaurants');
      if (res.data.restaurants && res.data.restaurants.length > 0) {
        const restId = res.data.restaurants[0]._id;
        const menuRes = await api.get(`/restaurants/${restId}/menu`);
        setDishes(menuRes.data.dishes || []);
      }
    } catch (err) {
      console.error('Error fetching menu for management:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddPanel = () => {
    setEditingDish(null);
    setName('');
    setPrice('');
    setCategory('STARTERS');
    setDescription('');
    setImage('');
    setIsVeg(true);
    setSpiceLevel(0);
    setPanelOpen(true);
  };

  const openEditPanel = (dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setPrice(dish.price);
    setCategory(dish.category || 'STARTERS');
    setDescription(dish.description || '');
    setImage(dish.image || '');
    setIsVeg(dish.isVeg);
    setSpiceLevel(dish.spiceLevel || 0);
    setPanelOpen(true);
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        price: Number(price),
        category,
        description,
        image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        isVeg,
        spiceLevel
      };

      if (editingDish) {
        const res = await api.put(`/dishes/${editingDish._id}`, payload);
        setDishes((prev) => prev.map((d) => (d._id === editingDish._id ? res.data.dish : d)));
      } else {
        const res = await api.post('/dishes', payload);
        setDishes((prev) => [...prev, res.data.dish]);
      }
      setPanelOpen(false);
    } catch (err) {
      console.error('Error saving dish:', err);
    }
  };

  const handleToggleAvailability = async (dishId) => {
    try {
      setDishes((prev) =>
        prev.map((d) => (d._id === dishId ? { ...d, isAvailable: !d.isAvailable } : d))
      );
      await api.patch(`/dishes/${dishId}/toggle-availability`);
    } catch (err) {
      console.error('Error toggling availability:', err);
      fetchMenu();
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Are you sure you want to delete this dish ticket?')) return;
    try {
      setDishes((prev) => prev.filter((d) => d._id !== dishId));
      await api.delete(`/dishes/${dishId}`);
    } catch (err) {
      console.error('Error deleting dish:', err);
      fetchMenu();
    }
  };

  const categories = ['STARTERS', 'MAINS', 'DESSERTS'];

  return (
    <div className="bg-surface-container-low text-primary font-body min-h-screen flex overflow-hidden">
      <SideNavBar />

      <main className="md:ml-64 flex-1 h-screen flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="flex justify-between items-center px-6 h-16 bg-surface-container-lowest border-b-2 border-primary shrink-0 sticky top-0 z-40">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-primary">
            MENU MANAGEMENT
          </h2>
          <button
            onClick={openAddPanel}
            className="border-2 border-primary bg-primary text-white font-display text-xs font-bold uppercase px-4 py-2 hover:bg-secondary-container hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> ADD ITEM
          </button>
        </header>

        {/* Menu Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {categories.map((cat) => {
            const categoryDishes = dishes.filter(
              (d) => (d.category || 'STARTERS').toUpperCase() === cat
            );

            return (
              <section key={cat} className="space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t-2 border-dashed border-outline-variant"></div>
                  <span className="absolute bg-surface-container-low px-4 font-display text-sm font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                    <Scissors className="w-4 h-4 rotate-90" /> {cat}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {categoryDishes.map((dish) => (
                    <div
                      key={dish._id}
                      className={`bg-surface-container-lowest border-2 border-primary p-4 flex flex-col sm:flex-row items-center gap-4 relative clip-zigzag pb-6 ${
                        !dish.isAvailable ? 'opacity-60' : ''
                      }`}
                    >
                      <span
                        className={`absolute top-0 right-0 font-display text-[10px] uppercase font-bold px-2 py-0.5 border-b border-l border-primary ${
                          dish.isVeg ? 'bg-secondary-container text-on-secondary-container' : 'bg-error text-white'
                        }`}
                      >
                        {dish.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>

                      <img
                        src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                        alt={dish.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-16 h-16 object-cover border border-primary shrink-0"
                      />

                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-display text-lg font-bold text-primary">{dish.name}</h3>
                        <p className="font-mono text-xs text-on-surface-variant line-clamp-1">
                          {dish.description}
                        </p>
                      </div>

                      <div className="font-mono text-base font-bold text-primary shrink-0">
                        ₹{dish.price}
                      </div>

                      <div className="flex items-center gap-2 border border-primary p-1 bg-surface-container-low shrink-0">
                        <button
                          onClick={() => handleToggleAvailability(dish._id)}
                          className={`font-display text-xs font-bold uppercase px-3 py-1 transition-colors ${
                            dish.isAvailable
                              ? 'bg-herb-green text-white'
                              : 'text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          {dish.isAvailable ? 'IN STOCK' : 'SOLD OUT'}
                        </button>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => openEditPanel(dish)}
                          className="p-2 border border-primary text-primary hover:bg-surface-container-high"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish._id)}
                          className="p-2 border border-primary text-error hover:bg-error-container"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Slide-out Add/Edit Item Panel */}
        <aside
          className={`fixed top-0 right-0 h-full w-96 bg-surface-container-lowest border-l-2 border-primary transition-transform duration-300 z-50 flex flex-col shadow-2xl ${
            panelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <header className="flex justify-between items-center p-6 border-b-2 border-primary bg-surface-container-high">
            <h3 className="font-display text-lg font-bold text-primary uppercase">
              {editingDish ? 'EDIT ITEM TICKET' : 'NEW ITEM TICKET'}
            </h3>
            <button onClick={() => setPanelOpen(false)} className="text-primary hover:text-error">
              <X className="w-5 h-5" />
            </button>
          </header>

          <form onSubmit={handleSaveDish} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
              <div>
                <label className="block font-display text-xs uppercase font-bold text-on-surface-variant mb-1">
                  ITEM NAME
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Truffle Fries"
                  className="w-full border border-outline-variant p-2 bg-surface-container-low focus:border-2 focus:border-primary outline-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block font-display text-xs uppercase font-bold text-on-surface-variant mb-1">
                    PRICE (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="250"
                    className="w-full border border-outline-variant p-2 bg-surface-container-low focus:border-2 focus:border-primary outline-none"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block font-display text-xs uppercase font-bold text-on-surface-variant mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-outline-variant p-2 bg-surface-container-low focus:border-2 focus:border-primary outline-none"
                  >
                    <option value="STARTERS">STARTERS</option>
                    <option value="MAINS">MAINS</option>
                    <option value="DESSERTS">DESSERTS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-display text-xs uppercase font-bold text-on-surface-variant mb-1">
                  IMAGE URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-outline-variant p-2 bg-surface-container-low focus:border-2 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-display text-xs uppercase font-bold text-on-surface-variant mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingredients and description..."
                  className="w-full border border-outline-variant p-2 bg-surface-container-low focus:border-2 focus:border-primary outline-none resize-none"
                ></textarea>
              </div>

              <div className="border-t border-dashed border-outline-variant pt-3 flex justify-between items-center">
                <span className="font-display text-xs font-bold uppercase text-primary">DIETARY TYPE</span>
                <div className="flex border border-primary">
                  <button
                    type="button"
                    onClick={() => setIsVeg(true)}
                    className={`px-3 py-1 font-display text-xs font-bold uppercase ${
                      isVeg ? 'bg-secondary-container text-on-secondary-container' : 'bg-white text-outline'
                    }`}
                  >
                    VEG
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVeg(false)}
                    className={`px-3 py-1 font-display text-xs font-bold uppercase ${
                      !isVeg ? 'bg-error text-white' : 'bg-white text-outline'
                    }`}
                  >
                    NON-VEG
                  </button>
                </div>
              </div>
            </div>

            <footer className="p-4 border-t-2 border-primary bg-surface-container-high">
              <button
                type="submit"
                className="w-full bg-secondary-container text-on-secondary-container border-2 border-primary py-3 font-display text-sm font-bold uppercase hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span>SAVE ITEM TICKET</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </footer>
          </form>
        </aside>
      </main>
    </div>
  );
}
