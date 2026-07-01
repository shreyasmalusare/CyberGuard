// Cyberpunk Theme Configuration
export const theme = {
  colors: {
    neonCyan: '#00E5FF',
    electricPurple: '#7C4DFF',
    dangerRed: '#FF3366',
    mediumAmber: '#FFC857',
    backgroundBlack: '#07070A',
    cardBackground: 'rgba(15, 15, 20, 0.9)',
    borderGlow: 'rgba(0, 229, 255, 0.2)',
  },
  fonts: {
    ui: 'Inter, system-ui, -apple-system, sans-serif',
    heading: 'Orbitron, "Space Grotesk", sans-serif',
  },
  severity: {
    critical: {
      color: '#FF3366',
      bgColor: 'rgba(255, 51, 102, 0.1)',
      borderColor: 'rgba(255, 51, 102, 0.3)',
    },
    high: {
      color: '#C41E8C',
      bgColor: 'rgba(196, 30, 140, 0.1)',
      borderColor: 'rgba(196, 30, 140, 0.3)',
    },
    medium: {
      color: '#FFC857',
      bgColor: 'rgba(255, 200, 87, 0.1)',
      borderColor: 'rgba(255, 200, 87, 0.3)',
    },
    low: {
      color: '#00E5FF',
      bgColor: 'rgba(0, 229, 255, 0.1)',
      borderColor: 'rgba(0, 229, 255, 0.3)',
    },
    info: {
      color: '#7C4DFF',
      bgColor: 'rgba(124, 77, 255, 0.1)',
      borderColor: 'rgba(124, 77, 255, 0.3)',
    },
  },
};

export default theme;