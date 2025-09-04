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
OPENAI_API_KEY=your_openai_api_key_here

# Application Settings  
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Cloudinary for image storage (future feature)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`

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

// Build the project
console.log('\n🔨 Building the project...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Project built successfully')
} catch (error) {
  console.error('❌ Error building project:', error.message)
  console.log('\n⚠️  This is likely due to missing OpenAI API key. Please:')
  console.log('1. Add your OpenAI API key to .env.local')
  console.log('2. Run "npm run build" again')
}

console.log('\n🎉 Setup complete!')
console.log('\n📋 Next steps:')
console.log('1. Add your OpenAI API key to .env.local')
console.log('2. Run "npm run dev" to start the development server')
console.log('3. Open http://localhost:3000 in your browser')
console.log('4. Upload a UI sketch and watch the magic happen!')

console.log('\n📚 Documentation:')
console.log('- README.md for detailed usage instructions')
console.log('- GitHub repository for updates and support')

console.log('\n💡 Tips:')
console.log('- Use clear, well-lit sketches for best results')
console.log('- Include text labels and element boundaries')
console.log('- Review generated code before production use')

console.log('\nHappy coding! 🎨✨')
