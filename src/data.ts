// Seed data — generated deterministically so slugs are stable across reloads.
let seed = 42
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)]

export type Residence = {
  id: string; code: string; wing: 'A' | 'B'; floor: number; rooms: number; area: number
  balcony: boolean; garden: boolean; status: 'Available' | 'Reserved'; orientation: string; planSeed: number
}
const ROOM_OPTS = [1, 1.5, 2, 2.5, 3, 4]
export const residences: Residence[] = []
;(() => {
  for (const wing of ['A', 'B'] as const) {
    for (let floor = 1; floor <= 16; floor++) {
      const per = wing === 'A' ? 7 : 6
      for (let u = 1; u <= per; u++) {
        const rooms = pick(ROOM_OPTS)
        const area = Math.round((26 + rooms * 22 + rnd() * 26) * 10) / 10
        residences.push({
          id: `${wing.toLowerCase()}-${floor}-${String(u).padStart(2, '0')}`,
          code: `${wing} ${floor}.${String(u).padStart(2, '0')}`,
          wing, floor, rooms, area: Math.min(area, 162),
          balcony: rnd() > 0.3, garden: floor === 1 && rnd() > 0.35,
          status: rnd() > 0.82 ? 'Reserved' : 'Available',
          orientation: pick(['East', 'West', 'South', 'South-East', 'North-West']),
          planSeed: Math.floor(rnd() * 1e6),
        })
      }
    }
  }
})()

export type RetailUnit = {
  id: string; code: string; type: 'Office' | 'Retail'; wing: 'A' | 'B' | 'V'; floor: number
  floorLabel: string; area: number; status: 'Available' | 'Reserved'; planSeed: number
}
export const retailUnits: RetailUnit[] = []
;(() => {
  seed = 777
  let n = 0
  for (const wing of ['A', 'B', 'V'] as const) {
    for (let i = 1; i <= (wing === 'V' ? 15 : 17); i++) {
      n++
      const type = i <= 3 ? 'Retail' : 'Office'
      const floor = type === 'Retail' ? 0 : 1 + Math.floor(rnd() * 11)
      retailUnits.push({
        id: `${wing.toLowerCase()}${floor}-pp${i}`,
        code: `${wing}${floor}.PP${i}`, type, wing, floor,
        floorLabel: floor === 0 ? 'Ground floor' : `Floor ${floor}`,
        area: Math.round(71 + rnd() * (type === 'Retail' ? 420 : 888)),
        status: rnd() > 0.85 ? 'Reserved' : 'Available', planSeed: Math.floor(rnd() * 1e6),
      })
    }
  }
})()

export const pois = [
  { name: 'Central Rail Station', walk: 12, drive: 4, x: 22, y: 30, desc: 'Regional and intercity connections from early morning to late evening, with a direct airport express every twenty minutes.' },
  { name: 'Riverside Primary School', walk: 6, drive: 2, x: 38, y: 52, desc: 'A well-regarded neighborhood school with a green campus, after-school programs and a safe, tree-lined walking route.' },
  { name: 'The Market Hall', walk: 4, drive: 1, x: 55, y: 40, desc: 'Fresh produce, bakeries and small makers under one vaulted roof — the daily ritual of the district, moments from your door.' },
  { name: 'Northfield Business Park', walk: 9, drive: 3, x: 68, y: 24, desc: 'Headquarters and studios of the city’s creative and tech firms; many residents simply walk to work through the park.' },
  { name: 'Canopy Shopping Gallery', walk: 14, drive: 5, x: 80, y: 58, desc: 'Fashion, design stores and a cinema, arranged around a planted atrium that mirrors the spirit of Lumen Grove.' },
  { name: 'International Airport', walk: 0, drive: 28, x: 90, y: 16, desc: 'Under half an hour by car or express rail, with direct flights to more than sixty destinations.' },
]

export const projects = [
  { title: 'The Alder Quarter', city: 'Your City', img: '/assets/building-exterior.jpg', desc: 'A garden district of 320 homes wrapped around a preserved grove of alder trees, completed in 2019.' },
  { title: 'Meridian Works', city: 'Northport', img: '/assets/business-office.jpg', desc: 'Adaptive reuse of a former printing works into light-filled offices and maker studios.' },
  { title: 'Casa Verde', city: 'Southfield', img: '/assets/residence-interior.jpg', desc: 'Courtyard residences where every balcony is a small orchard; sold out within a single season.' },
  { title: 'The Canopy Hotel', city: 'Your City', img: '/assets/amenities-rooftop.jpg', desc: 'A rooftop-forest hotel whose restaurant grows much of its menu forty metres above the street.' },
  { title: 'Harbour Steps', city: 'Eastbay', img: '/assets/panorama-aerial.jpg', desc: 'Terraced homes stepping down to the water, each level planted as a hanging garden.' },
  { title: 'Studio Nine', city: 'Northport', img: '/assets/location-street.jpg', desc: 'Compact first homes above a street of independent shops — proof that small can still be generous.' },
]

export const milestones = [
  { pct: 20, label: 'On signing the reservation agreement' },
  { pct: 20, label: 'Completion of the structural frame' },
  { pct: 20, label: 'Facade and glazing installed' },
  { pct: 30, label: 'Interior fit-out and technical acceptance' },
  { pct: 10, label: 'Handover of keys and final registration' },
]

// Programmatic floor-plan SVG (deterministic per planSeed)
export function planRooms(planSeed: number, rooms: number) {
  let s = planSeed || 7
  const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
  const count = Math.min(2 + Math.round(rooms), 6)
  const out: { x: number; y: number; w: number; h: number; label: string }[] = []
  const labels = ['Living', 'Kitchen', 'Bedroom', 'Bath', 'Bedroom 2', 'Study']
  let x = 8
  for (let i = 0; i < count; i++) {
    const w = 22 + r() * 26
    const h = i % 2 ? 38 + r() * 20 : 62 + r() * 22
    out.push({ x, y: i % 2 ? 8 : 8, w: Math.min(w, 292 - x), h, label: labels[i] })
    x += w + 4
    if (x > 240) { x = 8 }
  }
  return out
}
export const roomLabel = (r: number) => (Number.isInteger(r) ? `${r} BR` : `${r} BR`)
