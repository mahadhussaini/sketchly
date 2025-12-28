#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up Sketchly - AI-Powered Sketch to Code Tool...\n')

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...')

  const envContent = `# OpenAI API Configuration
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Custom OpenAI models (defaults to gpt-4.1-nano for both generation and analysis)
# OPENAI_MODEL_GENERATE=gpt-4.1-nano
# OPENAI_MODEL_ANALYZE=gpt-4.1-nano

# Optional: OpenAI Organization and Project IDs (for enterprise accounts)
# OPENAI_ORGANIZATION_ID=your_org_id_here
# OPENAI_PROJECT_ID=your_project_id_here

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Cloudinary for image storage (future feature)
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret`

  fs.writeFileSync(envPath, envContent)
  console.log('✅ .env.local created')
} else {
  console.log('✅ .env.local already exists')
}

// Install dependencies
console.log('\n📦 Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed successfully')
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message)
  process.exit(1)
}

// Validate API key before building
console.log('\n🔍 Validating OpenAI API key...')
try {
  // Simple check - we can't actually validate without importing Node modules
  const fs = require('fs')
  const path = require('path')
  const envPath = path.join(__dirname, '.env.local')

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const apiKeyMatch = envContent.match(/OPENAI_API_KEY=(.+)/)

    if (apiKeyMatch) {
      const apiKey = apiKeyMatch[1].trim()

      if (apiKey === 'your_openai_api_key_here') {
        throw new Error('API key is still the placeholder value')
      }

      if (apiKey.length < 20) {
        throw new Error('API key appears to be too short')
      }

      console.log('✅ API key format looks valid')
    } else {
      throw new Error('OPENAI_API_KEY not found in .env.local')
    }
  } else {
    throw new Error('.env.local file not found')
  }
} catch (error) {
  console.error('❌ API key validation failed:', error.message)
  console.log('\n📋 To fix this:')
  console.log('1. Go to https://platform.openai.com/api-keys')
  console.log('2. Create a new API key (starts with "sk-")')
  console.log('3. Replace "your_openai_api_key_here" in .env.local with your real key')
  console.log('4. Run "npm run setup" again')
  process.exit(1)
}

// Build the project
console.log('\n🔨 Building the project...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Project built successfully')
} catch (error) {
  console.error('❌ Error building project:', error.message)
  console.log('\n⚠️  Build failed. This might be due to:')
  console.log('1. Invalid OpenAI API key')
  console.log('2. Network connectivity issues')
  console.log('3. OpenAI service temporarily unavailable')
  console.log('\n💡 Try running "npm run dev" to start in development mode and test the API key')
}

console.log('\n🎉 Setup complete!')
console.log('\n📋 Next steps:')
console.log('1. 🔑 Get your OpenAI API key:')
console.log('   - Visit: https://platform.openai.com/api-keys')
console.log('   - Create a new API key (starts with "sk-")')
console.log('   - Copy the key and replace "your_openai_api_key_here" in .env.local')
console.log('')
console.log('2. 🚀 Start the development server:')
console.log('   npm run dev')
console.log('')
console.log('3. 🌐 Open your browser to:')
console.log('   http://localhost:3000')
console.log('')
console.log('4. 🎨 Upload a UI sketch and watch the AI magic happen!')

console.log('\n📚 Documentation:')
console.log('- README.md for detailed usage instructions')
console.log('- .env.example for all available configuration options')
console.log('- DEPLOYMENT.md for production deployment guide')

console.log('\n💡 Tips:')
console.log('- Use clear, well-lit sketches for best AI results')
console.log('- Include text labels and element boundaries in sketches')
console.log('- Review generated code before production use')
console.log('- Keep sketches under 10MB for optimal performance')

console.log('\nHappy coding! 🎨✨')
