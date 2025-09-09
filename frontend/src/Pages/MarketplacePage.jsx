import React, { useState, useEffect } from 'react'
import { Navbar } from '../componets/navbar'
import { Footer } from '../componets/footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faFilter, 
  faSort, 
  faStar, 
  faMapMarkerAlt, 
  faShoppingCart,
  faHeart,
  faEye,
  faTruck,
  faLeaf,
  faSeedling,
  faAppleAlt,
  faCarrot,
  faWheatAwn,
  faPepperHot,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'
import '../Styles/MarketplacePage.css'
import { useCartStore } from '../stores/useCartStore'
import { faThLarge, faList } from '@fortawesome/free-solid-svg-icons'

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    farmer: "Rajesh Kumar",
    location: "Punjab, India",
    price: 45,
    originalPrice: 60,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
    category: "vegetables",
    description: "Fresh organic tomatoes grown without pesticides",
    stock: 50,
    unit: "kg",
    deliveryTime: "2-3 days",
    verified: true
  },
  {
    id: 2,
    name: "Premium Basmati Rice",
    farmer: "Priya Sharma",
    location: "Haryana, India",
    price: 120,
    originalPrice: 150,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    category: "grains",
    description: "Premium quality basmati rice, aged for perfect taste",
    stock: 25,
    unit: "kg",
    deliveryTime: "1-2 days",
    verified: true
  },
  {
    id: 3,
    name: "Fresh Green Spinach",
    farmer: "Amit Singh",
    location: "Uttar Pradesh, India",
    price: 30,
    originalPrice: 40,
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
    category: "vegetables",
    description: "Fresh green spinach packed with nutrients",
    stock: 30,
    unit: "bunch",
    deliveryTime: "1 day",
    verified: true
  },
  {
    id: 4,
    name: "Organic Mangoes",
    farmer: "Sunita Devi",
    location: "Bihar, India",
    price: 80,
    originalPrice: 100,
    rating: 4.7,
    reviews: 156,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg",
    category: "fruits",
    description: "Sweet and juicy organic mangoes",
    stock: 40,
    unit: "dozen",
    deliveryTime: "2-3 days",
    verified: true
  },
  {
    id: 5,
    name: "Fresh Corn",
    farmer: "Vikram Patel",
    location: "Gujarat, India",
    price: 25,
    originalPrice: 35,
    rating: 4.5,
    reviews: 43,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
    category: "vegetables",
    description: "Fresh sweet corn harvested daily",
    stock: 60,
    unit: "piece",
    deliveryTime: "1-2 days",
    verified: true
  },
  {
    id: 6,
    name: "Organic Wheat Flour",
    farmer: "Ramesh Yadav",
    location: "Madhya Pradesh, India",
    price: 55,
    originalPrice: 70,
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    category: "grains",
    description: "Stone-ground organic wheat flour",
    stock: 35,
    unit: "kg",
    deliveryTime: "2-3 days",
    verified: true
  },
  {
    id: 7,
    name: "Cavendish Bananas",
    farmer: "Kiran Patil",
    location: "Maharashtra, India",
    price: 50,
    originalPrice: 60,
    rating: 4.6,
    reviews: 142,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Bananas.jpg",
    category: "fruits",
    description: "Sweet ripe bananas harvested this week",
    stock: 80,
    unit: "dozen",
    deliveryTime: "1-2 days",
    verified: true
  },
  {
    id: 8,
    name: "Kashmir Apples",
    farmer: "Imran Khan",
    location: "Jammu & Kashmir, India",
    price: 120,
    originalPrice: 140,
    rating: 4.7,
    reviews: 201,
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80",
    category: "fruits",
    description: "Crisp and juicy hand-picked apples",
    stock: 45,
    unit: "kg",
    deliveryTime: "2-3 days",
    verified: true
  },
  {
    id: 9,
    name: "Navel Oranges",
    farmer: "Suman Verma",
    location: "Madhya Pradesh, India",
    price: 90,
    originalPrice: 110,
    rating: 4.5,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400",
    category: "fruits",
    description: "Vitamin C rich, naturally sweet oranges",
    stock: 60,
    unit: "kg",
    deliveryTime: "2 days",
    verified: true
  },
  {
    id: 10,
    name: "Red Grapes",
    farmer: "Harpreet Singh",
    location: "Punjab, India",
    price: 140,
    originalPrice: 160,
    rating: 4.6,
    reviews: 73,
    image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Red_Grapes.jpg",
    category: "fruits",
    description: "Seedless table grapes, naturally sweet",
    stock: 30,
    unit: "kg",
    deliveryTime: "1-2 days",
    verified: true
  },
  {
    id: 11,
    name: "Brown Onions",
    farmer: "Ravi Joshi",
    location: "Maharashtra, India",
    price: 35,
    originalPrice: 45,
    rating: 4.4,
    reviews: 66,
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400",
    category: "vegetables",
    description: "Firm bulbs with rich flavor",
    stock: 100,
    unit: "kg",
    deliveryTime: "1-2 days",
    verified: true
  },
  {
    id: 12,
    name: "New Potatoes",
    farmer: "Neha Gupta",
    location: "Uttar Pradesh, India",
    price: 28,
    originalPrice: 35,
    rating: 4.5,
    reviews: 58,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/94/Potatoes.jpg",
    category: "vegetables",
    description: "Thin-skinned, perfect for roasting and curries",
    stock: 120,
    unit: "kg",
    deliveryTime: "1-2 days",
    verified: true
  },
  {
    id: 13,
    name: "Orange Carrots",
    farmer: "Sita Ram",
    location: "Rajasthan, India",
    price: 40,
    originalPrice: 50,
    rating: 4.6,
    reviews: 91,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Carrots.JPG",
    category: "vegetables",
    description: "Crunchy, sweet carrots ideal for salads",
    stock: 70,
    unit: "kg",
    deliveryTime: "1 day",
    verified: true
  },
  {
    id: 14,
    name: "Cucumbers",
    farmer: "Ashok Kumar",
    location: "Haryana, India",
    price: 32,
    originalPrice: 40,
    rating: 4.3,
    reviews: 39,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Cucumbers.jpg",
    category: "vegetables",
    description: "Hydrating cucumbers, crisp and fresh",
    stock: 90,
    unit: "kg",
    deliveryTime: "1 day",
    verified: true
  },
  {
    id: 15,
    name: "Bell Peppers Mix",
    farmer: "Pooja Rao",
    location: "Karnataka, India",
    price: 85,
    originalPrice: 100,
    rating: 4.7,
    reviews: 52,
    image: "https://upload.wikimedia.org/wikipedia/commons/5/59/Capsicum_annuum_fruits_various_colors.jpg",
    category: "vegetables",
    description: "Red, yellow and green capsicum mix",
    stock: 50,
    unit: "kg",
    deliveryTime: "1-2 days",
    verified: true
  },
  {
    id: 16,
    name: "Basmati Rice (Aged)",
    farmer: "Seema Chaudhary",
    location: "Haryana, India",
    price: 180,
    originalPrice: 210,
    rating: 4.9,
    reviews: 133,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Basmati_rice.jpg",
    category: "grains",
    description: "Aged basmati rice for perfect aroma",
    stock: 60,
    unit: "kg",
    deliveryTime: "2-3 days",
    verified: true
  },
  {
    id: 17,
    name: "Yellow Lentils (Moong Dal)",
    farmer: "Tarun Patel",
    location: "Gujarat, India",
    price: 110,
    originalPrice: 130,
    rating: 4.6,
    reviews: 77,
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Moong_dal.jpg",
    category: "grains",
    description: "Protein-rich, cleaned and ready to cook",
    stock: 80,
    unit: "kg",
    deliveryTime: "2 days",
    verified: true
  },
  {
    id: 18,
    name: "Turmeric Powder",
    farmer: "Anita Iyer",
    location: "Andhra Pradesh, India",
    price: 95,
    originalPrice: 120,
    rating: 4.7,
    reviews: 65,
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Turmeric_powder.jpg",
    category: "spices",
    description: "Sun-dried, stone-ground turmeric powder",
    stock: 40,
    unit: "kg",
    deliveryTime: "2-3 days",
    verified: true
  },
  {
    id: 19,
    name: "Coriander Seeds",
    farmer: "Gopal Sharma",
    location: "Rajasthan, India",
    price: 80,
    originalPrice: 95,
    rating: 4.5,
    reviews: 44,
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Coriander_Seeds.JPG",
    category: "spices",
    description: "Aromatic coriander seeds with strong flavor",
    stock: 55,
    unit: "kg",
    deliveryTime: "2-3 days",
    verified: true
  }
]

