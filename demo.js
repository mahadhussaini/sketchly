#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🎨 Sketchly Demo - AI-Powered Sketch to Code Tool\n')

console.log('✨ Welcome to Sketchly!')
console.log('🔮 An AI-powered platform that transforms UI sketches into production-ready React components\n')

console.log('🚀 Key Features:')
console.log('  ✅ AI-Powered Analysis - GPT-4 Vision processes your sketches')
console.log('  ✅ Smart Code Generation - GPT-4 creates clean, responsive React code')
console.log('  ✅ Live Preview - See your components in real-time')
console.log('  ✅ Professional Tools - Version control, accessibility checker, performance analyzer')
console.log('  ✅ Project Management - Save, load, and organize your work')
console.log('  ✅ Component Library - 15+ pre-built components and templates')
console.log('  ✅ Keyboard Shortcuts - Boost your productivity')
console.log('  ✅ Responsive Design - Works perfectly on all devices')
console.log('  ✅ Vercel Ready - One-command deployment\n')

console.log('📁 Project Structure:')
console.log('  📦 src/')
console.log('    ├── app/           # Next.js app router')
console.log('    ├── components/    # React components')
console.log('    ├── store/         # Zustand state management')
console.log('    ├── lib/           # Utilities and AI integration')
console.log('    └── hooks/         # Custom React hooks')
console.log('')

console.log('🛠️  Available Scripts:')
console.log('  npm run dev      - Start development server')
console.log('  npm run build    - Build for production')
console.log('  npm run deploy   - Deploy to Vercel')
console.log('  npm run setup    - Initial setup and configuration')
console.log('')

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local')
const hasEnv = fs.existsSync(envPath)

if (hasEnv) {
  console.log('✅ Environment configured')
} else {
  console.log('⚠️  Environment not configured')
  console.log('   Create .env.local with your OPENAI_API_KEY')
  console.log('   See .env.example for reference')
}

console.log('')
console.log('🌐 Deployment Options:')
console.log('  1. Quick Deploy: npm run deploy')
console.log('  2. Manual Vercel: vercel --prod')
console.log('  3. GitHub Integration: Push to GitHub, connect to Vercel')
console.log('')

console.log('🎯 Getting Started:')
console.log('  1. Get OpenAI API key: https://platform.openai.com/api-keys')
console.log('  2. Add to .env.local: OPENAI_API_KEY=your_key_here')
console.log('  3. Run: npm install && npm run dev')
console.log('  4. Open: http://localhost:3000')
console.log('  5. Upload a sketch and watch the magic!')
console.log('')

console.log('📊 What happens when you upload a sketch:')
console.log('  1. 📸 Image Analysis - GPT-4 Vision identifies UI elements')
console.log('  2. 🧠 AI Processing - Detects buttons, inputs, cards, layouts')
console.log('  3. 💻 Code Generation - Creates clean React + Tailwind code')
console.log('  4. ✨ Live Preview - See your component instantly')
console.log('  5. 🎨 Refinement - Edit code with Monaco editor')
console.log('  6. ✅ Quality Checks - Accessibility and performance analysis')
console.log('  7. 💾 Version Control - Auto-save with rollback capability')
console.log('')

console.log('🎨 Supported Sketch Types:')
console.log('  • 📱 Mobile app wireframes')
console.log('  • 🖥️ Desktop application layouts')
console.log('  • 🌐 Website designs')
console.log('  • 📝 Hand-drawn sketches')
console.log('  • 🎨 Design mockups')
console.log('  • 📋 Form layouts')
console.log('  • 🗂️ Dashboard designs')
console.log('')

console.log('💡 Pro Tips:')
console.log('  • Use clear, well-lit sketches for best results')
console.log('  • Label interactive elements (buttons, inputs)')
console.log('  • Draw clear boundaries between components')
console.log('  • Include text content in your sketches')
console.log('  • Try different sketch styles and layouts')
console.log('')

console.log('🚀 Ready to start? Run:')
console.log('  npm install && npm run dev')
console.log('')

console.log('📚 Documentation:')
console.log('  • README.md - Complete feature overview')
console.log('  • DEPLOYMENT.md - Vercel deployment guide')
console.log('  • Source code - Well-documented and modular')
console.log('')

console.log('🎉 Happy sketching and coding!')
console.log('   Made with ❤️ using Next.js, AI, and modern web technologies ✨')
console.log('')

// Offer to start the development server
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('🚀 Would you like to start the development server now? (y/N): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Starting development server...')
    console.log('🌐 Open http://localhost:3000 in your browser\n')

    try {
      execSync('npm run dev', { stdio: 'inherit' })
    } catch (error) {
      console.log('❌ Failed to start development server')
      console.log('   Make sure you have Node.js installed and run: npm install')
    }
  } else {
    console.log('\n👋 See you soon! Run "npm run dev" when you\'re ready to start.')
  }

  rl.close()
})
