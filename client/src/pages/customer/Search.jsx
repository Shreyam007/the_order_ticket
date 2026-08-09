import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, Star, Scissors, ArrowRight } from 'lucide-react';
import api from '../../api/client';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [minRating, setMinRating] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const cuisineOptions = ['Italian', 'Indian', 'Pizza', 'Burgers', 'Japanese', 'American'];

  useEffect(() => {
    fetchFilteredRestaurants();
  }, [searchParams]);

  const fetchFilteredRestaurants = async () => {
    try {
      setLoading(true);
      const params = {};
      const q = searchParams.get('q');
      const pr = searchParams.get('priceRange');
      const cu = searchParams.get('cuisine');
      const rat = searchParams.get('minRating');

      if (q) params.query = q;
      if (pr) params.priceRange = pr;
      if (cu) params.cuisine = cu;
      if (rat) params.minRating = rat;

      const res = await api.get('/restaurants', { params });
      setRestaurants(res.data.restaurants || []);
    } catch (err) {
      console.error('Error searching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newParams = {}) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({ q: query });
  };

  const toggleCuisine = (c) => {
    let updated;
    if (selectedCuisines.includes(c)) {
      updated = selectedCuisines.filter((item) => item !== c);
    } else {
      updated = [...selectedCuisines, c];
    }
    setSelectedCuisines(updated);
    applyFilters({ cuisine: updated.join(',') });
  };

  return (
    <div className="bg-surface-container-low min-h-screen font-body text-on-surface">
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar (Filters) */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface-container-lowest p-5 border-2 border-outline relative clip-zigzag">
            <div className="font-display text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Filter className="w-4 h-4" /> FILTERS
            </div>

            {/* Scissors Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-dashed border-outline"></div>
              <span className="absolute bg-white px-2 text-outline text-xs">
                <Scissors className="w-3 h-3 rotate-90" />
              </span>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <div className="font-display text-xs font-bold text-on-surface-variant mb-2">PRICE RANGE</div>
              <div className="flex border-2 border-primary">
                {['', '₹', '₹₹', '₹₹₹'].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPriceRange(p);
                      applyFilters({ priceRange: p });
                    }}
                    className={`flex-1 py-1.5 font-mono text-xs text-center transition-colors border-r last:border-r-0 border-primary ${
                      priceRange === p ? 'bg-primary text-white font-bold' : 'hover:bg-surface-container-high text-primary'
                    }`}
                  >
                    {p || 'ALL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine */}
            <div className="mb-6">
              <div className="font-display text-xs font-bold text-on-surface-variant mb-2">CUISINE</div>
              <div className="flex flex-col gap-2">
                {cuisineOptions.map((c) => {
                  const isChecked = selectedCuisines.includes(c);
                  return (
                    <label key={c} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCuisine(c)}
                        className="w-4 h-4 border-2 border-primary text-primary focus:ring-0 rounded-none bg-surface-container-low"
                      />
                      <span className="font-mono text-xs px-2 py-0.5 border border-outline-variant bg-surface-container-low group-hover:bg-surface-container-high transition-colors">
                        {c}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <div className="font-display text-xs font-bold text-on-surface-variant mb-2">RATING</div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={minRating === '4.0'}
                  onChange={(e) => {
                    const val = e.target.checked ? '4.0' : '';
                    setMinRating(val);
                    applyFilters({ minRating: val });
                  }}
                  className="w-4 h-4 border-2 border-primary text-primary focus:ring-0 rounded-none"
                />
                <span className="font-mono text-xs flex items-center gap-1">
                  4.0+ <Star className="w-3.5 h-3.5 fill-secondary-container text-secondary" />
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Search & Results Content Area */}
        <section className="flex-1 flex flex-col gap-6">
          {/* Search Header Card */}
          <div className="bg-surface-container-lowest border-2 border-primary p-5 clip-zigzag relative">
            <div className="absolute top-0 right-0 bg-secondary-container text-primary px-3 py-1 border-b-2 border-l-2 border-primary font-display text-xs font-bold uppercase clip-luggage-tag">
              SEARCH TICKET
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end mt-4">
              <div className="flex-1">
                <label className="block font-display text-xs font-bold text-on-surface-variant mb-1 uppercase">
                  QUERY
                </label>
                <div className="flex border-b-2 border-primary">
                  <SearchIcon className="w-5 h-5 text-on-surface-variant self-center mr-2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search restaurant or cuisine..."
                    className="w-full bg-transparent border-none focus:ring-0 font-mono text-sm p-2 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-white font-display text-xs uppercase font-bold px-6 py-3 hover:bg-secondary-container hover:text-primary transition-colors border-2 border-primary"
              >
                EXECUTE SEARCH
              </button>
            </form>

            <div className="border-t border-dashed border-outline-variant my-4"></div>

            <div className="font-mono text-xs uppercase flex items-center justify-between text-on-surface-variant">
              <span>STATUS: EXECUTING</span>
              <span className="font-bold text-primary">{restaurants.length} RESTAURANTS FOUND</span>
            </div>
          </div>

          {/* Results List */}
          {loading ? (
            <div className="py-12 text-center font-mono text-sm text-on-surface-variant">
              LOADING MATCHING TICKETS...
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 border-2 border-dashed border-outline text-center clip-zigzag">
              <h3 className="font-display text-xl font-bold uppercase mb-1">NO MATCHES FOUND</h3>
              <p className="font-mono text-xs text-on-surface-variant">
                Try loosening your filters or search for another keyword.
              </p>
            </div>
          ) : (
            <div className="flex flex-col border border-outline bg-surface-container-lowest">
              {restaurants.map((r) => (
                <div
                  key={r._id}
                  onClick={() => navigate(`/restaurant/${r._id}`)}
                  className="flex items-center p-4 border-b border-outline-variant hover:bg-surface-container-low transition-colors group cursor-pointer relative"
                >
                  <img
                    src={r.coverImage}
                    alt={r.name}
                    className="w-20 h-20 object-cover border border-primary rounded-sm flex-shrink-0"
                  />
                  <div className="ml-4 flex-1 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start w-full">
                      <h3 className="font-display text-xl font-bold uppercase text-primary group-hover:text-secondary">
                        {r.name}
                      </h3>
                      <div className="flex items-center gap-1 font-mono text-xs bg-surface-container-high px-2 py-0.5 border border-outline-variant font-bold">
                        <span>{r.rating}</span>
                        <Star className="w-3 h-3 fill-secondary-container text-secondary" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      {r.cuisine.map((c) => (
                        <span key={c} className="font-mono text-[10px] bg-surface-container-high px-2 py-0.5 border border-outline-variant">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 font-mono text-xs text-on-surface-variant flex items-center gap-2">
                      <span>{r.avgPrepTime}</span>
                      <span>•</span>
                      <span>{r.priceRange}</span>
                    </div>
                  </div>
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
