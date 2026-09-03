import { ArrowRight, BrainCircuit, CheckCircle2, Clock3, FileCheck2, SearchCheck, UsersRound, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, CustomSelect, EmptyState, PageHeader, Progress, SearchField } from '../components/ui'
import { useDemo } from '../state/DemoContext'
import type { CorrectiveActionStatus, MissionType } from '../data/types'

const actionTone=(status?:CorrectiveActionStatus)=>status==='Closed'?'success':status==='In Progress'?'accent':'danger'

export default function Lessons(){
  const {lessons,debriefs}=useDemo()
  const [q,setQ]=useState('')
  const [status,setStatus]=useState('All')
  const [category,setCategory]=useState('All')
  const [missionType,setMissionType]=useState<'All'|MissionType>('All')
  const [corrective,setCorrective]=useState<'All'|CorrectiveActionStatus>('All')
  const categories=['All',...Array.from(new Set(lessons.map(l=>l.category)))]

  const missionTypesFor=(lessonId:string)=>{
    const lesson=lessons.find(l=>l.id===lessonId)
    if(!lesson)return [] as MissionType[]
    return Array.from(new Set(lesson.sourceDebriefIds.map(id=>debriefs.find(d=>d.id===id)?.missionType).filter(Boolean))) as MissionType[]
  }

  const visible=useMemo(()=>lessons.filter(l=>{
    const missionTypes=Array.from(new Set(l.sourceDebriefIds.map(id=>debriefs.find(d=>d.id===id)?.missionType).filter(Boolean))) as MissionType[]
    return (status==='All'||l.status===status)
      &&(category==='All'||l.category===category)
      &&(missionType==='All'||missionTypes.includes(missionType))
      &&(corrective==='All'||l.correctiveActionStatus===corrective)
      &&`${l.title} ${l.summary} ${l.category}`.toLowerCase().includes(q.toLowerCase())
  }),[lessons,debriefs,q,status,category,missionType,corrective])

  const published=lessons.filter(l=>l.status==='Published').length
  const avg=lessons.length?Math.round(lessons.reduce((sum,l)=>sum+l.confidence,0)/lessons.length):0
  const openItems=lessons.filter(l=>l.status==='Published'&&l.correctiveActionStatus!=='Closed').length

  const clear=()=>{setQ('');setStatus('All');setCategory('All');setMissionType('All');setCorrective('All')}

  return <>
    <PageHeader
      eyebrow="Lessons Learned"
      title="Lessons learned intelligence"
      description="Transform debrief observations into evidence-backed learning, compare the same underlying themes across mission types, and track corrective action after human validation."
      actions={<Link to="/review" className="secondary-btn"><CheckCircle2 size={15}/>Open human review</Link>}
    />

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div className="card p-4"><div className="flex items-center justify-between"><div><div className="data-label">Published</div><div className="mt-2 text-2xl font-semibold text-ink">{published}</div><div className="mt-1 text-[10px] text-muted">Searchable organization-wide</div></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-success/10 text-success"><FileCheck2 size={16}/></div></div></div>
      <div className="card p-4"><div className="flex items-center justify-between"><div><div className="data-label">Awaiting review</div><div className="mt-2 text-2xl font-semibold text-ink">{lessons.length-published}</div><div className="mt-1 text-[10px] text-muted">AI candidates, human validation required</div></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-purple/10 text-purple"><BrainCircuit size={16}/></div></div></div>
      <div className="card p-4"><div className="flex items-center justify-between"><div><div className="data-label">Open action items</div><div className="mt-2 text-2xl font-semibold text-accent">{openItems}</div><div className="mt-1 text-[10px] text-muted">Published lessons not yet closed</div></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><Wrench size={16}/></div></div></div>
      <div className="card p-4"><div className="flex items-center justify-between"><div><div className="data-label">Average confidence</div><div className="mt-2 text-2xl font-semibold text-ink">{avg}%</div><div className="mt-1 text-[10px] text-muted">Similarity-supported candidate confidence</div></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><SearchCheck size={16}/></div></div></div>
    </div>

    <div className="card my-4 p-3.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <SearchField value={q} onChange={setQ} placeholder="Search lessons, categories or operational themes…" className="min-w-[280px] flex-1"/>
        <div className="grid grid-cols-2 gap-2 lg:flex">
          <CustomSelect value={status} onChange={setStatus} options={['All','Published','Draft']} className="lg:w-[145px]"/>
          <CustomSelect value={missionType} onChange={value=>setMissionType(value as 'All'|MissionType)} options={['All','SAR','EMS','Training','Firefighting']} className="lg:w-[160px]"/>
          <CustomSelect value={corrective} onChange={value=>setCorrective(value as 'All'|CorrectiveActionStatus)} options={['All','Open','In Progress','Closed']} className="lg:w-[160px]"/>
          <CustomSelect value={category} onChange={setCategory} options={categories} className="lg:w-[210px]" menuWidth={260}/>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-line/70 pt-3">
        {(['All','SAR','EMS','Training','Firefighting'] as const).map(m=><button key={m} onClick={()=>setMissionType(m)} className={`rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold transition ${missionType===m?'border-accent/30 bg-accent/10 text-accent':'border-line bg-panel/40 text-muted hover:text-ink'}`}>{m}</button>)}
        <span className="ml-auto self-center text-[9px] text-faint">Cross-mission filters reveal the same lesson theme across operating contexts.</span>
      </div>
    </div>

    {visible.length?<div className="grid gap-3 xl:grid-cols-2">
      {visible.map(l=>{
        const missionTypes=missionTypesFor(l.id)
        return <Link key={l.id} to={`/lessons/${l.id}`} className="card card-hover group overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><div className="text-[9px] font-semibold uppercase tracking-[.13em] text-accent">{l.category}</div><h2 className="mt-2 text-sm font-semibold leading-5 text-ink transition group-hover:text-accent">{l.title}</h2><div className="mt-1 text-[9px] text-faint">{l.id} · last seen {l.lastSeen}</div></div>
              <div className="flex shrink-0 flex-col items-end gap-2"><Badge tone={l.status==='Published'?'success':'accent'}>{l.status}</Badge>{l.status==='Published'&&l.correctiveActionStatus&&<Badge tone={actionTone(l.correctiveActionStatus)}>{l.correctiveActionStatus}</Badge>}</div>
            </div>
            <p className="mt-3 line-clamp-3 text-[11px] leading-5 text-muted">{l.summary}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">{missionTypes.map(type=><span key={type} className="rounded-lg border border-line bg-panel/45 px-2 py-1 text-[8px] font-semibold text-muted">{type}</span>)}</div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><SearchCheck size={10}/>Occurrences</div><div className="mt-1 text-base font-semibold text-ink">{l.occurrences}</div></div>
              <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><UsersRound size={10}/>Crews</div><div className="mt-1 text-base font-semibold text-ink">{l.crews}</div></div>
              <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><Clock3 size={10}/>Evidence</div><div className="mt-1 text-base font-semibold text-ink">{l.sourceDebriefIds.length}</div></div>
            </div>

            <div className="mt-4"><div className="mb-2 flex items-center justify-between text-[9px]"><span className="text-faint">AI confidence</span><span className="font-semibold text-accent">{l.confidence}%</span></div><Progress value={l.confidence} tone={l.confidence>=90?'success':'accent'}/></div>
          </div>
          <div className="flex items-center justify-between border-t border-line bg-panel/30 px-4 py-3"><span className="text-[9px] text-muted">{l.status==='Published'?`Corrective action: ${l.correctiveActionStatus||'Open'}`:'Human validation required before publication'}</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Inspect lesson <ArrowRight size={12}/></span></div>
        </Link>
      })}
    </div>:<EmptyState icon={<BrainCircuit size={18}/>} title="No lessons match these filters" description="Try a broader search or clear the status, mission-type, corrective-action or category filters." action={<button onClick={clear} className="secondary-btn">Clear filters</button>}/>} 
  </>
}
