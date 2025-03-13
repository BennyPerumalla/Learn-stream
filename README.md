# EduLearn Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

A minimalist modern educational platform inspired by Khan Academy with organized courses and lessons. This platform provides structured learning paths through various subjects, tracks user progress, and awards achievements.

![EduLearn Dashboard Screenshot](https://via.placeholder.com/800x450.png?text=EduLearn+Dashboard)

## 🌟 Features

- 📚 **Organized Courses & Lessons**: Browse through various subjects and enroll in structured courses
- 📊 **Progress Tracking**: Track your learning progress across all courses
- 🏆 **Achievement System**: Earn achievements as you complete courses and maintain learning streaks
- 📅 **Learning Calendar**: Keep track of your study sessions with an integrated calendar view
- 📱 **Responsive Design**: Enjoy a seamless experience across desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: 
  - React 18
  - TailwindCSS
  - ShadcnUI (UI component library)
  - React Query (for data fetching)
  - Wouter (for routing)
  - Zod (for form validation)

- **Backend**: 
  - Node.js
  - Express.js
  - Drizzle ORM (with in-memory storage)

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 7 or higher) or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/edulearn-platform.git
   cd edulearn-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Environment setup (optional - for future database integration):
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running Locally

To start the application in development mode:

```bash
npm run dev
```

This will start both the backend server and the frontend development server. The application will be available at:

- Application URL: http://localhost:3000

### Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 📂 Project Structure

```
edulearn-platform/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── main.tsx       # Entry point
├── server/                # Backend Express server
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Data storage implementation
│   ├── index.ts           # Server entry point
│   └── vite.ts            # Vite server configuration
├── shared/                # Shared code between frontend and backend
│   └── schema.ts          # Data models and validation schemas
├── drizzle.config.ts      # Drizzle ORM configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## 🔄 API Endpoints

The backend provides the following RESTful API endpoints:

- `GET /api/subjects` - Get all subjects
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/lessons/:courseId` - Get lessons for a course
- `POST /api/enrollments` - Enroll in a course
- `GET /api/enrollments` - Get user's enrolled courses
- `GET /api/achievements` - Get all achievements
- `GET /api/user/achievements` - Get user's earned achievements
- `GET /api/user/streaks` - Get user's learning streaks

## 🔐 Authentication

The platform includes a simple authentication system using Express sessions. Users can:

- View their personalized dashboard
- Track progress across enrolled courses
- Earn and view achievements
- Maintain learning streaks

## 📋 Development Roadmap

- [ ] Add PostgreSQL database support
- [ ] Implement user authentication with JWT
- [ ] Create admin panel for content management
- [ ] Add quiz/assessment functionality
- [ ] Implement social learning features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Khan Academy](https://www.khanacademy.org/) for inspiration
- [ShadcnUI](https://ui.shadcn.com/) for the beautiful UI components
- [Replit](https://replit.com/) for development tools