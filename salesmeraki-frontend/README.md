This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

To run the mock API server:

```bash
npm run mock-api
# or
yarn mock-api
```

To run the Socket.io server for real-time features:

```bash
npm run socket-server
# or
yarn socket-server
```

Alternatively, you can run all servers at once:

```bash
npm run dev:all
# or
yarn dev:all
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-nextauth-secret

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# API Configuration
API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Socket.io Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# AI Services
AI_SERVICE_URL=http://localhost:3001/api/ai
TRANSCRIPTION_SERVICE_URL=http://localhost:3001/api/transcription
TRANSCRIPTION_API_KEY=your-transcription-api-key
```
# CI/CD Test

## Features

### Dashboard
- Interactive dashboard with real-time metrics and charts
- Sales analytics with revenue trends and performance metrics
- Customer insights and segmentation analysis
- Sales forecasting with AI-powered projections

### Workflow Automation
- Visual workflow builder with drag-and-drop interface
- Trigger-based automation for sales processes
- Customizable actions for email, tasks, and more
- Workflow management and monitoring

### AI Coaching
- Real-time sales coaching with AI feedback
- Practice scenarios for different sales situations
- Performance analysis with strengths and improvement areas
- Team coaching and performance tracking

### Team Collaboration
- Real-time chat with team members
- Document sharing and collaboration
- Task management and assignment
- Team calendar and meeting scheduling

### Authentication
- User profile management with customizable settings
- Role-based access control
- Two-factor authentication
- Session management and security features

### Real-time Features
- Real-time notifications for important events
- WebSocket integration for instant updates
- Collaborative document editing
- Live chat and messaging

## Testing

To run the tests:

```bash
npm run test
# or
yarn test
```

To run the tests in watch mode:

```bash
npm run test:watch
# or
yarn test:watch
```
