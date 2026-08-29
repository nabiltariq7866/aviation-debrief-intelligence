import {
  Activity,
  BarChart3,
  BookOpen,
  BrainCircuit,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  PanelLeftClose,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRoundCheck,
  UsersRound,
  X,
} from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { CustomSelect } from './ui'
import { useDemo } from '../state/DemoContext'
import type { Persona } from '../data/types'

const nav=[
  {label:'Overview',items:[
    {label:'Command Center',to:'/dashboard',icon:LayoutDashboard},
  ]},
  {label:'Learning Intelligence',items:[
    {label:'Debriefs',to:'/debriefs',icon:ClipboardList},
    {label:'Lessons Learned',to:'/lessons',icon:BrainCircuit},
    {label:'Trend Intelligence',to:'/trends',icon:BarChart3},
    {label:'Knowledge Base',to:'/knowledge',icon:BookOpen},
  ]},
  {label:'Development & Review',items:[
    {label:'Training Profiles',to:'/training-profiles',icon:GraduationCap},
    {label:'Human Review',to:'/review',icon:UserRoundCheck},
  ]},
  {label:'Governance',items:[
    {label:'Audit & Traceability',to:'/audit',icon:ShieldCheck},
  ]},
  {label:'Demo',items:[
    {label:'Extended Capabilities',to:'/extensions',icon:Sparkles},
    {label:'Settings',to:'/settings',icon:Settings2},
  ]},
]

