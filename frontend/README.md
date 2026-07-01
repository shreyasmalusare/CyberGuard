# CYBERGUARD - Cybersecurity Vulnerability Scanner Frontend

## Overview

CYBERGUARD is a **production-quality, interview-ready** cybersecurity vulnerability scanner frontend built with React, Tailwind CSS, and Framer Motion. It features a stunning cyberpunk/neon aesthetic with advanced micro-interactions, animated backgrounds, and a security-first architecture.

![CYBERGUARD Screenshot](docs/screenshot.png)

## 🎯 Key Features

### Visual Design
- **Cyberpunk Theme**: Dark background with neon cyan (#00E5FF) and electric purple (#7C4DFF) accents
- **Magic Cursor**: Custom cursor with particle trail and magnet effect on interactive elements
- **Animated Network Background**: Canvas-based network grid with nodes that react to cursor proximity and scanning activity
- **Glassmorphism**: Translucent cards with neon glow and blurred backdrop
- **Color-Coded Vulnerabilities**: Critical (red glow), High (magenta), Medium (amber), Low (cyan/green)

### Functionality
- **Smart URL Validation**: Client-side validation prevents scanning of private IPs and localhost
- **3-State Scan Flow**: Idle → Scanning (with progress) → Completed
- **Real-Time Log Streaming**: Socket-like scanning log with color-coded severity levels
- **Animated Threat Meter**: Circular gauge showing risk score (0-100) with color transitions
- **Interactive Dashboard**: Filter by severity, sort by CVSS/date, search vulnerabilities
- **Inspector Panel**: Detailed vulnerability analysis with remediation steps and CVE references
- **Export Functionality**: Export results as JSON or PDF

### Accessibility & Performance
- **Keyboard Navigation**: Full tab order and focus ring support
- **ARIA Roles**: Proper semantic HTML and ARIA labels
- **Reduced Motion Support**: Respects `prefers-reduced-motion` user preference
- **Mobile Responsive**: Works on mobile with stacked layout
- **Optimized Rendering**: Lazy-load heavy backgrounds, limit particle counts

### Security Features
- **Input Sanitization**: URL validation, scheme checking, private IP blocking
- **No Client-Side Scanning**: All scans performed by backend API
- **Legal Disclaimer**: Clear allowed-use notice
- **HTTPS-Only**: Enforces secure connections

## 📦 Tech Stack

- **React 19**: Modern functional components with hooks
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Framer Motion 12**: Animation library for smooth transitions
- **Lucide React**: Modern icon library
- **Shadcn/ui**: High-quality, accessible UI components
- **Canvas API**: For network background animation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API server (see Backend Integration section)

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🔌 Backend Integration

### Demo Mode (Current)

The app currently uses **mock data** from `/src/mocks/vulnerabilityData.js` for demonstration purposes. This allows you to:
- Test all UI interactions
- See the complete scan flow
- Experience the full feature set

### Production Mode

To connect to a real backend:

1. **Update API calls** in `src/App.js`:
   ```javascript
   // Replace mock scan with actual API call
   const handleScanStart = async (scanConfig) => {
     const response = await axios.post(
       `${process.env.REACT_APP_BACKEND_URL}/api/scan/start`,
       scanConfig
     );
     // Handle response...
   };
   ```

2. **Backend API Contract** (see `/docs/apiContract.md`):
   - `POST /api/scan/start` - Initiate a scan
   - `GET /api/scan/{scanId}/status` - Check scan status
   - `GET /api/scan/{scanId}/results` - Retrieve results
   - `GET /api/scan/{scanId}/logs` - Stream logs (WebSocket)

## 📁 Project Structure

```
src/
├── components/
│   ├── MagicCursor.jsx          # Custom cursor with particle trail
│   ├── NetworkBackground.jsx    # Animated canvas background
│   ├── ScanHero.jsx            # Main scan input interface
│   ├── ScanLogStream.jsx       # Real-time log streaming
│   ├── ThreatMeter.jsx         # Animated risk score gauge
│   ├── Dashboard.jsx           # Vulnerability dashboard
│   ├── VulnCard.jsx            # Individual vulnerability card
│   ├── InspectorPanel.jsx      # Detailed vulnerability inspector
│   └── ui/                     # Shadcn UI components
├── config/
│   └── theme.js                # Theme configuration
├── mocks/
│   └── vulnerabilityData.js    # Mock data for demo
├── styles/
│   └── cyberpunk.css          # Custom neon effects and animations
├── App.js                      # Main application component
└── index.css                   # Global styles with fonts
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
yarn test

# Run with coverage
yarn test --coverage
```

Key test files:
- `__tests__/MagicCursor.test.js` - Cursor behavior and reduced motion
- `__tests__/ScanHero.test.js` - URL validation and input handling
- `__tests__/VulnCard.test.js` - Card rendering and interactions

### E2E Tests (Playwright)

```bash
# Install Playwright
npx playwright install

# Run E2E tests
yarn test:e2e
```

Test scenarios:
- Full scan flow from input to results
- Keyboard navigation
- Filter and sort functionality
- Error handling and recovery

## 🎨 Design Guidelines

### Color Palette

```css
Neon Cyan:        #00E5FF  /* Primary accent, links, buttons */
Electric Purple:  #7C4DFF  /* Secondary accent */
Danger Red:       #FF3366  /* Critical vulnerabilities */
Medium Amber:     #FFC857  /* Medium severity */
Background Black: #07070A  /* Main background */
```

### Typography

- **UI Text**: Inter (Google Fonts)
- **Headings**: Orbitron (Google Fonts)
- **Code**: Source Code Pro (monospace)

### Animation Principles

1. **Subtle on Load**: Staggered entrance animations
2. **Responsive on Hover**: Immediate feedback (scale, glow)
3. **Smooth Transitions**: 200-300ms for most interactions
4. **Meaningful Motion**: Animations convey state changes

## 🔒 Security Considerations

### Input Validation

```javascript
// Blocks private IPs and localhost
const privatePatterns = [
  /^localhost$/,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
];
```

### Best Practices

- ✅ Never perform scans from frontend
- ✅ Sanitize all user input
- ✅ Use HTTPS for API calls
- ✅ Implement rate limiting UI-side
- ✅ Show clear legal disclaimers
- ✅ Log security events to backend

## 📊 Performance Optimizations

1. **Lazy Load Background**: Canvas animation loads after initial paint
2. **Particle Limiting**: Reduces particle count on mobile
3. **CSS Transforms**: Uses `transform` over `position` for animations
4. **Memoization**: Uses `useMemo` for expensive calculations
5. **Debounced Search**: Reduces re-renders during typing

## 🎤 Interview Talking Points

### Architecture

"I chose a component-based architecture with React to ensure:
- **Reusability**: Components like VulnCard can be used anywhere
- **Testability**: Each component is independently testable
- **Maintainability**: Clear separation of concerns"

### UX Design

"The cyberpunk aesthetic isn't just visual flair—it:
- **Signals Authority**: Professional security tools need to look serious
- **Reduces Cognitive Load**: Color-coding helps users quickly identify critical issues
- **Builds Trust**: Smooth animations and polish convey attention to detail"

### Security

"Security is built into every layer:
- **Client-Side Validation**: Prevents accidental misuse
- **Backend Delegation**: All scanning happens server-side
- **Legal Compliance**: Clear disclaimers prevent unauthorized use"

### Performance

"I optimized for 60fps animations by:
- Using CSS transforms instead of position changes
- Limiting particle counts based on device capabilities
- Lazy-loading the canvas background after critical paint"

## 🐛 Troubleshooting

### Common Issues

**Q: Blank screen on load**
A: Check console for errors. Ensure all dependencies are installed: `yarn install`

**Q: Network background not animating**
A: Check if user has `prefers-reduced-motion` enabled. Also verify Canvas API support.

**Q: Export PDF not working**
A: PDF export is a placeholder. Implement using libraries like `jsPDF` or server-side generation.

**Q: Cursor animations not showing**
A: Magic cursor is hidden on touch devices and when `prefers-reduced-motion` is enabled.

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## 📞 Support

For questions or issues:
- Open a GitHub issue
- Email: support@cyberguard.dev

---

**Built with ❤️ for cybersecurity professionals**

*Last updated: July 2025*