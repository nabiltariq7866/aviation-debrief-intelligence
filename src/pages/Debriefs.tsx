import { ArrowRight, CalendarDays, ClipboardCheck, MapPin, Plane, Plus, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, CustomSelect, EmptyState, PageHeader, SearchField } from '../components/ui'
import { useDemo } from '../state/DemoContext'
import type { DebriefType } from '../data/types'

const typeTone=(type:DebriefType)=>type==='Post-Mission'?'info':type==='Training Sortie'?'accent':'purple'
const statusTone=(status:string)=>status==='Published'?'success':status==='Review Required'?'accent':status==='AI Structured'?'purple':'muted'

export default function Debriefs(){
  const {debriefs}=useDemo()
  const [q,setQ]=useState('')
  const [type,setType]=useState<'All'|DebriefType>('All')
  const [status,setStatus]=useState('All')

  const visible=useMemo(()=>debriefs.filter(d=>(type==='All'||d.type===type)&&(status==='All'||d.status===status)&&`${d.title} ${d.mission} ${d.crew.join(' ')} ${d.aircraft} ${d.location}`.toLowerCase().includes(q.toLowerCase())),[debriefs,q,type,status])

  const counts={
    post:debriefs.filter(d=>d.type==='Post-Mission').length,
    training:debriefs.filter(d=>d.type==='Training Sortie').length,
    assessment:debriefs.filter(d=>d.type==='Assessment Flight').length,
    review:debriefs.filter(d=>d.status==='Review Required').length,
  }

  return <>
    <PageHeader
      eyebrow="Debrief Operations"
      title="Mission, training & assessment debriefs"
      description="Capture honest individual and team observations, keep the human-authored source intact, and move each record into the operational learning workflow."
      actions={<Link to="/debriefs/new" className="primary-btn"><Plus size={15}/>New debrief</Link>}
    />

    <div className="card mb-4 p-3.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <SearchField value={q} onChange={setQ} placeholder="Search mission, crew, aircraft or debrief…" className="min-w-[280px] flex-1"/>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
          <CustomSelect value={type} onChange={value=>setType(value as 'All'|DebriefType)} options={['All','Post-Mission','Training Sortie','Assessment Flight']} className="sm:w-[185px]"/>
          <CustomSelect value={status} onChange={setStatus} options={['All','Draft','Review Required','Published']} className="sm:w-[165px]"/>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line/70 pt-3 text-[10px] text-muted">
        <span><strong className="mr-1 text-ink">{debriefs.length}</strong> total records</span>
        <span><strong className="mr-1 text-info">{counts.post}</strong> post-mission</span>
        <span><strong className="mr-1 text-accent">{counts.training}</strong> training</span>
        <span><strong className="mr-1 text-purple">{counts.assessment}</strong> assessment</span>
        <span className="ml-auto"><strong className="mr-1 text-accent">{counts.review}</strong> need review</span>
      </div>
    </div>

    {visible.length?<div className="grid gap-3 xl:grid-cols-2">
      {visible.map(d=><Link key={d.id} to={`/debriefs/${d.id}`} className="card card-hover group relative overflow-hidden p-4">
        <span className={`absolute inset-y-4 left-0 w-[2px] rounded-r-full ${d.type==='Post-Mission'?'bg-info':d.type==='Training Sortie'?'bg-accent':'bg-purple'}`}/>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={typeTone(d.type)}>{d.type}</Badge>
              <span className="text-[9px] font-semibold text-faint">{d.id}</span>
            </div>
            <h2 className="mt-3 truncate text-[15px] font-semibold tracking-[-.02em] text-ink transition group-hover:text-accent">{d.title}</h2>
            <div className="mt-1 text-[10px] text-faint">{d.mission} · submitted by {d.createdBy}</div>
          </div>
          <Badge tone={statusTone(d.status)}>{d.status}</Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><Plane size={10}/>Aircraft</div><div className="mt-1 text-[10px] font-semibold text-ink">{d.aircraft}</div></div>
          <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><MapPin size={10}/>Location</div><div className="mt-1 truncate text-[10px] font-semibold text-ink">{d.location}</div></div>
          <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><UsersRound size={10}/>Crew</div><div className="mt-1 truncate text-[10px] font-semibold text-ink">{d.crew.length} people</div></div>
          <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><CalendarDays size={10}/>Date</div><div className="mt-1 text-[10px] font-semibold text-ink">{d.date}</div></div>
        </div>

        <div className="mt-4 rounded-xl bg-panel/45 p-3.5">
          <div className="line-clamp-2 text-[11px] leading-5 text-muted">{d.aiSummary||d.rawNotes}</div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line/60 pt-3">
          <div className="flex items-center gap-2 text-[9px] text-faint"><ClipboardCheck size={11}/>{d.observations.length} structured observations{d.similarDebriefIds?.length?` · ${d.similarDebriefIds.length} similar records`:''}</div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open record <ArrowRight size={12}/></span>
        </div>
      </Link>)}
    </div>:<EmptyState icon={<ClipboardCheck size={18}/>} title="No debriefs match these filters" description="Clear the search or adjust the custom filters to see more mission, training and assessment records." action={<button onClick={()=>{setQ('');setType('All');setStatus('All')}} className="secondary-btn">Clear filters</button>}/>} 
  </>
}
