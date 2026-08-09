import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Flame, Plus, Paperclip, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { useCart } from '../../context/CartContext';
import QtyStepper from '../../components/ui/QtyStepper';
import DishCustomizationModal from '../../components/ui/DishCustomizationModal';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDishForCustomization, setSelectedDishForCustomization] = useState(null);

  const { cartItems, addToCart, updateQuantity, cartItemsCount, subtotal } = useCart();

  useEffect(() => {
    fetchRestaurantDetail();
  }, [id]);

  const fetchRestaurantDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/restaurants/${id}`);
      setRestaurant(res.data.restaurant);
      setCategories(res.data.categories || []);
      if (res.data.categories && res.data.categories.length > 0) {
        setActiveCategory(res.data.categories[0].name);
      }
    } catch (err) {
      console.error('Error fetching restaurant detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCartQuantityForDish = (dishId) => {
    return cartItems
      .filter((item) => item.dish._id === dishId)
      .reduce((acc, item) => acc + item.quantity, 0);
  };

  const handleAddClick = (dish) => {
    if (dish.addOns && dish.addOns.length > 0) {
      setSelectedDishForCustomization(dish);
    } else {
      addToCart(dish, 1, [], '');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center font-mono text-sm text-on-surface-variant">
        LOADING RESTAURANT MENU TICKET...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-surface-container-lowest p-8 border-2 border-primary clip-zigzag max-w-md">
          <h2 className="font-display text-2xl font-bold uppercase mb-2">RESTAURANT NOT FOUND</h2>
          <button onClick={() => navigate('/')} className="font-display text-xs uppercase bg-primary text-white px-4 py-2 mt-4 font-bold">
            BACK TO DISCOVER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low min-h-screen font-body text-on-surface pb-32">
      {/* Header Section */}
      <header className="relative bg-surface-container border-b-2 border-primary">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full relative">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover grayscale-[10%]"
          />
          <div className="absolute inset-0 bg-primary/20"></div>
        </div>

        {/* Restaurant Info */}
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          {restaurant.bestsellerTag && (
            <div className="absolute -top-4 right-4 bg-secondary-container border-2 border-primary px-3 py-1 font-display text-xs text-on-secondary-container uppercase font-bold clip-luggage-tag flex items-center gap-1">
              <Flame className="w-4 h-4 fill-secondary-container" />
              {restaurant.bestsellerTag}
            </div>
          )}

          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight text-primary mb-1">
            {restaurant.name}
          </h1>

          <div className="flex items-center gap-3 font-body text-sm text-on-surface-variant mb-1">
            <span className="font-bold">{restaurant.cuisine.join(' • ')}</span>
            <span>•</span>
            <span>{restaurant.priceRange}</span>
            <span>•</span>
            <span>{restaurant.address}</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
            <Star className="w-4 h-4 fill-secondary-container text-secondary" />
            <span className="font-bold text-primary">{restaurant.rating}</span>
            <span>({restaurant.reviewsCount || 200}+ reviews)</span>
          </div>
        </div>
      </header>

      {/* Category Nav Tabs */}
      <nav className="sticky top-14 z-40 bg-surface-container-low border-b-2 border-primary overflow-x-auto">
        <div className="max-w-7xl mx-auto flex px-4">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-4 font-display text-base font-bold uppercase transition-colors border-r border-outline-variant relative flex items-center gap-1 whitespace-nowrap ${
                  isActive
                    ? 'bg-surface-container-lowest text-primary border-b-4 border-b-secondary-container'
                    : 'text-outline hover:bg-surface-container-high'
                }`}
              >
                {isActive && (
                  <Paperclip className="w-3.5 h-3.5 rotate-45 text-primary absolute -top-2.5 left-1/2 -translate-x-1/2" />
                )}
                {cat.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Menu Item List */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {categories
          .filter((c) => !activeCategory || c.name === activeCategory)
          .map((cat) => (
            <div key={cat.name} className="mb-10">
              <h2 className="font-display text-2xl font-bold uppercase text-primary mb-6 pb-2 border-b-2 border-primary flex items-center justify-between">
                <span>— {cat.name} —</span>
                <span className="font-mono text-xs text-outline">{cat.dishes.length} ITEMS</span>
              </h2>

              <div className="flex flex-col gap-6">
                {cat.dishes.map((dish) => {
                  const cartQty = getCartQuantityForDish(dish._id);

                  return (
                    <div key={dish._id} className="flex justify-between items-start group border-b border-dashed border-outline-variant pb-4">
                      {/* Dish Thumbnail */}
                      <img
                        src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                        alt={dish.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-16 h-16 object-cover border border-primary mr-4 shrink-0 mt-1"
                      />

                      <div className="flex-1 pr-4">
                        <div className="flex items-baseline mb-1">
                          {/* Veg/Non-Veg Dot Indicator */}
                          <span
                            className={`w-3 h-3 border flex items-center justify-center rounded-sm mr-2 flex-shrink-0 ${
                              dish.isVeg ? 'border-green-700' : 'border-red-700'
                            }`}
                            title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                dish.isVeg ? 'bg-green-700' : 'bg-red-700'
                              }`}
                            ></span>
                          </span>

                          <h3 className="font-display text-xl font-bold uppercase text-primary m-0">
                            {dish.name}
                          </h3>

                          {/* Spice Level Flames */}
                          {dish.spiceLevel > 0 && (
                            <div className="flex text-error ml-2" title={`Spicy Level ${dish.spiceLevel}`}>
                              {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                                <Flame key={i} className="w-3.5 h-3.5 fill-error text-error" />
                              ))}
                            </div>
                          )}

                          <div className="flex-1 border-b border-dotted border-outline-variant mx-2 self-end mb-1"></div>
                        </div>

                        <p className="font-body text-sm text-on-surface-variant mt-1">
                          {dish.description}
                        </p>

                        {dish.addOns && dish.addOns.length > 0 && (
                          <span className="font-mono text-[10px] text-secondary uppercase font-bold mt-1 inline-block">
                            + Customisable add-ons available
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="font-mono text-lg font-bold text-primary">
                          ₹{dish.price}
                        </span>

                        {cartQty > 0 ? (
                          <QtyStepper
                            value={cartQty}
                            onChange={(newVal) => {
                              const itemIdx = cartItems.findIndex((i) => i.dish._id === dish._id);
                              if (itemIdx > -1) {
                                updateQuantity(itemIdx, newVal);
                              }
                            }}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddClick(dish)}
                            className="w-9 h-9 border-2 border-primary font-mono text-primary font-bold hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                            aria-label="Add dish"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </main>

      {/* Floating Action Bar (View Cart) */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-50 clip-zigzag bg-surface-container-lowest border-t-2 border-primary py-4 px-4 shadow-lg">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="font-mono text-sm text-primary font-bold flex items-center gap-3">
              <span>{cartItemsCount} ITEMS</span>
              <span>·</span>
              <span className="font-bold text-lg">₹{subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="bg-secondary-container text-on-secondary-container border-2 border-primary px-6 py-3 font-display text-sm font-bold uppercase hover:bg-primary hover:text-white transition-colors flex items-center gap-2 clip-luggage-tag"
            >
              <span>VIEW CART</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {selectedDishForCustomization && (
        <DishCustomizationModal
          dish={selectedDishForCustomization}
          onClose={() => setSelectedDishForCustomization(null)}
          onAdd={(dish, qty, addOns, instructions) => {
            addToCart(dish, qty, addOns, instructions);
            setSelectedDishForCustomization(null);
          }}
        />
      )}
    </div>
  );
}
