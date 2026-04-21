import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Gem as GemIcon, TrendingUp, Heart, ShoppingCart, Clock, LogOut, Settings, Search, Filter } from 'lucide-react';

interface Auction {
  id: string;
  title: string;
  image: string;
  price: number;
  currentBid: number;
  timeLeft: string;
  status: 'active' | 'ending' | 'ended';
}

const BuyerDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [auctions] = useState<Auction[]>([
    {
      id: '1',
      title: 'Royal Blue Tanzanite',
      image: 'https://via.placeholder.com/300x200',
      price: 5000,
      currentBid: 6500,
      timeLeft: '2h 30m',
      status: 'active',
    },
    {
      id: '2',
      title: 'Emerald Cut Diamond',
      image: 'https://via.placeholder.com/300x200',
      price: 8000,
      currentBid: 9200,
      timeLeft: '5h 15m',
      status: 'active',
    },
    {
      id: '3',
      title: 'Sunset Padparadscha',
      image: 'https://via.placeholder.com/300x200',
      price: 3500,
      currentBid: 4100,
      timeLeft: '45m',
      status: 'ending',
    },
    {
      id: '4',
      title: 'Pink Tourmaline',
      image: 'https://via.placeholder.com/300x200',
      price: 2500,
      currentBid: 2800,
      timeLeft: '8h',
      status: 'active',
    },
  ]);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [bids] = useState<any[]>([
    {
      id: '1',
      gem: 'Royal Blue Tanzanite',
      yourBid: 6500,
      status: 'pending',
      timeLeft: '2h 30m',
    },
    {
      id: '2',
      gem: 'Emerald Cut Diamond',
      yourBid: 9200,
      status: 'leading',
      timeLeft: '5h 15m',
    },
  ]);

  const navItems = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'my-bids', label: 'My Bids' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'watchlist', label: 'Watchlist' },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'my-bids':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                My Bids
              </h2>
              <p className="text-gray-600">Track all your active bids</p>
            </div>

            {bids.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No active bids yet</p>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Bidding
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          {bid.gem}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Your Bid: <span className="font-semibold text-slate-900">₨{bid.yourBid}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Time Left: <span className="font-semibold text-amber-600">{bid.timeLeft}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                            bid.status === 'leading'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {bid.status === 'leading' ? 'You\'re Winning!' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                Favorite Items
              </h2>
              <p className="text-gray-600">Items you've saved</p>
            </div>

            {favorites.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No favorite items yet</p>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {auctions
                  .filter(a => favorites.includes(a.id))
                  .map((auction) => (
                    <div
                      key={auction.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
                    >
                      <div className="relative h-40 bg-gray-200">
                        <img
                          src={auction.image}
                          alt={auction.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => toggleFavorite(auction.id)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(auction.id)
                                ? 'fill-red-600 text-red-600'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-2">
                          {auction.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Current: ₨{auction.currentBid}
                        </p>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                          Place Bid
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                Gem Marketplace
              </h2>
              <p className="text-gray-600">
                Discover and bid on premium gemstones
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>

            {/* Auctions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {auctions.map((auction) => (
                <div
                  key={auction.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden group"
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      onClick={() => toggleFavorite(auction.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(auction.id)
                            ? 'fill-red-600 text-red-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                    <span
                      className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        auction.status === 'ending'
                          ? 'bg-red-600'
                          : auction.status === 'active'
                          ? 'bg-emerald-600'
                          : 'bg-gray-600'
                      }`}
                    >
                      {auction.status === 'ending' && '🔥 ENDING SOON'}
                      {auction.status === 'active' && 'Active'}
                      {auction.status === 'ended' && 'Ended'}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                      {auction.title}
                    </h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Current Bid</span>
                        <span className="font-bold text-slate-900">
                          ₨{auction.currentBid}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Ends in
                        </span>
                        <span className="font-semibold text-amber-600">
                          {auction.timeLeft}
                        </span>
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                      Place Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">Gem Collector</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.id === 'marketplace' && <GemIcon className="w-5 h-5" />}
              {item.id === 'my-bids' && <TrendingUp className="w-5 h-5" />}
              {item.id === 'favorites' && <Heart className="w-5 h-5" />}
              {item.id === 'watchlist' && <ShoppingCart className="w-5 h-5" />}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-100 bg-white space-y-2">
          <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
