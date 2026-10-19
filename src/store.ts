import { create } from 'zustand'

type UIState = {
  menuOpen: boolean
  setMenu: (v: boolean) => void
  loaded: boolean
  setLoaded: (v: boolean) => void
  cursorLabel: string
  setCursor: (v: string) => void
  prefillUnit: string
  setPrefillUnit: (v: string) => void
  selected3d: string | null
  setSelected3d: (v: string | null) => void
  evening: boolean
  setEvening: (v: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  menuOpen: false, setMenu: (v) => set({ menuOpen: v }),
  loaded: false, setLoaded: (v) => set({ loaded: v }),
  cursorLabel: '', setCursor: (v) => set({ cursorLabel: v }),
  prefillUnit: '', setPrefillUnit: (v) => set({ prefillUnit: v }),
  selected3d: null, setSelected3d: (v) => set({ selected3d: v }),
  evening: false, setEvening: (v) => set({ evening: v }),
}))
export const BRAND = 'Lumen Grove'
export const PHONE = '+00 00 000 000'
export const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 961
