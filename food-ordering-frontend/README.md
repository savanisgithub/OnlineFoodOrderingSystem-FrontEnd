# Online Food Ordering System - Frontend

A modern, responsive React-based frontend application for an online food ordering platform. Built with TypeScript, Vite, and Tailwind CSS, this application provides a seamless user experience for browsing, ordering, and managing food deliveries.

## 🌟 Features

- **User Authentication**
  - Secure sign-up and sign-in functionality
  - JWT-based authentication
  - Protected routes for authenticated users
  - Session management

- **Food Browsing & Search**
  - Browse food items by category
  - Product details with images and descriptions
  - Real-time search functionality
  - Category filtering

- **Shopping Cart**
  - Add/remove items from cart
  - Quantity management
  - Cart persistence
  - Real-time cart badge updates
  - Checkout process

- **Order Management**
  - Place new orders
  - View order history
  - Track order status
  - Cancel orders (if eligible)

- **Payment Processing**
  - Secure payment integration
  - Multiple payment methods
  - Payment history tracking
  - Payment status verification

- **Admin Dashboard**
  - Order management
  - User analytics
  - Inventory management

- **Responsive Design**
  - Mobile-first approach
  - Fully responsive UI
  - Cross-browser compatibility

## 🛠 Tech Stack

- **Frontend Framework:** React 19.2.5
- **Language:** TypeScript 6.0
- **Build Tool:** Vite 8.0
- **Styling:** Tailwind CSS 4.2
- **HTTP Client:** Axios 1.16
- **Routing:** React Router DOM 7.15
- **Icons:** Lucide React 1.14
- **Package Manager:** npm or yarn
- **Code Quality:**
  - ESLint 10.2
  - TypeScript ESLint 8.58

## 📁 Project Structure

```
food-ordering-frontend/
├── public/                    # Static assets
├── src/
│   ├── api/                  # API integration layer
│   │   ├── axiosInstance.ts  # Axios configuration
│   │   ├── cartApi.ts        # Cart endpoints
│   │   ├── categoryApi.ts    # Category endpoints
│   │   ├── foodApi.ts        # Food items endpoints
│   │   ├── orderApi.ts       # Order endpoints
│   │   └── paymentApi.ts     # Payment endpoints
│   ├── assets/               # Images, fonts, and media
│   ├── components/           # Reusable React components
│   │   ├── cart/            # Cart-related components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── context/             # React Context (Auth, Cart)
│   ├── pages/               # Page components
│   │   ├── AdminDashboardPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── FoodsPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── PaymentHistoryPage.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── SignInPage.tsx
│   │   ├── SignUpPage.tsx
│   │   └── HomePage/
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles
│   └── App.css              # App component styles
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── README.md                # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher) or **yarn** (v1.22 or higher)
- **Git** (optional, for version control)

## 🚀 Installation

1. **Clone the repository** (if using Git):
   ```bash
   git clone <repository-url>
   cd food-ordering-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   Or with yarn:
   ```bash
   yarn install
   ```

## 💻 Development

### Start Development Server

Run the development server with hot module replacement (HMR):

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

This command:
- Compiles TypeScript
- Bundles and minifies the code
- Generates optimized assets in the `dist/` folder

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Code Quality

Run ESLint to check for code quality issues:

```bash
npm run lint
```

## 🔐 Authentication Flow

1. **Sign Up:** New users create an account with email and password
2. **Sign In:** Existing users log in with credentials
3. **Token Storage:** JWT token stored securely (localStorage/sessionStorage)
4. **Protected Routes:** Authenticated users redirected to home page; unauthenticated users redirected to sign-in
5. **Session Management:** Automatic token validation on app load

## 🛒 Shopping Cart Context

The application uses React Context API to manage:
- Cart items and quantities
- Subtotal and total calculations
- Cart persistence across sessions

## 📡 API Integration

The application communicates with the backend API using Axios with:
- Base URL configuration from environment variables
- Request/response interceptors
- Error handling and retry logic
- Token-based authentication headers

### API Endpoints Used:

- **Authentication:** `/auth/signup`, `/auth/signin`
- **Food Items:** `/foods`, `/foods/{id}`, `/foods/category/{categoryId}`
- **Categories:** `/categories`
- **Cart:** `/cart`, `/cart/items`, `/cart/checkout`
- **Orders:** `/orders`, `/orders/{id}`, `/orders/user`
- **Payments:** `/payments`, `/payments/history`, `/payments/{orderId}`

## 🎨 Styling

The project uses **Tailwind CSS** for styling:
- Utility-first CSS framework
- Responsive design with breakpoints
- Custom theme configuration in `tailwind.config.js`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Food Ordering System
```

Update the values according to your backend setup.

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### Build Errors

Ensure TypeScript compilation passes:
```bash
npm run build
```

### CORS Issues

Ensure the backend server has proper CORS configuration to accept requests from the frontend origin.

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -am 'Add new feature'`
4. Push: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For issues, questions, or suggestions, please contact the development team or create an issue in the repository.

---

**Last Updated:** May 2026

**Version:** 1.0.0
