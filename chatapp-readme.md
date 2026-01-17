# ChatApp - Real-Time Chat Application

A modern, real-time chat application built with .NET 9, React, TypeScript, SignalR, and PostgreSQL. Features Google OAuth authentication and persistent message storage.

![ChatApp](https://img.shields.io/badge/Chat-Real--Time-blue)
![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

## Features

✨ **Real-time Messaging** - Instant message delivery using SignalR WebSockets  
🔐 **Google OAuth Authentication** - Secure login with Google accounts  
💾 **Persistent Storage** - Messages saved to PostgreSQL database  
👤 **User Profiles** - Display Google profile pictures and usernames  
🎨 **Modern UI** - Beautiful gradient design with responsive layout  
📱 **Cross-Platform** - Works on Windows, macOS, and Linux  
🔒 **JWT Security** - Token-based authentication with JwtBearer  
⚡ **Fast & Scalable** - Built with ASP.NET Core and Vite

## Tech Stack

### Backend
- **.NET 8.0** - Modern web framework
- **ASP.NET Core Web API** - RESTful API endpoints
- **SignalR** - Real-time WebSocket communication
- **Entity Framework Core** - ORM for database operations
- **PostgreSQL** - Relational database
- **JWT Authentication** - Secure token-based auth
- **Google OAuth 2.0** - Third-party authentication

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **SignalR Client** - Real-time client library

## Prerequisites

Before you begin, ensure you have the following installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/download) (8.0 or later)
- [Node.js](https://nodejs.org/) (18.0 or later)
- [PostgreSQL](https://www.postgresql.org/download/) (14.0 or later)
- [Git](https://git-scm.com/downloads)
- A Google account for OAuth setup

## Project Structure

```
ChatApp/
├── ChatApp.Api/              # .NET Web API backend
│   ├── Controllers/          # API endpoints
│   ├── Hubs/                # SignalR hubs
│   ├── Data/                # Database context
│   ├── Services/            # Business logic
│   └── Program.cs           # Application entry point
├── ChatApp.Models/          # Shared data models
│   ├── User.cs
│   └── Message.cs
└── ChatApp.Client/          # React TypeScript frontend
    ├── src/
    │   ├── components/      # React components
    │   ├── contexts/        # React contexts
    │   ├── hooks/          # Custom hooks
    │   ├── types/          # TypeScript types
    │   └── App.tsx         # Main app component
    └── package.json
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chatapp.git
cd ChatApp
```

### 2. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`, `http://localhost:5296`
   - Authorized redirect URIs: `http://localhost:5296/signin-google`
5. Save your **Client ID** and **Client Secret**

### 3. Configure PostgreSQL

1. Install PostgreSQL if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE chatapp;
   ```
3. Note your PostgreSQL username and password

### 4. Configure Backend

1. Navigate to the API project:
   ```bash
   cd ChatApp.Api
   ```

2. Update `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=chatapp;Username=postgres;Password=YOUR_PASSWORD"
     },
     "Jwt": {
       "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
       "Issuer": "ChatApp",
       "Audience": "ChatAppUsers"
     },
     "Authentication": {
       "Google": {
         "ClientId": "YOUR_GOOGLE_CLIENT_ID",
         "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
       }
     }
   }
   ```

3. Install dependencies:
   ```bash
   dotnet restore
   ```

4. Run database migrations:
   ```bash
   dotnet ef database update
   ```

### 5. Configure Frontend

1. Navigate to the client project:
   ```bash
   cd ../ChatApp.Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API URLs in `src/components/Chat.tsx` and `src/components/Login.tsx` if your API runs on a different port (default is 5296)

### 6. Run the Application

**Terminal 1 - Start the API:**
```bash
cd ChatApp.Api
dotnet run
```
The API will start at `http://localhost:5296`

**Terminal 2 - Start the React app:**
```bash
cd ChatApp.Client
npm run dev
```
The app will start at `http://localhost:5173`

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

Click "Sign in with Google" and authenticate with your Google account.

## Usage

### Sending Messages
1. Log in with your Google account
2. Type your message in the input box at the bottom
3. Press Enter or click "Send"
4. Your message appears instantly for all connected users

### Multiple Users
1. Open the app in multiple browser windows or incognito mode
2. Log in with different Google accounts
3. Messages sent from one window appear in real-time in all windows

### Viewing Profile
- Your Google profile picture appears in the top-right corner
- Your username is displayed next to your profile picture
- Click "Logout" to sign out

## API Endpoints

### Authentication
- `GET /api/auth/google-login` - Initiate Google OAuth flow
- `GET /api/auth/google-callback` - Handle Google OAuth callback
- `GET /api/auth/verify?token=xxx` - Verify JWT token

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Messages
- `GET /api/messages` - Get all messages

### SignalR Hub
- `ws://localhost:5296/chathub` - WebSocket connection for real-time messaging
  - **Methods:**
    - `SendMessage(message: string)` - Send a message to all users
  - **Events:**
    - `ReceiveMessage(username, message, sentAt)` - Receive a new message
    - `UserJoined(username)` - User joined the chat

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| Id | int | Primary key |
| Username | string | User's display name |
| Email | string | User's email address |
| GoogleId | string | Google OAuth ID |
| ProfilePictureUrl | string | URL to profile picture |
| CreatedAt | datetime | Account creation timestamp |

### Messages Table
| Column | Type | Description |
|--------|------|-------------|
| Id | int | Primary key |
| UserId | int | Foreign key to Users |
| Content | string | Message text |
| SentAt | datetime | Message timestamp |

## Development

### Backend Development
```bash
cd ChatApp.Api
dotnet watch run  # Auto-reload on code changes
```

### Frontend Development
```bash
cd ChatApp.Client
npm run dev  # Vite dev server with hot reload
```

### Create New Migration
```bash
cd ChatApp.Api
dotnet ef migrations add MigrationName
dotnet ef database update
```

## Building for Production

### Backend
```bash
cd ChatApp.Api
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd ChatApp.Client
npm run build
# Output in dist/ folder
```

## Environment Variables

Create `.env` files for different environments:

**Backend (.NET)** - Use `appsettings.Production.json`

**Frontend (React)** - Create `.env.production`:
```
VITE_API_URL=https://your-api-domain.com/api
VITE_HUB_URL=https://your-api-domain.com/chathub
```

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify PostgreSQL is running
- Check connection string in `appsettings.json`
- Ensure database exists: `CREATE DATABASE chatapp;`

**Google OAuth Error**
- Verify Client ID and Secret in `appsettings.json`
- Check redirect URIs in Google Cloud Console
- Ensure URLs match exactly (including http/https)

**SignalR Connection Failed**
- Check CORS settings in `Program.cs`
- Verify JWT token is being sent with requests
- Check browser console for errors

**Messages Duplicating**
- Remove `React.StrictMode` in development
- Ensure proper cleanup in useEffect hooks
- Check for multiple SignalR connections

**Port Already in Use**
- API: Change port in `Properties/launchSettings.json`
- Frontend: Change port with `npm run dev -- --port 3000`

## Security Considerations

🔒 **Never commit sensitive data:**
- Keep `appsettings.json` out of version control (use `.gitignore`)
- Use environment variables for production
- Rotate JWT secret keys regularly
- Use HTTPS in production

## Performance Tips

⚡ **Optimize for production:**
- Enable response compression
- Use Azure SignalR Service for scaling
- Implement message pagination
- Add Redis caching for user sessions
- Use CDN for static assets

## Future Enhancements

Ideas for extending the application:

- [ ] Private/direct messaging
- [ ] Multiple chat rooms/channels
- [ ] Message editing and deletion
- [ ] File and image uploads
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Emoji reactions
- [ ] User presence (online/offline status)
- [ ] Message search
- [ ] Dark mode
- [ ] Push notifications
- [ ] Voice/video calls

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [ASP.NET Core](https://docs.microsoft.com/aspnet/core) - Backend framework
- [SignalR](https://docs.microsoft.com/aspnet/signalr) - Real-time communication
- [React](https://reactjs.org/) - Frontend library
- [Vite](https://vitejs.dev/) - Build tool
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Google Identity](https://developers.google.com/identity) - Authentication

## Support

For support, please open an issue in the GitHub repository or contact [your-email@example.com](mailto:your-email@example.com).

## Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

Made with ❤️ using .NET, React, and SignalR