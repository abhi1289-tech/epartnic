import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Building, Camera, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import Toast from '../UI/Toast';

const schema = yup.object({
  displayName: yup.string().required('Display name is required'),
  companyName: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      displayName: user?.displayName || '',
      companyName: user?.companyName || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // In a real app, you would update the user profile here
      // For now, we'll just show a success message
      setToast({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to update profile. Please try again.' });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg py-12">
      {toast && (
        <Toast
          type={toast.type as any}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark px-8 py-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || user.email}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-primary" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white rounded-full p-2 transition-colors duration-200">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white">
                  {user.displayName || 'User Profile'}
                </h1>
                <p className="text-primary-dark">{user.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-deep mb-6">Profile Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      {...register('displayName')}
                      type="text"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                </div>

                {user.role === 'partner' && (
                  <div className="md:col-span-2">
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <input
                        {...register('companyName')}
                        type="text"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your company name"
                      />
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Account Stats */}
          <div className="bg-gray-50 px-8 py-6">
            <h3 className="text-lg font-semibold text-deep mb-4">Account Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">₹0</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-gray-600">Saved Addresses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;