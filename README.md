# Blueprint Assessment App
Clinical Assessment App

## Requirements
- NodeJS 24.0.0 — API server, Web application
- Docker — PostgreSQL
- Terminal

## How to Run Locally

1. Setup environment
   ```sh
   # From project root
   
   # Rename `.env.sample` to `.env`
   mv .env.sample .env
   
   # Install dependencies
   npm install
   
   # Start database (in terminal 1)
   docker compose up database
   
   # Build all packages
   npm run build
   
   # Setup database schema and seed data
   npm run db
   ```
2. Run the applications
   ```sh
   # Start API server (in terminal 2)
   npm run start:prod
   
   # Start web application (in terminal 3)
   npm run start:web
   ```

## Discussions

### Description of the problem and solution.

The ask is to provide a tool that allows a patient to take a diagnostic screener
using a platform. The problem is to build a platform for initiating diagnostic
screener assessments in a reduced scope. The solution was architect a baseline of
the platform that could theoretically reach feature parity with the current
production equivalent.

### Reasoning behind your technical choices:

Architecture solutions were highly motivated from the existing Blueprint job
post which provides a preview of the current platforms stack.

- Docker Foundations
  - because it would provide a dispensable backend ecosystem
  - allows quick initialization of a disposable database
  - backend server deployment in a docker container allows quick deployment and
    easier horizontal backend server scaling.
- NestJS made sense here since there are plenty of features to build out and a
  good framework would allow extensibility with ease.
- DrizzleORM was chosen because it’s serverless friendly, feels close to SQL,
  highly optimized for performance (low overhead) and because the database is
  defined in TypeScript type safty with less file
  generation. 
- Monorepo and NPM workspaces, intended effort is to share both types and tools
- Vite: It seemed extensible and the least opinionated
- Tailwind & ShadCN UI: Choice was motivated by time, the goal is to build a full
  stack platform solution  and building custom components would take too long.


### Describe how you would deploy this as a true production app on the platform of your choice:

- **Database**: Cloud-hosted PostgreSQL (Render, Heroku)
- **Web Application**: Static site hosted on CDN for global availability
- **API Server**: Cloud compute instances with horizontal scaling capabilities


### How would ensure the application is highly available and performs well?

- Leverage cloud provider's built-in redundancy
- CDN distribution for web assets
- Horizontal scaling for API servers during peak loads
- Database connection pooling and optimization


### How would you secure it?

- Authentication and authorization
- HTTPS for all connections
- CORS configuration
- Environment-based secrets management


### What would you add to make it easier to troubleshoot problems while it is running live?

- Application performance monitoring (APM)
- Error tracking and alerting (Datadog/Sentry)
- Structured logging
- Health check endpoints


### Trade-offs you might have made, anything you left out, or what you might do differently if you were to spend additional time on the project

- Multi-section assessment rendering
- Assessment creation and editing tools
- Comprehensive authentication system
- Advanced analytics dashboard
- Mobile-optimized experience
