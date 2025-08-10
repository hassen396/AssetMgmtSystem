# Asset Management System

A full-stack Asset Management System with a modern React frontend and a .NET backend API.

---

## Table of Contents

- [Frontend (React)](#frontend-react)
- [Backend API (ASP.NET Core)](#backend-api-aspnet-core)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Features in Detail](#features-in-detail)
- [Styling](#styling)
- [Development](#development)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

---

The following demo users are automatically created when you run the backend for the first time:

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | <admin@company.test>   | Admin123!  |
| User  | <user@company.test>    | User123!   |

> **Note:** These credentials are for demo/development purposes only.  
> For production, change the default passwords and emails in the seeder or disable demo user creation.

---

## Frontend (React)

A modern React frontend for the Asset Management System built with Vite, Tailwind CSS, and React Router.

### Features

- **Authentication System**: Login, register, and logout functionality
- **Role-based Access Control**: Admin and User roles with different permissions
- **Asset Management**: View, create, edit, and delete assets (Admin only)
- **Request Management**: Approve/reject asset requests (Admin only)
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean and intuitive design with Tailwind CSS

### Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Lucide React**
- **Headless UI**

### Getting Started (Frontend)

#### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see below)

#### Installation

1. Install dependencies:

    ```bash
    npm install
    ```

2. Start the development server:

    ```bash
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:5173`

#### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

---

## Backend API (ASP.NET Core)

The backend is built with ASP.NET Core and Entity Framework Core, providing authentication, asset, and request management APIs.

### Prerequisites

- [.NET 8+ SDK](https://dotnet.microsoft.com/download)
- PostgreSQL (or SQLite, depending on your configuration)
- (Optional) [EF Core CLI tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

### Getting Started (Backend)

1. **Navigate to the API directory:**

    ```bash
    cd AssetMgmtApi
    ```

2. **Restore dependencies:**

    ```bash
    dotnet restore
    ```

3. **Configure your database connection:**
    - Open `appsettings.json` or `appsettings.Development.json` in the `AssetMgmtApi` directory.
    - Update the `ConnectionStrings:DefaultConnection` section with your PostgreSQL username, password, host, and database name.  
      **Example:**

      ```json
      "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Port=5432;Database=assetmgmtdb;Username=your_username;Password=your_password"
      }
      ```

    - **Make sure to change the `Username` and `Password` to match your PostgreSQL setup.**

4. **Apply database migrations:**

    ```bash
    dotnet ef database update
    ```

    > If you don't have the EF CLI installed, run:  
    > `dotnet tool install --global dotnet-ef`

5. **Run the API:**

    ```bash
    dotnet run
    ```

6. **API will be available at:**
    - `https://localhost:5051` or
    - `http://localhost:5050`

### Useful Backend Commands

- **Create a new migration:**

    ```bash
    dotnet ef migrations add <MigrationName>
    ```

- **Update the database:**

    ```bash
    dotnet ef database update
    ```

- **Run the API:**

    ```bash
    dotnet run
    ```

### Configuration

- Edit `appsettings.Development.json` for database connection strings and other settings.
- Default connection string uses PostgreSQL; update as needed for your environment.
- **Remember to set your own PostgreSQL username and password in `appsettings.json` before running the application.**

---

## Demo Credentials

## Project Structure

```
AssetMgmtSystem/
├── AssetMgmtApi/         # ASP.NET Core backend API
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   └── ...
├── frontend/             # React frontend (see below)
│   └── src/
│       └── ...
└── README.md
```

### Frontend Structure

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

---

## API Integration

The frontend communicates with the backend API through the `api.js` service:

- **Base URL**: `http://localhost:5050/api` (update as needed)
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

---

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

---

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design patterns
- Consistent color scheme
- Modern UI components
- Accessibility features

---

## Development

### Available Scripts (Frontend)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration for code quality
- Consistent component structure
- Proper error handling
- TypeScript-like prop validation

---

## Deployment

### Frontend

1. Build the application: `npm run build`
2. Upload the `dist` folder to your hosting service
3. Configure your hosting service to serve the `index.html` file for all routes

### Backend

- Deploy the ASP.NET Core API to your preferred cloud provider or server.
- Update frontend API URLs as needed.

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

This project is part of the Asset Management System.
