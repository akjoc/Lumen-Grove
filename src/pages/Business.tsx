import { asset } from '../asset'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Seo, L, Footer } from '../App'
import { SplitReveal, FadeUp, Magnetic } from '../anim'
import { reduced } from '../store'

gsap.registerPlugin(ScrollTrigger)

/* Fullscreen promo video modal — swap src/poster with the client's film */
export function VideoModal({ src = asset('assets/video/promo.mp4'), poster = asset('assets/building-exterior.jpg'), onClose }: { src?: string; poster?: string; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [prog, setProg] = useState(0)
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    ;(window as any).__lenis?.stop()
    video.current?.focus()
    return () => { window.removeEventListener('keydown', esc); (window as any).__lenis?.start() }
  }, [])
  const toggle = () => { const v = video.current!; if (v.paused) { v.play(); setPlaying(true) } else { v.pause(); setPlaying(false) } }
  return (
    <div className="vmodal" role="dialog" aria-modal="true" aria-label="Promo video">
      <button className="pill-btn" style={{ position: 'absolute', top: 24, right: 24 }} onClick={onClose} autoFocus>Close ✕</button>
      <video ref={video} src={src} poster={poster} autoPlay muted={muted} loop playsInline
        onTimeUpdate={(e) => setProg(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
        onClick={toggle} data-cursor={playing ? 'Pause' : 'Play'} />
      <div className="vcontrols">
        <button className="pill-btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? '❚❚' : '▶'}</button>
        <progress value={prog} max={1} aria-label="Progress" />
        <button className="pill-btn" onClick={() => { setMuted(!muted); if (video.current) video.current.muted = !muted }}>{muted ? 'Muted' : 'Sound on'}</button>
      </div>
      <p style={{ marginTop: 14, opacity: 0.65, fontSize: 12.5 }}>Placeholder film slot — place the client video at <code>/assets/video/promo.mp4</code>.</p>
    </div>
  )
}

const WINGS = [
  { id: 'A', label: 'Wing A', count: 11, poly: '6,18 34,10 36,82 8,88', desc: 'Corner-glazed offices above the market street, 90–640 m², with planted loggias on every second floor.' },
  { id: 'B', label: 'Wing B', count: 14, poly: '38,8 64,12 62,84 38,80', desc: 'The quiet work wing: deep floor plates for studios and headquarters, facing the inner grove courtyard.' },
  { id: 'V', label: 'Wing V', count: 9, poly: '66,14 92,22 90,86 64,82', desc: 'The crown wing — upper-floor offices sharing the rooftop park level and the café-restaurant terrace.' },
  { id: 'R', label: 'Retail', count: 15, poly: '6,88 92,84 94,98 4,98', desc: 'Ground-canopy storefronts for cafés, makers and neighbourhood services, with shaded pavement terraces.' },
]

export default function Business() {
  const [video, setVideo] = useState(false)
  const [wing, setWing] = useState(0)
  const connRef = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!connRef.current || reduced) return
    const ctx = gsap.context(() => {
      const blocks = gsap.utils.selector(connRef)('.conn-block')
      const tl = gsap.timeline({ scrollTrigger: { trigger: connRef.current, start: 'top top', end: '+=240%', pin: true, scrub: 1, anticipatePin: 1 } })
      blocks.forEach((b, i) => {
        tl.fromTo(b, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.3, onStart: () => setStep(i), onReverseComplete: () => setStep(Math.max(0, i - 1)) }, i * 0.8)
        if (i < blocks.length - 1) tl.to(b, { autoAlpha: 0, y: -50, duration: 0.25 }, i * 0.8 + 0.55)
      })
    }, connRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!countRef.current || reduced) { if (countRef.current) countRef.current.textContent = String(WINGS[wing].count); return }
    const obj = { v: parseInt(countRef.current.textContent || '0') }
    gsap.to(obj, { v: WINGS[wing].count, duration: 0.7, ease: 'power3.out', onUpdate: () => { if (countRef.current) countRef.current.textContent = String(Math.round(obj.v)) } })
  }, [wing])

  const brochure = () => {
    const blob = new Blob([`LUMEN Grove — Business brochure\n${WINGS[wing].label}: ${WINGS[wing].count} spaces\n\nPlaceholder brochure for the client mockup.`], { type: 'text/plain' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'lumen-grove-business-brochure.txt'; a.click(); URL.revokeObjectURL(a.href)
  }

  return (
    <main>
      <Seo title="Business Spaces" desc="Offices and retail at Lumen Grove — contemporary architecture under a living canopy." />
      {video && <VideoModal onClose={() => setVideo(false)} />}
      {/* 1 Hero */}
      <section className="page-hero" style={{ minHeight: '100vh' }}>
        <div className="bg" style={{ backgroundImage: `url(${asset('assets/business-office.jpg')})` }} role="img" aria-label="Business interiors" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(13,38,30,.86),rgba(13,38,30,.25) 60%)' }} />
        <div className="inner"><div className="wrap">
          <p className="eyebrow light">Work, beneath the leaves</p>
          <SplitReveal text="BUSINESS SPACES" as="h1" className="h-display" />
          <FadeUp><p className="lead light mt-s">Offices and retail for companies that believe a workplace should feel alive — daylight, greenery and the whole district at the door.</p></FadeUp>
          <FadeUp className="mt-m"><div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Magnetic><button className="btn gold" onClick={() => setVideo(true)} data-cursor="Play">▶ View promo video</button></Magnetic>
            <Magnetic><L to="/retail-spaces" className="btn light">Explore spaces<span className="arr">→</span></L></Magnetic>
          </div></FadeUp>
        </div></div>
      </section>

      {/* 2 Connectivity — pinned 3 steps */}
      <section className="hero-pin" ref={connRef} style={{ height: '100vh' }}>
        <div className="hero-layer back" style={{ backgroundImage: `url(${asset('assets/building-exterior.jpg')})`, inset: 0 }} />
        <div className="hero-shade" />
        <div className="hero-progress">{[0, 1, 2].map((i) => <button key={i} className={step === i ? 'on' : ''} tabIndex={-1}>0{i + 1}</button>)}</div>
        {[
          { h: 'Connected by nature', p: 'The central station is a twelve-minute walk under the avenue trees; the airport express leaves every twenty minutes. Clients arrive calm. Teams arrive on foot.' },
          { h: 'A neighbourhood that works', p: 'The Market Hall for lunch, the business park for partners, two gyms and a rooftop park for everything in between. The workday, composted into something richer.' },
          { h: 'Contemporary Architecture & Sophisticated Interiors', p: 'Canopy-patterned shading, 3.1 m ceilings, openable glazing and planted loggias — interiors specified for focus, finished for pleasure.', cta: true },
        ].map((b, i) => (
          <div className="statement conn-block" key={i} style={i === 0 && !reduced ? {} : undefined}>
            <p className="eyebrow light">0{i + 1} / 03</p>
            <h2>{b.h}</h2>
            <p className="lead light">{b.p}</p>
            {b.cta && <div className="mt-m"><L to="/retail-spaces" className="btn gold">Explore spaces<span className="arr">→</span></L></div>}
          </div>
        ))}
      </section>

      {/* 3 Space options */}
      <section className="section"><div className="wrap">
        <p className="eyebrow">Space options</p>
        <SplitReveal text={"Choose your\nbranch"} className="h-xl" />
        <div className="mt-l">
          <div className="wing-pills" role="tablist" aria-label="Wings">
            {WINGS.map((w, i) => <button key={w.id} role="tab" aria-selected={wing === i} className={`chip ${wing === i ? 'on' : ''}`} onClick={() => setWing(i)}>{w.id === 'R' ? 'Retail' : `Wing ${w.id}`}</button>)}
          </div>
          <div className="wing-stage">
            <img className="bgimg" src={asset('assets/building-exterior.jpg')} alt="Lumen Grove wings" />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
              {WINGS.map((w, i) => (
                <polygon key={w.id} points={w.poly} onClick={() => setWing(i)} style={{ cursor: 'pointer' }}
                  fill={wing === i ? 'rgba(185,146,86,.45)' : 'rgba(20,53,42,.12)'} stroke={wing === i ? '#b99256' : 'rgba(246,241,231,.35)'} strokeWidth={0.4} />
              ))}
            </svg>
            <div className="wing-card" role="tabpanel">
              <p className="eyebrow">{WINGS[wing].label}</p>
              <p style={{ marginTop: 10 }}><span className="big" ref={countRef}>{WINGS[wing].count}</span> <strong>{WINGS[wing].id === 'R' ? 'retail spaces' : 'office spaces'}</strong></p>
              <p style={{ marginTop: 10, color: '#4a5049' }}>{WINGS[wing].desc}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
                <button className="btn solid" onClick={brochure}>Brochure ↓</button>
                <L to="/contact?tab=business" className="btn">Inquire<span className="arr">→</span></L>
              </div>
            </div>
          </div>
        </div>
      </div></section>

      {/* 4 Panorama */}
      <section className="teaser" style={{ minHeight: '84vh' }}>
        <div className="bg" style={{ backgroundImage: `url(${asset('assets/panorama-aerial.jpg')})` }} role="img" aria-label="Panoramic view from the rooftop" />
        <div className="shade" />
        <div className="inner"><div className="wrap">
          <p className="eyebrow light">The top floor</p>
          <SplitReveal text={"Lunch above\nthe treetops"} className="h-xl" />
          <FadeUp><p className="lead light mt-s" style={{ maxWidth: '54ch' }}>A café-restaurant crowns the complex, its terrace wrapped in the rooftop park. Client lunches with a panorama; team evenings under the first stars.</p></FadeUp>
          <FadeUp className="mt-m"><Magnetic><L to="/retail-spaces" className="btn light">View available spaces<span className="arr">→</span></L></Magnetic></FadeUp>
        </div></div>
      </section>
      <Footer />
    </main>
  )
}