export default function Layout(){
  const navigate=useNavigate()
  const location=useLocation()
  const {debriefs,lessons,trends,profiles,persona,setPersona,currentActor}=useDemo()
  const [mobileOpen,setMobileOpen]=useState(false)
  const [collapsed,setCollapsed]=useState(false)
  const [query,setQuery]=useState('')
  const [theme,setTheme]=useState<'dark'|'light'>(()=>(localStorage.getItem('aviation-theme') as 'dark'|'light')||'dark')

  useEffect(()=>{
    document.documentElement.classList.remove('dark','light')
    document.documentElement.classList.add(theme)
    localStorage.setItem('aviation-theme',theme)
  },[theme])

  useEffect(()=>{
    setMobileOpen(false)
    setQuery('')
  },[location.pathname])

  const activeLabel=useMemo(()=>nav.flatMap(group=>group.items).find(item=>location.pathname.startsWith(item.to))?.label||'Operational Learning',[location.pathname])

  const searchResults=useMemo(()=>{
    const q=query.trim().toLowerCase()
    if(!q)return []
    const rows=[
      ...debriefs.filter(d=>`${d.id} ${d.title} ${d.mission} ${d.crew.join(' ')}`.toLowerCase().includes(q)).map(d=>({type:'Debrief',label:d.title,meta:`${d.id} · ${d.type}`,to:`/debriefs/${d.id}`})),
      ...lessons.filter(l=>`${l.id} ${l.title} ${l.category}`.toLowerCase().includes(q)).map(l=>({type:'Lesson',label:l.title,meta:`${l.id} · ${l.category}`,to:`/lessons/${l.id}`})),
      ...profiles.filter(p=>`${p.id} ${p.name} ${p.role}`.toLowerCase().includes(q)).map(p=>({type:'Profile',label:p.name,meta:`${p.role} · ${p.base}`,to:`/training-profiles/${p.id}`})),
      ...trends.filter(t=>`${t.id} ${t.title} ${t.category}`.toLowerCase().includes(q)).map(t=>({type:'Trend',label:t.title,meta:`${t.category} · ${t.occurrences} occurrences`,to:'/trends'})),
    ]
    return rows.slice(0,7)
  },[query,debriefs,lessons,profiles,trends])

  const sidebar=<aside className={`flex h-full flex-col border-r border-line bg-surface/95 backdrop-blur-xl transition-all ${collapsed?'w-[86px]':'w-[264px]'}`}>
    <div className={`relative flex h-[76px] items-center border-b border-line px-4 ${collapsed?'justify-center':'justify-between'}`}>
      <div className={`flex min-w-0 items-center ${collapsed?'justify-center':'gap-3'}`}>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
          <Activity size={18}/>
        </div>
        {!collapsed&&<div className="min-w-0"><div className="truncate text-sm font-semibold tracking-[-.02em] text-ink">AeroLearn AI</div><div className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[.16em] text-faint">Operational Learning</div></div>}
      </div>
      <button onClick={()=>setCollapsed(v=>!v)} className={`hidden h-8 w-8 items-center justify-center rounded-lg text-faint transition hover:bg-panel hover:text-ink lg:flex ${collapsed?'absolute -right-4 top-[22px] z-10 rotate-180 border border-line bg-surface shadow-lg':''}`}><PanelLeftClose size={16}/></button>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {nav.map(group=><div key={group.label} className="mb-5 last:mb-0">
        {!collapsed&&<div className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[.18em] text-faint">{group.label}</div>}
        <div className="space-y-1">
          {group.items.map(item=>{
            const Icon=item.icon
            return <NavLink
              key={item.to}
              to={item.to}
              title={collapsed?item.label:undefined}
              className={({isActive})=>`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${isActive?'sidebar-nav-active text-accent':'border-transparent text-muted hover:bg-panel hover:text-ink'} ${collapsed?'justify-center px-0':''}`}
            >
              <Icon size={17} className="shrink-0"/>
              {!collapsed&&<span className="truncate">{item.label}</span>}
            </NavLink>
          })}
        </div>
      </div>)}
    </nav>

    <div className="border-t border-line p-3">
      <div className={`rounded-xl border border-line bg-panel/65 ${collapsed?'p-2':'p-3'}`}>
        {collapsed?<div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-[color:var(--accent-hover)] text-[#0B0B0D]"><UsersRound size={16}/></div>:<>
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-[color:var(--accent-hover)] text-[#0B0B0D]"><UsersRound size={16}/></div>
            <div className="min-w-0"><div className="truncate text-xs font-semibold text-ink">{currentActor}</div><div className="mt-0.5 text-[9px] text-faint">{persona} demo persona</div></div>
          </div>
          <div className="mt-3 border-t border-line/70 pt-3 text-[9px] leading-4 text-muted"><span className="font-semibold text-success">Safety boundary:</span> AI organizes knowledge; qualified humans retain operational and assessment decisions.</div>
        </>}
      </div>
    </div>
  </aside>

  return <div className="min-h-screen text-ink">
    <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
    {mobileOpen&&<>
      <button className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden" onClick={()=>setMobileOpen(false)}/>
      <div className="fixed inset-y-0 left-0 z-50 lg:hidden">{sidebar}<button onClick={()=>setMobileOpen(false)} className="absolute right-3 top-3 icon-btn h-8 w-8"><X size={15}/></button></div>
    </>}

    <div className={`min-h-screen transition-all ${collapsed?'lg:pl-[86px]':'lg:pl-[264px]'}`}>
      <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-line bg-[color:var(--bg-primary)]/90 px-4 backdrop-blur-xl md:px-6">
        <button onClick={()=>setMobileOpen(true)} className="icon-btn lg:hidden"><Menu size={17}/></button>
        <div className="hidden min-w-[240px] flex-1 md:block">
          <div className="label truncate">AeroLearn / {activeLabel}</div>
          <div className="mt-1 truncate text-xs text-muted">Human-authored evidence connected to organization-wide learning.</div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden w-[360px] xl:block">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"/>
            <input value={query} onChange={e=>setQuery(e.target.value)} className="field h-10 pl-10" placeholder="Search debriefs, lessons, trends, profiles…"/>
            {searchResults.length>0&&<div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-line bg-elevated p-1.5" style={{boxShadow:'var(--shadow-float)'}}>
              {searchResults.map((r,index)=><button key={`${r.to}-${r.label}-${index}`} onClick={()=>{navigate(r.to);setQuery('')}} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-panel">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent"><Search size={13}/></div>
                <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-ink">{r.label}</div><div className="mt-0.5 truncate text-[9px] text-faint">{r.type} · {r.meta}</div></div>
              </button>)}
            </div>}
          </div>

          <button className="icon-btn" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label="Toggle theme">{theme==='dark'?<Sun size={16}/>:<Moon size={16}/>}</button>

          <div className="hidden w-[185px] sm:block">
            <CustomSelect
              size="sm"
              value={persona}
              onChange={value=>setPersona(value as Persona)}
              options={[
                {value:'Crew Member',label:'Crew Member',description:'Read & submit learning'},
                {value:'Trainer',label:'Trainer',description:'Review & validate'},
                {value:'Checker',label:'Checker',description:'Review & validate'},
              ]}
              menuWidth={220}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1680px] p-4 md:p-6 xl:p-7">
        <Outlet/>
      </main>
    </div>
  </div>
}
