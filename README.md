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

### Automated Setup (Recommended)

1. **Clone and run setup:**
   ```bash
   git clone https://github.com/your-username/sketchly.git
   cd sketchly
   npm run setup
   ```

   This will:
   - Create `.env.local` with default configuration
   - Install all dependencies
   - Attempt to build the project

### Manual Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/your-username/sketchly.git
   cd sketchly
   npm install
   ```

2. **Configure OpenAI API:**

   **Get your OpenAI API key:**
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key (it starts with `sk-`)
   - Copy the key

   **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your_actual_api_key_here
   ```

   **Important:** Never commit `.env.local` to version control!

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🔧 Environment Configuration

### Required Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key for AI functionality | ✅ Yes | - |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_MODEL_GENERATE` | Model for code generation | `gpt-4.1-nano` |
| `OPENAI_MODEL_ANALYZE` | Model for sketch analysis | `gpt-4.1-nano` |
| `OPENAI_ORGANIZATION_ID` | OpenAI organization ID (enterprise) | - |
| `OPENAI_PROJECT_ID` | OpenAI project ID (enterprise) | - |
| `NEXT_PUBLIC_APP_URL` | App URL for redirects | `http://localhost:3000` |

### OpenAI API Key Setup

1. **Create an OpenAI Account:**
   - Visit [platform.openai.com](https://platform.openai.com)
   - Sign up or log in to your account
   - Add credits to your account (required for API usage)

2. **Generate an API Key:**
   - Go to [API Keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - **Important:** Copy the key immediately (you won't see it again)
   - The key starts with `sk-` and is 51+ characters long

3. **Configure in Your Project:**
   ```bash
   # The setup script creates .env.local automatically
   npm run setup

   # Edit .env.local and replace the placeholder
   OPENAI_API_KEY=sk-your_actual_key_here_from_openai
   ```

   ⚠️ **Security Warning:**
   - Never commit `.env.local` to version control
   - Never share your API key publicly
   - Rotate keys regularly for security

### Security Best Practices

- ✅ **Never commit `.env.local`** to version control
- ✅ **Use different keys** for development and production
- ✅ **Rotate keys regularly** for security
- ✅ **Monitor API usage** on your OpenAI dashboard
- ✅ **Set spending limits** to control costs

### Troubleshooting OpenAI Configuration

**"OpenAI API key not configured" error:**
- Check that `OPENAI_API_KEY` is set in `.env.local`
- Ensure the key starts with `sk-`
- Verify the key is not expired or revoked

**"Invalid API key" error:**
- Double-check the key was copied correctly
- Ensure no extra spaces or characters
- Try regenerating the key on OpenAI platform

**Rate limiting or quota exceeded:**
- Check your OpenAI dashboard for usage limits
- Upgrade your OpenAI plan if needed
- Implement request throttling in your app

**API key validation errors:**
- Ensure your key starts with `sk-` and is 51+ characters long
- Check that you've replaced the placeholder `your_openai_api_key_here`
- Verify the key hasn't expired on your OpenAI dashboard
- Make sure you have credits in your OpenAI account

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

### API Key & Security
- 🔐 **OpenAI API Key Required**: This tool requires a valid OpenAI API key for all AI functionality
- 💰 **Costs Apply**: API usage incurs charges based on OpenAI's pricing (typically $0.002-0.03 per request)
- 🔒 **Secure Key Storage**: Never commit API keys to version control or share them publicly
- 🔄 **Key Rotation**: Regularly rotate your API keys for enhanced security
- 📊 **Monitor Usage**: Track your API usage and costs on the OpenAI dashboard

### AI & Code Quality
- 🤖 **AI Limitations**: Generated code should always be reviewed and tested before production use
- 📸 **Sketch Quality**: AI analysis accuracy depends on sketch clarity, lighting, and detail level
- 🧪 **Testing Required**: Always test generated components thoroughly in your application
- 🔍 **Human Oversight**: Use AI as a productivity tool, not a replacement for human code review

### Performance & Limits
- 📏 **File Size Limits**: Keep sketch uploads under 10MB for optimal performance
- ⏱️ **Rate Limits**: OpenAI API has rate limits; implement appropriate error handling
- 🌐 **Network Dependent**: Requires stable internet connection for AI processing
- 💾 **Local Processing**: Sketch analysis happens server-side; ensure adequate server resources

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
