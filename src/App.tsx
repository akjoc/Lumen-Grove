import { asset } from './asset'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Routes, Route, Navigate, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useUI, BRAND, PHONE, reduced } from './store'
import i18n, { LANGS } from './i18n'
import { SplitReveal, FadeUp, Magnetic } from './anim'

gsap.registerPlugin(ScrollTrigger)

const Home = React.lazy(() => import('./pages/Home'))
const ThreeD = React.lazy(() => import('./pages/ThreeD'))
const ResidencesP = React.lazy(() => import('./pages/Catalogs').then((m) => ({ default: m.Residences })))
const ResidenceDetailP = React.lazy(() => import('./pages/Catalogs').then((m) => ({ default: m.ResidenceDetail })))
const RetailP = React.lazy(() => import('./pages/Catalogs').then((m) => ({ default: m.Retail })))
const RetailDetailP = React.lazy(() => import('./pages/Catalogs').then((m) => ({ default: m.RetailDetail })))
const Business = React.lazy(() => import('./pages/Business'))
const ContactP = React.lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))
const PrivacyP = React.lazy(() => import('./pages/Contact').then((m) => ({ default: m.Privacy })))
const About = React.lazy(() => import('./pages/About'))
const Admin = React.lazy(() => import('./pages/Admin'))

export const PRELOAD = [asset('assets/hero-leaves.jpg'), asset('assets/building-exterior.jpg'), asset('assets/residence-interior.jpg'), asset('assets/business-office.jpg'), asset('assets/panorama-aerial.jpg'), asset('assets/amenities-rooftop.jpg'), asset('assets/location-street.jpg')]

export function Seo({ title, desc }: { title: string; desc?: string }) {
  return (
    <Helmet>
      <title>{title} — {BRAND}</title>
      {desc && <meta name="description" content={desc} />}
      <meta property="og:title" content={`${title} — ${BRAND}`} />
      <meta property="og:image" content={asset('assets/building-exterior.jpg')} />
    </Helmet>
  )
}

/* ---------------- Preloader ---------------- */
function Preloader() {
  const loc = useLocation()
  const { loaded, setLoaded } = useUI()
  const [pct, setPct] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isAdmin = loc.pathname.includes('/admin')

  useEffect(() => {
    if (isAdmin) { setLoaded(true); return }
    if (sessionStorage.getItem('lg-loaded')) { setLoaded(true); return }
    let done = 0
    const start = performance.now()
    const tick = () => {
      done++
      const real = Math.round((done / PRELOAD.length) * 100)
      const elapsed = Math.min((performance.now() - start) / 1800, 1)
      setPct(Math.min(real, Math.round(elapsed * 100) || real))
      if (done >= PRELOAD.length) finish()
    }
    const finish = () => {
      const wait = Math.max(0, 1800 - (performance.now() - start))
      setTimeout(() => {
        setPct(100)
        sessionStorage.setItem('lg-loaded', '1')
        if (ref.current) {
          gsap.to(ref.current, {
            yPercent: -100, duration: reduced ? 0 : 1.05, ease: 'expo.inOut', delay: 0.25,
            onComplete: () => { setLoaded(true); ScrollTrigger.refresh() },
          })
        } else setLoaded(true)
      }, wait)
    }
    PRELOAD.forEach((src) => { const im = new Image(); im.onload = tick; im.onerror = tick; im.src = src })
    const iv = setInterval(() => setPct((p) => (p >= 100 ? 100 : Math.min(p + 1, 92))), 40); setTimeout(() => clearInterval(iv), 6000)
    return () => clearInterval(iv)
    // eslint-disable-next-line
  }, [isAdmin])

  if (loaded || isAdmin) return null
  return (
    <div className="preloader" ref={ref} role="status" aria-label="Loading">
      <div className="pl-brand">{BRAND}</div>
      <div className="pl-tag">A living canopy in the city</div>
      <div className="pl-pct">{pct}%</div>
      <div className="pl-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ---------------- Cursor ---------------- */
function Cursor() {
  const loc = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const { cursorLabel, setCursor } = useUI()
  const isAdmin = loc.pathname.includes('/admin')

  useEffect(() => {
    if (isAdmin) return
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return
    const el = ref.current
    if (!el) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    const move = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY) }
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('[data-cursor],a,button')
      if (t) { el.classList.add('big'); setCursor(t.getAttribute('data-cursor') || '') }
      else { el.classList.remove('big'); setCursor('') }
    }
    window.addEventListener('mousemove', move); window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [isAdmin])

  if (isAdmin) return null
  return <div className="cursor" ref={ref}>{cursorLabel}</div>
}

