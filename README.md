# task-manager
Task Manager powered by NestJS and Vue.js

# Project Structure
```bash
task-manager/
│
├── api/                # NestJS api
│   ├── src/            # Source files
│   ├── dist/           # Compiled files (generated during build)
│   ├── node_modules/   # Node.js modules (generated after npm install)
│   ├── package.json    # api dependencies and scripts
│   └── Dockerfile      # Docker configuration for api
│
├── api/                # Vue.js api
│   ├── public/         # Public assets
│   ├── src/            # Source files
│   ├── dist/           # Built files (generated during build)
│   ├── node_modules/   # Node.js modules (generated after npm install)
│   ├── package.json    # api dependencies and scripts
│   └── Dockerfile      # Docker configuration for api
│
├── shared/             # Shared code, configuration, or resources
│
├── docker-compose.yml  # Docker Compose configuration for multi-container setup
└── Readme.md           # Documentation
```

## Setup Instructions

### Prerequisites

-   Docker installed on your machine (Install Docker)

### Steps to Setup

1.  **Clone the repository**
    
    ```bash
    git clone https://github.com/veehhk/task-manager.git
    cd task-manager
    ```
    
2.  **Option 1. Build and run using npm command line**
    
    ```bash
    npm run start
    ```
    
2.  **Option 2. Build and run using Docker containers**
    
    ```bash
    docker-compose up --build
    ```

    This command will build and start both the api and api Docker containers.
    
3.  **Access the application**
    
    -   api API: Open your browser and go to `http://localhost:3000`
    -   api Vue.js app: Open your browser and go to `http://localhost:8080`