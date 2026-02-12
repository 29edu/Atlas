# Project Structure

This document describes the organized file structure of the Atlas project.

## Backend Structure

```
backend/src/
├── modules/                    # Feature-based modules
│   ├── auth/                   # Authentication module
│   │   ├── auth.model.js      # User model
│   │   ├── auth.controller.js # Auth controllers (login, signup)
│   │   ├── auth.routes.js     # Auth routes
│   │   └── index.js           # Module exports
│   │
│   ├── products/              # Products module
│   │   ├── product.model.js   # Product model
│   │   ├── product.controller.js  # (To be created)
│   │   ├── product.routes.js      # (To be created)
│   │   └── index.js
│   │
│   ├── cart/                  # Shopping cart module
│   │   ├── cart.model.js      # Cart model
│   │   ├── cart.controller.js     # (To be created)
│   │   ├── cart.routes.js         # (To be created)
│   │   └── index.js
│   │
│   ├── orders/                # Orders module
│   │   ├── order.model.js     # Order model
│   │   ├── order.controller.js    # (To be created)
│   │   ├── order.routes.js        # (To be created)
│   │   └── index.js
│   │
│   └── tasks/                 # Task queue handlers
│       ├── emailHandler.js    # Email task handler
│       ├── paymentHandler.js  # Payment task handler
│       ├── imageHandler.js    # Image processing handler
│       └── index.js           # Task handlers registry
│
├── shared/                    # Shared resources
│   ├── config/                # Configuration files
│   │   ├── db.js             # Database connection
│   │   └── jwt.config.js     # JWT configuration
│   │
│   ├── middlewares/           # Express middlewares
│   │   └── auth.middleware.js # Authentication middleware
│   │
│   └── utils/                 # Utility functions
│
├── core/                      # Task queue core functionality
│   ├── Queue.js              # Abstract queue interface
│   ├── InMemoryQueue.js      # In-memory queue implementation
│   ├── RedisQueue.js         # Redis queue implementation
│   └── Task.js               # Task class
│
├── workers/                   # Worker processes
│   ├── Worker.js             # Base worker class
│   └── RedisWorker.js        # Redis worker implementation
│
├── monitors/                  # Health monitoring
│   └── HealthMonitor.js      # System health monitor
│
├── examples/                  # Example implementations
│   └── emailTask.js          # Email task example
│
└── server.js                 # Main application entry point
```

## Frontend Structure

```
frontend/src/
├── features/                  # Feature-based modules
│   ├── auth/                  # Authentication feature
│   │   ├── components/        # Auth-specific components
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignUpForm.jsx
│   │   │
│   │   ├── pages/            # Auth pages
│   │   │   └── LoginPage.jsx
│   │   │
│   │   ├── hooks/            # Auth custom hooks (to be created)
│   │   ├── services/         # Auth API services (to be created)
│   │   ├── routes/           # Auth routing
│   │   │   └── auth.routes.jsx
│   │   │
│   │   └── index.js          # Feature exports
│   │
│   ├── products/             # Products feature (to be created)
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   │
│   ├── cart/                 # Shopping cart feature (to be created)
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   │
│   ├── orders/               # Orders feature (to be created)
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   │
│   └── dashboard/            # Dashboard feature (to be created)
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       └── index.js
│
├── shared/                   # Shared resources
│   ├── components/           # Reusable components
│   ├── layouts/              # Layout components
│   ├── hooks/                # Shared custom hooks
│   └── utils/                # Utility functions
│
├── App.jsx                   # Main App component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

## Module Organization Principles

### Backend Modules

Each module follows this pattern:

- **Model**: Database schema and model definition
- **Controller**: Request handlers and business logic
- **Routes**: API endpoint definitions
- **Service** (optional): Complex business logic separated from controllers
- **index.js**: Centralized exports for the module

### Frontend Features

Each feature follows this pattern:

- **Components**: UI components specific to the feature
- **Pages**: Full page components
- **Hooks**: Custom React hooks for the feature
- **Services**: API calls and data fetching
- **Routes**: Feature-specific routing
- **index.js**: Centralized exports for the feature

## Import Guidelines

### Backend

```javascript
// Import from modules
import { User, login, signUp, authRoutes } from "./modules/auth/index.js";

// Import from shared
import connectDB from "./shared/config/db.js";
import authMiddleware from "./shared/middlewares/auth.middleware.js";
```

### Frontend

```javascript
// Import from features
import { LoginForm, SignUpForm, AuthRoutes } from "./features/auth";

// Import from shared
import Button from "./shared/components/Button";
import useAuth from "./shared/hooks/useAuth";
```

## Next Steps

### Backend

1. Create controllers for products, cart, and orders
2. Create routes for each module
3. Add service layer for complex business logic
4. Implement API endpoints for CRUD operations

### Frontend

1. Create dashboard page
2. Implement product listing and details pages
3. Build cart functionality
4. Create checkout and order management
5. Add authentication context and protected routes
6. Implement API service layer with axios

## Benefits of This Structure

1. **Modularity**: Each feature is self-contained
2. **Scalability**: Easy to add new features without affecting existing code
3. **Maintainability**: Clear separation of concerns
4. **Reusability**: Shared components and utilities in one place
5. **Team Collaboration**: Different developers can work on different modules
6. **Testing**: Easier to test isolated modules
7. **Code Discovery**: Intuitive file organization