/* ---------------- Header + Menu ---------------- */
export function useLang() {
  const loc = useLocation()
  const seg = loc.pathname.split('/')[1] || 'en'
  return (LANGS as readonly string[]).includes(seg) ? seg : 'en'
}
export function L({ to, children, ...p }: any) {
  const lang = useLang()
  const href = to.startsWith('#') ? `/${lang}${to}` : `/${lang}${to === '/' ? '' : to}`
  return <Link to={href} {...p}>{children}</Link>
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const { t } = useTranslation()
  const items: [string, string][] = [
    [t('nav.home'), '/'], [t('nav.three'), '/3d'], [t('nav.residences'), '/residences'],
    [t('nav.business'), '/business'], [t('nav.retail'), '/retail-spaces'], [t('nav.location'), '/#Around'],
    [t('nav.amenities'), '/#Amenities'], [t('nav.contact'), '/contact'], [t('nav.about'), '/about-the-investor'],
    ['Admin Studio', '/admin'],
  ]
  return (
    <nav className="menu-links" aria-label="Main">
      {items.map(([label, to], i) => (
        <span className="menu-link-mask" key={to}>
          <span className="menu-link-inner">
            <L to={to} onClick={onClick}><span className="idx">0{i + 1}</span>{label}</L>
          </span>
        </span>
      ))}
    </nav>
  )
}

function LangSwitch() {
  const loc = useLocation(); const nav = useNavigate(); const lang = useLang()
  const swap = (l: string) => {
    i18n.changeLanguage(l)
    nav(loc.pathname.replace(/^\/(en|es)/, `/${l}`) + loc.search + loc.hash)
  }
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      <button className={lang === 'en' ? 'active' : ''} onClick={() => swap('en')}>ENG</button>
      <button className={lang === 'es' ? 'active' : ''} onClick={() => swap('es')}>ESP</button>
    </div>
  )
}

