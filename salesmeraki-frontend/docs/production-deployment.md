# Production Deployment Guide

This guide provides instructions for deploying the SalesMeraki frontend application to production environments.

## Environment Variables

The following environment variables need to be configured in your production environment:

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | The canonical URL of your site | `https://app.salesmeraki.com` |
| `NEXTAUTH_SECRET` | Secret used to encrypt the NextAuth.js JWT | Generate a secure random string |
| `API_BASE_URL` | Base URL for backend API | `https://api.salesmeraki.com/api` |
| `NEXT_PUBLIC_API_URL` | Publicly accessible API URL | `https://api.salesmeraki.com/api` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | `wss://api.salesmeraki.com` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io URL | `https://api.salesmeraki.com` |

### Authentication Providers

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth client secret |

### AI Services

| Variable | Description |
|----------|-------------|
| `AI_SERVICE_URL` | URL for AI service API |
| `TRANSCRIPTION_SERVICE_URL` | URL for transcription service API |
| `TRANSCRIPTION_API_KEY` | API key for transcription service |

## Deployment Options

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel project settings
3. Deploy using the Vercel dashboard or CI/CD pipeline

### AWS Deployment

1. Build the application: `npm run build`
2. Export the static files: `npm run export` (if using static export)
3. Upload the files to an S3 bucket
4. Configure CloudFront distribution for CDN
5. Set up Route 53 for domain management

### Docker Deployment

1. Build the Docker image: `docker build -t salesmeraki-frontend .`
2. Run the container: `docker run -p 3000:3000 -e NEXTAUTH_URL=https://app.salesmeraki.com [other env vars] salesmeraki-frontend`

## Performance Optimizations

1. Enable gzip compression on your web server
2. Configure proper cache headers for static assets
3. Use a CDN for static assets
4. Implement HTTP/2 or HTTP/3 on your web server
5. Enable Brotli compression if supported

## Security Considerations

1. Always use HTTPS in production
2. Set secure and HttpOnly flags on cookies
3. Implement proper Content Security Policy (CSP) headers
4. Configure X-XSS-Protection and X-Content-Type-Options headers
5. Use Subresource Integrity (SRI) for third-party scripts
6. Regularly update dependencies to patch security vulnerabilities
7. Implement rate limiting for API endpoints
8. Use secure and randomly generated values for secrets

## Monitoring and Logging

1. Set up application monitoring with services like New Relic, Datadog, or Sentry
2. Configure error tracking to capture and report frontend errors
3. Implement analytics to track user behavior and performance metrics
4. Set up alerting for critical errors or performance degradation
