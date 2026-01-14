Leave Management System (Serverless)

A serverless Leave Management API built using AWS SAM, TypeScript, AWS Lambda, API Gateway, Step Functions, DynamoDB, and SES, with JWT-based authentication, unit testing, and CI/CD using GitHub Actions.

Features

- Apply leave requests

- Manager approval / rejection via email

- Step Functions orchestration with wait states

- Email notifications using Amazon SES

- JWT-based custom Lambda authorizer

- DynamoDB for persistence

- 95%+ test coverage with Jest

- CI/CD with GitHub Actions

- Separate dev and prod deployments

Architecture Overview
--
Client
  |
API Gateway
  |
JWT Authorizer (Lambda)
  |
Step Functions
  ├──Apply leave lambda (validation and storing data)
  ├── Notify Manager (SES)
  ├── Wait for Approval
  ├── Approve / Reject Lambda
  └── Notify Employee (SES)
Step Function stop

Tech Stack

  Language: TypeScript

  Framework: AWS SAM (Serverless)

  Compute: AWS Lambda

  Workflow: AWS Step Functions

  Database: DynamoDB

  Email: Amazon SES

  Auth: JWT (Custom Lambda Authorizer)

  Testing: Jest + ts-jest

  CI/CD: GitHub Actions

Project Structure

Leave-Management-App/
├── src/
│   ├── auth/
│   │   ├── login.ts
│   │   └── authorizer.ts
│   ├── handlers/
│   │   ├── applyLeave.ts
│   │   ├── approve.ts
│   ├── notify/
│   │   └── notify.ts
│   └── services/
│       └── dynamodb.service.ts
├── tests/
│   └── unit/
│       ├── applyLeave.test.ts
│       ├── approve.test.ts
│       ├── authorizer.test.ts
│       ├── login.test.ts
│       └── notify.test.ts
├── template.yaml
├── jest.config.ts
├── package.json
└── README.md

-Authentication

  JWT-based authentication
  Custom Lambda Authorizer
  Supports:
    Employee
    Manager

-Testing
    Run unit tests with coverage
      npm install
      npm test

-Environment Setup
  Prerequisites

  Node.js 18+

  AWS CLI configured

  AWS SAM CLI

  SES verified email addresses

  DynamoDB table created (via SAM)

Deployment Strategy (Dev → Prod)
  Branch Strategy
  Branch             	Action
   dev	            Build, test, deploy to dev environment
   main	            Deploy to production (only after PR approval)

-CI/CD Workflow (GitHub Actions)

  Push to dev

   Install dependencies
   Run tests + coverage
   Deploy to dev

  Pull Request → main 

   Tests must pass
   Manual approval required
   Merge to main
   Deploy to production

All handled via a single GitHub Actions workflow file using branch conditions.

-Local Development
    sam build
    sam local start-api
  Test endpoints using Postman or curl.

Error Handling
  Graceful validation errors
  Step Function failure handling
  Proper HTTP status codes
  Logged errors for debugging

-Future Enhancements
    Swagger / OpenAPI documentation
    Role-based access control
    Admin dashboard
    CloudWatch alarms
    Canary deployments

-Author
  G.NAVEEN KUMAR
  B.Tech – Computer Science
  Serverless | AWS | TypeScript | Backend Engineering