function Header() {
  const loc = useLocation()
  const isAdmin = loc.pathname.includes('/admin')
  const { t } = useTranslation()
  const { menuOpen, setMenu } = useUI()
  const ref = useRef<HTMLElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const light = /\/(residences|retail-spaces)\/[^/]+$|privacy-policy/.test(loc.pathname)

  useEffect(() => {
    if (isAdmin) return
    let last = 0
    const onScroll = () => {
      const y = window.scrollY; const el = ref.current; if (!el) return
      el.classList.toggle('scrolled', y > 60)
      el.classList.toggle('hidden', y > 500 && y > last + 4)
      if (y < last - 4) el.classList.remove('hidden')
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isAdmin])

  useEffect(() => { setMenu(false) }, [loc.pathname])
  useEffect(() => {
    if (isAdmin) return
    const el = overlay.current; if (!el) return
    const lenis = (window as any).__lenis as Lenis | undefined
    if (menuOpen) {
      lenis?.stop(); document.body.style.overflow = 'hidden'
      gsap.set(el, { visibility: 'visible' })
      gsap.to(el, { clipPath: 'inset(0 0 0% 0)', duration: reduced ? 0 : 0.85, ease: 'expo.inOut' })
      gsap.fromTo(el.querySelectorAll('.menu-link-inner'), { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.06, delay: 0.3 })
    } else {
      lenis?.start(); document.body.style.overflow = ''
      gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: reduced ? 0 : 0.7, ease: 'expo.inOut', onComplete: () => gsap.set(el, { visibility: 'hidden' }) })
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [menuOpen, isAdmin])

  if (isAdmin) return null

  return (
    <>
      <header className={`header ${light ? 'on-light' : ''}`} ref={ref}>
        <L to="/" className="logo" aria-label={BRAND}>{BRAND}<small>Est. canopy living</small></L>
        <div className="header-actions">
          <Magnetic><L to="/contact" className="pill-btn">{t('nav.inquire')}</L></Magnetic>
          <button className="menu-btn" onClick={() => setMenu(true)} aria-haspopup="dialog" aria-expanded={menuOpen}>
            {t('nav.menu')}<span className="bars"><i /><i /></span>
          </button>
        </div>
      </header>
      <div className="menu-overlay" ref={overlay} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="menu-top">
          <span className="logo">{BRAND}</span>
          <button className="menu-btn" onClick={() => setMenu(false)}>{t('nav.close')} ✕</button>
        </div>
        <NavLinks onClick={() => setMenu(false)} />
        <div className="menu-bottom">
          <LangSwitch />
          <a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
          <div className="socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------------- Footer ---------------- */
const newsSchema = z.object({
  first: z.string().min(1, 'Required'), last: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'), consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
})
function Tree({ side }: { side: 'left' | 'right' }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    if (!ref.current || reduced) return
    const ctx = gsap.context(() => {
      gsap.to(ref.current, { rotation: side === 'left' ? 1.5 : -1.5, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.fromTo(ref.current, { x: side === 'left' ? -46 : 46 }, {
        x: side === 'left' ? 18 : -18, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <svg ref={ref} className={`tree ${side}`} width="240" height="360" viewBox="0 0 240 360" aria-hidden>
      <path d="M118 360 C116 280 112 220 104 170 L132 170 C126 240 126 300 128 360 Z" fill="#2c2118" />
      {[[120, 90, 88], [70, 140, 62], [172, 138, 66], [120, 168, 74], [86, 66, 52], [158, 62, 50]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? '#2c5a47' : '#1d4636'} opacity={0.96} />
      ))}
      {[[90, 80], [150, 100], [120, 140], [70, 150], [180, 120]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={14} fill="#3f7359" />)}
    </svg>
  )
}
export function Footer() {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(newsSchema) })
  const onSubmit = async () => { await new Promise((r) => setTimeout(r, 700)); setSent(true) }
  const cols: [string, string][] = [
    [t('nav.home'), '/'], [t('nav.three'), '/3d'], [t('nav.residences'), '/residences'], [t('nav.business'), '/business'],
    [t('nav.retail'), '/retail-spaces'], [t('nav.contact'), '/contact'], [t('nav.about'), '/about-the-investor'], ['Admin Portal', '/admin'], ['Privacy policy', '/privacy-policy'],
  ]
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="news">
          <div>
            <p className="eyebrow light">Newsletter</p>
            <SplitReveal text={`Join the world\nof ${BRAND}`} className="h-lg" />
            <FadeUp><p className="lead light mt-s">Seasonal notes on construction progress, new releases beneath the canopy, and private previews — a few letters a year, never more.</p></FadeUp>
          </div>
          <div>
            {sent ? <div className="form-ok"><h3 className="h-md">Welcome to the grove.</h3><p className="mt-s">Your subscription is confirmed. First letter arrives with the new season.</p></div> : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="field"><label htmlFor="nl-f">First name *</label><input id="nl-f" {...register('first')} />{errors.first && <span className="err">{String(errors.first.message)}</span>}</div>
                <div className="field"><label htmlFor="nl-l">Last name *</label><input id="nl-l" {...register('last')} />{errors.last && <span className="err">{String(errors.last.message)}</span>}</div>
                <div className="field"><label htmlFor="nl-e">Email *</label><input id="nl-e" type="email" {...register('email')} />{errors.email && <span className="err">{String(errors.email.message)}</span>}</div>
                <label className="check"><input type="checkbox" {...register('consent')} /><span>I agree to the processing of my data as described in the <L to="/privacy-policy" style={{ textDecoration: 'underline' }}>privacy policy</L>. *</span></label>
                {errors.consent && <p className="err">{String(errors.consent.message)}</p>}
                <button className="btn gold" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : "Let's begin"}<span className="arr">→</span></button>
              </form>
            )}
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <span className="logo">{BRAND}</span>
            <p style={{ marginTop: 16, opacity: 0.75, maxWidth: '30ch' }}>A living canopy in the city.<br />Your City, Your District.</p>
            <p style={{ marginTop: 14 }}><a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></p>
          </div>
          <div><h4>Explore</h4>{cols.slice(0, 4).map(([l, to]) => <L key={to} to={to}>{l}</L>)}</div>
          <div><h4>Company</h4>{cols.slice(4).map(([l, to]) => <L key={to} to={to}>{l}</L>)}</div>
          <div><h4>Follow</h4>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
        <p className="legal">This website is a client presentation mockup. All visualizations are artistic impressions; areas, layouts and availability are indicative and subject to change without notice. Developer: Northfield Property Group. © {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
      </div>
      <div className="footer-scene" aria-hidden>
        <img className="front" src={asset('assets/building-exterior.jpg')} alt="" loading="lazy" />
        <Tree side="left" /><Tree side="right" />
      </div>
    </footer>
  )
}

/* ---------------- Page transition + scroll mgmt ---------------- */
function RouteFX({ children }: { children: React.ReactNode }) {
  const loc = useLocation()
  const wipe = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  useEffect(() => {
    const lenis = (window as any).__lenis as Lenis | undefined
    if (loc.hash) {
      const el = document.querySelector(loc.hash)
      if (el) { setTimeout(() => lenis ? lenis.scrollTo(el as HTMLElement, { offset: -70 }) : el.scrollIntoView({ behavior: 'smooth' }), 350); return }
    }
    if (first.current) { first.current = false; return }
    lenis?.scrollTo(0, { immediate: true }); window.scrollTo(0, 0)
    if (wipe.current && !reduced) {
      gsap.timeline()
        .set(wipe.current, { transformOrigin: 'bottom' })
        .fromTo(wipe.current, { scaleY: 1 }, { scaleY: 0, duration: 0.8, ease: 'expo.inOut', transformOrigin: 'top' })
    }
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(t)
  }, [loc.pathname, loc.hash])
  return <><div className="page-wipe" ref={wipe} />{children}</>
}

function LangSync() {
  const { lang } = useParams()
  useEffect(() => { if (lang && i18n.language !== lang) i18n.changeLanguage(lang); document.documentElement.lang = lang || 'en' }, [lang])
  return null
}

function NotFound() {
  return <div className="notfound"><div><p className="eyebrow">404</p><h1 className="h-xl">Lost in the grove</h1><p className="lead mt-s">This path doesn't lead anywhere yet.</p><L to="/" className="btn mt-m">Back home<span className="arr">→</span></L></div></div>
}

export default function App() {
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    ;(window as any).__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])

  return (
    <>
      <Preloader /><Cursor /><Header />
      <RouteFX>
        <LangSync />
        <Suspense fallback={<div className="notfound"><p className="eyebrow">Loading…</p></div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/en" replace />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/:lang/admin" element={<Admin />} />
            <Route path="/:lang/admin/*" element={<Admin />} />
            <Route path="/:lang" element={<Home />} />
            <Route path="/:lang/3d" element={<ThreeD />} />
            <Route path="/:lang/residences" element={<ResidencesP />} />
            <Route path="/:lang/residences/:unitId" element={<ResidenceDetailP />} />
            <Route path="/:lang/business" element={<Business />} />
            <Route path="/:lang/retail-spaces" element={<RetailP />} />
            <Route path="/:lang/retail-spaces/:unitId" element={<RetailDetailP />} />
            <Route path="/:lang/contact" element={<ContactP />} />
            <Route path="/:lang/privacy-policy" element={<PrivacyP />} />
            <Route path="/:lang/about-the-investor" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </RouteFX>
    </>
  )
}
export { LangSwitch }
