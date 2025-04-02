# Art Realm Deployment Guide

This document outlines the process for deploying the Art Realm application to various environments.

## Deployment Options

Art Realm is configured for seamless deployment on Vercel, but can also be deployed on other platforms with proper configuration.

## Deploying to Vercel (Recommended)

### Prerequisites

- A [Vercel](https://vercel.com) account
- Git repository with your Art Realm project

### Deployment Steps

1. **Connect your Git repository to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Select the repository containing Art Realm

2. **Configure the project**

   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: .next (default)

3. **Environment Variables**

   Add the following environment variables:
   
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   # Add other environment variables as needed
   ```

4. **Deploy**

   Click "Deploy" and Vercel will build and deploy your application.

5. **Custom Domain (Optional)**

   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domain

### Continuous Deployment

Vercel automatically sets up continuous deployment with your Git provider. Any push to your main branch will trigger a new deployment.

## Manual Deployment

If you prefer to deploy manually or to another platform, follow these steps:

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Start the Production Server

```bash
npm run start
```

This starts the Next.js production server on port 3000 (by default).

## Deploying to Other Platforms

### Docker Deployment

1. **Create a Dockerfile**

   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .
   RUN npm run build

   EXPOSE 3000

   CMD ["npm", "start"]
   ```

2. **Build the Docker image**

   ```bash
   docker build -t art-realm .
   ```

3. **Run the Docker container**

   ```bash
   docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=your_api_url art-realm
   ```

### AWS Elastic Beanstalk

1. **Install the EB CLI**

   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**

   ```bash
   eb init
   ```

3. **Create an environment**

   ```bash
   eb create art-realm-production
   ```

4. **Deploy**

   ```bash
   eb deploy
   ```

## Deployment Best Practices

1. **Use environment variables** for configuration
2. **Run tests before deployment**
3. **Set up proper monitoring**
4. **Configure error tracking**
5. **Set up proper logging**
6. **Use a staging environment** for testing before production
7. **Implement proper security headers**
8. **Set up SSL/TLS**

## Monitoring and Maintenance

### Vercel Analytics

Vercel provides built-in analytics:

1. Go to your project on Vercel
2. Navigate to "Analytics"
3. View performance metrics

### Performance Monitoring

- Use [Next.js Analytics](https://nextjs.org/analytics) for monitoring Core Web Vitals
- Consider integrating tools like New Relic or Datadog for more comprehensive monitoring

### Error Tracking

Consider integrating error tracking tools:

- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)

## Rollback Procedure

### Vercel Rollback

1. Go to your project deployments
2. Find the last working deployment
3. Click the three dots menu
4. Select "Promote to Production"

### Manual Rollback

If using Git-based deployments, revert to the last known working commit and redeploy:

```bash
git revert HEAD
git push
```

## Troubleshooting Common Deployment Issues

### Build Failures

- Check build logs for errors
- Verify environment variables are set correctly
- Check that dependencies are installed properly

### Runtime Errors

- Check server logs
- Verify API endpoints are accessible
- Check environment configuration

### Performance Issues

- Check server resources (CPU, memory)
- Review database performance
- Consider CDN for static assets

## Scaling Considerations

- Implement caching strategies
- Use a CDN for static assets
- Consider serverless functions for API routes
- Optimize database queries 