import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Seo, L, Footer } from '../App'
import { SplitReveal, FadeUp, ParallaxImage, RevealImage, CountUp, Magnetic } from '../anim'
import { pois, milestones } from '../data'
import { reduced, isMobile } from '../store'

gsap.registerPlugin(ScrollTrigger)
const M = () => isMobile()

/* 1 — Hero pinned leaf reveal + statement slides */
function Hero() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!ref.current || reduced) { setStep(2); return }
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=340%', pin: true, scrub: 1, anticipatePin: 1 },
      })
      tl.to(q('.hero-layer.back'), { scale: 1.22, ease: 'none' }, 0)
        .to(q('.hero-layer.mid'), { xPercent: -58, scale: 1.15, ease: 'none' }, 0)
        .to(q('.hero-layer.front'), { xPercent: 58, scale: 1.15, ease: 'none' }, 0)
        .to(q('.hero-brand'), { opacity: 0, scale: 1.12, filter: 'blur(6px)', ease: 'power2.in' }, 0.05)
        .to(q('.scroll-hint'), { opacity: 0 }, 0)
      const slides = q('.statement')
      slides.forEach((s, i) => {
        const at = 0.35 + i * 0.85
        tl.fromTo(s, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: 'power3.out', onStart: () => setStep(i), onReverseComplete: () => setStep(Math.max(0, i - 1)) }, at)
        if (i < slides.length - 1) tl.to(s, { autoAlpha: 0, y: -70, duration: 0.28, ease: 'power3.in' }, at + 0.55)
      })
      gsap.fromTo(q('.hero-brand h1'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out', delay: 0.2 })
    }, ref)
    return () => ctx.revert()
  }, [])
  const statements = [
    { e: t('hero.design'), h: t('hero.s1t'), p: t('hero.s1'), cta: null },
    { e: t('hero.design'), h: t('hero.s2t'), p: t('hero.s2'), cta: null },
    { e: t('hero.design'), h: t('hero.s3t'), p: t('hero.s3'), cta: t('hero.cta') },
  ]
  return (
    <section className="hero-pin" ref={ref} aria-label="Introduction">
      <div className="hero-layer back" style={{ backgroundImage: 'url(/assets/hero-leaves.jpg)' }} />
      <div className="hero-layer mid" style={{ backgroundImage: 'url(/assets/hero-leaves.jpg)' }} />
      <div className="hero-layer front" style={{ backgroundImage: 'url(/assets/hero-leaves.jpg)' }} />
      <div className="hero-shade" />
      <div className="hero-brand">
        <p className="eyebrow light">{t('hero.design')}</p>
        <h1>Lumen Grove</h1>
        <p className="tag">{t('hero.tag')}</p>
        <div style={{ marginTop: 30 }}><Magnetic><L to="/3d" className="btn light" data-cursor="Explore">{t('hero.explore3d')}<span className="arr">→</span></L></Magnetic></div>
      </div>
      <div className="hero-statements">
        {statements.map((s, i) => (
          <div className="statement" key={i} style={reduced ? { position: 'relative', opacity: 1, visibility: 'visible', marginBottom: 30 } : undefined}>
            <p className="eyebrow light">0{i + 1} — {s.e}</p>
            <h2>{s.h}</h2>
            <p className="lead light">{s.p}</p>
            {s.cta && <div className="mt-m"><Magnetic><L to="/residences" className="btn gold">{s.cta}<span className="arr">→</span></L></Magnetic></div>}
          </div>
        ))}
      </div>
      <div className="hero-progress" aria-hidden>
        {[0, 1, 2].map((i) => <button key={i} className={step === i ? 'on' : ''} tabIndex={-1}>0{i + 1}</button>)}
      </div>
      <div className="scroll-hint"><span>{t('hero.scroll')}</span><i /></div>
    </section>
  )
}

