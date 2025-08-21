import React from 'react';
import { Package, ShoppingCart, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'package' | 'cart' | 'search';
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'package',
  title,
  description,
  action,
  className = '',
}) => {
  const icons = {
    package: Package,
    cart: ShoppingCart,
    search: Search,
  };

  const Icon = icons[icon];

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;