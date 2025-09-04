# Sketchly - AI-Powered Sketch to Code Tool

Transform your UI sketches into production-ready React components with AI.

## 🚀 Features

- **Sketch Upload & Processing**: Upload hand-drawn sketches, wireframes, or design mockups
- **AI-Powered Analysis**: Computer vision detects UI elements and extracts text using OpenAI GPT-4V
- **Automatic Code Generation**: Convert detected UI into Next.js + Tailwind JSX components  
- **Live Code Editor**: Monaco Editor with syntax highlighting and AI suggestions
- **Real-Time Preview**: Instant preview with multiple viewport sizes (mobile, tablet, desktop)
- **Component Library**: Pre-built Tailwind + Headless UI components
- **Export Functionality**: Download generated components as standalone files

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **AI**: OpenAI GPT-4 Vision for image analysis and code generation
- **Editor**: Monaco Editor (VS Code-like experience)  
- **State Management**: Zustand
- **UI Components**: Headless UI + Lucide React icons
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

- Node.js 18.17 or later
- OpenAI API key

## ⚡ Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/your-username/sketchly.git
   cd sketchly
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📱 How to Use

1. **Upload a Sketch**: Drag & drop or click to upload your UI sketch (JPG, PNG, WebP, PDF)
2. **AI Analysis**: The AI automatically analyzes your sketch and detects UI elements
3. **Code Generation**: AI generates clean React + Tailwind code based on the analysis
4. **Edit & Preview**: Use the Monaco editor to refine the code and see live preview
5. **Export**: Download your component as a ready-to-use React file

## 🎨 Supported UI Elements

- Buttons and form controls
- Text inputs and textareas  
- Cards and containers
- Navigation bars and menus
- Lists and grids
- Images and media
- Modals and overlays

## 📐 Best Practices for Sketches

- Ensure good lighting and clear visibility
- Include labels and text content
- Draw clear boundaries between components
- Use consistent spacing and alignment
- Label interactive elements clearly

## 🔧 Development

### Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes for AI functionality
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main application page
├── components/         # React components
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   └── ...            # Feature components
├── lib/                # Utility functions
│   ├── ai/            # AI integration
│   └── utils.ts       # Helper functions
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
└── hooks/             # Custom React hooks
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🎨 Branding

### Logo
The Sketchly logo is located in `/public/logo.svg` and features:
- Gradient design (purple → blue → cyan) representing AI and technology
- Clean "S" letter for "Sketchly"
- Sketch-like lines suggesting creativity and drawing
- Tech dots representing AI elements
- Modern, scalable SVG format

### Color Palette
- Primary: Purple (#8B5CF6) to Blue (#3B82F6) to Cyan (#06B6D4) gradient
- Background: Light/Dark theme compatible
- Text: Semantic color system using CSS variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

- This tool requires an OpenAI API key and will incur costs based on usage
- Generated code should be reviewed before production use
- The AI analysis accuracy depends on sketch quality and clarity
- Always test generated components thoroughly

## 🔮 Roadmap

- [ ] Multi-platform export (React Native, Flutter)
- [ ] Auto-generate style guide from sketches  
- [ ] Figma/Sketch plugin integration
- [ ] Real-time collaboration features
- [ ] Component version history
- [ ] Custom component library creation
- [ ] Advanced accessibility suggestions

## 🚀 Deploy to Vercel

### One-Command Deploy
```bash
# Install dependencies
npm install

# Deploy to Vercel (includes build verification)
npm run deploy
```

### Prerequisites
- [Vercel account](https://vercel.com/signup)
- [OpenAI API key](https://platform.openai.com/api-keys)
- Node.js 18+

### Environment Setup
Create `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📞 Support

If you encounter any issues or have questions:

1. Check the [GitHub Issues](https://github.com/your-username/sketchly/issues)
2. Create a new issue with detailed information
3. Join our community discussions

---

Made with ❤️ for developers and designers who want to bridge the design-to-code gap.
