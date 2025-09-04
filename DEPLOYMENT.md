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

## Environment Variables Required

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Your Vercel app URL | ❌ No (auto-detected) |

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

## Troubleshooting

### Build Errors
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing OPENAI_API_KEY
# - Node.js version mismatch
# - Dependency conflicts
```

### Runtime Errors
```bash
# Check Vercel function logs
# Common issues:
# - API key invalid/expired
# - Rate limits exceeded
# - Network timeouts
```

### Performance Issues
```bash
# Enable Vercel Analytics
# Check bundle size in build logs
# Optimize images and assets
```

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
