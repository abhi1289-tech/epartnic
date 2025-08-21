import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MapPin, User, Phone, Home, Save, ArrowLeft } from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { useAuth } from '../../contexts/AuthContext';
import { Address } from '../../types';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Toast from '../UI/Toast';

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  phone: yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .required('Phone number is required'),
  line1: yup.string().required('Address line 1 is required'),
  line2: yup.string().optional(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string()
    .matches(/^\d{6}$/, 'Please enter a valid 6-digit PIN code')
    .required('PIN code is required'),
  country: yup.string().default('India'),
  isDefault: yup.boolean().default(false),
});

type FormData = yup.InferType<typeof schema>;

const AddressForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(!!id);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      country: 'India',
      isDefault: false,
    },
  });

  useEffect(() => {
    if (isEditing && user && id) {
      loadAddress();
    } else {
      setLoading(false);
    }
  }, [isEditing, user, id]);

  const loadAddress = async () => {
    if (!user || !id) return;

    try {
      const addresses = await FirestoreService.getAddresses(user.uid);
      const address = addresses.find(addr => addr.id === id);
      
      if (address) {
        setValue('fullName', address.fullName);
        setValue('phone', address.phone);
        setValue('line1', address.line1);
        setValue('line2', address.line2 || '');
        setValue('city', address.city);
        setValue('state', address.state);
        setValue('pincode', address.pincode);
        setValue('country', address.country);
        setValue('isDefault', address.isDefault);
      } else {
        setToast({ type: 'error', message: 'Address not found' });
        navigate('/addresses');
      }
    } catch (error) {
      console.error('Error loading address:', error);
      setToast({ type: 'error', message: 'Failed to load address' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    try {
      const addressData: Omit<Address, 'id'> = {
        fullName: data.fullName,
        phone: data.phone,
        line1: data.line1,
        line2: data.line2 || undefined,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country,
        isDefault: data.isDefault,
      };

      if (isEditing && id) {
        await FirestoreService.updateAddress(user.uid, id, addressData);
        setToast({ type: 'success', message: 'Address updated successfully' });
      } else {
        await FirestoreService.saveAddress(user.uid, addressData);
        setToast({ type: 'success', message: 'Address added successfully' });
      }

      setTimeout(() => {
        navigate('/addresses');
      }, 2000);
    } catch (error) {
      console.error('Error saving address:', error);
      setToast({ 
        type: 'error', 
        message: `Failed to ${isEditing ? 'update' : 'add'} address` 
      });
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8">
      {toast && (
        <Toast
          type={toast.type as any}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/addresses')}
            className="flex items-center text-gray-600 hover:text-primary mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Address Book
          </button>
          <h1 className="text-3xl font-bold text-deep">
            {isEditing ? 'Edit Address' : 'Add New Address'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update your delivery address' : 'Add a new delivery address to your account'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-deep mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register('fullName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter mobile number"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">+91</span>
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-deep mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    {...register('line1')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="House/Flat/Block no., Area, Street"
                  />
                  {errors.line1 && (
                    <p className="mt-1 text-sm text-red-600">{errors.line1.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="line2" className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    {...register('line2')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Landmark, Colony, Area"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      {...register('state')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      {...register('pincode')}
                      type="text"
                      maxLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="000000"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    {...register('country')}
                    type="text"
                    value="India"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-deep mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Preferences
              </h3>
              
              <div className="flex items-center">
                <input
                  {...register('isDefault')}
                  type="checkbox"
                  id="isDefault"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default delivery address
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                loading={isSubmitting}
                size="lg"
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Address' : 'Save Address'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;