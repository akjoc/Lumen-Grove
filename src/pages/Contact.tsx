import { asset } from '../asset'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import gsap from 'gsap'
import { Seo, L, Footer } from '../App'
import { SplitReveal, FadeUp } from '../anim'
import { PHONE, useUI } from '../store'

const base = {
  privacy: z.literal(true, { errorMap: () => ({ message: 'Please accept the privacy policy' }) }),
  marketing: z.boolean().optional(), messenger: z.boolean().optional(),
}
const schemas = {
  callback: z.object({ first: z.string().min(1, 'Required'), last: z.string().min(1, 'Required'), phone: z.string().min(6, 'Enter a valid phone'), time: z.string().min(1, 'Choose a time'), unit: z.string().optional(), ...base }),
  business: z.object({ name: z.string().min(2, 'Required'), company: z.string().min(1, 'Required'), email: z.string().email('Enter a valid email'), phone: z.string().min(6, 'Enter a valid phone'), unit: z.string().optional(), ...base }),
  general: z.object({ last: z.string().min(1, 'Required'), email: z.string().email('Enter a valid email'), phone: z.string().min(6, 'Enter a valid phone'), message: z.string().optional(), unit: z.string().optional(), ...base }),
}
type Tab = keyof typeof schemas
const TABS: { id: Tab; label: string; submit: string }[] = [
  { id: 'callback', label: 'Callback', submit: 'Submit for a callback' },
  { id: 'business', label: 'Business inquiry', submit: 'Submit a request' },
  { id: 'general', label: 'General inquiry', submit: 'Submit a request' },
]

function Checks({ register, errors }: any) {
  return (
    <>
      <label className="check"><input type="checkbox" {...register('privacy')} /><span>I agree to the processing of my personal data as described in the <L to="/privacy-policy" style={{ textDecoration: 'underline' }}>privacy policy</L>. *</span></label>
      {errors.privacy && <p className="err">{String(errors.privacy.message)}</p>}
      <label className="check"><input type="checkbox" {...register('marketing')} /><span>I would like to receive news and offers from Lumen Grove.</span></label>
      <label className="check"><input type="checkbox" {...register('messenger')} /><span>Contact me via WhatsApp / Viber where possible.</span></label>
    </>
  )
}
function F({ label, id, error, children }: any) {
  return <div className="field"><label htmlFor={id}>{label}</label>{children}{error && <span className="err">{error}</span>}</div>
}

function InquiryForm({ tab, unit }: { tab: Tab; unit: string }) {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>({ resolver: zodResolver(schemas[tab] as any), defaultValues: { unit } })
  const ref = useRef<HTMLFormElement>(null)
  useEffect(() => { if (ref.current) gsap.fromTo(ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }) }, [tab])
  const onSubmit = async (data: any) => {
    // Mock POST /api/inquiry — replace with the client's CRM endpoint
    await new Promise((r) => setTimeout(r, 800)); console.info('POST /api/inquiry', { tab, ...data }); setSent(true)
  }
  if (sent) return <div className="form-ok"><h3 className="h-md">Request received 🌿</h3><p className="mt-s">Thank you — our team will reply within one business day. Prefer to talk now? <a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a></p></div>
  const e = errors as any
  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)} noValidate>
      {unit && <div className="field"><label>Regarding unit</label><input {...register('unit')} readOnly /></div>}
      {tab === 'callback' && (<>
        <F label="First name *" id="cb-f" error={e.first?.message}><input id="cb-f" {...register('first')} autoComplete="given-name" /></F>
        <F label="Last name *" id="cb-l" error={e.last?.message}><input id="cb-l" {...register('last')} autoComplete="family-name" /></F>
        <F label="Phone *" id="cb-p" error={e.phone?.message}><input id="cb-p" type="tel" {...register('phone')} autoComplete="tel" /></F>
        <F label="Preferred call time *" id="cb-t" error={e.time?.message}>
          <select id="cb-t" {...register('time')} defaultValue=""><option value="" disabled>Choose…</option><option>Morning (9–12)</option><option>Afternoon (12–17)</option><option>Evening (17–20)</option></select>
        </F>
      </>)}
      {tab === 'business' && (<>
        <F label="Full name *" id="bz-n" error={e.name?.message}><input id="bz-n" {...register('name')} autoComplete="name" /></F>
        <F label="Company name *" id="bz-c" error={e.company?.message}><input id="bz-c" {...register('company')} autoComplete="organization" /></F>
        <F label="Email *" id="bz-e" error={e.email?.message}><input id="bz-e" type="email" {...register('email')} autoComplete="email" /></F>
        <F label="Phone *" id="bz-p" error={e.phone?.message}><input id="bz-p" type="tel" {...register('phone')} autoComplete="tel" /></F>
      </>)}
      {tab === 'general' && (<>
        <F label="Last name *" id="gn-l" error={e.last?.message}><input id="gn-l" {...register('last')} autoComplete="family-name" /></F>
        <F label="Email *" id="gn-e" error={e.email?.message}><input id="gn-e" type="email" {...register('email')} autoComplete="email" /></F>
        <F label="Phone *" id="gn-p" error={e.phone?.message}><input id="gn-p" type="tel" {...register('phone')} autoComplete="tel" /></F>
        <div className="field"><label htmlFor="gn-m">Message</label><textarea id="gn-m" rows={4} {...register('message')} style={{ border: '1px solid var(--line)', borderRadius: 4, padding: 14, background: 'transparent' }} /></div>
      </>)}
      <Checks register={register} errors={e} />
      <button className="btn solid" type="submit" disabled={isSubmitting} style={{ marginTop: 10 }}>{isSubmitting ? 'Sending…' : TABS.find((t) => t.id === tab)!.submit}<span className="arr">→</span></button>
    </form>
  )
}

