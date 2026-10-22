import { asset } from '../asset'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { Seo, useLang } from '../App'
import { residences, retailUnits, roomLabel } from '../data'
import { useUI } from '../store'
import { DualRange } from '../anim'

type VUnit = { id: string; code: string; kind: 'residence' | 'office' | 'retail'; wing: string; floor: number; area: number; rooms?: number; pos: [number, number, number]; href: string }
const WING_POS: Record<string, [number, number]> = { A: [-14, 0], B: [2, -8], V: [16, 2] }

function buildUnits(): VUnit[] {
  const out: VUnit[] = []
  const per: Record<string, number> = {}
  residences.forEach((u) => {
    const key = `${u.wing}${u.floor}`; per[key] = (per[key] || 0) + 1
    const [wx, wz] = WING_POS[u.wing]
    out.push({ id: u.id, code: u.code, kind: 'residence', wing: u.wing, floor: u.floor, area: u.area, rooms: u.rooms, href: `/residences/${u.id}`,
      pos: [wx - 5.5 + per[key] * 1.7, 1.6 + u.floor * 2.1, wz + 3.2] })
  })
  const per2: Record<string, number> = {}
  retailUnits.forEach((u) => {
    const key = `${u.wing}${u.floor}`; per2[key] = (per2[key] || 0) + 1
    const [wx, wz] = WING_POS[u.wing]
    out.push({ id: u.id, code: u.code, kind: u.type === 'Retail' ? 'retail' : 'office', wing: u.wing, floor: u.floor, area: u.area, href: `/retail-spaces/${u.id}`,
      pos: [wx - 4 + per2[key] * 2.2, 1.6 + Math.max(u.floor, 0) * 2.1 + 0.4, wz - 3.2] })
  })
  return out
}
const ALL = buildUnits()

function Wing({ pos, h, label, evening, onPick }: { pos: [number, number, number]; h: number; label: string; evening: boolean; onPick: (l: string) => void }) {
  const [hov, setHov] = useState(false)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(() => { if (mat.current) mat.current.emissiveIntensity = THREE.MathUtils.lerp(mat.current.emissiveIntensity, hov ? 0.35 : 0, 0.12) })
  return (
    <group position={pos}>
      <mesh castShadow receiveShadow position={[0, h / 2, 0]} onPointerOver={(e) => { e.stopPropagation(); setHov(true) }} onPointerOut={() => setHov(false)} onClick={(e) => { e.stopPropagation(); onPick(label) }}>
        <boxGeometry args={[13, h, 9]} />
        <meshStandardMaterial ref={mat} color={evening ? '#33513f' : '#cdbd9d'} roughness={0.65} emissive="#b99256" emissiveIntensity={0} />
      </mesh>
      {/* window grid */}
      {Array.from({ length: Math.floor(h / 2.1) }).map((_, f) =>
        [-4.5, -1.5, 1.5, 4.5].map((x) => (
          <mesh key={`${f}-${x}`} position={[x, 1.8 + f * 2.1, 4.56]}>
            <planeGeometry args={[1.6, 1.3]} />
            <meshStandardMaterial color={evening ? '#ffca7a' : '#7fa5a0'} emissive={evening ? '#ff9d45' : '#223'} emissiveIntensity={evening ? 1.4 : 0.15} roughness={0.2} metalness={0.4} />
          </mesh>
        ))
      )}
      {/* rooftop greenery */}
      <mesh position={[0, h + 0.5, 0]}><boxGeometry args={[12, 1, 8]} /><meshStandardMaterial color="#2c5a47" roughness={1} /></mesh>
      {[-4, 0, 4].map((x) => (
        <group key={x} position={[x, h + 1, 0]}>
          <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.12, 0.18, 1.6]} /><meshStandardMaterial color="#4a3721" /></mesh>
          <mesh position={[0, 2.2, 0]}><sphereGeometry args={[1.3, 10, 10]} /><meshStandardMaterial color="#35704f" roughness={1} /></mesh>
        </group>
      ))}
      <Html position={[0, h + 3.6, 0]} center distanceFactor={70}><div className="hotspot" onClick={() => onPick(label)}>{label}</div></Html>
    </group>
  )
}

