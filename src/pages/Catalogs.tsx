import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { Seo, L, Footer, useLang } from '../App'
import { SplitReveal, FadeUp, DualRange, PlanSVG, ParallaxImage } from '../anim'
import { residences, retailUnits, roomLabel, type Residence, type RetailUnit } from '../data'
import { useUI, reduced } from '../store'

gsap.registerPlugin(Flip)
const PAGE = 12

function Hero({ img, title, intro, eyebrow }: any) {
  return (
    <section className="page-hero">
      <div className="bg" style={{ backgroundImage: `url(${img})` }} role="img" aria-label={title} />
      <div className="-shade" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(13,38,30,.85),rgba(13,38,30,.22) 62%)' }} />
      <div className="inner"><div className="wrap">
        <p className="eyebrow light">{eyebrow}</p>
        <SplitReveal text={title} as="h1" className="h-display" />
        <FadeUp><p className="lead light mt-s">{intro}</p></FadeUp>
      </div></div>
    </section>
  )
}

function useGridAnim(listRef: React.RefObject<HTMLDivElement>, deps: any[]) {
  const first = useRef(true)
  // FLIP state captured before render change is approximated: animate items in with stagger + Flip from previous positions when possible
  useEffect(() => {
    const el = listRef.current; if (!el || reduced) return
    const cards = el.querySelectorAll('.unit-card')
    gsap.fromTo(cards, { opacity: 0, y: 34, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.045, ease: 'power3.out', overwrite: 'auto' })
    first.current = false
  }, deps)
}

/* ================= RESIDENCES ================= */
export function Residences() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [rooms, setRooms] = useState<string>(params.get('rooms') || 'All')
  const [area, setArea] = useState<[number, number]>([28, 162])
  const [floor, setFloor] = useState<[number, number]>([1, 16])
  const [feats, setFeats] = useState({ Garden: false, Balcony: false, A: false, B: false })
  const [shown, setShown] = useState(PAGE)
  const grid = useRef<HTMLDivElement>(null)
  const lang = useLang()

  const filtered = useMemo(() => residences.filter((u) =>
    (rooms === 'All' || u.rooms === parseFloat(rooms)) &&
    u.area >= area[0] && u.area <= area[1] && u.floor >= floor[0] && u.floor <= floor[1] &&
    (!feats.Garden || u.garden) && (!feats.Balcony || u.balcony) &&
    ((!feats.A && !feats.B) || (feats.A && u.wing === 'A') || (feats.B && u.wing === 'B'))
  ), [rooms, area, floor, feats])

  useEffect(() => {
    const p: Record<string, string> = {}
    if (rooms !== 'All') p.rooms = rooms
    p.floor = `${floor[0]}-${floor[1]}`
    setParams(p, { replace: true }); setShown(PAGE)
  }, [rooms, floor])
  useGridAnim(grid, [filtered.map((u) => u.id).join(','), shown])

  const reset = () => { setRooms('All'); setArea([28, 162]); setFloor([1, 16]); setFeats({ Garden: false, Balcony: false, A: false, B: false }) }
  return (
    <main>
      <Seo title="Residences" desc="Browse 208 residences at Lumen Grove — filter by rooms, area, floor and features." />
      <Hero img="/assets/residence-interior.jpg" title="Residences" eyebrow="Live in the canopy" intro="208 homes across two planted wings — from garden residences at the roots to penthouses in the crown." />
      <div className="filterbar"><div className="wrap">
        <div className="chips" role="group" aria-label="Room type">
          {['All', '1', '1.5', '2', '2.5', '3', '4'].map((r) => (
            <button key={r} className={`chip ${rooms === r ? 'on' : ''}`} onClick={() => setRooms(r)}>{r === 'All' ? 'All' : `${r} BR`}</button>
          ))}
        </div>
        <div className="filter-grid">
          <DualRange label={`${t('common.area')} (m²)`} min={28} max={162} value={area} onChange={(v) => { setArea(v); setShown(PAGE) }} unit=" m²" />
          <DualRange label={t('common.floor')} min={1} max={16} value={floor} onChange={setFloor} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 10 }}>Features</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(Object.keys(feats) as (keyof typeof feats)[]).map((k) => (
                <button key={k} className={`chip ${feats[k] ? 'on' : ''}`} aria-pressed={feats[k]} onClick={() => { setFeats({ ...feats, [k]: !feats[k] }); setShown(PAGE) }}>
                  {k === 'A' ? 'Wing A' : k === 'B' ? 'Wing B' : k}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'space-between' }}>
            <strong style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--forest)' }}>{filtered.length} {t('common.results')}</strong>
            <button className="link-u" onClick={reset}>{t('common.reset')}</button>
          </div>
        </div>
      </div></div>
      <section><div className="wrap">
        <div className="unit-grid" ref={grid}>
          {filtered.slice(0, shown).map((u) => (
            <article className="unit-card" key={u.id}>
              <Link to={`/${lang}/residences/${u.id}`} data-cursor="Explore" aria-label={`Residence ${u.code}`}>
                <div className="unit-plan"><PlanSVG planSeed={u.planSeed} rooms={u.rooms} /></div>
                <div className="unit-meta">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="code">{u.code}</span>
                    <span className={`badge ${u.status === 'Reserved' ? 'res' : ''}`}>{u.status === 'Reserved' ? t('common.reserved') : t('common.available')}</span>
                  </div>
                  <div className="unit-specs"><span>{u.area} m²</span><span>{roomLabel(u.rooms)}</span><span>{t('common.floor')} {u.floor}</span>{u.garden && <span>🌿 Garden</span>}{u.balcony && <span>Balcony</span>}</div>
                  <span className="link-u">{t('common.seeMore')} →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <p className="lead center" style={{ padding: '40px 0' }}>No residences match these filters — try widening the canopy.</p>}
        {shown < filtered.length && (
          <div className="center" style={{ padding: '44px 0 80px' }}>
            <button className="btn solid" onClick={() => setShown(shown + PAGE)}>{t('common.loadMore')} ({filtered.length - shown})<span className="arr">↓</span></button>
          </div>
        )}
      </div></section>
      <Footer />
    </main>
  )
}

