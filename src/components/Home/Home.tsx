import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Truck, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await FirestoreService.getFeaturedProducts(6);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Genuine Parts',
      description: 'All parts are sourced directly from certified suppliers and come with authenticity guarantee.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders above ₹1000. Express delivery available nationwide.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our expert team is available round the clock to help you find the right parts.',
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Every part undergoes rigorous quality checks before dispatch.',
    },
  ];

  const benefits = [
    'Wide range of parts for all vehicle makes and models',
    'Competitive prices with bulk order discounts',
    'Easy returns and warranty support',
    'Expert technical support and installation guidance',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-deep to-deep-light text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Find the Right
                <span className="block text-primary">Auto Parts</span>
                for Your Vehicle
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed">
                Genuine parts, competitive prices, and fast delivery. Everything you need to keep your vehicle running smoothly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/vehicle">
                  <Button size="lg" className="text-lg px-8">
                    Find Your Parts
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/parts">
                  <Button variant="outline" size="lg" className="text-lg px-8 text-white border-white hover:bg-white hover:text-deep">
                    Browse All Parts
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <img
                  src="https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Auto parts and tools"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-deep mb-4">
            Quick Part Search
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Enter your vehicle details or part number to find exactly what you need
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">Select Make</option>
                <option value="maruti">Maruti Suzuki</option>
                <option value="hyundai">Hyundai</option>
                <option value="tata">Tata</option>
                <option value="mahindra">Mahindra</option>
                <option value="honda">Honda</option>
              </select>
              
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">Select Model</option>
                <option value="swift">Swift</option>
                <option value="baleno">Baleno</option>
                <option value="i20">i20</option>
                <option value="creta">Creta</option>
              </select>
              
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by part name or number..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button size="lg" className="px-8">
                Search Parts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-deep mb-4">
              Why Choose Epartnic?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best auto parts shopping experience with quality, convenience, and reliability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-deep mb-2 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-deep mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked quality parts at unbeatable prices
              </p>
            </div>
            <Link to="/parts">
              <Button variant="outline">
                View All Parts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/parts/${product.id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                    <img
                      src={product.images[0] || 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-deep group-hover:text-primary transition-colors duration-200">
                        {product.name}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.brand}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {product.vehicle.make} {product.vehicle.model} ({product.vehicle.year})
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatINR(product.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Everything You Need for Your Vehicle
              </h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                From engine components to body parts, we have everything to keep your vehicle in perfect condition. Our extensive catalog covers all major brands and models.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Mechanic working on car"
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Find Your Parts?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start by selecting your vehicle make and model to see compatible parts
          </p>
          <Link to="/vehicle">
            <Button variant="secondary" size="lg" className="text-lg px-8">
              Start Vehicle Selection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;