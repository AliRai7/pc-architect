# PC Architect - Interactive 3D PC Builder

A premium, immersive 3D website featuring an exploded view of a high-end gaming PC. Built with React, Three.js, and Next.js.

![PC Architect Preview](https://via.placeholder.com/800x400/0A0A0F/7C3AED?text=PC+Architect+3D)

## Features

- **3D Interactive Model**: Explore a detailed gaming PC in real-time 3D
- **Exploded View**: Scroll to see components separate and float apart
- **Clickable Components**: Click any part to view detailed specifications
- **Glass Morphism UI**: Modern, premium interface design
- **Custom Cursor**: Magnetic cursor with glow effects
- **Particle Background**: Animated stars and sparkles
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: 60fps performance with GSAP

## Tech Stack

- **Framework**: Next.js 14 + React 18 + TypeScript
- **3D Engine**: React Three Fiber + Three.js
- **Animations**: GSAP + Framer Motion
- **Styling**: Tailwind CSS
- **State**: Zustand

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pc-architect.git

# Navigate to project
cd pc-architect

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

## Project Structure

```
pc-architect/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/
│   │   ├── 3d/           # 3D scene components
│   │   │   ├── Scene.tsx
│   │   │   ├── PCModel.tsx
│   │   │   └── components/  # Individual PC parts
│   │   └── ui/           # UI components
│   │       ├── GlassPanel.tsx
│   │       ├── LoadingScreen.tsx
│   │       ├── CustomCursor.tsx
│   │       ├── Navigation.tsx
│   │       └── ScrollIndicator.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and data
│   ├── store/            # Zustand state management
│   └── types/            # TypeScript types
├── public/               # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Components

### 3D Components

| Component | Description |
|-----------|-------------|
| `Scene.tsx` | Main 3D canvas with lighting and camera |
| `PCModel.tsx` | Container for all PC components |
| `GPU.tsx` | NVIDIA RTX 4090 graphics card |
| `CPU.tsx` | Intel Core i9 processor |
| `RAM.tsx` | DDR5 memory modules |
| `Cooling.tsx` | 360mm AIO liquid cooler |
| `Motherboard.tsx` | Z790 ATX motherboard |
| `SSD.tsx` | NVMe Gen4 SSD |
| `PSU.tsx` | 1000W power supply |

### UI Components

| Component | Description |
|-----------|-------------|
| `GlassPanel.tsx` | Side panel with component specs |
| `LoadingScreen.tsx` | Animated loading screen |
| `CustomCursor.tsx` | Magnetic cursor with glow |
| `Navigation.tsx` | Top navigation bar |
| `ScrollIndicator.tsx` | Scroll hint animation |

## Customization

### Changing Accent Color

Edit `tailwind.config.ts`:

```typescript
colors: {
  accent: {
    primary: '#7C3AED',  // Change this
    // ...
  },
}
```

### Adding New Components

1. Create component file in `src/components/3d/components/`
2. Add data to `src/lib/data.ts`
3. Import and add to `PCModel.tsx`

### Modifying Explosion Animation

Edit explosion direction in `src/lib/data.ts`:

```typescript
explosionDirection: new Vector3(x, y, z), // Direction and distance
```

## Performance Optimization

### Current Optimizations

- Draco compression for 3D models
- Lazy loading of 3D scene
- Object pooling for particles
- Frustum culling
- Optimized shaders

### Performance Budget

- **Desktop**: 60fps, <5MB model size
- **Mobile**: 30fps, <3MB model size
- **Load time**: <3s on 4G

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=out
```

### Static Export

```bash
# Export static files
npm run build

# Files will be in `out/` directory
```

## Environment Variables

Create `.env.local`:

```bash
# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_id

# Optional: CDN URL for assets
NEXT_PUBLIC_CDN_URL=https://your-cdn.com
```

## Security

See [SECURITY.md](./SECURITY.md) for:
- Security headers configuration
- XSS prevention
- Dependency auditing
- Deployment security

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](./LICENSE) for details

## Credits

- 3D rendering: [Three.js](https://threejs.org/)
- React integration: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- Animations: [GSAP](https://greensock.com/gsap/)
- UI Framework: [Tailwind CSS](https://tailwindcss.com/)

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/pc-architect/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/pc-architect/discussions)

---

**Built with passion by the PC Architect team** 🖥️✨
