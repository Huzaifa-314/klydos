# Klydos

**AI-Powered Quality Assurance Platform for Web Applications**

Klydos is an AI-powered Java web application that automates website testing by generating, executing, and analyzing test cases based on application behavior. It saves time and improves accuracy by eliminating the need for manual testing and constantly updating automation scripts.

## Introduction

Testing modern web apps is time-consuming and complex. Manual testing is slow, and automation scripts require constant updates. Klydos automates website testing by generating, executing, and analyzing test cases based on app behavior, saving time and improving accuracy.

## Scope

Klydos is a centralized, AI-powered Quality Assurance platform that utilizes autonomous agents to test web applications. The platform focuses on three key areas:

1. **Functionality Testing**: AI agents understand application requirements and user stories to automatically generate and execute functional tests. These agents identify and report bugs with high accuracy, ensuring all features work as intended.

2. **Customer Experience Evaluation**: AI agents simulate real user behavior, navigating the website, completing tasks, and providing feedback on usability and overall experience. By analyzing user journeys and identifying points of friction, these agents provide valuable insights on areas that need optimization.

3. **Form & Endpoint Testing**: Users define form or endpoint behaviors. The AI agent tests them and reports results with suggestions.

## Technology Stack

- **Backend Framework**: Laravel 12
- **PHP Version**: 8.2+
- **AI Integration**: Python (via REST API), NLP-based test generation
- **Database**: MySQL
- **Frontend**: Vite, Tailwind CSS
- **Package Manager**: Composer, npm

## Features

### 1. User Management
- Anonymous user access with limited features
- User registration and authentication
- Role-based access control (Anonymous, Registered, Admin)
- Admin dashboard for user management

### 2. Test Definition & Configuration
- Define application behavior (test cases, user stories)
- Upload or describe functional requirements

### 3. AI-Powered Test Generation
- NLP-driven analysis of requirements
- Automatic generation of functional test cases
- Autonomous agents for understanding system workflow
- Smart test case optimization and deduplication

### 4. Automated Test Execution
- AI agents execute generated tests autonomously
- Cross-browser and workflow simulation
- Ability to simulate real user actions and journeys
- Backend and endpoint testing support

### 5. Bug Detection & Analysis
- Automatic identification of UI/UX issues
- Functional bug reporting with detailed breakdowns
- Screenshots, logs, and trace outputs for failed tests

### 6. Customer Experience Evaluation
- AI-based user journey simulation
- Usability scoring and feedback generation
- Detection of friction points in workflows

### 7. Results & Insights
- Real-time test execution results
- Historical test results tracking
- Detailed analytics and reporting

### 8. System Monitoring & Admin Tools
- Overview of all tests executed by users
- Platform activity logs
- Resource usage and health overview

## User Roles

1. **Anonymous User**: View basic info and register
2. **Registered User**: Define inputs, generate tests, view results
3. **Admin User**: Manage users and monitor system activity

## Use Cases

1. Register account
2. Define system behavior
3. Generate AI-driven test cases
4. Run tests and get results
5. Analyze history and insights

## Installation & Setup

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js and npm
- MySQL 5.7+ or MariaDB 10.3+
- Python 3.x (for AI service integration)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd klydos
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

### Step 3: Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

Edit the `.env` file and configure:
- Database connection settings
- AI service API endpoint (Python REST API)
- Application URL
- Mail configuration (if needed)

### Step 4: Database Setup

```bash
php artisan migrate
php artisan db:seed  # Optional: seed initial data
```

### Step 5: Install Frontend Dependencies

```bash
npm install
```

### Step 6: Build Frontend Assets

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

## Running the Project

### Development Mode

Run the development server with all services:

```bash
composer run dev
```

This command runs:
- Laravel development server
- Queue worker
- Log viewer (Pail)
- Vite dev server

Or run services individually:

```bash
# Start Laravel server
php artisan serve

# Start queue worker (in separate terminal)
php artisan queue:listen

# Start Vite dev server (in separate terminal)
npm run dev
```

### Production Mode

1. Build frontend assets:
```bash
npm run build
```

2. Optimize Laravel:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. Start the server:
```bash
php artisan serve
```

### Quick Setup Script

For a complete setup in one command:

```bash
composer run setup
```

This will:
- Install Composer dependencies
- Create `.env` file if it doesn't exist
- Generate application key
- Run database migrations
- Install npm dependencies
- Build frontend assets

## Testing

Run the test suite:

```bash
composer run test
```

Or directly:

```bash
php artisan test
```

## Project Structure

```
klydos/
├── app/                    # Application core
│   ├── Http/              # Controllers, Middleware
│   ├── Models/            # Eloquent models
│   └── Providers/         # Service providers
├── config/                 # Configuration files
├── database/               # Migrations, seeders, factories
├── public/                 # Public assets
├── resources/              # Views, CSS, JS
├── routes/                 # Route definitions
├── storage/                # Logs, cache, uploads
└── tests/                  # Test files
```

## AI Service Integration

Klydos integrates with a Python-based AI service via REST API for:
- NLP-driven test case generation
- Autonomous test execution
- Bug detection and analysis
- User experience evaluation

Ensure the AI service is running and accessible at the configured endpoint in your `.env` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
