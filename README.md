# Agrivision 🌱

Agrivision is a comprehensive digital agriculture platform that connects farmers, suppliers, and consumers in a seamless online ecosystem. The platform enables users to browse agricultural products and services, manage listings, communicate via real-time chat, and access news and information related to modern farming practices.

## Features

### 🧑‍🌾 User Management

- **Multi-role System**: Admin, Regular Users, and Agents
- **User Authentication**: Secure login/signup with JWT tokens
- **Profile Management**: Complete user profiles with location, bio, and preferences
- **OTP Verification**: Phone number verification for account security

### 📋 Agriculture Listings

- **Product/Service Listings**: Agents can create and manage agricultural listings
- **Image Upload**: Multiple image support for listings
- **Approval System**: Admin approval workflow for new listings
- **Status Management**: Pending, Approved, Rejected states

### 💬 Real-time Chat

- **Instant Messaging**: Real-time communication between users
- **Message Types**: Support for text, images, videos, audio, and documents
- **Online Status**: User presence indicators
- **Chat History**: Persistent message storage

### 📰 Content Management

- **News Section**: Latest agricultural news and updates
- **Services**: Agricultural services and consultations
- **FAQs**: Frequently asked questions
- **CMS**: Privacy Policy, Terms & Conditions, About Us pages

### 📊 Admin Dashboard

- **User Management**: View and manage all users
- **Listing Approval**: Review and approve agent listings
- **Analytics**: Dashboard with charts and statistics
- **Content Management**: Manage news, services, and FAQs

### 🌐 Website Features

- **Public Website**: Marketing pages for non-registered users
- **Contact Forms**: Inquiry submission system
- **Social Media Integration**: Links to social platforms

## Tech Stack

### Frontend

- **React 18.3.1**: Modern JavaScript library for building user interfaces
- **Redux Toolkit**: State management for complex application state
- **React Router**: Client-side routing
- **Material-UI**: Component library for consistent UI
- **Socket.io Client**: Real-time communication
- **Axios**: HTTP client for API requests
- **Leaflet**: Interactive maps for location services

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MySQL**: Relational database management system
- **Sequelize**: ORM for database operations
- **Socket.io**: Real-time bidirectional communication
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Nodemailer**: Email sending functionality

### Development Tools

- **Create React App**: Frontend build setup
- **Nodemon**: Automatic server restart during development
- **Morgan**: HTTP request logger
- **CORS**: Cross-origin resource sharing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MySQL** (v8.0 or higher)
- **Git** for version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd agrivision
```

### 2. Database Setup

1. Install MySQL and create a database named `agrivision`
2. Import the database schema from `agrivision.sql`:

```bash
mysql -u root -p agrivision < agrivision.sql
```

3. Update database credentials in `server/config/config.json` if needed

### 3. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:

```env
PORT=4888
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=agrivision
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4. Frontend Setup

```bash
cd ../client
npm install
```

## Running the Application

### Development Mode

1. **Start the Backend Server**:

```bash
cd server
npm start
```

The server will run on `http://localhost:4888`

2. **Start the Frontend**:

```bash
cd client
npm start
```

The React app will run on `http://localhost:3000`

### Production Build

1. **Build the Frontend**:

```bash
cd client
npm run build
```

2. **Start the Server** (it serves the built React app):

```bash
cd server
npm start
```

The application will be available at `http://localhost:4888`

## API Endpoints

### Authentication

- `POST /user/login` - User login
- `POST /user/register` - User registration
- `POST /user/verify-otp` - OTP verification

### Admin Routes

- `GET /admin/users` - Get all users
- `GET /admin/listings` - Get agriculture listings
- `POST /admin/approve-listing` - Approve/reject listings
- `GET /admin/dashboard-stats` - Dashboard statistics

### User Routes

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/listings` - Get user's listings

### Website Routes

- `GET /website/news` - Get news articles
- `GET /website/services` - Get services
- `POST /website/contact` - Submit contact inquiry

### Chat Routes

- `POST /chat/send-message` - Send message
- `GET /chat/messages/:chatId` - Get chat messages

## Project Structure

```
agrivision/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── Admin/         # Admin panel components
│   │   ├── Website/       # Public website components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controller/        # Route controllers
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── socket/            # Socket.io handlers
│   └── package.json
├── agrivision.sql         # Database schema
└── README.md             # Project documentation
```

## Default Credentials

### Admin Account

- **Email**: admin@gmail.com
- **Password**: admin123 (or check the hashed password in SQL)

### Sample Users

Several test users are included in the database with roles:

- Regular users (role: 1)
- Agents (role: 2)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@agrivision.com or join our Discord community.

---

**Agrivision** - Transforming Agriculture Through Technology 🚜</content>
<parameter name="filePath">f:\Cqlsys\agrivision\README.md