/* 2 — Location */
function Location() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(0)
  const bodies = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    bodies.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, { height: i === open ? 'auto' : 0, duration: reduced ? 0 : 0.6, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() })
    })
  }, [open])
  return (
    <section className="section" id="Around">
      <div className="wrap">
        <p className="eyebrow">{t('loc.label')}</p>
        <SplitReveal text={t('loc.title')} className="h-xl" />
        <div className="loc-grid mt-l">
          <div style={{ position: 'relative' }}>
            <ParallaxImage src="/assets/location-street.jpg" alt="Tree-lined street around Lumen Grove" className="loc-img" />
            {pois.map((p, i) => <span key={p.name} className={`loc-pin ${open === i ? 'on' : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>⌖</span>)}
            <FadeUp><p className="lead mt-m">{t('loc.intro')}</p></FadeUp>
          </div>
          <div>
            {pois.map((p, i) => (
              <article key={p.name} className={`poi-row ${open === i ? 'open' : ''}`} onClick={() => setOpen(i)} onMouseEnter={() => !M() && setOpen(i)}>
                <div className="poi-head">
                  <h3>{p.name}</h3>
                  <div className="poi-times">
                    {p.walk > 0 && <span>🚶 {p.walk} min {t('common.walk')}</span>}
                    <span>🚗 {p.drive} min {t('common.drive')}</span>
                  </div>
                </div>
                <div className="poi-body" ref={(el) => (bodies.current[i] = el)}><p>{p.desc}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* 3/4 — Teasers */
function Teaser({ img, eyebrow, title, text, to, cta }: any) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!ref.current || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!.querySelector('.bg'), { scale: 1.14, yPercent: -4 }, {
        scale: 1, yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="teaser" ref={ref}>
      <div className="bg" style={{ backgroundImage: `url(${img})` }} role="img" aria-label={title} />
      <div className="shade" />
      <div className="inner"><div className="wrap"><div className="teaser-row">
        <div>
          <p className="eyebrow light">{eyebrow}</p>
          <SplitReveal text={title} className="h-display" />
          <FadeUp><p className="lead light mt-s" style={{ maxWidth: '52ch' }}>{text}</p></FadeUp>
        </div>
        <Magnetic><L to={to} className="btn light" data-cursor="Explore">{cta}<span className="arr">→</span></L></Magnetic>
      </div></div></div>
    </section>
  )
}

/* 5 — Your roots */
function Roots() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!ref.current || reduced) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref)
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=220%', pin: true, scrub: 1, anticipatePin: 1 } })
      tl.fromTo(q('.r1 img'), { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .to(q('.r1'), { xPercent: M() ? 0 : -46, yPercent: M() ? -12 : 0, scale: 0.82, opacity: 0.25, ease: 'power2.inOut', duration: 0.6 }, 0.8)
        .fromTo(q('.r2'), { clipPath: 'inset(0 0 100% 0)', scale: 1.06 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, ease: 'power2.inOut', duration: 0.6 }, 0.85)
        .fromTo(q('.roots-p2'), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 1.1)
        .to(q('.roots-p1'), { autoAlpha: 0, y: -20, duration: 0.25 }, 0.95)
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="roots-pin" ref={ref}>
      <div className="roots-img r1"><img src="/assets/residence-interior.jpg" alt="Residence interior with garden view" /></div>
      <div className="roots-img r2"><img src="/assets/amenities-rooftop.jpg" alt="Rooftop garden at golden hour" /></div>
      <div className="roots-copy">
        <p className="eyebrow">The way of living</p>
        <h2>Your roots</h2>
        <div style={{ position: 'relative', minHeight: 150, marginTop: 18 }}>
          <p className="lead roots-p1" style={{ position: 'absolute' }}>Homes here are planted, not placed. Deep balconies hold soil and shade; living rooms open to planted terraces where mornings begin among leaves.</p>
          <p className="lead roots-p2" style={{ position: 'absolute', opacity: 0 }}>As seasons turn, the building turns with them — blossom, canopy, amber, rest. To live at Lumen Grove is to keep time with something older than the city.</p>
        </div>
        <div className="mt-m"><Magnetic><L to="/residences" className="btn solid">Explore residences<span className="arr">→</span></L></Magnetic></div>
      </div>
    </section>
  )
}

/* 6 — Amenities */
function Amenities() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!ref.current || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!.querySelectorAll('.amen-card'), { opacity: 0, y: 46 }, {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 65%' },
      })
      gsap.fromTo(ref.current!.querySelector('.bg'), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    }, ref)
    return () => ctx.revert()
  }, [])
  const items = [
    ['02', 'Fitness clubs with garden views'], ['02', 'Rooftop parks under open sky'],
    ['01', 'Top-floor café & restaurant'], ['24/7', 'Concierge & residents’ club'],
    ['600m²', 'Children’s forest playground'], ['300+', 'Trees & shrubs on site'],
  ]
  return (
    <section className="amenities section" id="Amenities" ref={ref}>
      <div className="bg" style={{ backgroundImage: 'url(/assets/amenities-rooftop.jpg)' }} role="img" aria-label="Rooftop park and café" />
      <div className="shade" />
      <div className="wrap" style={{ position: 'relative' }}>
        <p className="eyebrow light">Residents’ world</p>
        <SplitReveal text="Amenities" className="h-display" />
        <FadeUp><p className="lead light mt-s">Two gyms face the gardens, two rooftop parks crown the wings, and a café-restaurant on the top floor pours the sunset daily. Everything a household needs grows within the canopy.</p></FadeUp>
        <div className="amen-grid">
          {items.map(([n, label]) => <div className="amen-card" key={label}><b>{n}</b><span>{label}</span></div>)}
        </div>
      </div>
    </section>
  )
}

/* 7 — View from above (horizontal) */
const CloudSVG = ({ w = 340 }: { w?: number }) => (
  <svg width={w} viewBox="0 0 340 150" aria-hidden>
    <g fill="#ffffff">
      <ellipse cx="110" cy="100" rx="95" ry="38" /><ellipse cx="175" cy="78" rx="80" ry="46" />
      <ellipse cx="240" cy="102" rx="85" ry="34" /><ellipse cx="140" cy="112" rx="110" ry="30" />
    </g>
  </svg>
)
function Above() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!ref.current || reduced) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref)
      const track = q('.above-track')[0] as HTMLElement
      const dist = () => track.scrollWidth - window.innerWidth
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true } })
      tl.to(track, { x: () => -dist(), ease: 'none', duration: 1 }, 0)
        .fromTo(q('.above-letters'), { scale: 0.7, backgroundPosition: '30% 50%' }, { scale: 1.6, backgroundPosition: '70% 50%', ease: 'none', duration: 1 }, 0)
        .to(q('.cloud.c1'), { x: -520, ease: 'none', duration: 1 }, 0)
        .to(q('.cloud.c2'), { x: -980, ease: 'none', duration: 1 }, 0)
        .to(q('.cloud.c3'), { x: -300, ease: 'none', duration: 1 }, 0)
        .fromTo(q('.above-end > *'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.18 }, 0.78)
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="above-pin" ref={ref} aria-label="View from above">
      <div className="above-track">
        <div className="above-pano" style={{ backgroundImage: 'url(/assets/panorama-aerial.jpg)' }}>
          <div className="above-mask-wrap">
            <span className="above-letters" style={{ backgroundImage: 'url(/assets/panorama-aerial.jpg)' }}>LG</span>
          </div>
          <div className="cloud c1" style={{ top: '12%', left: '38%' }}><CloudSVG w={380} /></div>
          <div className="cloud c2" style={{ top: '58%', left: '62%' }}><CloudSVG w={520} /></div>
          <div className="cloud c3" style={{ top: '24%', left: '78%' }}><CloudSVG w={260} /></div>
          <p className="eyebrow" style={{ position: 'absolute', top: 90, left: 'var(--pad)', color: '#14352a' }}>Keep scrolling →</p>
        </div>
        <div className="above-end">
          <p className="eyebrow light">The signature view</p>
          <h2 className="h-display">View<br />from above</h2>
          <p className="lead light mt-s" style={{ maxWidth: '46ch' }}>From the rooftop parks, the city reads as a second forest — rooftops, river and cloud shadows drifting at walking pace. Some addresses have a view. This one has a horizon.</p>
          <div className="mt-m"><Magnetic><L to="/3d" className="btn gold" data-cursor="Explore">See it in 3D<span className="arr">→</span></L></Magnetic></div>
        </div>
      </div>
    </section>
  )
}

/* 8 — Installment */
function Installment() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || reduced) { ref.current?.querySelectorAll('.mile-line i').forEach((el: any) => (el.style.transform = 'scaleX(1)')); return }
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.mile-row').forEach((row, i) => {
        gsap.fromTo(row, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.05, scrollTrigger: { trigger: row, start: 'top 88%' } })
        gsap.to(row.querySelector('.mile-line i'), { scaleX: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 88%' } })
      })
      gsap.to('.inst-bar i', { width: '100%', ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom 60%', scrub: true } })
    }, ref)
    return () => ctx.revert()
  }, [])
  const dl = (name: string) => {
    const blob = new Blob([`LUMEN Grove\n${name}\n\nPlaceholder document for the client mockup.\nReplace with the official permit PDF before launch.`], { type: 'text/plain' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.txt`; a.click(); URL.revokeObjectURL(a.href)
  }
  return (
    <section className="section"><div className="wrap"><div className="inst-grid">
      <RevealImage src="/assets/building-exterior.jpg" alt="Lumen Grove facade detail" style={{ height: 'clamp(380px,60vh,620px)' }} />
      <div ref={ref}>
        <p className="eyebrow">Payment plan</p>
        <SplitReveal text={"Own it in\nfive seasons"} className="h-lg" />
        <div className="mt-m">
          {milestones.map((m) => (
            <div className="mile-row" key={m.label}>
              <span className="pct"><CountUp value={m.pct} /><em>%</em></span>
              <span>{m.label}</span>
              <span className="mile-line"><i /></span>
            </div>
          ))}
        </div>
        <div className="inst-bar" aria-hidden><i /></div>
        <FadeUp className="mt-m" >
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => dl('Building Permit Wing A')}>Building permit — Wing A ↓</button>
            <button className="btn" onClick={() => dl('Building Permit Wing B')}>Building permit — Wing B ↓</button>
          </div>
        </FadeUp>
      </div>
    </div></div></section>
  )
}

export default function Home() {
  return (
    <main>
      <Seo title="Home" desc="Lumen Grove — a living canopy in the city. Premium residences, business and retail spaces." />
      <Hero />
      <Location />
      <Teaser img="/assets/residence-interior.jpg" eyebrow="Live" title="Residences" text="One to four bedroom homes with planted terraces, garden-level residences and penthouses in the crown of the canopy. 208 ways to put down roots." to="/residences" cta="Browse residences" />
      <Teaser img="/assets/business-office.jpg" eyebrow="Work & trade" title="Business" text="Offices and retail woven into the ground canopy — daylight workplaces above a shaded, walkable street of independent shops and cafés." to="/business" cta="Explore business" />
      <Roots />
      <Amenities />
      <Above />
      <Installment />
      <Footer />
    </main>
  )
}
