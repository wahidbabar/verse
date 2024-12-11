# Full-Stack Book Store Application

## Overview
This README provides a comprehensive overview of your Full-Stack Book Store Application. It includes:

- An attractive project cover image
- Detailed feature descriptions
- Tech stack with badges
- Clear setup instructions for both frontend and backend
- Script descriptions
- Author information
- License details

## Features
- User authentication and authorization
- Book listing and management
- Secure payment processing with Stripe
- Cloud storage for book images with Cloudinary

## Tech Stack
- **Frontend:** React, Redux, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT, Firebase
- **Payments:** Stripe
- **Cloud Storage:** Cloudinary

## Setup Instructions

### Backend

1. **Create a `.env` file** with the following configurations:

    ```env
    DB_URL="your-mongodb-connection-string"
    JWT_SECRET_KEY="your-jwt-secret-key"
    STRIPE_SECRET_KEY="your-stripe-secret-key"
    STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
    CLIENT_URL="http://localhost:5173"
    FIREBASE_PROJECT_ID="your-firebase-project-id"
    CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
    CLOUDINARY_API_KEY="your-cloudinary-api-key"
    CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Start the backend server**:

    ```bash
    npm run start:dev
    ```

4. **Ensure MongoDB is running** and replace `DB_URL` with your credentials.

### Frontend

1. **Create a `.env` file** with the following configurations:

    ```env
    VITE_API_KEY="your-firebase-api-key"
    VITE_AUTH_DOMAIN="your-firebase-auth-domain"
    VITE_PROJECT_ID="your-firebase-project-id"
    VITE_STORAGE_BUCKET="your-firebase-storage-bucket"
    VITE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
    VITE_APP_ID="your-firebase-app-id"
    VITE_DEV_ENVIRONMENT="development"
    VITE_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
    API_URL="http://localhost:5000"
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Start the development server**:

    ```bash
    npm run dev
    ```

### Obtaining Credentials

- **MongoDB:** Sign up at MongoDB Atlas and create a new cluster. Obtain your connection string from the cluster's connection settings.
- **JWT Secret Key:** Generate a secure key using a tool like randomkeygen.
- **Stripe:** Sign up at Stripe and get your API keys from the Developers section.
- **Cloudinary:** Sign up at Cloudinary and get your API credentials from the Dashboard.
- **Firebase:** Go to the Firebase Console, create a new project, and obtain your configuration details from the project settings.

## Scripts

### Frontend Scripts

| Script        | Description                      |
| ------------- | -------------------------------- |
| `npm run dev` | Start development server         |
| `npm run build` | Build production-ready app      |
| `npm run preview` | Preview production build      |

### Backend Scripts

| Script        | Description                      |
| ------------- | -------------------------------- |
| `npm run start` | Start server in production mode |
| `npm run start:dev` | Start server in development mode |

## Author

**Name:** Akash Deep  
**Email:** contact.akashdeep023@gmail.com  
**LinkedIn:** Akash Deep

## License

This project is licensed under the MIT License.

---

Happy Coding! 🚀📖
