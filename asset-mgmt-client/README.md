# Asset Management System - Frontend

A modern React frontend for the Asset Management System built with Vite, Tailwind CSS, and React Router.

## Features

- **Authentication System**: Login, register, and logout functionality
- **Role-based Access Control**: Admin and User roles with different permissions
- **Asset Management**: View, create, edit, and delete assets (Admin only)
- **Request Management**: Approve/reject asset requests (Admin only)
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean and intuitive design with Tailwind CSS

## Tech Stack

- **React 19**: Latest version with hooks and modern patterns
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Lucide React**: Beautiful icons
- **Headless UI**: Accessible UI components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── assets/
│   │   ├── Assets.jsx
│   │   └── AssetForm.jsx
│   ├── requests/
│   │   └── Requests.jsx
│   └── layout/
│       └── Navbar.jsx
├── contexts/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx
```

## API Integration

The frontend communicates with the backend API through the `api.js` service:

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT tokens with automatic refresh
- **Error Handling**: Centralized error handling with user-friendly messages

### Key API Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - User logout
- `GET /assets` - Get all assets
- `POST /assets` - Create asset (Admin only)
- `PUT /assets/:id` - Update asset (Admin only)
- `DELETE /assets/:id` - Delete asset (Admin only)
- `GET /requests` - Get all requests (Admin only)
- `POST /requests/:id/approve` - Approve request (Admin only)
- `POST /requests/:id/reject` - Reject request (Admin only)

## Features in Detail

### Authentication
- Secure login with email/password
- User registration with role selection
- Automatic token refresh
- Protected routes based on authentication status

### Asset Management
- View all assets with filtering and search
- Create new assets with form validation
- Edit existing assets
- Delete assets with confirmation
- Image URL support for asset photos

### Request Management
- View all asset requests
- Filter requests by status
- Approve or reject pending requests
- Real-time status updates

### Dashboard
- Overview statistics
- Quick action buttons
- Recent activity display

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design patterns
- Consistent color scheme
- Modern UI components
- Accessibility features

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration for code quality
- Consistent component structure
- Proper error handling
- TypeScript-like prop validation

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Upload the `dist` folder to your hosting service
3. Configure your hosting service to serve the `index.html` file for all routes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Asset Management System.
