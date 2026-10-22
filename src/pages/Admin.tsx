import { asset } from '../asset'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { residences as seedResidences, retailUnits as seedRetail, Residence, RetailUnit } from '../data'
import { BRAND, PHONE } from '../store'
import '../admin.css'

export type ContentItem = {
  id: number
  title: string
  type: string
  status: 'Published' | 'Draft' | 'Archived'
  updated: string
  description: string
  image: string
  views?: string
}

export type Enquiry = {
  id: string
  name: string
  email: string
  phone: string
  interest: string
  type: string
  date: string
  status: 'New' | 'In Progress' | 'Closed'
  budget: string
  notes: string
}

const DEFAULT_CONTENT: ContentItem[] = [
  {
    id: 1,
    title: 'Homepage — Living Canopy Hero',
    type: 'Page section',
    status: 'Published',
    updated: '19 Oct 2026',
    description: 'A living canopy in the city. Pinned leaf reveal, 01/02/03 architectural statements, and 3D preview link.',
    image: asset('assets/hero-leaves.jpg'),
    views: '14,820',
  },
  {
    id: 2,
    title: 'Residences Catalog & Filter System',
    type: 'Project section',
    status: 'Published',
    updated: '19 Oct 2026',
    description: '208 residences across Wings A & B. 1 to 4 bedroom layouts with private planted terraces and garden suites.',
    image: asset('assets/residence-interior.jpg'),
    views: '9,410',
  },
  {
    id: 3,
    title: '3D Canopy & Architectural Explorer',
    type: 'Interactive 3D',
    status: 'Published',
    updated: '18 Oct 2026',
    description: 'Procedural 3D model with day/evening toggle, camera fly-to, hot spots, and floorplate inspector.',
    image: asset('assets/panorama-aerial.jpg'),
    views: '6,230',
  },
  {
    id: 4,
    title: 'Business & Office Spaces',
    type: 'Commercial page',
    status: 'Published',
    updated: '17 Oct 2026',
    description: 'Daylight offices and executive suites tailored for creative and tech visionaries. Flexible multi-story floorplates.',
    image: asset('assets/business-office.jpg'),
    views: '3,840',
  },
  {
    id: 5,
    title: 'Street-Level Retail Spaces',
    type: 'Commercial page',
    status: 'Published',
    updated: '16 Oct 2026',
    description: '49 ground-level retail spaces along Bulevar heroja sa Košara with wide pedestrian canopies.',
    image: asset('assets/location-street.jpg'),
    views: '2,950',
  },
  {
    id: 6,
    title: 'Rooftop Forest & Sky Amenities',
    type: 'Page section',
    status: 'Published',
    updated: '15 Oct 2026',
    description: 'Planted sky terraces, 24/7 wellness center, resident lounge, and signature panoramic viewpoint.',
    image: asset('assets/amenities-rooftop.jpg'),
    views: '5,180',
  },
  {
    id: 7,
    title: 'Northfield Property Group Heritage',
    type: 'About page',
    status: 'Published',
    updated: '14 Oct 2026',
    description: 'Developer background, 20-year portfolio, sustainable urban philosophy, and international project milestones.',
    image: asset('assets/building-exterior.jpg'),
    views: '2,110',
  },
  {
    id: 8,
    title: 'Winter Private Preview Release',
    type: 'Article / Release',
    status: 'Draft',
    updated: '12 Oct 2026',
    description: 'Exclusive invitation-only previews for high-floor penthouses in Wing A with private elevator access.',
    image: asset('assets/residence-interior.jpg'),
    views: '—',
  },
]

const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    id: 'ENQ-1042',
    name: 'Marko Petrović',
    email: 'marko.petrovic@outlook.com',
    phone: '+381 64 123 4567',
    interest: 'Wing A — 3 Bedroom Penthouse (Floor 15)',
    type: 'Residence',
    date: '19 Oct 2026',
    status: 'New',
    budget: '€480,000 - €550,000',
    notes: 'Requested private tour this weekend. Interested in morning orientation.'
  },
  {
    id: 'ENQ-1041',
    name: 'Elena Rostova',
    email: 'elena.rostova@globalcapital.ch',
    phone: '+41 79 555 0192',
    interest: 'Wing V — Full Floor Commercial Office',
    type: 'Business',
    date: '18 Oct 2026',
    status: 'In Progress',
    budget: '€1,200,000',
    notes: 'Sent preliminary technical brochure and installment breakdown.'
  },
  {
    id: 'ENQ-1040',
    name: 'Ana Jovanović',
    email: 'ana.jovanovic@designworks.rs',
    phone: '+381 63 987 6543',
    interest: 'Wing B — 2 BR with Garden Terrace (Floor 1)',
    type: 'Residence',
    date: '18 Oct 2026',
    status: 'In Progress',
    budget: '€290,000 - €340,000',
    notes: 'Scheduled call with sales advisor for Thursday 3 PM.'
  },
  {
    id: 'ENQ-1039',
    name: 'Marcus Vance',
    email: 'm.vance@vancemedia.co.uk',
    phone: '+44 20 7946 0912',
    interest: 'Ground Level Corner Retail Unit (PP03)',
    type: 'Retail',
    date: '16 Oct 2026',
    status: 'New',
    budget: '€450,000',
    notes: 'Looking for coffee shop / artisanal bakery franchise location.'
  },
  {
    id: 'ENQ-1038',
    name: 'Dejan Stojanović',
    email: 'dejan.stojanovic@sbb.rs',
    phone: '+381 60 555 1289',
    interest: 'Wing A — 1.5 BR Investment Unit',
    type: 'Residence',
    date: '15 Oct 2026',
    status: 'Closed',
    budget: '€195,000',
    notes: 'Reservation agreement signed. Deposit pending.'
  },
  {
    id: 'ENQ-1037',
    name: 'Clara Gomez',
    email: 'clara.gomez@madrid-tech.es',
    phone: '+34 612 345 678',
    interest: 'Payment Plan & 5 Seasons Schedule Inquiry',
    type: 'General',
    date: '13 Oct 2026',
    status: 'Closed',
    budget: '—',
    notes: 'Consultation completed by international sales desk.'
  }
]