export function Contact() {
  const [params, setParams] = useSearchParams()
  const prefill = useUI((s) => s.prefillUnit)
  const initial = (params.get('tab') === 'business' ? 'business' : params.get('tab') === 'general' ? 'general' : 'callback') as Tab
  const [tab, setTab] = useState<Tab>(initial)
  const unit = params.get('unit') || prefill
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [ink, setInk] = useState({ left: 0, width: 0 })
  const moveInk = () => {
    const i = TABS.findIndex((t) => t.id === tab); const el = tabRefs.current[i]
    if (el) setInk({ left: el.offsetLeft, width: el.offsetWidth })
  }
  useLayoutEffect(moveInk, [tab])
  useEffect(() => { window.addEventListener('resize', moveInk); return () => window.removeEventListener('resize', moveInk) }, [tab])
  const choose = (t: Tab) => { setTab(t); const p = new URLSearchParams(params); p.set('tab', t); setParams(p, { replace: true }) }

  return (
    <main>
      <Seo title="Contact" desc="Submit a request — callback, business or general inquiry at Lumen Grove." />
      <section className="page-hero" style={{ minHeight: '52vh' }}>
        <div className="bg" style={{ backgroundImage: `url(${asset('assets/location-street.jpg')})` }} role="img" aria-label="Lumen Grove street" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(13,38,30,.85),rgba(13,38,30,.25) 62%)' }} />
        <div className="inner"><div className="wrap">
          <p className="eyebrow light">Contact</p>
          <SplitReveal text="Submit a request" as="h1" className="h-xl" />
          <FadeUp><p className="lead light mt-s">Tell us what you're growing toward — a home, a headquarters, or simply a question. Or call us at <a href={`tel:${PHONE.replace(/\s/g, '')}`} style={{ textDecoration: 'underline' }}>{PHONE}</a>.</p></FadeUp>
        </div></div>
      </section>
      <section className="section"><div className="wrap"><div style={{ maxWidth: 760 }}>
        <div className="tabs" role="tablist" aria-label="Inquiry type">
          {TABS.map((t, i) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} ref={(el) => (tabRefs.current[i] = el)} className={tab === t.id ? 'on' : ''} onClick={() => choose(t.id)}>{t.label}</button>
          ))}
          <span className="tab-ink" style={ink} />
        </div>
        <InquiryForm key={tab} tab={tab} unit={unit} />
      </div></div></section>
      <Footer />
    </main>
  )
}

const SECTIONS = [
  ['controller', '1. Who we are', 'Northfield Property Group ("we", "the Developer") is the data controller for personal data collected through the Lumen Grove website, a presentation mockup for a premium residential and business complex in Your City, Your District.'],
  ['data', '2. Data we collect', 'We collect the data you submit through inquiry and newsletter forms (name, email, phone number, company, preferred contact time and consent choices), together with privacy-respecting, aggregated usage analytics. We do not collect payment data through this website.'],
  ['purpose', '3. Why we process it', 'To respond to callbacks and inquiries, to send the newsletter where you have opted in, to arrange viewings, and to improve the website. Marketing messages are only sent with your explicit consent, which you may withdraw at any time.'],
  ['legal', '4. Legal basis', 'Processing is based on your consent and on steps taken at your request prior to entering into a contract. Where consent is the basis, withdrawal does not affect the lawfulness of prior processing.'],
  ['retention', '5. Retention & sharing', 'Inquiry data is retained for up to 24 months after last contact, then deleted or anonymized. Data is shared only with service providers acting on our instructions (hosting, CRM) and never sold.'],
  ['rights', '6. Your rights', 'You may request access, rectification, erasure, restriction or portability of your data, and object to processing. Contact us via the contact page or by phone; you also have the right to complain to your supervisory authority.'],
  ['cookies', '7. Cookies', 'This mockup stores a single session flag to remember that the intro has played, and your language preference in the page URL. No third-party advertising cookies are set.'],
] as const

export function Privacy() {
  return (
    <main>
      <Seo title="Privacy Policy" desc="How Lumen Grove and Northfield Property Group process personal data." />
      <section className="section" style={{ paddingTop: 150 }}><div className="wrap">
        <p className="eyebrow">Legal</p>
        <h1 className="h-xl">Privacy policy</h1>
        <div className="grid-2 mt-l" style={{ gridTemplateColumns: '260px 1fr', alignItems: 'start' }}>
          <aside className="toc" aria-label="Table of contents">
            {SECTIONS.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}
          </aside>
          <div className="prose-legal">
            {SECTIONS.map(([id, title, body]) => (
              <div key={id} id={id}><h2>{title}</h2><p>{body}</p><p>This placeholder text must be replaced with counsel-approved wording before public launch, reflecting the client's jurisdiction, processors and cookie inventory.</p></div>
            ))}
          </div>
        </div>
      </div></section>
      <Footer />
    </main>
  )
}
