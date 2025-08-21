# Epartnic - E-commerce Auto Parts Platform

A modern, full-featured e-commerce platform for automotive parts built with React, TypeScript, Firebase, and Tailwind CSS.

## 🚀 Features

- **Multi-role Authentication**: Customer, Partner, and Admin roles with Firebase Auth
- **Vehicle-based Search**: Find parts by selecting your vehicle make, model, and year
- **Shopping Cart**: Persistent cart with localStorage integration
- **Address Management**: Save and manage multiple delivery addresses
- **Secure Checkout**: Mock payment system with Razorpay integration placeholder
- **Order Tracking**: Complete order management system
- **Partner Dashboard**: Inventory management for parts sellers
- **Admin Dashboard**: User and order management with analytics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Database**: Firebase Firestore for data persistence

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + PostCSS
- **Routing**: React Router v6 with lazy loading
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage (for future file uploads)
- **Forms**: React Hook Form + Yup validation
- **State Management**: React Context + localStorage
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/           # Navbar, Footer
│   ├── UI/              # Reusable components
│   ├── Home/            # Landing page
│   ├── Auth/            # Authentication pages
│   ├── Vehicle/         # Vehicle selection
│   ├── Parts/           # Product listing and details
│   ├── Cart/            # Shopping cart
│   ├── Address/         # Address management
│   ├── Checkout/        # Checkout flow
│   ├── Orders/          # Order management
│   ├── Partner/         # Partner dashboard
│   └── Admin/           # Admin dashboard
├── contexts/            # React contexts
├── services/            # Firebase and payment services
├── types/               # TypeScript definitions
├── utils/               # Utility functions
├── config/              # Firebase configuration
├── seed/                # Sample data and seeding
└── styles/              # Global styles and themes
```

## 🎨 Design System

### Brand Colors
- **Primary Orange**: `#F28C28`
- **Dark Teal**: `#1C3C3A`
- **Warm Background**: `#F5ECE7`

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd epartnic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   
   # Optional: For Razorpay integration
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key
   ```

4. **Firebase Setup**
   - Create a new Firebase project
   - Enable Authentication with Email/Password
   - Create Firestore database
   - Add your web app and copy the configuration

5. **Configure Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
       match /addresses/{uid}/{doc} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
       match /orders/{doc} {
         allow create: if request.auth != null;
         allow read: if request.auth != null && 
           (resource.data.userId == request.auth.uid);
         allow update, delete: if false;
       }
       match /products/{doc} {
         allow read: if true;
         allow write: if false; // Update for admin/partner access
       }
     }
   }
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### Seeding Sample Data

In development mode, you can seed the database with sample products:

```javascript
// Open browser console and run:
seedDatabase()
```

## 🔧 Configuration

### Payment Integration

The app includes both mock payment and Razorpay integration:

#### Mock Payments (Default)
- Automatically enabled in development
- 80% success rate for testing
- No additional setup required

#### Razorpay Integration
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from the dashboard
3. Add `VITE_RAZORPAY_KEY_ID` to your `.env` file
4. The app will automatically detect and use Razorpay when configured

To switch between payment methods, check the `RazorpayService.isEnabled()` method in your checkout flow.

## 🔒 Authentication & Authorization

### User Roles
- **Customer**: Browse products, place orders, manage profile
- **Partner**: Manage inventory, view orders, access seller dashboard
- **Admin**: Manage users, orders, and platform analytics

### Protected Routes
Routes are protected based on authentication status and user roles using the `ProtectedRoute` component.

## 📱 Features Overview

### For Customers
- Vehicle-based part discovery
- Advanced filtering and search
- Shopping cart with persistence
- Multiple address management
- Order tracking and history
- Secure checkout process

### For Partners
- Inventory management dashboard
- Order fulfillment tracking
- Sales analytics
- Product catalog management

### For Admins
- User management
- Order oversight
- Platform analytics
- Dispute resolution queue

## 🧪 Testing

### User Flow Testing
1. **Registration & Login**: Create account → Login → Access protected areas
2. **Shopping Flow**: Vehicle selection → Browse parts → Add to cart → Checkout
3. **Order Management**: Place order → Track status → View history
4. **Address Management**: Add → Edit → Delete → Set default

### Role-based Testing
- Test customer, partner, and admin role restrictions
- Verify dashboard access permissions
- Check data visibility based on user roles

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting (Optional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🛡️ Security Best Practices

- Environment variables for sensitive data
- Firebase security rules for data protection
- Input validation with Yup schemas
- Protected routes with role-based access
- Sanitized user inputs

## 🔄 State Management

- **Authentication**: React Context with Firebase Auth
- **Shopping Cart**: React Context with localStorage persistence
- **Form State**: React Hook Form for complex forms
- **UI State**: Local component state with hooks

## 📊 Analytics & Monitoring

The app includes basic analytics tracking:
- User registration and login events
- Product views and purchases
- Cart abandonment tracking
- Order completion rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue for bugs or feature requests
- Refer to Firebase documentation for backend issues

## 🔮 Future Enhancements

- Real-time chat support
- Advanced analytics dashboard
- Mobile app with React Native
- Inventory management automation
- Advanced payment options
- Multi-language support
- Social media integration