const MEDIA_ASSETS = [
  { id: 1, name: 'Hero Canopy Foliage', file: asset('assets/hero-leaves.jpg'), category: 'Hero & Atmosphere', size: '2.4 MB', resolution: '2800 × 1860' },
  { id: 2, name: 'Lumen Grove Exterior Architecture', file: asset('assets/building-exterior.jpg'), category: 'Exterior', size: '1.9 MB', resolution: '2400 × 1600' },
  { id: 3, name: 'Canopy Residence Living Room', file: asset('assets/residence-interior.jpg'), category: 'Interior', size: '2.1 MB', resolution: '2560 × 1700' },
  { id: 4, name: 'Creative Tech Office Suite', file: asset('assets/business-office.jpg'), category: 'Commercial', size: '1.8 MB', resolution: '2400 × 1600' },
  { id: 5, name: 'Skyline Panorama & Aerial', file: asset('assets/panorama-aerial.jpg'), category: 'Aerial & Views', size: '3.2 MB', resolution: '3200 × 1800' },
  { id: 6, name: 'Rooftop Forest & Resident Wellness', file: asset('assets/amenities-rooftop.jpg'), category: 'Amenities', size: '2.0 MB', resolution: '2400 × 1600' },
  { id: 7, name: 'Neighborhood Tree-Lined Avenue', file: asset('assets/location-street.jpg'), category: 'Location', size: '1.7 MB', resolution: '2200 × 1460' },
  { id: 8, name: 'Procedural 3D Canopy Engine', file: 'Three.js / Draco', category: '3D Interactive', size: 'Shader WebGL', resolution: 'Real-time 60fps' },
]

