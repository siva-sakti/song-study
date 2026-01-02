'use client'

// Color mapping for Roman numerals
const romanColors: Record<string, string> = {
  'I': '#4ECDC4',   // teal - home
  'i': '#45B7AA',   // dark teal
  'ii': '#96CEB4',  // sage
  'II': '#A8D8C4',  // light sage
  'iii': '#FFEAA7', // soft yellow
  'III': '#FDCB6E', // golden
  'IV': '#DDA0DD',  // plum - lift
  'iv': '#C896C8',  // dark plum
  'V': '#FF6B6B',   // coral - tension
  'v': '#E55555',   // dark coral
  'vi': '#74B9FF',  // sky blue - emotional
  'VI': '#5DADE2',  // bright blue
  'vii°': '#FFB347', // orange
  'VII': '#F5A623', // amber
}

const romanFeelings: Record<string, string> = {
  'I': 'home',
  'i': 'home (minor)',
  'ii': 'preparing',
  'II': 'bright preparation',
  'iii': 'dreamy',
  'III': 'surprise',
  'IV': 'lifting',
  'iv': 'longing',
  'V': 'tension',
  'v': 'subtle tension',
  'vi': 'emotional',
  'VI': 'dramatic',
  'vii°': 'pull to resolve',
  'VII': 'unexpected',
}

interface ChordBlockProps {
  chordName: string
  romanNumeral: string
  isActive?: boolean
}

export default function ChordBlock({ chordName, romanNumeral, isActive = false }: ChordBlockProps) {
  const color = romanColors[romanNumeral] || '#666'
  const feeling = romanFeelings[romanNumeral] || ''

  return (
    <div
      className={`
        relative group flex flex-col items-center justify-center
        w-16 h-20 rounded-lg cursor-default transition-transform
        ${isActive ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'}
      `}
      style={{ backgroundColor: color }}
    >
      <span className="text-black font-bold text-lg">{chordName}</span>
      <span className="text-black/70 text-xs">{romanNumeral}</span>

      {/* Tooltip */}
      {feeling && (
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {feeling}
        </div>
      )}
    </div>
  )
}
