// Éléments décoratifs SVG réutilisables

export function Asterisk({ size = 32, color = 'currentColor', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <line x1="16" y1="2" x2="16" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="2" y1="16" x2="30" y2="16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="5.5" y1="5.5" x2="26.5" y2="26.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="26.5" y1="5.5" x2="5.5" y2="26.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function Squiggle({ width = 80, color = 'currentColor', className = '' }) {
  return (
    <svg width={width} height={20} viewBox="0 0 80 20" fill="none" className={className} aria-hidden="true">
      <path d="M2 10 C12 2, 22 18, 32 10 C42 2, 52 18, 62 10 C72 2, 78 14, 78 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function Ring({ size = 48, color = 'currentColor', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="2.5" />
      <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="1.5" strokeDasharray="4 4" />
    </svg>
  )
}

export function Blob({ color = '#F2A0A8', className = '' }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path fill={color} d="M44.6,-62.3C57.3,-54.7,67,-41.2,71.4,-26.4C75.8,-11.6,74.8,4.6,69.3,18.7C63.8,32.8,53.7,44.8,41.4,53.8C29,62.8,14.5,68.7,-0.7,69.6C-15.9,70.6,-31.8,66.5,-44.1,58C-56.3,49.5,-64.9,36.6,-68.5,22.4C-72.1,8.2,-70.7,-7.3,-65.1,-20.7C-59.5,-34.2,-49.6,-45.6,-37.9,-53.4C-26.1,-61.2,-13.1,-65.4,1.5,-67.3C16.1,-69.3,31.9,-70,44.6,-62.3Z" transform="translate(100 100)" />
    </svg>
  )
}

// Pattern de fond — à utiliser en inline style sur un élément
export const patterns = {
  dots: (color = 'rgba(42,21,6,0.12)') => ({
    backgroundImage: `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
    backgroundSize: '22px 22px',
  }),
  grid: (color = 'rgba(42,21,6,0.07)') => ({
    backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    backgroundSize: '28px 28px',
  }),
  diag: (color = 'rgba(42,21,6,0.06)') => ({
    backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0, ${color} 1px, transparent 0, transparent 50%)`,
    backgroundSize: '14px 14px',
  }),
  grain: (color = 'rgba(251,245,233,0.04)') => ({
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: '6px 6px',
  }),
}
