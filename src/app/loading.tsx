export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {/* Animated logo */}
        <div className="relative mb-8">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading text */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Loading Sketchly
        </h1>
        <p className="text-muted-foreground">
          Preparing your AI-powered development environment...
        </p>

        {/* Loading steps */}
        <div className="mt-8 space-y-2">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Initializing components</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <span>Loading AI models</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span>Setting up workspace</span>
          </div>
        </div>
      </div>
    </div>
  )
}