export default function Admin() {
  const [page, setPage] = useState<'dashboard' | 'content' | 'residences' | 'commercial' | 'media' | 'enquiries' | 'seo' | 'settings'>('dashboard')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Content state with localStorage
  const [items, setItems] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem('lg_admin_content')
      return saved ? JSON.parse(saved) : DEFAULT_CONTENT
    } catch {
      return DEFAULT_CONTENT
    }
  })

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = localStorage.getItem('lg_admin_enquiries')
      return saved ? JSON.parse(saved) : DEFAULT_ENQUIRIES
    } catch {
      return DEFAULT_ENQUIRIES
    }
  })

  // Residences state
  const [residencesList, setResidencesList] = useState<Residence[]>(() => {
    try {
      const savedOverrides = localStorage.getItem('lg_residence_status_overrides')
      if (savedOverrides) {
        const overrides: Record<string, 'Available' | 'Reserved'> = JSON.parse(savedOverrides)
        return seedResidences.map(r => overrides[r.id] ? { ...r, status: overrides[r.id] } : r)
      }
    } catch {}
    return seedResidences
  })

  // Retail state
  const [retailList, setRetailList] = useState<RetailUnit[]>(() => {
    try {
      const savedOverrides = localStorage.getItem('lg_retail_status_overrides')
      if (savedOverrides) {
        const overrides: Record<string, 'Available' | 'Reserved'> = JSON.parse(savedOverrides)
        return seedRetail.map(r => overrides[r.id] ? { ...r, status: overrides[r.id] } : r)
      }
    } catch {}
    return seedRetail
  })

  // SEO state
  const [seo, setSeo] = useState({
    title: 'Lumen Grove — A living canopy in the city | Luxury Residences & Offices',
    desc: 'Award-winning residential and commercial complex in New Belgrade. 208 residences, street-level retail, modern offices, and a rooftop forest.',
    url: 'https://lumengrove.rs/en',
    indexing: 'Index, follow',
    ogImage: asset('assets/building-exterior.jpg'),
  })

  // Settings state
  const [settings, setSettings] = useState({
    projectName: BRAND,
    developer: 'Northfield Property Group',
    address: 'Bulevar heroja sa Košara, New Belgrade',
    phone: PHONE,
    email: 'concierge@lumengrove.rs',
    defaultLang: 'English (EN)',
    timezone: 'Europe/Belgrade (UTC+1)',
    currency: 'EUR (€)',
  })

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [wingFilter, setWingFilter] = useState<'All' | 'A' | 'B'>('All')
  const [residenceRoomFilter, setResidenceRoomFilter] = useState<string>('All')
  const [residenceStatusFilter, setResidenceStatusFilter] = useState<string>('All')

  // Modal editor
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formType, setFormType] = useState('Page section')
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft' | 'Archived'>('Published')
  const [formDesc, setFormDesc] = useState('')
  const [formImage, setFormImage] = useState('')

  // Toast helper
  const showToast = (msg: string) => {
    setToastMsg(msg)
    window.clearTimeout((window as any).__toastTimer)
    ;(window as any).__toastTimer = window.setTimeout(() => setToastMsg(null), 3000)
  }

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lg_admin_content', JSON.stringify(items))
    } catch {}
  }, [items])

  useEffect(() => {
    try {
      localStorage.setItem('lg_admin_enquiries', JSON.stringify(enquiries))
    } catch {}
  }, [enquiries])

  // Open modal for new/edit
  const handleOpenEditor = (item: ContentItem | null = null) => {
    if (item) {
      setEditingItem(item)
      setFormTitle(item.title)
      setFormType(item.type)
      setFormStatus(item.status)
      setFormDesc(item.description)
      setFormImage(item.image)
    } else {
      setEditingItem(null)
      setFormTitle('')
      setFormType('Page section')
      setFormStatus('Published')
      setFormDesc('')
      setFormImage(asset('assets/building-exterior.jpg'))
    }
    setIsModalOpen(true)
  }

  // Save item from modal
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    const now = new Date()
    const updatedStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

    if (editingItem) {
      setItems(prev => prev.map(x => x.id === editingItem.id ? {
        ...x,
        title: formTitle.trim(),
        type: formType,
        status: formStatus,
        description: formDesc.trim(),
        image: formImage.trim(),
        updated: updatedStr,
      } : x))
      showToast('Content section updated successfully.')
    } else {
      const newId = Math.max(0, ...items.map(x => x.id)) + 1
      const newItem: ContentItem = {
        id: newId,
        title: formTitle.trim(),
        type: formType,
        status: formStatus,
        description: formDesc.trim(),
        image: formImage.trim() || asset('assets/building-exterior.jpg'),
        updated: updatedStr,
        views: '0',
      }
      setItems(prev => [newItem, ...prev])
      showToast('New content section added.')
    }
    setIsModalOpen(false)
  }

  // Toggle item status
  const handleToggleStatus = (id: number) => {
    setItems(prev => prev.map(x => {
      if (x.id !== id) return x
      const nextStatus: ContentItem['status'] = x.status === 'Published' ? 'Draft' : 'Published'
      return { ...x, status: nextStatus, updated: '19 Oct 2026' }
    }))
    showToast('Content status updated.')
  }

  // Delete item
  const handleDeleteItem = (id: number) => {
    const item = items.find(x => x.id === id)
    if (!item) return
    if (window.confirm(`Delete "${item.title}" from the Lumen Grove content manager?`)) {
      setItems(prev => prev.filter(x => x.id !== id))
      showToast('Content section deleted.')
    }
  }

  // Toggle Residence status
  const handleToggleResidence = (id: string) => {
    setResidencesList(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: (r.status === 'Available' ? 'Reserved' : 'Available') as 'Available' | 'Reserved' } : r)
      const overrides: Record<string, string> = {}
      updated.forEach(u => {
        const seedMatch = seedResidences.find(s => s.id === u.id)
        if (seedMatch && seedMatch.status !== u.status) overrides[u.id] = u.status
      })
      localStorage.setItem('lg_residence_status_overrides', JSON.stringify(overrides))
      return updated
    })
    showToast('Residence status updated.')
  }

  // Toggle Retail status
  const handleToggleRetail = (id: string) => {
    setRetailList(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: (r.status === 'Available' ? 'Reserved' : 'Available') as 'Available' | 'Reserved' } : r)
      const overrides: Record<string, string> = {}
      updated.forEach(u => {
        const seedMatch = seedRetail.find(s => s.id === u.id)
        if (seedMatch && seedMatch.status !== u.status) overrides[u.id] = u.status
      })
      localStorage.setItem('lg_retail_status_overrides', JSON.stringify(overrides))
      return updated
    })
    showToast('Commercial unit status updated.')
  }

  // Toggle Enquiry status
  const handleToggleEnquiry = (id: string) => {
    setEnquiries(prev => prev.map(enq => {
      if (enq.id !== id) return enq
      const next = enq.status === 'New' ? 'In Progress' : enq.status === 'In Progress' ? 'Closed' : 'New'
      return { ...enq, status: next }
    }))
    showToast('Enquiry status updated.')
  }

  // Export JSON
  const handleExportJSON = () => {
    const data = {
      project: BRAND,
      exportedAt: new Date().toISOString(),
      content: items,
      residencesCount: residencesList.length,
      retailCount: retailList.length,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lumen-grove-content.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Content JSON exported successfully.')
  }

  // Export CSV
  const handleExportEnquiries = () => {
    const headers = 'ID,Name,Email,Phone,Interest,Type,Date,Status,Budget,Notes\n'
    const rows = enquiries.map(e => `"${e.id}","${e.name}","${e.email}","${e.phone}","${e.interest}","${e.type}","${e.date}","${e.status}","${e.budget}","${e.notes.replace(/"/g, '""')}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lumen-grove-enquiries.csv'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Enquiries exported as CSV.')
  }

  // Computed metrics
  const publishedCount = useMemo(() => items.filter(x => x.status === 'Published').length, [items])
  const draftCount = useMemo(() => items.filter(x => x.status === 'Draft').length, [items])
  const availableResidences = useMemo(() => residencesList.filter(r => r.status === 'Available').length, [residencesList])
  const availableRetail = useMemo(() => retailList.filter(r => r.status === 'Available').length, [retailList])

  // Filtered Content
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return items.filter(x => {
      const matchStatus = !statusFilter || x.status === statusFilter
      const matchQuery = !q || [x.title, x.type, x.description].join(' ').toLowerCase().includes(q)
      return matchStatus && matchQuery
    })
  }, [items, searchQuery, statusFilter])

  // Filtered Residences
  const filteredResidences = useMemo(() => {
    return residencesList.filter(r => {
      if (wingFilter !== 'All' && r.wing !== wingFilter) return false
      if (residenceRoomFilter !== 'All' && String(r.rooms) !== residenceRoomFilter) return false
      if (residenceStatusFilter !== 'All' && r.status !== residenceStatusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        return r.code.toLowerCase().includes(q) || `floor ${r.floor}`.includes(q) || r.orientation.toLowerCase().includes(q)
      }
      return true
    })
  }, [residencesList, wingFilter, residenceRoomFilter, residenceStatusFilter, searchQuery])

  // Greeting
  const greeting = useMemo(() => {
    const hr = new Date().getHours()
    if (hr < 12) return 'Good morning'
    if (hr < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const pageTitle = ({
    dashboard: 'Dashboard',
    content: 'Website Content',
    residences: 'Residences Inventory',
    commercial: 'Retail & Office Spaces',
    media: 'Media Gallery',
    enquiries: 'Enquiries & CRM',
    seo: 'SEO Settings',
    settings: 'Workspace Settings',
  })[page]

  return (
    <div className="lg-admin-root">
      <Helmet>
        <title>{pageTitle} — Lumen Grove Admin Studio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Sidebar */}
      <aside className="lg-sidebar">
        <div className="lg-sidebrand">
          <span className="lg-sidebrand-title">LUMEN GROVE</span>
          <span className="lg-sidebrand-sub">Canopy Living · Admin Studio</span>
        </div>

        <div className="lg-side-label">Content & Catalog</div>
        <button
          className={`lg-side-link ${page === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setPage('dashboard'); setSearchQuery(''); }}
        >
          <span className="lg-ico">▦</span> Dashboard
        </button>
        <button
          className={`lg-side-link ${page === 'content' ? 'active' : ''}`}
          onClick={() => { setPage('content'); setSearchQuery(''); }}
        >
          <span className="lg-ico">▤</span> Website Content
        </button>
        <button
          className={`lg-side-link ${page === 'residences' ? 'active' : ''}`}
          onClick={() => { setPage('residences'); setSearchQuery(''); }}
        >
          <span className="lg-ico">⌂</span> Residences ({availableResidences} live)
        </button>
        <button
          className={`lg-side-link ${page === 'commercial' ? 'active' : ''}`}
          onClick={() => { setPage('commercial'); setSearchQuery(''); }}
        >
          <span className="lg-ico">🏢</span> Retail & Office ({availableRetail} live)
        </button>
        <button
          className={`lg-side-link ${page === 'media' ? 'active' : ''}`}
          onClick={() => { setPage('media'); setSearchQuery(''); }}
        >
          <span className="lg-ico">▧</span> Media Gallery
        </button>
        <button
          className={`lg-side-link ${page === 'enquiries' ? 'active' : ''}`}
          onClick={() => { setPage('enquiries'); setSearchQuery(''); }}
        >
          <span className="lg-ico">✉</span> Enquiries ({enquiries.filter(e => e.status === 'New').length} new)
        </button>
        <button
          className={`lg-side-link ${page === 'seo' ? 'active' : ''}`}
          onClick={() => { setPage('seo'); setSearchQuery(''); }}
        >
          <span className="lg-ico">⌕</span> SEO Settings
        </button>

        <div className="lg-side-label">System</div>
        <button
          className={`lg-side-link ${page === 'settings' ? 'active' : ''}`}
          onClick={() => { setPage('settings'); setSearchQuery(''); }}
        >
          <span className="lg-ico">⚙</span> Settings
        </button>

        <div className="lg-side-bottom">
          <Link to="/en" className="lg-side-link" style={{ color: '#b99a62', fontWeight: 600 }}>
            <span className="lg-ico">↗</span> View Live Site
          </Link>
          <button
            className="lg-side-link"
            onClick={() => showToast('Demo session: administrative credentials active.')}
          >
            <span className="lg-ico">🔒</span> Secure Session
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="lg-admin-main">
        {/* Topbar */}
        <header className="lg-admin-top">
          <div className="lg-crumb">
            <span>Lumen Grove</span> / <strong>{pageTitle}</strong>
          </div>
          <div className="lg-admin-user">
            <span style={{ color: '#596a7b' }}>Property & CMS Admin</span>
            <div className="lg-avatar" title="Administrator">LG</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="lg-admin-content">
          {/* DASHBOARD VIEW */}
          {page === 'dashboard' && (
            <>
              <div className="lg-heading">
                <div>
                  <h1>{greeting}, Administrator</h1>
                  <p>Here’s what’s happening with Lumen Grove properties, website content, and client enquiries today.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to="/en" className="lg-btn-secondary">
                    <span>↗</span> Visit Website
                  </Link>
                  <button className="lg-btn-primary" onClick={() => handleOpenEditor()}>
                    <span>＋</span> Add Content
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="lg-cards">
                <div className="lg-metric">
                  <div className="lg-metric-top">
                    Total Residences <span className="lg-metric-icon">⌂</span>
                  </div>
                  <strong>{residencesList.length}</strong>
                  <span className="lg-trend">
                    ✓ {availableResidences} available · {residencesList.length - availableResidences} reserved
                  </span>
                </div>

                <div className="lg-metric">
                  <div className="lg-metric-top">
                    Commercial Spaces <span className="lg-metric-icon">🏢</span>
                  </div>
                  <strong>{retailList.length}</strong>
                  <span className="lg-trend">
                    ✓ {availableRetail} available · 49 retail & offices
                  </span>
                </div>

                <div className="lg-metric">
                  <div className="lg-metric-top">
                    Website Sections <span className="lg-metric-icon">▤</span>
                  </div>
                  <strong>{items.length.toString().padStart(2, '0')}</strong>
                  <span className="lg-trend">
                    ✓ {publishedCount} published · {draftCount} in review
                  </span>
                </div>

                <div className="lg-metric">
                  <div className="lg-metric-top">
                    New Enquiries <span className="lg-metric-icon">✉</span>
                  </div>
                  <strong>{enquiries.filter(e => e.status === 'New').length.toString().padStart(2, '0')}</strong>
                  <span className="lg-trend">
                    {enquiries.length} total active leads
                  </span>
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="lg-dashboard-grid">
                {/* Recent Content */}
                <section className="lg-panel">
                  <div className="lg-panel-head">
                    <h3>Recent Website Sections</h3>
                    <button className="lg-btn-secondary" onClick={() => setPage('content')}>
                      View all ({items.length}) →
                    </button>
                  </div>
                  <div className="lg-table-wrap">
                    <table className="lg-table">
                      <thead>
                        <tr>
                          <th>Section Title</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.slice(0, 5).map(item => (
                          <tr key={item.id}>
                            <td>
                              <b>{item.title}</b>
                              <br />
                              <span style={{ color: '#8897a5', fontSize: 11 }}>{item.description}</span>
                            </td>
                            <td>{item.type}</td>
                            <td>
                              <span className={`lg-status ${item.status.toLowerCase()}`}>
                                {item.status}
                              </span>
                            </td>
                            <td>{item.updated}</td>
                            <td>
                              <div className="lg-actions">
                                <button
                                  className="lg-icon-btn"
                                  onClick={() => handleOpenEditor(item)}
                                  title="Edit section"
                                >
                                  ✎
                                </button>
                                <button
                                  className="lg-icon-btn"
                                  onClick={() => handleToggleStatus(item.id)}
                                  title="Toggle status"
                                >
                                  ⇄
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Quick Actions */}
                <section className="lg-panel">
                  <div className="lg-panel-head">
                    <h3>Quick Operations</h3>
                    <small>Management Tools</small>
                  </div>
                  <div className="lg-panel-body">
                    <div className="lg-quick-grid">
                      <button className="lg-quick" onClick={() => handleOpenEditor()}>
                        <span>＋</span> Add Section
                      </button>
                      <button className="lg-quick" onClick={() => setPage('residences')}>
                        <span>⌂</span> Manage Units
                      </button>
                      <button className="lg-quick" onClick={() => setPage('enquiries')}>
                        <span>✉</span> View Enquiries
                      </button>
                      <button className="lg-quick" onClick={() => setPage('media')}>
                        <span>▧</span> Media Library
                      </button>
                      <button className="lg-quick" onClick={() => setPage('seo')}>
                        <span>⌕</span> SEO Settings
                      </button>
                      <button className="lg-quick" onClick={() => handleExportJSON()}>
                        <span>↓</span> Export JSON
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* System & Architecture Checklist */}
              <div className="lg-panel">
                <div className="lg-panel-head">
                  <h3>System & Project Architecture Status</h3>
                  <small>Lumen Grove Infrastructure</small>
                </div>
                <div className="lg-panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                  <div>
                    <span className="lg-status">Active</span>
                    <p style={{ fontSize: 12, fontWeight: 600, margin: '6px 0 2px', color: '#172737' }}>Three.js 3D Canopy Engine</p>
                    <span style={{ fontSize: 11, color: '#687786' }}>Procedural Wings A/B/V with day & evening toggle</span>
                  </div>
                  <div>
                    <span className="lg-status">Active</span>
                    <p style={{ fontSize: 12, fontWeight: 600, margin: '6px 0 2px', color: '#172737' }}>Lenis & GSAP Scroll System</p>
                    <span style={{ fontSize: 11, color: '#687786' }}>Synced ticker, pinned leaf-reveal hero & masked reveals</span>
                  </div>
                  <div>
                    <span className="lg-status">Active</span>
                    <p style={{ fontSize: 12, fontWeight: 600, margin: '6px 0 2px', color: '#172737' }}>Localization Ready</p>
                    <span style={{ fontSize: 11, color: '#687786' }}>English (EN) and Spanish (ES) routes synchronized</span>
                  </div>
                  <div>
                    <span className="lg-status in-progress">Staged</span>
                    <p style={{ fontSize: 12, fontWeight: 600, margin: '6px 0 2px', color: '#172737' }}>CRM Webhook Integration</p>
                    <span style={{ fontSize: 11, color: '#687786' }}>Inquiry mock endpoint active; ready for live CRM</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* WEBSITE CONTENT VIEW */}
          {page === 'content' && (
            <>
              <div className="lg-heading">
                <div>
                  <h1>Website Content</h1>
                  <p>Manage Lumen Grove public sections, copy, layout features, and publication status.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="lg-btn-secondary" onClick={handleExportJSON}>
                    Export JSON ↓
                  </button>
                  <button className="lg-btn-primary" onClick={() => handleOpenEditor()}>
                    ＋ Add New Section
                  </button>
                </div>
              </div>

              <div className="lg-notice">
                All modifications, additions, and status changes are dynamically synchronized with your local browser storage.
              </div>

              <div className="lg-toolbar">
                <input
                  className="lg-search"
                  placeholder="Search sections by title, type, or description…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <select
                  className="lg-select"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <section className="lg-panel">
                <div className="lg-table-wrap">
                  {filteredItems.length === 0 ? (
                    <div className="lg-empty">No content sections match your search criteria.</div>
                  ) : (
                    <table className="lg-table">
                      <thead>
                        <tr>
                          <th>Section Title & Description</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Last Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map(item => (
                          <tr key={item.id}>
                            <td>
                              <b style={{ fontSize: 13, color: '#142536' }}>{item.title}</b>
                              <br />
                              <span style={{ color: '#748595', fontSize: 11 }}>{item.description}</span>
                            </td>
                            <td>{item.type}</td>
                            <td>
                              <span className={`lg-status ${item.status.toLowerCase()}`}>
                                {item.status}
                              </span>
                            </td>
                            <td>{item.updated}</td>
                            <td>
                              <div className="lg-actions">
                                <button
                                  className="lg-icon-btn"
                                  onClick={() => handleOpenEditor(item)}
                                  title="Edit section"
                                >
                                  ✎ Edit
                                </button>
                                <button
                                  className="lg-icon-btn"
                                  onClick={() => handleToggleStatus(item.id)}
                                  title="Toggle status"
                                >
                                  ⇄ Status
                                </button>
                                <button
                                  className="lg-icon-btn"
                                  onClick={() => handleDeleteItem(item.id)}
                                  title="Delete section"
                                  style={{ color: '#b23b3b' }}
                                >
                                  ×
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </>
          )}

          {/* RESIDENCES INVENTORY VIEW */}
          {page === 'residences' && (
            <>
              <div className="lg-heading">
                <div>
                  <h1>Residences Inventory</h1>
                  <p>Browse and manage the 208 premium residences across Wings A & B of Lumen Grove.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to="/en/residences" className="lg-btn-secondary" target="_blank">
                    <span>↗</span> View Public Catalog
                  </Link>
                </div>
              </div>

              <div className="lg-toolbar">
                <input
                  className="lg-search"
                  placeholder="Search by unit code (e.g. A 4.02), floor, or orientation…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <select
                  className="lg-select"
                  value={wingFilter}
                  onChange={e => setWingFilter(e.target.value as any)}
                >
                  <option value="All">All Wings</option>
                  <option value="A">Wing A</option>
                  <option value="B">Wing B</option>
                </select>
                <select
                  className="lg-select"
                  value={residenceRoomFilter}
                  onChange={e => setResidenceRoomFilter(e.target.value)}
                >
                  <option value="All">All Layouts</option>
                  <option value="1">1 BR</option>
                  <option value="1.5">1.5 BR</option>
                  <option value="2">2 BR</option>
                  <option value="2.5">2.5 BR</option>
                  <option value="3">3 BR</option>
                  <option value="4">4 BR</option>
                </select>
                <select
                  className="lg-select"
                  value={residenceStatusFilter}
                  onChange={e => setResidenceStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <section className="lg-panel">
                <div className="lg-panel-head">
                  <h3>
                    Showing {filteredResidences.length} of {residencesList.length} Units
                  </h3>
                  <small>
                    {availableResidences} Available · {residencesList.length - availableResidences} Reserved
                  </small>
                </div>
                <div className="lg-table-wrap">
                  <table className="lg-table">
                    <thead>
                      <tr>
                        <th>Unit Code</th>
                        <th>Wing</th>
                        <th>Floor</th>
                        <th>Rooms</th>
                        <th>Area (m²)</th>
                        <th>Outdoor Features</th>
                        <th>Orientation</th>
                        <th>Status</th>
                        <th>Quick Toggle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResidences.slice(0, 50).map(unit => (
                        <tr key={unit.id}>
                          <td>
                            <b style={{ color: '#16293b' }}>{unit.code}</b>
                          </td>
                          <td>Wing {unit.wing}</td>
                          <td>Floor {unit.floor}</td>
                          <td>{unit.rooms} BR</td>
                          <td>{unit.area} m²</td>
                          <td>
                            {unit.garden ? '🌿 Private Garden' : unit.balcony ? '🌤 Terrace' : '—'}
                          </td>
                          <td>{unit.orientation}</td>
                          <td>
                            <span className={`lg-status ${unit.status === 'Available' ? '' : 'reserved'}`}>
                              {unit.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="lg-btn-secondary"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                              onClick={() => handleToggleResidence(unit.id)}
                            >
                              Toggle ⇄
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredResidences.length > 50 && (
                    <div style={{ padding: '12px 16px', background: '#f8fafc', fontSize: 11, color: '#687b8c', textAlign: 'center' }}>
                      Displaying first 50 results of {filteredResidences.length}. Use filters above to narrow your search.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* COMMERCIAL / RETAIL VIEW */}
          {page === 'commercial' && (
            <>
              <div className="lg-heading">
                <div>
                  <h1>Commercial & Retail Inventory</h1>
                  <p>49 commercial opportunities across street-level retail and modern daylight offices in Wings A, B, and V.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to="/en/retail-spaces" className="lg-btn-secondary" target="_blank">
                    <span>↗</span> View Retail Catalog
                  </Link>
                </div>
              </div>

              <section className="lg-panel">
                <div className="lg-table-wrap">
                  <table className="lg-table">
                    <thead>
                      <tr>
                        <th>Unit Code</th>
                        <th>Type</th>
                        <th>Wing</th>
                        <th>Floor</th>
                        <th>Area (m²)</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {retailList.map(unit => (
                        <tr key={unit.id}>
                          <td><b>{unit.code}</b></td>
                          <td>
                            <span style={{ fontWeight: 600, color: unit.type === 'Retail' ? '#226040' : '#18476d' }}>
                              {unit.type}
                            </span>
                          </td>
                          <td>Wing {unit.wing}</td>
                          <td>{unit.floorLabel}</td>
                          <td>{unit.area} m²</td>
                          <td>
                            <span className={`lg-status ${unit.status === 'Available' ? '' : 'reserved'}`}>
                              {unit.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="lg-btn-secondary"
                              style={{ padding: '4px 8px', fontSize: 11 }}
                              onClick={() => handleToggleRetail(unit.id)}
                            >
                              Toggle Status ⇄
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* MEDIA GALLERY VIEW */}
          {page === 'media' && (
            <>
              <div className="lg-heading">
                <div>
                  <h1>Media Assets & Renders</h1>
                  <p>Curated photography, aerial views, and procedural 3D model assets for Lumen Grove.</p>
                </div>
                <button
                  className="lg-btn-primary"
                  onClick={() => showToast('Media file upload endpoint ready for staging.')}
                >
                  ＋ Upload Asset
                </button>
              </div>

              <div className="lg-media-grid">
                {MEDIA_ASSETS.map(asset => (
                  <div className="lg-media-card" key={asset.id}>
                    <div className="lg-media-thumb">
                      {asset.file.startsWith('/') ? (
                        <img src={asset.file} alt={asset.name} loading="lazy" />
                      ) : (
                        <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#88a7c2', background: '#0e1f30' }}>
                          <span style={{ fontSize: 32 }}>◈</span>
                        </div>
                      )}
                    </div>
                    <div className="lg-media-info">
                      <b>{asset.name}</b>
                      <span>{asset.category}</span>
                      <div className="lg-media-meta">
                        <span>{asset.resolution}</span>
                        <span>{asset.size}</span>
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                        <button
                          className="lg-btn-secondary"
                          style={{ flex: 1, padding: '5px 8px', fontSize: 11 }}
                          onClick={() => {
                            navigator.clipboard?.writeText(asset.file)
                            showToast(`Copied asset path: ${asset.file}`)
                          }}
                        >
                          Copy Path
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ENQUIRIES VIEW */}
          {page === 'enquiries' && (
            <>
              <div className="lg-heading">
                <div>
                  <h1>Client Inquiries & CRM Leads</h1>
                  <p>Direct leads received through the Lumen Grove reservation desk and contact forms.</p>
                </div>
                <button className="lg-btn-secondary" onClick={handleExportEnquiries}>
                  Export Inquiries CSV ↓
                </button>
              </div>

              <section className="lg-panel">
                <div className="lg-table-wrap">
                  <table className="lg-table">
                    <thead>
                      <tr>
                        <th>Lead ID</th>
                        <th>Client Details</th>
                        <th>Property of Interest</th>
                        <th>Category</th>
                        <th>Received</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map(enq => (
                        <tr key={enq.id}>
                          <td><b>{enq.id}</b></td>
                          <td>
                            <strong style={{ color: '#162738' }}>{enq.name}</strong>
                            <br />
                            <span style={{ fontSize: 11, color: '#687786' }}>{enq.email}</span>
                            <br />
                            <span style={{ fontSize: 10, color: '#8898a7' }}>{enq.phone}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: '#183856' }}>{enq.interest}</span>
                            <br />
                            <small style={{ color: '#8595a4' }}>Budget: {enq.budget}</small>
                          </td>
                          <td>{enq.type}</td>
                          <td>{enq.date}</td>
                          <td>
                            <span className={`lg-status ${enq.status === 'New' ? '' : enq.status === 'In Progress' ? 'in-progress' : 'closed'}`}>
                              {enq.status}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: 11, color: '#556676', maxWidth: 200, display: 'inline-block', whiteSpace: 'normal' }}>
                              {enq.notes}
                            </span>
                          </td>
                          <td>
                            <button
                              className="lg-btn-secondary"
                              style={{ padding: '5px 8px', fontSize: 11 }}
                              onClick={() => handleToggleEnquiry(enq.id)}
                            >
                              Cycle Status ⇄
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* SEO SETTINGS VIEW */}
          {page === 'seo' && (
            <>
              <div className="lg-heading">
                <div>
                  <h1>Search Engine Optimization (SEO)</h1>
                  <p>Configure search appearance, canonical metadata, and social previews for Lumen Grove.</p>
                </div>
                <button
                  className="lg-btn-primary"
                  onClick={() => showToast('SEO settings saved successfully.')}
                >
                  Save SEO Settings
                </button>
              </div>

              {/* Live Google Search Preview */}
              <div className="lg-seo-preview">
                <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#667888', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                  Search Result Snippet Preview
                </span>
                <div className="lg-google-url">{seo.url}</div>
                <h3 className="lg-google-title">{seo.title}</h3>
                <p className="lg-google-desc">{seo.desc}</p>
              </div>

              <section className="lg-panel">
                <div className="lg-panel-head">
                  <h3>Metadata Configuration</h3>
                </div>
                <div className="lg-panel-body">
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      showToast('SEO settings saved.')
                    }}
                    className="lg-form-grid"
                  >
                    <div className="lg-field full">
                      <label>Page Meta Title</label>
                      <input
                        value={seo.title}
                        onChange={e => setSeo({ ...seo, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lg-field full">
                      <label>Meta Description</label>
                      <textarea
                        value={seo.desc}
                        onChange={e => setSeo({ ...seo, desc: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="lg-field">
                      <label>Canonical Project URL</label>
                      <input
                        value={seo.url}
                        onChange={e => setSeo({ ...seo, url: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lg-field">
                      <label>Search Bot Indexing</label>
                      <select
                        value={seo.indexing}
                        onChange={e => setSeo({ ...seo, indexing: e.target.value })}
                      >
                        <option value="Index, follow">Index, follow (Recommended)</option>
                        <option value="No index, follow">No index, follow</option>
                        <option value="No index, no follow">No index, no follow</option>
                      </select>
                    </div>
                    <div className="lg-field full">
                      <label>OpenGraph / Social Sharing Image Path</label>
                      <input
                        value={seo.ogImage}
                        onChange={e => setSeo({ ...seo, ogImage: e.target.value })}
                      />
                    </div>
                    <div className="lg-field full" style={{ marginTop: 10 }}>
                      <button type="submit" className="lg-btn-primary">
                        Save SEO Settings
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </>
          )}

          {/* SETTINGS VIEW */}
          {page === 'settings' && (
            <>
              <div className="lg-heading">
                <div>
                  <h1>Workspace & Project Configuration</h1>
                  <p>Global property information, contact coordinates, and admin preferences for Lumen Grove.</p>
                </div>
                <button
                  className="lg-btn-primary"
                  onClick={() => showToast('Workspace settings saved.')}
                >
                  Save Settings
                </button>
              </div>

              <section className="lg-panel">
                <div className="lg-panel-head">
                  <h3>Project & Developer Coordinates</h3>
                </div>
                <div className="lg-panel-body">
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      showToast('Project configuration saved.')
                    }}
                    className="lg-form-grid"
                  >
                    <div className="lg-field">
                      <label>Project Name</label>
                      <input
                        value={settings.projectName}
                        onChange={e => setSettings({ ...settings, projectName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lg-field">
                      <label>Developer Entity</label>
                      <input
                        value={settings.developer}
                        onChange={e => setSettings({ ...settings, developer: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lg-field full">
                      <label>Address / Site Location</label>
                      <input
                        value={settings.address}
                        onChange={e => setSettings({ ...settings, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lg-field">
                      <label>Concierge Phone</label>
                      <input
                        value={settings.phone}
                        onChange={e => setSettings({ ...settings, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lg-field">
                      <label>Concierge Email</label>
                      <input
                        value={settings.email}
                        onChange={e => setSettings({ ...settings, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="lg-field">
                      <label>Default Localization</label>
                      <select
                        value={settings.defaultLang}
                        onChange={e => setSettings({ ...settings, defaultLang: e.target.value })}
                      >
                        <option>English (EN)</option>
                        <option>Spanish (ES)</option>
                      </select>
                    </div>
                    <div className="lg-field">
                      <label>Pricing Currency</label>
                      <select
                        value={settings.currency}
                        onChange={e => setSettings({ ...settings, currency: e.target.value })}
                      >
                        <option>EUR (€)</option>
                        <option>USD ($)</option>
                        <option>RSD (дин)</option>
                      </select>
                    </div>
                    <div className="lg-field full" style={{ marginTop: 12 }}>
                      <button type="submit" className="lg-btn-primary">
                        Save Workspace Settings
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* MODAL EDITOR */}
      {isModalOpen && (
        <div className="lg-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="lg-modal" onClick={e => e.stopPropagation()}>
            <div className="lg-modal-head">
              <h3>{editingItem ? 'Edit Website Section' : 'Add Website Section'}</h3>
              <button className="lg-modal-x" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="lg-modal-body">
              <form onSubmit={handleSaveItem}>
                <div className="lg-form-grid">
                  <div className="lg-field full">
                    <label>Section Title *</label>
                    <input
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      placeholder="e.g. Skyline Sky Lounge & Terrace"
                      required
                    />
                  </div>
                  <div className="lg-field">
                    <label>Content Type</label>
                    <select
                      value={formType}
                      onChange={e => setFormType(e.target.value)}
                    >
                      <option value="Page section">Page section</option>
                      <option value="Project section">Project section</option>
                      <option value="Commercial page">Commercial page</option>
                      <option value="Interactive 3D">Interactive 3D</option>
                      <option value="About page">About page</option>
                      <option value="Article / Release">Article / Release</option>
                    </select>
                  </div>
                  <div className="lg-field">
                    <label>Status</label>
                    <select
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as any)}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div className="lg-field full">
                    <label>Description & Copy Details</label>
                    <textarea
                      value={formDesc}
                      onChange={e => setFormDesc(e.target.value)}
                      placeholder="Summary of copy, features, and layout details for this section"
                      rows={3}
                    />
                  </div>
                  <div className="lg-field full">
                    <label>Associated Media / Image Asset</label>
                    <input
                      value={formImage}
                      onChange={e => setFormImage(e.target.value)}
                      placeholder={asset('assets/building-exterior.jpg')}
                    />
                  </div>
                </div>

                <div className="lg-form-actions">
                  <button
                    type="button"
                    className="lg-btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="lg-btn-primary">
                    {editingItem ? 'Update Section' : 'Create Section'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      {toastMsg && (
        <div className="lg-toast">
          <span>✓</span> {toastMsg}
        </div>
      )}
    </div>
  )
}
