import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../services/api';
import PublicHeader from '../shared/PublicHeader';
import { useDispatch } from 'react-redux';
import { addToCart, saveCart } from '../../cartSlice';
import { useSelector } from 'react-redux';
import Footer from './Footer';
import heroImg from '../../assets/herobg-1.png';
import heroImg2 from '../../assets/herobg-2.png';
import heroImg3 from '../../assets/herobg-3.png';
import organic from '../../assets/organic.png';
import delivery from '../../assets/transport.png';
import star from '../../assets/star.png';



// Helper function to format weight from grams to readable format
const formatWeight = (weightInGrams) => {
  if (!weightInGrams || weightInGrams === 0) return null;

  if (weightInGrams >= 1000) {
    const kg = weightInGrams / 1000;
    return `${kg} kg`;
  } else {
    return `${weightInGrams} g`;
  }
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const heroImages = [
    heroImg,
    heroImg2,
    heroImg3,
    // 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop',
    // 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop'
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = heroImages.filter((u) => !!u);

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const filteredProducts = () => {
    if (selectedCategory === 'All') return products;
    return products.filter((product) => String(product.category_id) === String(selectedCategory));
  };

  // Remove cart logic from HomePage
  // Remove handleAddToCart and useEffect for cart sync
  // Remove Add to Cart button from product card

  return (
    <div className="public-website">
      {/* Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 via-green-100 to-green-200 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 right-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="hero-container max-w-7xl mx-auto px-6 py-24 flex flex-col-reverse md:flex-row items-center justify-between relative z-10">
          {/* Content */}
          <div className="hero-content text-center md:!text-left space-y-6 md:space-y-8 max-w-xl">
            <h1 className="hero-title text-5xl md:text-6xl font-extrabold text-green-900 tracking-tight leading-tight">
              Premium <span className="text-green-700">Organic</span> Food Products
            </h1>
            <p className="hero-subtitle text-lg md:text-xl text-green-800">
              Discover our handpicked selection of organic spices, health mixes, and premium food products.
              Quality you can trust, delivered to your doorstep.
            </p>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {isLoggedIn() ? (
                <>
                  <Link
                    to="/shop"
                    className="hero-btn px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-xl transition duration-500 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    🛍️ Shop Now
                  </Link>
                  <Link
                    to="/about"
                    className="hero-btn px-6 py-3 bg-white hover:bg-green-50 text-green-700 border border-green-700 rounded-full shadow-md transition duration-300 flex items-center justify-center gap-2"
                  >
                    📖 Learn More
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hero-btn px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full shadow-xl transition duration-500 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    🔐 Login to Shop
                  </Link>
                  <Link
                    to="/about"
                    className="hero-btn px-6 py-3 bg-white hover:bg-green-50 text-green-700 border border-green-700 rounded-full shadow-md transition duration-300 flex items-center justify-center gap-2"
                  >
                    📖 Learn More
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div className="hero-image mb-10 md:mb-0 relative w-full">
            <div className="relative w-full  rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
              <div className="relative w-full h-80 md:h-96">
                {(slides.length ? slides : [heroImg]).map((src, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}
                    style={{ willChange: 'opacity' }}
                  >
                    <img
                      src={src}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = '/images/no-image.png'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent"></div>
                  </div>
                ))}
              </div>


            </div>
            {slides.length > 1 && (
              <div className="relative m-auto flex justify-center z-90 mt-4 items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-14 bg-green-800' : 'w-6 bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="features-section py-16">
        <div className="features-container">
          <h2 className="section-title"> Choose RTQ Foods?</h2>
          <p className="section-subtitle">
            We are committed to providing the highest quality organic food products with exceptional service
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><img src={organic} alt="Organic icon" />
              </div>
              <h3 className="feature-title">100% Organic</h3>
              <p className="feature-description">
                All our products are certified organic, grown without harmful pesticides and chemicals.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src={delivery} alt="Organic icon" /></div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">
                Quick and reliable delivery across India. Get your products delivered within 2-3 business days.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src={star} alt="Organic icon" /></div>
              <h3 className="feature-title">Premium Quality</h3>
              <p className="feature-description">
                We source only the finest ingredients from trusted farmers and suppliers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section !py-16 !pb-18 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Featured Products
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                className={`px-5 py-2 rounded-full border transition ${selectedCategory === "All"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                  }`}
                onClick={() => setSelectedCategory("All")}
              >
                All
              </button>
              {categoriesLoading ? (
                // <span className="text-gray-500">Loading...</span>
                <></>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat._id}
                    className={`px-5 py-2 rounded-full border transition ${selectedCategory === cat._id
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                      }`}
                    onClick={() => setSelectedCategory(cat._id)}
                  >
                    {cat.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              // 🔹 Skeleton Loader
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow overflow-hidden flex flex-col animate-pulse"
                >
                  {/* Skeleton Image */}
                  <div className="w-full h-60 bg-gray-200"></div>

                  {/* Skeleton Content */}
                  <div className="flex flex-col flex-1 px-5 pt-2 pb-5">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredProducts().length > 0 ? (
              filteredProducts()
                .slice(0, 8) // show more on larger screens
                .map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-60 bg-gray-100 flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={process.env.REACT_APP_API_URL + product.image_url}
                          alt={product.name}
                          className="w-full h-auto object-cover object-center"
                        // onError={(e) => {
                        //   e.currentTarget.src = "/images/no-image.png"; // fallback if broken
                        // }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                          No Image
                        </div>
                      )}

                      <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                        {product.category === "Spices" ? "Organic" : "Best Seller"}
                      </span>
                    </div>

                    {/* Product Content */}
                    <div className="flex flex-col flex-1 px-5 pt-2 pb-5">
                      <div className='flex justify-between items-center'>
                        <p className="text-sm text-gray-500 mb-1">
                          {product.category_name || "Unknown"}
                        </p>
                        <p className='text-[12px] mb-1 leading-[20px]'>
                          <b className='text-green-800'>HSN Code:</b> <span className="font-medium">{product.hsn_number || "N/A"}</span>
                        </p>
                      </div>

                      <p className='text-[12px] mb-1 leading-[20px]'>
                        <b className='text-green-800'>GST No:</b> <span className="font-medium">33AAOCR1538H1ZB</span>
                      </p>
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-0">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description}
                      </p>

                      {product.weight && (
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="font-medium">Weight:</span>{" "}
                          {formatWeight(product.weight)}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="text-lg font-bold text-green-600">
                          ₹{product.price}
                        </div>
                        {/* <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                          Add to Cart
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full text-center text-gray-500 h-[300px] flex items-center justify-center">
                No products available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default HomePage; 