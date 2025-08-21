import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Search } from 'lucide-react';
import Button from '../UI/Button';

const VehicleSelection: React.FC = () => {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const navigate = useNavigate();

  const vehicleData = {
    makes: [
      { value: 'maruti', label: 'Maruti Suzuki' },
      { value: 'hyundai', label: 'Hyundai' },
      { value: 'tata', label: 'Tata' },
      { value: 'mahindra', label: 'Mahindra' },
      { value: 'honda', label: 'Honda' },
      { value: 'toyota', label: 'Toyota' },
      { value: 'ford', label: 'Ford' },
      { value: 'volkswagen', label: 'Volkswagen' },
    ],
    models: {
      maruti: [
        { value: 'swift', label: 'Swift' },
        { value: 'baleno', label: 'Baleno' },
        { value: 'vitara-brezza', label: 'Vitara Brezza' },
        { value: 'alto', label: 'Alto' },
        { value: 'wagon-r', label: 'Wagon R' },
      ],
      hyundai: [
        { value: 'i20', label: 'i20' },
        { value: 'creta', label: 'Creta' },
        { value: 'verna', label: 'Verna' },
        { value: 'grand-i10', label: 'Grand i10' },
      ],
      tata: [
        { value: 'nexon', label: 'Nexon' },
        { value: 'tiago', label: 'Tiago' },
        { value: 'harrier', label: 'Harrier' },
        { value: 'altroz', label: 'Altroz' },
      ],
      mahindra: [
        { value: 'xuv700', label: 'XUV700' },
        { value: 'scorpio', label: 'Scorpio' },
        { value: 'thar', label: 'Thar' },
        { value: 'bolero', label: 'Bolero' },
      ],
      honda: [
        { value: 'city', label: 'City' },
        { value: 'amaze', label: 'Amaze' },
        { value: 'jazz', label: 'Jazz' },
        { value: 'civic', label: 'Civic' },
      ],
      toyota: [
        { value: 'innova', label: 'Innova Crysta' },
        { value: 'fortuner', label: 'Fortuner' },
        { value: 'glanza', label: 'Glanza' },
        { value: 'camry', label: 'Camry' },
      ],
      ford: [
        { value: 'ecosport', label: 'EcoSport' },
        { value: 'endeavour', label: 'Endeavour' },
        { value: 'figo', label: 'Figo' },
      ],
      volkswagen: [
        { value: 'polo', label: 'Polo' },
        { value: 'vento', label: 'Vento' },
        { value: 'tiguan', label: 'Tiguan' },
      ],
    },
    years: Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i),
  };

  const handleSearch = () => {
    if (selectedMake && selectedModel && selectedYear) {
      const searchParams = new URLSearchParams({
        make: selectedMake,
        model: selectedModel,
        year: selectedYear,
      });
      navigate(`/parts?${searchParams.toString()}`);
    }
  };

  const selectedMakeData = vehicleData.makes.find(make => make.value === selectedMake);
  const availableModels = selectedMake ? vehicleData.models[selectedMake as keyof typeof vehicleData.models] || [] : [];

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-deep mb-4">Select Your Vehicle</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your vehicle's make, model, and year to find the perfect parts that fit your needs
          </p>
        </div>

        {/* Vehicle Selection Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Make Selection */}
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Make
              </label>
              <select
                id="make"
                value={selectedMake}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  setSelectedModel(''); // Reset model when make changes
                }}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Make</option>
                {vehicleData.makes.map((make) => (
                  <option key={make.value} value={make.value}>
                    {make.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Selection */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Model
              </label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedMake}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Model</option>
                {availableModels.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selection */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturing Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Year</option>
                {vehicleData.years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Vehicle Display */}
          {selectedMake && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Vehicle:</h3>
              <div className="text-lg font-semibold text-deep">
                {selectedMakeData?.label}
                {selectedModel && ` ${availableModels.find(m => m.value === selectedModel)?.label}`}
                {selectedYear && ` (${selectedYear})`}
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="text-center">
            <Button
              onClick={handleSearch}
              disabled={!selectedMake || !selectedModel || !selectedYear}
              size="lg"
              className="px-8"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Compatible Parts
            </Button>
          </div>
        </div>

        {/* Popular Vehicle Quick Links */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-deep mb-6 text-center">Popular Vehicles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { make: 'maruti', model: 'swift', year: '2023', label: 'Swift 2023' },
              { make: 'hyundai', model: 'creta', year: '2023', label: 'Creta 2023' },
              { make: 'tata', model: 'nexon', year: '2023', label: 'Nexon 2023' },
              { make: 'mahindra', model: 'xuv700', year: '2023', label: 'XUV700 2023' },
            ].map((vehicle) => (
              <button
                key={`${vehicle.make}-${vehicle.model}-${vehicle.year}`}
                onClick={() => {
                  setSelectedMake(vehicle.make);
                  setSelectedModel(vehicle.model);
                  setSelectedYear(vehicle.year);
                }}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="font-medium text-deep">{vehicle.label}</div>
                <div className="text-sm text-gray-500 mt-1">Quick select</div>
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-deep mb-4">Need Help Finding Your Vehicle?</h3>
          <p className="text-gray-600 mb-6">
            Can't find your vehicle in our list? Our support team can help you identify compatible parts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">Contact Support</Button>
            <Button variant="ghost">Browse All Parts</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelection;