# 🚀 Deploying Haven to Vercel

## Prerequisites

- Vercel account ([sign up](https://vercel.com/signup))
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

## Quick Deploy

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add OPENAI_API_KEY
   # Enter your OpenAI API key when prompted
   ```

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

3. **Set Environment Variables:**
   - In Vercel dashboard, go to your project
   - Navigate to Settings → Environment Variables
   - Add: `OPENAI_API_KEY` with your API key

## Environment Variables Configuration

### Required Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key for AI functionality | ✅ Yes | `sk-proj-...` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_APP_URL` | App URL for redirects and links | Auto-detected | `https://your-app.vercel.app` |
| `OPENAI_MODEL_GENERATE` | Model for code generation | `gpt-4.1-nano` | `gpt-4.1-nano` |
| `OPENAI_MODEL_ANALYZE` | Model for sketch analysis | `gpt-4.1-nano` | `gpt-4.1-nano` |
| `OPENAI_ORGANIZATION_ID` | OpenAI organization ID (enterprise) | - | `org-...` |
| `OPENAI_PROJECT_ID` | OpenAI project ID (enterprise) | - | `proj-...` |

## Vercel Configuration

The app includes optimized Vercel configuration:

- ✅ **Next.js framework** automatically detected
- ✅ **API routes** configured with proper timeouts
- ✅ **Build optimization** for production
- ✅ **Region selection** (US East)
- ✅ **Static optimization** enabled

## Post-Deployment Setup

1. **Verify Deployment:**
   - Visit your Vercel app URL
   - Test sketch upload functionality
   - Verify AI code generation works

2. **Monitor Performance:**
   - Check Vercel Analytics
   - Monitor API usage in OpenAI dashboard
   - Review function execution logs

3. **Custom Domain (Optional):**
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## Platform-Specific Environment Setup

### Vercel

**Via Vercel Dashboard:**
1. Go to your project in [vercel.com](https://vercel.com)
2. Navigate to Settings → Environment Variables
3. Add each variable with its value
4. Redeploy to apply changes

**Via Vercel CLI:**
```bash
# Add required variables
vercel env add OPENAI_API_KEY

# Add optional variables
vercel env add NEXT_PUBLIC_APP_URL
vercel env add OPENAI_MODEL_GENERATE

# Redeploy
vercel --prod
```

### Netlify

**Via Netlify Dashboard:**
1. Go to your site in [netlify.com](https://netlify.com)
2. Navigate to Site Settings → Environment Variables
3. Add each variable with its value
4. Trigger a new deploy

**Via netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  OPENAI_API_KEY = "your_openai_api_key"
  NEXT_PUBLIC_APP_URL = "https://your-site.netlify.app"
```

### Railway

**Via Railway Dashboard:**
1. Go to your project in [railway.app](https://railway.app)
2. Navigate to Variables in your service
3. Add each environment variable
4. Redeploy automatically applies changes

### Render

**Via Render Dashboard:**
1. Go to your service in [render.com](https://render.com)
2. Navigate to Environment
3. Add each environment variable
4. Manual redeploy required

### Heroku

**Via Heroku CLI:**
```bash
# Set required variables
heroku config:set OPENAI_API_KEY=your_openai_api_key

# Set optional variables
heroku config:set NEXT_PUBLIC_APP_URL=https://your-app.herokuapp.com

# Check variables
heroku config
```

**Via Heroku Dashboard:**
1. Go to your app in [heroku.com](https://heroku.com)
2. Navigate to Settings → Config Vars
3. Add each variable with its value

### AWS Amplify

**Via AWS Console:**
1. Go to AWS Amplify Console
2. Select your app → Environment variables
3. Add each variable
4. Save and redeploy

### DigitalOcean App Platform

**Via DigitalOcean Console:**
1. Go to your app in DigitalOcean Console
2. Navigate to Settings → Environment Variables
3. Add each variable with its value
4. Redeploy the app

### General Environment Variable Security

- 🔐 **Never commit secrets** to version control
- 🔄 **Use different keys** for staging/production
- 📊 **Monitor API usage** across all environments
- 🔑 **Rotate keys regularly** for security
- 💰 **Set spending limits** on OpenAI to control costs

## Troubleshooting

### Environment Variable Issues

**"OpenAI API key not configured" error:**
- Verify `OPENAI_API_KEY` is set in your deployment platform
- Check that the key starts with `sk-`
- Ensure no extra spaces or characters in the key
- Confirm the key is not expired or revoked

**"Invalid API key" error:**
- Double-check the API key was copied correctly from OpenAI
- Try regenerating a new key on the OpenAI platform
- Ensure you're using the correct environment variable name

**Environment variables not updating:**
- Redeploy your application after adding environment variables
- Check platform-specific documentation for variable persistence
- Some platforms require manual redeployment for env var changes

### Build Errors

**Missing dependencies:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**OpenAI configuration issues:**
- Ensure `OPENAI_API_KEY` is available during build
- Check that the key format is correct (starts with `sk-`)
- Verify OpenAI package version compatibility

**Next.js build failures:**
- Check Node.js version compatibility (18.17+ required)
- Verify all required environment variables are present
- Review build logs for specific error messages

### Runtime Errors

**API timeout errors:**
- OpenAI API calls may timeout on slower networks
- Increase timeout limits in your deployment platform
- Implement retry logic for failed requests

**Rate limiting:**
- Monitor your OpenAI API usage dashboard
- Implement request throttling in your application
- Consider upgrading your OpenAI plan for higher limits

**CORS issues:**
- Verify CORS configuration in deployment platform
- Check that API routes are properly configured
- Ensure environment variables include correct app URLs

### Performance Issues

**Slow AI processing:**
- Optimize sketch image sizes before upload
- Consider implementing image compression
- Monitor OpenAI API response times

**Memory issues:**
- Check deployment platform resource limits
- Optimize bundle size with code splitting
- Monitor memory usage in platform dashboards

**Cold start problems:**
- Some platforms have cold start delays for serverless functions
- Consider keeping functions warm with periodic pings
- Evaluate platform-specific performance optimizations

## Cost Considerations

- **Vercel:** Free tier includes 100GB bandwidth, generous function limits
- **OpenAI:** Pay per API call (~$0.002-0.03 per request)
- **Monitoring:** Use Vercel's built-in analytics

## Security Best Practices

- ✅ **API keys** stored securely in environment variables
- ✅ **HTTPS** enabled by default
- ✅ **CORS** properly configured
- ✅ **Rate limiting** implemented on API routes

## Production Optimizations

The app includes several production optimizations:

- **Static Generation:** Where possible for better performance
- **Image Optimization:** Next.js automatic image optimization
- **Bundle Splitting:** Automatic code splitting
- **Caching:** Appropriate cache headers
- **Compression:** Automatic gzip compression

## Support

- 📚 **Documentation:** Check the main README.md
- 🐛 **Issues:** Report bugs on GitHub
- 💬 **Community:** Join discussions on GitHub
- 📧 **Vercel Support:** Use Vercel dashboard support

---

**Happy deploying!** 🎉 Your AI-powered sketch-to-code tool is now live on Vercel! 🚀