function Trees() {
  const ref = useRef<THREE.InstancedMesh>(null)
  useEffect(() => {
    if (!ref.current) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < 46; i++) {
      const a = (i / 46) * Math.PI * 2, r = 26 + (i % 5) * 3
      dummy.position.set(Math.cos(a) * r, 1.4, Math.sin(a) * r - 2)
      dummy.scale.setScalar(0.8 + ((i * 7) % 10) / 12)
      dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 46]} castShadow>
      <sphereGeometry args={[1.5, 8, 8]} /><meshStandardMaterial color="#2f6b4c" roughness={1} />
    </instancedMesh>
  )
}

function CameraRig({ target, flyKey }: { target: [number, number, number] | null; flyKey: number }) {
  const { camera, controls } = useThree() as any
  useEffect(() => {
    if (!target || !controls) return
    const [x, y, z] = target
    const end = new THREE.Vector3(x + 14, y + 7, z + 16)
    gsap.to(camera.position, { x: end.x, y: end.y, z: end.z, duration: 1.8, ease: 'power3.inOut' })
    gsap.to(controls.target, { x, y, z, duration: 1.8, ease: 'power3.inOut', onUpdate: () => controls.update() })
  }, [flyKey])
  return null
}

function UnitMarkers({ units, selected, onSelect }: { units: VUnit[]; selected: string | null; onSelect: (u: VUnit) => void }) {
  const ids = useMemo(() => new Set(units.map((u) => u.id)), [units])
  return (
    <group>
      {ALL.map((u) => {
        const match = ids.has(u.id); const sel = selected === u.id
        return (
          <mesh key={u.id} position={u.pos} onClick={(e) => { e.stopPropagation(); onSelect(u) }}>
            <boxGeometry args={[1.15, 1.5, 0.35]} />
            <meshStandardMaterial color={sel ? '#ffca7a' : match ? '#b99256' : '#5a6a60'} transparent opacity={match || sel ? 1 : 0.18}
              emissive={sel ? '#ffb347' : '#000'} emissiveIntensity={sel ? 1.2 : 0} />
          </mesh>
        )
      })}
    </group>
  )
}

const HOTSPOTS = [
  { label: 'Gym', pos: [-14, 6, 8] as const, icon: '✦' },
  { label: 'Rooftop park', pos: [2, 26, -4] as const, icon: '❀' },
  { label: 'Café-restaurant', pos: [16, 22, 8] as const, icon: '☕' },
]

