#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Haven Deployment Script for Vercel\n')

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' })
  console.log('✅ Vercel CLI is installed')
} catch (error) {
  console.log('❌ Vercel CLI not found. Installing...')
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' })
    console.log('✅ Vercel CLI installed successfully')
  } catch (installError) {
    console.log('❌ Failed to install Vercel CLI. Please install manually:')
    console.log('npm install -g vercel')
    process.exit(1)
  }
}

// Check if user is logged in
try {
  execSync('vercel whoami', { stdio: 'pipe' })
  console.log('✅ Already logged in to Vercel')
} catch (error) {
  console.log('🔐 Please login to Vercel:')
  try {
    execSync('vercel login', { stdio: 'inherit' })
  } catch (loginError) {
    console.log('❌ Vercel login failed. Please try again manually.')
    process.exit(1)
  }
}

// Check for environment variables
const envPath = path.join(__dirname, '.env.local')
const envExamplePath = path.join(__dirname, '.env.example')

if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env.local file found.')
  console.log('📝 Please create .env.local with your OPENAI_API_KEY')
  console.log('💡 You can copy from .env.example')

  if (fs.existsSync(envExamplePath)) {
    console.log('\n📋 .env.example contents:')
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8')
    console.log(exampleContent)
  }

  process.exit(1)
}

// Check if OPENAI_API_KEY is set
try {
  const envContent = fs.readFileSync(envPath, 'utf8')
  if (!envContent.includes('OPENAI_API_KEY=') || envContent.includes('OPENAI_API_KEY=your_openai_api_key_here')) {
    console.log('⚠️  OPENAI_API_KEY not properly configured in .env.local')
    console.log('📝 Please add your actual OpenAI API key')
    process.exit(1)
  }
} catch (error) {
  console.log('❌ Error reading .env.local file')
  process.exit(1)
}

console.log('✅ Environment variables configured')

// Run build to ensure everything works
console.log('\n🔨 Building application...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build successful')
} catch (error) {
  console.log('❌ Build failed. Please fix build errors first.')
  process.exit(1)
}

// Deploy to Vercel
console.log('\n🚀 Deploying to Vercel...')
try {
  console.log('📦 Deploying project...')
  const deployResult = execSync('vercel --prod --yes', {
    stdio: 'pipe',
    encoding: 'utf8'
  })

  // Extract deployment URL from output
  const urlMatch = deployResult.match(/https:\/\/[^\s]+/)
  if (urlMatch) {
    console.log(`\n🎉 Deployment successful!`)
    console.log(`🌐 Your app is live at: ${urlMatch[0]}`)
  } else {
    console.log('\n🎉 Deployment completed!')
    console.log('🌐 Check your Vercel dashboard for the deployment URL')
  }

  console.log('\n📋 Next steps:')
  console.log('1. Visit your deployment URL')
  console.log('2. Test the sketch upload functionality')
  console.log('3. Verify AI code generation works')
  console.log('4. Share your app with others!')

} catch (error) {
  console.log('❌ Deployment failed. Error details:')
  console.log(error.message)

  console.log('\n🔧 Troubleshooting:')
  console.log('1. Check your internet connection')
  console.log('2. Verify your Vercel account has available resources')
  console.log('3. Ensure OPENAI_API_KEY is valid')
  console.log('4. Try deploying manually: vercel --prod')

  process.exit(1)
}

console.log('\n💡 Pro tips:')
console.log('- Monitor your OpenAI API usage to avoid unexpected costs')
console.log('- Use Vercel Analytics to track user engagement')
console.log('- Consider upgrading to Vercel Pro for more resources')
console.log('- Set up custom domains for a professional look')

console.log('\n📚 Documentation:')
console.log('- Main README: Comprehensive feature overview')
console.log('- DEPLOYMENT.md: Detailed deployment guide')
console.log('- Vercel Dashboard: Monitor performance and logs')

console.log('\n🎨 Happy coding with Haven!')
console.log('🚀 Built with AI, deployed on Vercel ✨')
