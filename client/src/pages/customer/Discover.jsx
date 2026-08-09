import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Star, Flame, Scissors } from 'lucide-react';
import api from '../../api/client';

export default function Discover() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const cuisines = ['ITALIAN', 'INDIAN', 'SUSHI', 'BURGERS', 'VEGAN'];

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCuisine]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCuisine) params.cuisine = selectedCuisine;
      const res = await api.get('/restaurants', { params });
      setRestaurants(res.data.restaurants || []);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen font-body text-on-surface">
      {/* Location Bar */}
      <div className="border-b border-outline-variant bg-surface-container-highest">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="w-4 h-4 text-outline" />
            <span className="font-display text-xs uppercase tracking-wider font-bold">DELIVERING TO</span>
            <span className="font-mono text-xs bg-surface-container-lowest px-2 py-0.5 border border-outline-variant tracking-tight font-bold">
              124 KITCHEN ST, TERMINAL 4
            </span>
          </div>
          <button className="font-display text-xs uppercase text-primary border-b-2 border-primary hover:bg-primary hover:text-white px-2 py-0.5 transition-colors font-bold">
            CHANGE
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-16">
        {/* Search Section */}
        <section className="py-8 w-full max-w-3xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH RESTAURANTS OR DISHES..."
              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-2 focus:border-primary p-4 pr-14 font-mono text-sm text-primary placeholder:text-outline outline-none rounded-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-surface-container-high transition-colors border border-transparent"
            >
              <Search className="w-5 h-5 text-primary" />
            </button>
          </form>
        </section>

        {/* Cuisine Filter Pills Rail */}
        <section className="mb-8 w-full overflow-hidden">
          <div className="flex overflow-x-auto gap-3 pb-2 border-b border-outline-variant">
            <button
              onClick={() => setSelectedCuisine('')}
              className={`px-5 py-2 font-display text-xs uppercase rounded-none clip-luggage-tag whitespace-nowrap transition-colors relative flex items-center gap-2 ${
                selectedCuisine === ''
                  ? 'bg-secondary-container text-on-secondary-container border-2 border-primary font-bold'
                  : 'bg-surface-container-lowest text-primary border border-outline-variant hover:bg-primary hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              ALL CUISINES
            </button>
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(selectedCuisine === c ? '' : c)}
                className={`px-5 py-2 font-display text-xs uppercase rounded-none clip-luggage-tag whitespace-nowrap transition-colors relative flex items-center gap-2 ${
                  selectedCuisine === c
                    ? 'bg-secondary-container text-on-secondary-container border-2 border-primary font-bold'
                    : 'bg-surface-container-lowest text-primary border border-outline-variant hover:bg-primary hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-primary/40 inline-block"></span>
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Restaurants Grid */}
        {loading ? (
          <div className="py-16 text-center font-mono text-sm text-on-surface-variant">
            <div className="animate-pulse">LOADING RESTAURANT TICKETS...</div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="py-16 text-center bg-surface-container-lowest p-8 border-2 border-dashed border-outline clip-zigzag max-w-md mx-auto">
            <p className="font-display text-xl font-bold uppercase mb-2">NO KITCHENS FOUND</p>
            <p className="font-mono text-xs text-on-surface-variant">
              No active restaurant tickets match your filter criteria.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <article
                key={r._id}
                onClick={() => navigate(`/restaurant/${r._id}`)}
                className="bg-surface-container-lowest border-2 border-outline relative clip-zigzag hover:bg-surface-container-low transition-all cursor-pointer flex flex-col h-full group"
              >
                <div className="relative border-b border-outline-variant p-2 bg-surface-container">
                  <img
                    src={r.coverImage}
                    alt={r.name}
                    className="w-full h-48 object-cover grayscale-[15%] group-hover:grayscale-0 transition-all border border-outline-variant"
                  />
                  {r.bestsellerTag && (
                    <div className="absolute top-4 right-4 bg-secondary-container border-2 border-primary px-3 py-0.5 font-display text-xs text-on-secondary-container uppercase font-bold clip-luggage-tag">
                      {r.bestsellerTag}
                    </div>
                  )}
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-primary uppercase tracking-tight mb-1 group-hover:text-secondary">
                      {r.name}
                    </h3>
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-dashed border-outline-variant">
                      <span className="font-display text-xs text-on-surface-variant uppercase font-semibold">
                        {r.cuisine.join(' • ')}
                      </span>
                      <div className="flex items-center gap-1 font-mono text-xs bg-primary text-secondary-container px-2 py-0.5 font-bold">
                        <Star className="w-3.5 h-3.5 fill-secondary-container" />
                        <span>{r.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <span className="font-display text-xs text-outline uppercase font-semibold">EST. DELIVERY</span>
                    <span className="font-mono text-xs text-primary font-bold bg-surface-container-high px-2 py-1 border border-outline-variant">
                      {r.avgPrepTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Scissors Divider Decorator */}
        <div className="w-full flex items-center text-outline max-w-4xl mx-auto py-12">
          <div className="flex-grow border-t border-dashed border-outline-variant"></div>
          <div className="mx-4 flex items-center font-mono text-xs text-primary gap-2 bg-surface-container-low px-4">
            <Scissors className="w-4 h-4 rotate-90" />
            <span>ORDER AHEAD · FRESH FROM THE EXPO RAIL</span>
          </div>
          <div className="flex-grow border-t border-dashed border-outline-variant"></div>
        </div>
      </main>
    </div>
  );
}
