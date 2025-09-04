# 🚀 Sketchly Installation Guide

Welcome to Sketchly - AI-Powered Sketch to Code Tool! Follow these steps to get started.

## ✅ Dependencies Installed

All project dependencies have been successfully installed.

## 🔑 Required Setup

### 1. Create Environment File

Create a `.env.local` file in the project root with your OpenAI API key:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Cloudinary for image storage (future feature)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Get OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key and replace `your_openai_api_key_here` in `.env.local`

## 🎯 Start Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Haven in action!

## 🎨 How to Use

1. **Upload Sketch**: Drag & drop your UI sketch (JPG, PNG, WebP, PDF)
2. **AI Analysis**: Watch as AI analyzes your sketch automatically
3. **Code Generation**: AI generates React + Tailwind code
4. **Edit & Preview**: Use Monaco editor to refine and preview
5. **Export**: Download your component

## 📱 Features Available

✅ **Sketch Upload with Drag & Drop**
- Support for multiple file formats
- Real-time upload progress
- File validation and error handling

✅ **AI-Powered Analysis**  
- GPT-4 Vision integration
- UI element detection
- Text extraction
- Layout analysis

✅ **Code Generation**
- React components with TypeScript
- Tailwind CSS styling
- Modern React patterns
- Responsive design

✅ **Live Code Editor**
- Monaco Editor (VS Code experience)
- Syntax highlighting
- Auto-completion
- AI code enhancement

✅ **Real-Time Preview**
- Live component preview
- Multiple viewport sizes
- Error handling
- Responsive testing

✅ **Component Library**
- Pre-built components
- Categorized templates
- Copy & paste functionality
- Custom component support

✅ **Dark/Light Mode**
- Theme switching
- System preference detection
- Persistent preferences

✅ **Export System**
- Download components
- Multiple export formats
- Version history

## 🔧 Build for Production

```bash
npm run build
npm start
```

## 📚 Additional Resources

- `README.md` - Comprehensive documentation
- Component examples in `/src/components`
- AI integration in `/src/lib/ai`
- API routes in `/src/app/api`

## 🎯 Tips for Best Results

- Use clear, well-lit sketches
- Include text labels and annotations
- Draw clear element boundaries
- Use consistent spacing
- Label interactive elements

## ⚠️ Important Notes

- Requires OpenAI API key (costs apply based on usage)
- Review generated code before production use
- Test components thoroughly
- Keep sketches under 10MB

Enjoy building with Haven! 🎨✨
