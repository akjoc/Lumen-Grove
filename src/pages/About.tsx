import { asset } from '../asset'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Seo, L, Footer } from '../App'
import { SplitReveal, FadeUp, ParallaxImage, Magnetic } from '../anim'
import { projects } from '../data'
import { reduced } from '../store'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!listRef.current || reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.proj-item').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 55%', end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
    }, listRef)
    return () => ctx.revert()
  }, [])
  const jump = (i: number) => {
    setActive(i)
    const el = listRef.current?.querySelectorAll('.proj-item')[i]
    if (el) (window as any).__lenis?.scrollTo(el, { offset: -120 }) ?? (el as HTMLElement).scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <main>
      <Seo title="About the investor" desc="Northfield Property Group — developer of Lumen Grove." />
      <section className="page-hero" style={{ minHeight: '88vh' }}>
        <div className="bg" style={{ backgroundImage: `url(${asset('assets/building-exterior.jpg')})` }} role="img" aria-label="Northfield development" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(13,38,30,.86),rgba(13,38,30,.25) 60%)' }} />
        <div className="inner"><div className="wrap">
          <p className="eyebrow light">About the investor</p>
          <SplitReveal text={"Northfield\nProperty Group"} as="h1" className="h-xl" />
          <FadeUp><p className="lead light mt-s">For twenty-five years Northfield has built districts where architecture and landscape are designed as one organism — more than 40 completed projects and 1.2 million m² handed over across three countries.</p></FadeUp>
          <FadeUp className="mt-m"><Magnetic><L to="/contact" className="btn gold">Contact us<span className="arr">→</span></L></Magnetic></FadeUp>
        </div></div>
      </section>

      <section className="section"><div className="wrap"><div className="grid-2">
        <div>
          <p className="eyebrow">Our mission</p>
          <SplitReveal text={"“We don't build\non land. We build\nwith it.”"} className="h-lg" />
          <FadeUp><p className="lead mt-m">Every Northfield project starts with the trees already on site and ends with more canopy than it began with. We measure success in decades: in shade grown, in streets loved, in buildings that belong.</p></FadeUp>
        </div>
        <div style={{ position: 'relative', minHeight: 520 }}>
          <ParallaxImage src={asset('assets/residence-interior.jpg')} alt="Interior by Northfield" style={{ height: 420, width: '82%', borderRadius: 6 }} />
          <ParallaxImage src={asset('assets/amenities-rooftop.jpg')} alt="Rooftop garden" speed={16} style={{ height: 270, width: '56%', borderRadius: 6, position: 'absolute', right: 0, bottom: 0, border: '6px solid var(--off)' }} />
        </div>
      </div></div></section>

      <section className="section" style={{ background: 'var(--off-2)' }}><div className="wrap">
        <p className="eyebrow">Selected projects</p>
        <SplitReveal text="A grove of work" className="h-xl" />
        <div className="chips mt-m" role="group" aria-label="Projects">
          {projects.map((p, i) => <button key={p.title} className={`chip ${active === i ? 'on' : ''}`} onClick={() => jump(i)}>0{i + 1} · {p.title}</button>)}
        </div>
        <div className="proj-layout mt-l">
          <div ref={listRef}>
            {projects.map((p, i) => (
              <article key={p.title} className={`proj-item ${active === i ? 'on' : ''}`}>
                <p className="eyebrow">0{i + 1} / 06 — {p.city}</p>
                <h3 className="h-lg" style={{ marginBlock: '14px 16px' }}>{p.title}</h3>
                <p className="lead">{p.desc}</p>
              </article>
            ))}
          </div>
          <div>
            <div className="proj-sticky" aria-hidden>
              {projects.map((p, i) => <img key={p.title} src={p.img} alt="" loading="lazy" className={active === i ? 'on' : ''} />)}
            </div>
          </div>
        </div>
      </div></section>

      <section className="section"><div className="wrap"><div className="grid-2">
        <ParallaxImage src={asset('assets/business-office.jpg')} alt="Northfield studio desk" style={{ height: 'clamp(320px,50vh,520px)', borderRadius: 6 }} />
        <div>
          <p className="eyebrow">What we stand for</p>
          <SplitReveal text={"Patient capital,\npermanent places"} className="h-lg" />
          <FadeUp><p className="lead mt-m">We develop slowly on purpose: one district at a time, planted before it is sold, managed long after it is handed over. Lumen Grove is our most ambitious canopy yet — and we intend to watch it grow old beautifully.</p></FadeUp>
          <FadeUp className="mt-m"><L to="/contact?tab=business" className="btn solid">Work with us<span className="arr">→</span></L></FadeUp>
        </div>
      </div></div></section>
      <Footer />
    </main>
  )
}