function Elevation({ unit, maxFloor }: { unit: { floor: number; wing: string }; maxFloor: number }) {
  const rows = []
  for (let f = maxFloor; f >= (maxFloor === 16 ? 1 : 0); f--) {
    const on = f === unit.floor
    rows.push(
      <g key={f}>
        <rect x={10} y={10 + (maxFloor - f) * 17} width={130} height={14} rx={2} fill={on ? '#b99256' : '#e4ecdf'} stroke="#14352a" strokeWidth={0.7} />
        <text x={150} y={21 + (maxFloor - f) * 17} fontSize={9} fill="#14352a" fontFamily="Manrope">{f === 0 ? 'G' : f}{on ? ` · Wing ${unit.wing}` : ''}</text>
      </g>
    )
  }
  return <svg viewBox={`0 0 230 ${30 + (maxFloor + 1) * 17}`} width="100%" style={{ maxWidth: 240 }} role="img" aria-label="Unit position in building">{rows}</svg>
}

function downloadPlan(code: string) {
  const blob = new Blob([`LUMEN Grove — Floor plan ${code}\nPlaceholder PDF content for the client mockup.`], { type: 'text/plain' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `plan-${code.replace(/\s/g, '')}.txt`; a.click(); URL.revokeObjectURL(a.href)
}

export function ResidenceDetail() {
  const { unitId } = useParams(); const { t } = useTranslation(); const lang = useLang()
  const setPrefill = useUI((s) => s.setPrefillUnit)
  const idx = residences.findIndex((u) => u.id === unitId)
  const u: Residence | undefined = residences[idx]
  if (!u) return <DetailMissing back="/residences" />
  const prev = residences[(idx - 1 + residences.length) % residences.length]
  const next = residences[(idx + 1) % residences.length]
  return (
    <main>
      <Seo title={`Residence ${u.code}`} desc={`${u.area} m², ${roomLabel(u.rooms)}, floor ${u.floor}, Wing ${u.wing} at Lumen Grove.`} />
      <section className="section" style={{ paddingTop: 140 }}><div className="wrap">
        <L to="/residences" className="link-u">← {t('common.back')}</L>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 16, marginTop: 26 }}>
          <div><p className="eyebrow">Residence · Wing {u.wing}</p><h1 className="h-display">{u.code}</h1></div>
          <span className={`badge ${u.status === 'Reserved' ? 'res' : ''}`} style={{ fontSize: 12 }}>{u.status}</span>
        </div>
        <div className="grid-2 mt-l" style={{ alignItems: 'start' }}>
          <div>
            <div className="unit-plan" style={{ borderRadius: 8, border: '1px solid var(--line)' }}><PlanSVG planSeed={u.planSeed} rooms={u.rooms} large /></div>
            <div className="gallery mt-m">
              <ParallaxImage src="/assets/residence-interior.jpg" alt="Living space" className="g-main" />
              <div className="g-side">
                <ParallaxImage src="/assets/amenities-rooftop.jpg" alt="Terrace view" />
                <ParallaxImage src="/assets/building-exterior.jpg" alt="Facade" />
              </div>
            </div>
          </div>
          <div>
            <table className="spec-table"><tbody>
              <tr><td>{t('common.area')}</td><td>{u.area} m²</td></tr>
              <tr><td>{t('common.rooms')}</td><td>{roomLabel(u.rooms)}</td></tr>
              <tr><td>{t('common.floor')}</td><td>{u.floor} / 16</td></tr>
              <tr><td>Wing</td><td>{u.wing}</td></tr>
              <tr><td>Orientation</td><td>{u.orientation}</td></tr>
              <tr><td>Balcony</td><td>{u.balcony ? 'Yes' : '—'}</td></tr>
              <tr><td>Garden</td><td>{u.garden ? 'Private garden' : '—'}</td></tr>
            </tbody></table>
            <h3 className="h-md mt-m" style={{ marginBottom: 12 }}>Position in the canopy</h3>
            <Elevation unit={u} maxFloor={16} />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <Link to={`/${lang}/contact?unit=${encodeURIComponent(u.code)}`} className="btn solid" onClick={() => setPrefill(u.code)}>{t('common.inquireUnit')}<span className="arr">→</span></Link>
              <button className="btn" onClick={() => downloadPlan(u.code)}>{t('common.downloadPlan')} ↓</button>
            </div>
            <nav style={{ display: 'flex', justifyContent: 'space-between', marginTop: 44, borderTop: '1px solid var(--line)', paddingTop: 22 }} aria-label="Unit navigation">
              <Link to={`/${lang}/residences/${prev.id}`} className="link-u">← {prev.code}</Link>
              <Link to={`/${lang}/residences/${next.id}`} className="link-u">{next.code} →</Link>
            </nav>
          </div>
        </div>
      </div></section>
      <Footer />
    </main>
  )
}

