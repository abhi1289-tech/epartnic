import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { FirestoreService } from '../../services/FirestoreService';
import { useAuth } from '../../contexts/AuthContext';
import { Address } from '../../types';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';
import Toast from '../UI/Toast';

const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userAddresses = await FirestoreService.getAddresses(user.uid);
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setToast({ type: 'error', message: 'Failed to load addresses' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;

    try {
      // First, unset all other addresses as default
      const updatePromises = addresses.map(addr => {
        if (addr.id !== addressId && addr.isDefault) {
          return FirestoreService.updateAddress(user.uid, addr.id, { isDefault: false });
        }
        return Promise.resolve();
      });
      
      await Promise.all(updatePromises);
      
      // Set the selected address as default
      await FirestoreService.updateAddress(user.uid, addressId, { isDefault: true });
      
      setToast({ type: 'success', message: 'Default address updated' });
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      setToast({ type: 'error', message: 'Failed to update default address' });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await FirestoreService.deleteAddress(user.uid, addressId);
      setToast({ type: 'success', message: 'Address deleted successfully' });
      await loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      setToast({ type: 'error', message: 'Failed to delete address' });
    }
  };

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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-deep">Address Book</h1>
            <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
          </div>
          <Link to="/addresses/new">
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </Link>
        </div>

        {addresses.length === 0 ? (
          <EmptyState
            icon="package"
            title="No addresses saved"
            description="Add your first delivery address to make checkout faster and easier."
            action={
              <Link to="/addresses/new">
                <Button size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Address
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative"
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-primary text-white px-2 py-1 rounded-full text-sm font-medium">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Default
                    </div>
                  </div>
                )}

                {/* Address Details */}
                <div className="mb-4">
                  <div className="flex items-start mb-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-deep text-lg mb-1">
                        {address.fullName}
                      </h3>
                      <p className="text-gray-600 text-sm">{address.phone}</p>
                    </div>
                  </div>

                  <div className="ml-8 text-gray-700 space-y-1">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    <p>{address.country}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Link to={`/addresses/edit/${address.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>

                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-primary hover:text-primary-dark"
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        {addresses.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-semibold text-deep mb-2">Address Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Your default address will be selected automatically during checkout</li>
              <li>• You can add multiple addresses for home, office, or other locations</li>
              <li>• Make sure all address details are accurate for smooth delivery</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBook;