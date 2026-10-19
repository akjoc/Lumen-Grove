import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduced } from './store'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

/** Line-by-line (word-group) heading reveal with overflow masks. Lines split by <br/> or \n */
export function SplitReveal({ text, as: Tag = 'h2', className = '', delay = 0 }: { text: string; as?: any; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!ref.current) return
    if (reduced) { gsap.set(ref.current.querySelectorAll('.sr-inner'), { y: 0 }); return }
    const ctx = gsap.context(() => {
      gsap.to(ref.current!.querySelectorAll('.sr-inner'), {
        y: 0, duration: 1.15, ease: 'power4.out', stagger: 0.08, delay,
        scrollTrigger: { trigger: ref.current, start: 'top 86%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  const lines = text.split('\n')
  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, ' ')}>
      {lines.map((l, i) => (
        <span className="sr-line" key={i} aria-hidden><span className="sr-inner">{l}</span></span>
      ))}
    </Tag>
  )
}

export function FadeUp({ children, className = '', delay = 0, as: Tag = 'div' }: any) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!ref.current || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay,
        scrollTrigger: { trigger: ref.current, start: 'top 88%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return <Tag ref={ref} className={className}>{children}</Tag>
}

export function ParallaxImage({ src, alt, className = '', speed = 10, style }: { src: string; alt: string; className?: string; speed?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || reduced) return
    const img = ref.current.querySelector('img')
    const ctx = gsap.context(() => {
      gsap.fromTo(img, { yPercent: -speed / 2 }, {
        yPercent: speed / 2, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return <div ref={ref} className={`parallax-frame ${className}`} style={style}><img src={src} alt={alt} loading="lazy" /></div>
}

export function RevealImage({ src, alt, className = '', style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || reduced) return
    const img = ref.current.querySelector('img')
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { clipPath: 'inset(12% 8% 12% 8% round 6px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 1.3, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })
      gsap.to(img, { scale: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return <div ref={ref} className={`img-reveal ${className}`} style={style}><img src={src} alt={alt} loading="lazy" /></div>
}

export function CountUp({ value, suffix = '', className = '' }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!ref.current) return
    if (reduced) { ref.current.textContent = `${value}${suffix}`; return }
    const obj = { v: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: value, duration: 1.6, ease: 'power3.out',
        onUpdate: () => { if (ref.current) ref.current.textContent = `${Math.round(obj.v)}${suffix}` },
        scrollTrigger: { trigger: ref.current, start: 'top 90%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [value])
  return <span ref={ref} className={className}>0{suffix}</span>
}

/** Magnetic hover for primary CTAs (desktop pointers only) */
export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !window.matchMedia('(hover:hover)').matches) return
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.28, duration: 0.4, ease: 'power3.out' })
    }
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
    el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [])
  return <span ref={ref} style={{ display: 'inline-block' }}>{children}</span>
}

/** Dual-handle range slider */
export function DualRange({ label, min, max, value, onChange, unit = '' }: {
  label: string; min: number; max: number; value: [number, number]; onChange: (v: [number, number]) => void; unit?: string
}) {
  const [lo, hi] = value
  const set = (i: number, v: number) => {
    if (i === 0) onChange([Math.min(v, hi - 1), hi]); else onChange([lo, Math.max(v, lo + 1)])
  }
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  return (
    <div className="range-wrap">
      <label>{label}<output>{lo} – {hi}{unit}</output></label>
      <div className="dual">
        <span className="fill" style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }} />
        <input type="range" min={min} max={max} value={lo} aria-label={`${label} min`} onChange={(e) => set(0, +e.target.value)} />
        <input type="range" min={min} max={max} value={hi} aria-label={`${label} max`} onChange={(e) => set(1, +e.target.value)} />
      </div>
    </div>
  )
}

/** Programmatic SVG floor plan */
export function PlanSVG({ planSeed, rooms, large = false }: { planSeed: number; rooms: number; large?: boolean }) {
  // deterministic layout
  let s = planSeed || 7
  const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
  const beds = Math.max(1, Math.round(rooms))
  const cols = 1 + beds
  const W = 300, H = 210, pad = 10
  const rects: any[] = []
  const labels = ['Living', ...Array.from({ length: beds }, (_, i) => `Bedroom ${i + 1}`), 'Kitchen', 'Bath']
  const colW = (W - pad * 2) / cols
  for (let i = 0; i < cols; i++) {
    const split = 0.45 + r() * 0.2
    rects.push({ x: pad + i * colW, y: pad, w: colW - 5, h: (H - pad * 2) * split, l: labels[i] || 'Room' })
    rects.push({ x: pad + i * colW, y: pad + (H - pad * 2) * split + 5, w: colW - 5, h: (H - pad * 2) * (1 - split) - 5, l: i === 0 ? 'Kitchen' : i === cols - 1 ? 'Bath' : 'Hall' })
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: large ? 720 : 300 }} role="img" aria-label="Floor plan">
      <rect x={4} y={4} width={W - 8} height={H - 8} fill="none" stroke="#14352a" strokeWidth={2.5} />
      {rects.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={i % 2 ? '#efe7d7' : '#e4ecdf'} stroke="#14352a" strokeWidth={1} />
          <text x={b.x + b.w / 2} y={b.y + b.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize={large ? 11 : 9.5} fill="#14352a" fontFamily="Manrope,sans-serif" fontWeight={600}>{b.l}</text>
        </g>
      ))}
      <circle cx={W - 26} cy={26} r={11} fill="none" stroke="#b99256" /><text x={W - 26} y={29} textAnchor="middle" fontSize={9} fill="#b99256" fontWeight={700}>N</text>
    </svg>
  )
}

export function useGsapScope(fn: (ctx: gsap.Context) => void, deps: any[] = []) {
  const ref = useRef<any>(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => fn(ctx), ref)
    return () => ctx.revert()
    // eslint-disable-next-line
  }, deps)
  return ref
}