export default function ThreeD() {
  const lang = useLang()
  const { evening, setEvening } = useUI()
  const [kind, setKind] = useState<'all' | 'residence' | 'office' | 'retail'>('all')
  const [wing, setWing] = useState<string>('all')
  const [area, setArea] = useState<[number, number]>([28, 959])
  const [floor, setFloor] = useState<[number, number]>([0, 16])
  const [roomFilter, setRoomFilter] = useState('All')
  const [gardenOnly, setGardenOnly] = useState(false)
  const [sel, setSel] = useState<VUnit | null>(null)
  const [fly, setFly] = useState(0)
  const [auto, setAuto] = useState(true)
  const [pct, setPct] = useState(0)
  const [webgl, setWebgl] = useState(true)

  useEffect(() => {
    try { const c = document.createElement('canvas'); setWebgl(!!c.getContext('webgl2') || !!c.getContext('webgl')) } catch { setWebgl(false) }
    const mgr = THREE.DefaultLoadingManager
    mgr.onProgress = (_u, l, t) => setPct(Math.round((l / Math.max(t, 1)) * 100))
    const iv = setInterval(() => setPct((p) => Math.min(p + 4, 100)), 60)
    const to = setTimeout(() => { clearInterval(iv); setPct(100) }, 1600)
    return () => { clearInterval(iv); clearTimeout(to) }
  }, [])

  const filtered = useMemo(() => ALL.filter((u) =>
    (kind === 'all' || u.kind === kind) && (wing === 'all' || u.wing === wing) &&
    u.area >= area[0] && u.area <= area[1] && u.floor >= floor[0] && u.floor <= floor[1] &&
    (roomFilter === 'All' || u.rooms === parseFloat(roomFilter)) &&
    (!gardenOnly || residences.find((r) => r.id === u.id)?.garden)
  ), [kind, wing, area, floor, roomFilter, gardenOnly])

  const select = (u: VUnit) => { setSel(u); setFly((f) => f + 1); setAuto(false) }
  const flyWing = (l: string) => { setWing(l); setSel(null); setFly((f) => f + 1); setAuto(false) }
  const flyTarget: [number, number, number] | null = sel ? sel.pos : wing !== 'all' ? [WING_POS[wing][0], 12, WING_POS[wing][1]] : null

  return (
    <main className="three-page">
      <Seo title="3D Experience" desc="Explore Lumen Grove in interactive 3D — filter units and fly to your future home." />
      {pct < 100 && (
        <div className="preloader" style={{ zIndex: 60 }}>
          <div className="pl-brand">Growing the grove…</div><div className="pl-pct">{pct}%</div><div className="pl-bar" style={{ width: `${pct}%` }} />
        </div>
      )}
      {!webgl ? (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#f6f1e7', textAlign: 'center', padding: 24 }}>
          <div><img src={asset('assets/building-exterior.jpg')} alt="Lumen Grove exterior" style={{ borderRadius: 10, maxWidth: 720, width: '100%' }} />
          <p className="lead light mt-m">WebGL isn't available on this device — here's the grove in still life.</p>
          <Link className="btn gold mt-m" to={`/${lang}/residences`}>Browse residences →</Link></div>
        </div>
      ) : (
        <Canvas dpr={[1, 2]} shadows camera={{ position: [42, 30, 48], fov: 45 }} gl={{ antialias: true }}
          onPointerDown={() => setAuto(false)} data-cursor="Drag" style={{ cursor: 'grab' }}>
          <color attach="background" args={[evening ? '#15233a' : '#cfe3d8']} />
          <fog attach="fog" args={[evening ? '#15233a' : '#dcebe0', 90, 220]} />
          <ambientLight intensity={evening ? 0.35 : 0.75} />
          <directionalLight position={evening ? [-30, 18, -20] : [36, 52, 24]} intensity={evening ? 0.7 : 1.9} color={evening ? '#ffb877' : '#fff2d8'} castShadow shadow-mapSize={[2048, 2048]} />
          <Suspense fallback={null}>
            <Wing pos={[-14, 0, 0]} h={34} label="A" evening={evening} onPick={flyWing} />
            <Wing pos={[2, 0, -8]} h={26} label="B" evening={evening} onPick={flyWing} />
            <Wing pos={[16, 0, 2]} h={22} label="V" evening={evening} onPick={flyWing} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
              <circleGeometry args={[70, 40]} /><meshStandardMaterial color={evening ? '#1c3329' : '#8faE8b'} />
            </mesh>
            <Trees />
            <UnitMarkers units={filtered} selected={sel?.id || null} onSelect={select} />
            {HOTSPOTS.map((hsp) => (
              <Html key={hsp.label} position={[...hsp.pos]} center distanceFactor={80}>
                <div style={{ display: 'grid', justifyItems: 'center' }}><div className="hotspot">{hsp.icon}</div><div className="hotspot-label">{hsp.label}</div></div>
              </Html>
            ))}
            <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={90} blur={2.4} far={40} />
          </Suspense>
          <OrbitControls makeDefault enableDamping dampingFactor={0.06} autoRotate={auto} autoRotateSpeed={0.6}
            minDistance={16} maxDistance={130} maxPolarAngle={Math.PI / 2.15} minPolarAngle={0.15} target={[0, 10, 0]} />
          <CameraRig target={flyTarget} flyKey={fly} />
        </Canvas>
      )}

      <aside className="three-hud" aria-label="Unit filters">
        <p className="eyebrow">3D Experience</p>
        <h1 className="h-md" style={{ marginBlock: 8 }}>Find your place<br />in the canopy</h1>
        <div className="chips" style={{ marginTop: 14 }} role="group" aria-label="Type">
          {([['all', 'All'], ['residence', 'Apartments'], ['office', 'Offices'], ['retail', 'Retail']] as const).map(([v, l]) => (
            <button key={v} className={`chip ${kind === v ? 'on' : ''}`} onClick={() => setKind(v)}>{l}</button>
          ))}
        </div>
        <div className="chips" style={{ marginTop: 10 }} role="group" aria-label="Wing">
          {['all', 'A', 'B', 'V'].map((w) => <button key={w} className={`chip ${wing === w ? 'on' : ''}`} onClick={() => setWing(w)}>{w === 'all' ? 'All wings' : `Wing ${w}`}</button>)}
        </div>
        {kind !== 'office' && kind !== 'retail' && (
          <div className="chips" style={{ marginTop: 10 }} role="group" aria-label="Rooms">
            {['All', '1', '1.5', '2', '2.5', '3', '4'].map((r) => <button key={r} className={`chip ${roomFilter === r ? 'on' : ''}`} onClick={() => setRoomFilter(r)}>{r === 'All' ? 'All rooms' : `${r} BR`}</button>)}
          </div>
        )}
        <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
          <DualRange label="Area (m²)" min={28} max={959} value={area} onChange={setArea} unit=" m²" />
          <DualRange label="Floor" min={0} max={16} value={floor} onChange={setFloor} />
        </div>
        <label className="check" style={{ marginTop: 12 }}><input type="checkbox" checked={gardenOnly} onChange={(e) => setGardenOnly(e.target.checked)} /><span>Garden residences only</span></label>
        <p style={{ fontSize: 13, color: '#6d7268' }}><strong style={{ color: '#14352a' }}>{filtered.length}</strong> matching units glow gold. Click one — in the list or the building — to fly to it.</p>
        <div className="three-list">
          {filtered.slice(0, 40).map((u) => (
            <button key={u.id} className={sel?.id === u.id ? 'on' : ''} onClick={() => select(u)}>
              <span><strong>{u.code}</strong> · {u.kind}{u.rooms ? ` · ${roomLabel(u.rooms)}` : ''}</span><span>{u.area} m² · F{u.floor}</span>
            </button>
          ))}
          {filtered.length === 0 && <p style={{ fontSize: 13 }}>No units match — loosen the filters.</p>}
        </div>
      </aside>

      <div className="three-tools">
        <button className="pill-btn" style={{ background: 'rgba(13,38,30,.8)', color: '#f6f1e7', borderColor: 'transparent', backdropFilter: 'blur(8px)' }} onClick={() => setEvening(!evening)} aria-pressed={evening}>{evening ? '☀ Day' : '☾ Evening'}</button>
        <button className="pill-btn" style={{ background: 'rgba(13,38,30,.8)', color: '#f6f1e7', borderColor: 'transparent' }} onClick={() => setAuto(!auto)} aria-pressed={auto}>{auto ? 'Orbiting…' : 'Auto-orbit'}</button>
        <Link className="pill-btn" style={{ background: 'var(--gold)', color: '#fff', borderColor: 'transparent', textAlign: 'center' }} to={`/${lang}/residences`}>Catalog →</Link>
      </div>

      {sel && (
        <div className="three-panel" role="dialog" aria-label={`Unit ${sel.code}`}>
          <button style={{ float: 'right', fontSize: 18 }} onClick={() => setSel(null)} aria-label="Close panel">✕</button>
          <p className="eyebrow light">{sel.kind} · Wing {sel.wing}</p>
          <h2 className="h-md" style={{ marginBlock: 8 }}>{sel.code}</h2>
          <p style={{ opacity: 0.85 }}>{sel.area} m² · Floor {sel.floor}{sel.rooms ? ` · ${roomLabel(sel.rooms)}` : ''}</p>
          <Link to={`/${lang}${sel.href}`} className="btn gold mt-m" style={{ marginTop: 18 }}>View details<span className="arr">→</span></Link>
        </div>
      )}
      <p style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', color: 'rgba(246,241,231,.75)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', zIndex: 5, pointerEvents: 'none' }}>Drag to orbit · Scroll to zoom</p>
    </main>
  )
}