/* ================= RETAIL ================= */
export function Retail() {
  const { t } = useTranslation(); const lang = useLang()
  const [type, setType] = useState('All')
  const [area, setArea] = useState<[number, number]>([71, 959])
  const [floor, setFloor] = useState<[number, number]>([0, 12])
  const [wings, setWings] = useState({ A: false, B: false, V: false })
  const [shown, setShown] = useState(PAGE)
  const grid = useRef<HTMLDivElement>(null)
  const filtered = useMemo(() => retailUnits.filter((u) =>
    (type === 'All' || u.type === type || (type === 'Offices' && u.type === 'Office')) &&
    u.area >= area[0] && u.area <= area[1] && u.floor >= floor[0] && u.floor <= floor[1] &&
    ((!wings.A && !wings.B && !wings.V) || wings[u.wing])
  ), [type, area, floor, wings])
  useGridAnim(grid, [filtered.map((u) => u.id).join(','), shown])
  const reset = () => { setType('All'); setArea([71, 959]); setFloor([0, 12]); setWings({ A: false, B: false, V: false }) }
  return (
    <main>
      <Seo title="Retail Spaces" desc="Offices and retail units at Lumen Grove — 49 spaces from 71 to 959 m²." />
      <Hero img="/assets/business-office.jpg" title="Retail Spaces" eyebrow="Offices & retail" intro="49 workplaces and storefronts beneath the canopy, from intimate studios to full-floor headquarters." />
      <div className="filterbar"><div className="wrap">
        <div className="chips" role="group" aria-label="Space type">
          {['All', 'Offices', 'Retail'].map((r) => <button key={r} className={`chip ${type === r ? 'on' : ''}`} onClick={() => { setType(r); setShown(PAGE) }}>{r}</button>)}
        </div>
        <div className="filter-grid">
          <DualRange label={`${t('common.area')} (m²)`} min={71} max={959} value={area} onChange={(v) => { setArea(v); setShown(PAGE) }} unit=" m²" />
          <DualRange label={t('common.floor')} min={0} max={12} value={floor} onChange={(v) => { setFloor(v); setShown(PAGE) }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 10 }}>Wing</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {(Object.keys(wings) as (keyof typeof wings)[]).map((k) => (
                <button key={k} className={`chip ${wings[k] ? 'on' : ''}`} aria-pressed={wings[k]} onClick={() => { setWings({ ...wings, [k]: !wings[k] }); setShown(PAGE) }}>Wing {k}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'space-between' }}>
            <strong style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--forest)' }}>{filtered.length} {t('common.results')}</strong>
            <button className="link-u" onClick={reset}>{t('common.reset')}</button>
          </div>
        </div>
      </div></div>
      <section><div className="wrap">
        <div className="unit-grid" ref={grid}>
          {filtered.slice(0, shown).map((u) => (
            <article className="unit-card" key={u.id}>
              <Link to={`/${lang}/retail-spaces/${u.id}`} data-cursor="Explore" aria-label={`Space ${u.code}`}>
                <div className="unit-plan"><PlanSVG planSeed={u.planSeed} rooms={u.type === 'Retail' ? 1 : 3} /></div>
                <div className="unit-meta">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="code">{u.code}</span><span className="badge">{u.type}</span>
                  </div>
                  <div className="unit-specs"><span>{u.area} m²</span><span>{u.floorLabel}</span><span>Wing {u.wing}</span></div>
                  <span className="link-u">{t('common.seeMore')} →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <p className="lead center" style={{ padding: '40px 0' }}>No spaces match these filters.</p>}
        {shown < filtered.length && <div className="center" style={{ padding: '44px 0 80px' }}><button className="btn solid" onClick={() => setShown(shown + PAGE)}>Load more spaces ({filtered.length - shown})<span className="arr">↓</span></button></div>}
      </div></section>
      <Footer />
    </main>
  )
}

export function RetailDetail() {
  const { unitId } = useParams(); const { t } = useTranslation(); const lang = useLang()
  const idx = retailUnits.findIndex((u) => u.id === unitId)
  const u: RetailUnit | undefined = retailUnits[idx]
  if (!u) return <DetailMissing back="/retail-spaces" />
  const prev = retailUnits[(idx - 1 + retailUnits.length) % retailUnits.length]
  const next = retailUnits[(idx + 1) % retailUnits.length]
  return (
    <main>
      <Seo title={`Space ${u.code}`} desc={`${u.type} space, ${u.area} m², ${u.floorLabel}, Wing ${u.wing}.`} />
      <section className="section" style={{ paddingTop: 140 }}><div className="wrap">
        <L to="/retail-spaces" className="link-u">← {t('common.back')}</L>
        <p className="eyebrow mt-m">{u.type} · Wing {u.wing}</p>
        <h1 className="h-display">{u.code}</h1>
        <div className="grid-2 mt-l" style={{ alignItems: 'start' }}>
          <div>
            <div className="unit-plan" style={{ borderRadius: 8, border: '1px solid var(--line)' }}><PlanSVG planSeed={u.planSeed} rooms={u.type === 'Retail' ? 1 : 3} large /></div>
            <ParallaxImage src="/assets/business-office.jpg" alt="Office interior" className="mt-m" style={{ height: 320, borderRadius: 8 }} />
          </div>
          <div>
            <table className="spec-table"><tbody>
              <tr><td>Type</td><td>{u.type}</td></tr>
              <tr><td>{t('common.area')}</td><td>{u.area} m²</td></tr>
              <tr><td>{t('common.floor')}</td><td>{u.floorLabel}</td></tr>
              <tr><td>Wing</td><td>{u.wing}</td></tr>
              <tr><td>Status</td><td>{u.status}</td></tr>
              <tr><td>Fit-out</td><td>Shell & core, Cat A on request</td></tr>
            </tbody></table>
            <h3 className="h-md mt-m" style={{ marginBottom: 12 }}>Position</h3>
            <Elevation unit={u} maxFloor={12} />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <Link to={`/${lang}/contact?tab=business&unit=${encodeURIComponent(u.code)}`} className="btn solid">{t('common.inquireUnit')}<span className="arr">→</span></Link>
              <button className="btn" onClick={() => downloadPlan(u.code)}>{t('common.downloadPlan')} ↓</button>
            </div>
            <nav style={{ display: 'flex', justifyContent: 'space-between', marginTop: 44, borderTop: '1px solid var(--line)', paddingTop: 22 }}>
              <Link to={`/${lang}/retail-spaces/${prev.id}`} className="link-u">← {prev.code}</Link>
              <Link to={`/${lang}/retail-spaces/${next.id}`} className="link-u">{next.code} →</Link>
            </nav>
          </div>
        </div>
      </div></section>
      <Footer />
    </main>
  )
}

function DetailMissing({ back }: { back: string }) {
  return <main><div className="notfound"><div><h1 className="h-xl">Unit not found</h1><L to={back} className="btn mt-m">Back to catalog</L></div></div><Footer /></main>
}