// Limit catalogue to the original set with verified images (first 8 items)
const baseProducts = mockProducts.filter((p) => p.id <= 8)

const categories = [
  { id: 'all', name: 'All Products', icon: faLeaf },
  { id: 'vegetables', name: 'Vegetables', icon: faCarrot },
  { id: 'fruits', name: 'Fruits', icon: faAppleAlt },
  { id: 'grains', name: 'Grains', icon: faWheatAwn },
  { id: 'spices', name: 'Spices', icon: faPepperHot }
]

const sortOptions = [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' }
]

export const MarketplacePage = () => {
  const [products, setProducts] = useState(baseProducts)
  const [filteredProducts, setFilteredProducts] = useState(baseProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })
  const [wishlist, setWishlist] = useState(new Set())
  const { addItem } = useCartStore()
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [showQuickView, setShowQuickView] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const openQuickView = (product) => {
    setSelectedProduct(product)
    setShowQuickView(true)
  }

  const closeQuickView = () => {
    setShowQuickView(false)
    setSelectedProduct(null)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSortBy('popular')
    setPriceRange({ min: 0, max: 200 })
  }

  // Filter and search functionality
  useEffect(() => {
    // Always work on a copy to avoid mutating state during sort
    let filtered = [...products]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.id - a.id)
        break
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, sortBy, priceRange, products])

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
    } else {
      newWishlist.add(productId)
    }
    setWishlist(newWishlist)
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : faLeaf
  }

  return (
    <div className="marketplace-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="marketplace-hero">
        {/* Background media (image) */}
        <div className="hero-media">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1920&auto=format&fit=crop"
            alt="Farmer carrying fresh seasonal produce in a field"
          />
        </div>

        <div className="hero-content">
          <h1>Fresh Farm Marketplace</h1>
          <p>Connect directly with farmers and get fresh, organic produce delivered to your doorstep</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search for fresh produce..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <FontAwesomeIcon icon={faFilter} />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {showFilters && (
        <section className="filters-section">
          <div className="filters-container">
            <div className="filters-header-row">
              <h3>Filters</h3>
              <button className="clear-filters-btn" onClick={handleClearFilters}>Clear all</button>
            </div>
            <div className="filter-group">
              <h3>Categories</h3>
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <FontAwesomeIcon icon={category.icon} />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Price Range</h3>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                />
                <span>₹0 - ₹{priceRange.max}</span>
              </div>
            </div>

            <div className="filter-group">
              <h3>Sort By</h3>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Quick Filters */}
      <section className="quick-filters">
        <div className="quick-filters-container">
          {categories.map(category => (
            <button
              key={category.id}
              className={`quick-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <FontAwesomeIcon icon={category.icon} />
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-header">
          <h2>Fresh Produce ({filteredProducts.length} items)</h2>
          <div className="header-actions">
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <FontAwesomeIcon icon={faThLarge} />
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
            <div className="sort-dropdown">
            <FontAwesomeIcon icon={faSort} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            </div>
          </div>
        </div>

        <div className={`products-grid ${viewMode === 'list' ? 'list' : ''}`}>
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-badges">
                  {product.verified && <span className="verified-badge">Verified</span>}
                  {product.price < product.originalPrice && (
                    <span className="discount-badge">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <button 
                  className={`wishlist-btn ${wishlist.has(product.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              </div>

              <div className="product-info">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    <FontAwesomeIcon icon={faStar} />
                    <span>{product.rating}</span>
                    <span className="reviews">({product.reviews})</span>
                  </div>
                </div>

                <div className="farmer-info">
                  <FontAwesomeIcon icon={faSeedling} />
                  <span>{product.farmer}</span>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{product.location}</span>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-details">
                  <div className="stock-info">
                    <span>Stock: {product.stock} {product.unit}</span>
                  </div>
                  <div className="delivery-info">
                    <FontAwesomeIcon icon={faTruck} />
                    <span>{product.deliveryTime}</span>
                  </div>
                </div>

                <div className="product-footer">
                  <div className="price-info">
                    <span className="current-price">₹{product.price}</span>
                    {product.price < product.originalPrice && (
                      <span className="original-price">₹{product.originalPrice}</span>
                    )}
                    <span className="unit">/{product.unit}</span>
                  </div>
                  <div className="product-actions">
                    <button
                      className="view-btn"
                      onClick={() => openQuickView(product)}
                      title="View details"
                      aria-label={`View details for ${product.name}`}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="add-to-cart-btn" onClick={() => addItem(product, 1)}>
                      <FontAwesomeIcon icon={faShoppingCart} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <FontAwesomeIcon icon={faLeaf} />
            <h3>No products found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </section>

      {showQuickView && selectedProduct && (
        <div className="quick-view-overlay" onClick={closeQuickView}>
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qv-media">
              <img src={selectedProduct.image} alt={selectedProduct.name} loading="eager" />
            </div>
            <div className="qv-info">
              <h3>{selectedProduct.name}</h3>
              <p className="qv-desc">{selectedProduct.description}</p>
              <div className="qv-meta">
                <span className="qv-price">₹{selectedProduct.price}</span>
                <span className="qv-unit">/ {selectedProduct.unit}</span>
              </div>
              <div className="qv-actions">
                <button className="add-to-cart-btn" onClick={() => addItem(selectedProduct, 1)}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  Add to Cart
                </button>
                <button className="qv-close" onClick={closeQuickView}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
