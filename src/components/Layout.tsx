import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  ChevronLeft,
  ClipboardList,
  FileClock,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UsersRound,
  X,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useDemo } from '../state/DemoContext'
import type { Persona } from '../data/types'

const nav=[
  {label:'Command Center',to:'/dashboard',icon:LayoutDashboard},
  {label:'Debriefs',to:'/debriefs',icon:ClipboardList},
  {label:'Lessons Learned',to:'/lessons',icon:BrainCircuit},
  {label:'Trend Intelligence',to:'/trends',icon:BarChart3},
  {label:'Knowledge Base',to:'/knowledge',icon:BookOpen},
  {label:'Training Profiles',to:'/training-profiles',icon:GraduationCap},
  {label:'Human Review',to:'/review',icon:ShieldCheck},
  {label:'Audit & Traceability',to:'/audit',icon:FileClock},
  {label:'Extended Capabilities',to:'/extensions',icon:Sparkles},
  {label:'Settings',to:'/settings',icon:Settings},
]

const personas:Persona[]=['Crew Member','Trainer','Checker']

export default function Layout(){
  const navigate=useNavigate()
  const {debriefs,lessons,trends,profiles,persona,setPersona,currentActor}=useDemo()
  const [mobile,setMobile]=useState(false)
  const [query,setQuery]=useState('')
  const [theme,setTheme]=useState<'dark'|'light'>(()=>(localStorage.getItem('aviation-theme') as 'dark'|'light')||'dark')

  useEffect(()=>{
    document.documentElement.classList.remove('dark','light')
    document.documentElement.classList.add(theme)
    localStorage.setItem('aviation-theme',theme)
  },[theme])

  const results=useMemo(()=>{
    if(!query.trim())return []
    const q=query.toLowerCase()
    return [
      ...debriefs.filter(d=>`${d.id} ${d.title} ${d.mission} ${d.rawNotes}`.toLowerCase().includes(q)).slice(0,3).map(d=>({label:d.title,sub:`Debrief · ${d.id}`,to:`/debriefs/${d.id}`})),
      ...lessons.filter(l=>`${l.id} ${l.title} ${l.category}`.toLowerCase().includes(q)).slice(0,3).map(l=>({label:l.title,sub:`Lesson · ${l.id}`,to:`/lessons/${l.id}`})),
      ...trends.filter(t=>`${t.id} ${t.title} ${t.category}`.toLowerCase().includes(q)).slice(0,2).map(t=>({label:t.title,sub:`Trend · ${t.id}`,to:'/trends'})),
      ...profiles.filter(p=>`${p.id} ${p.name} ${p.role}`.toLowerCase().includes(q)).slice(0,2).map(p=>({label:p.name,sub:`Training profile · ${p.id}`,to:`/training-profiles/${p.id}`})),
    ].slice(0,8)
  },[query,debriefs,lessons,trends,profiles])

  return <div className="min-h-screen bg-[var(--bg-primary)]">
    <aside className={`fixed inset-y-0 left-0 z-50 w-[250px] border-r border-line/70 bg-surface transition lg:translate-x-0 ${mobile?'translate-x-0':'-translate-x-full'}`}>
      <div className="flex h-16 items-center justify-between border-b border-line/60 px-4">
        <div><div className="text-sm font-semibold tracking-tight text-ink">AeroLearn AI</div><div className="mt-0.5 text-[9px] uppercase tracking-[.15em] text-faint">Operational Learning</div></div>
        <button onClick={()=>setMobile(false)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-panel lg:hidden"><X size={16}/></button>
      </div>

      <div className="px-3 py-4">
        <div className="mb-3 px-2 text-[9px] font-bold uppercase tracking-[.16em] text-faint">Learning Intelligence</div>
        <nav className="space-y-1">{nav.map(item=>{const Icon=item.icon;return <NavLink key={item.to} to={item.to} onClick={()=>setMobile(false)} className={({isActive})=>`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${isActive?'border-accent/20 bg-accent/10 text-accent':'border-transparent text-muted hover:bg-panel hover:text-ink'}`}><Icon size={16}/>{item.label}</NavLink>})}</nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-line/60 p-3">
        <div className="rounded-xl bg-panel/60 p-3"><div className="text-xs font-semibold text-ink">Safety boundary</div><div className="mt-1 text-[10px] leading-4 text-muted">AI organizes knowledge. Qualified humans retain all operational, training and safety-critical decisions.</div></div>
      </div>
    </aside>

    <div className="lg:pl-[250px]">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line/70 bg-[color:var(--bg-primary)]/95 px-4 backdrop-blur-xl lg:px-6">
        <button onClick={()=>setMobile(true)} className="grid h-9 w-9 place-items-center rounded-xl text-muted hover:bg-panel lg:hidden"><Menu size={17}/></button>
        <button className="hidden h-9 w-9 place-items-center rounded-xl text-muted hover:bg-panel lg:grid"><ChevronLeft size={16}/></button>
        <div className="hidden flex-1 text-xs text-muted md:block">Turning every debrief into accessible operational knowledge.</div>

        <div className="relative w-full max-w-[390px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} className="field h-9 pl-9 text-xs" placeholder="Search debriefs, lessons, trends, profiles…"/>
          {results.length>0&&<div className="absolute right-0 top-11 w-full overflow-hidden rounded-xl border border-line bg-elevated shadow-2xl">{results.map(r=><button key={`${r.to}-${r.label}-${r.sub}`} onClick={()=>{navigate(r.to);setQuery('')}} className="block w-full border-b border-line/50 px-3 py-2.5 text-left last:border-0 hover:bg-panel"><div className="text-xs font-semibold text-ink">{r.label}</div><div className="mt-0.5 text-[9px] text-faint">{r.sub}</div></button>)}</div>}
        </div>

        <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted hover:text-ink">{theme==='dark'?<Sun size={16}/>:<Moon size={16}/>}</button>

        <div className="hidden items-center gap-2 rounded-xl border border-line bg-surface px-2 py-1.5 md:flex">
          <UsersRound size={15} className="text-accent"/>
          <div className="min-w-[104px]"><div className="text-[9px] font-semibold text-ink">{currentActor}</div><select value={persona} onChange={e=>setPersona(e.target.value as Persona)} className="mt-0.5 w-full border-0 bg-transparent p-0 text-[8px] text-faint outline-none">{personas.map(item=><option key={item} value={item}>{item}</option>)}</select></div>
        </div>
      </header>

      <main className="px-4 py-5 lg:px-6"><Outlet/></main>
    </div>
  </div>
}
