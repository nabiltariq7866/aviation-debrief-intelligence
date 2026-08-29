import { ArrowRight, BrainCircuit, CheckCircle2, Clock3, FileCheck2, SearchCheck, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, CustomSelect, EmptyState, PageHeader, Progress, SearchField } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function Lessons(){
  const {lessons}=useDemo()
  const [q,setQ]=useState('')
  const [status,setStatus]=useState('All')
  const [category,setCategory]=useState('All')
  const categories=['All',...Array.from(new Set(lessons.map(l=>l.category)))]

  const visible=useMemo(()=>lessons.filter(l=>(status==='All'||l.status===status)&&(category==='All'||l.category===category)&&`${l.title} ${l.summary} ${l.category}`.toLowerCase().includes(q.toLowerCase())),[lessons,q,status,category])
  const published=lessons.filter(l=>l.status==='Published').length
  const avg=lessons.length?Math.round(lessons.reduce((sum,l)=>sum+l.confidence,0)/lessons.length):0

  return <>
    <PageHeader
      eyebrow="Lessons Learned"
      title="Lessons learned intelligence"
      description="Transform debrief observations into evidence-backed learning candidates, validate them with qualified humans, and distribute the published knowledge across the organization."
      actions={<Link to="/review" className="secondary-btn"><CheckCircle2 size={15}/>Open human review</Link>}
    />

    <div className="grid gap-3 sm:grid-cols-3">
      <div className="card p-4"><div className="flex items-center justify-between"><div><div className="data-label">Published</div><div className="mt-2 text-2xl font-semibold text-ink">{published}</div><div className="mt-1 text-[10px] text-muted">Searchable organization-wide</div></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-success/10 text-success"><FileCheck2 size={16}/></div></div></div>
      <div className="card p-4"><div className="flex items-center justify-between"><div><div className="data-label">Awaiting review</div><div className="mt-2 text-2xl font-semibold text-ink">{lessons.length-published}</div><div className="mt-1 text-[10px] text-muted">AI candidates, human validation required</div></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-purple/10 text-purple"><BrainCircuit size={16}/></div></div></div>
      <div className="card p-4"><div className="flex items-center justify-between"><div><div className="data-label">Average confidence</div><div className="mt-2 text-2xl font-semibold text-ink">{avg}%</div><div className="mt-1 text-[10px] text-muted">Similarity-supported candidate confidence</div></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><SearchCheck size={16}/></div></div></div>
    </div>

    <div className="card my-4 p-3.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <SearchField value={q} onChange={setQ} placeholder="Search lessons, categories or operational themes…" className="min-w-[280px] flex-1"/>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <CustomSelect value={status} onChange={setStatus} options={['All','Published','Draft']} className="sm:w-[150px]"/>
          <CustomSelect value={category} onChange={setCategory} options={categories} className="sm:w-[230px]" menuWidth={260}/>
        </div>
      </div>
    </div>

    {visible.length?<div className="grid gap-3 xl:grid-cols-2">
      {visible.map(l=><Link key={l.id} to={`/lessons/${l.id}`} className="card card-hover group overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><div className="text-[9px] font-semibold uppercase tracking-[.13em] text-accent">{l.category}</div><h2 className="mt-2 text-sm font-semibold leading-5 text-ink transition group-hover:text-accent">{l.title}</h2><div className="mt-1 text-[9px] text-faint">{l.id} · last seen {l.lastSeen}</div></div>
            <Badge tone={l.status==='Published'?'success':'accent'}>{l.status}</Badge>
          </div>
          <p className="mt-3 line-clamp-3 text-[11px] leading-5 text-muted">{l.summary}</p>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><SearchCheck size={10}/>Occurrences</div><div className="mt-1 text-base font-semibold text-ink">{l.occurrences}</div></div>
            <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><UsersRound size={10}/>Crews</div><div className="mt-1 text-base font-semibold text-ink">{l.crews}</div></div>
            <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><Clock3 size={10}/>Evidence</div><div className="mt-1 text-base font-semibold text-ink">{l.sourceDebriefIds.length}</div></div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-[9px]"><span className="text-faint">AI confidence</span><span className="font-semibold text-accent">{l.confidence}%</span></div>
            <Progress value={l.confidence} tone={l.confidence>=90?'success':'accent'}/>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-line bg-panel/30 px-4 py-3"><span className="text-[9px] text-muted">Human validation {l.status==='Published'?'complete':'required before publication'}</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Inspect lesson <ArrowRight size={12}/></span></div>
      </Link>)}
    </div>:<EmptyState icon={<BrainCircuit size={18}/>} title="No lessons match these filters" description="Try a broader search or clear the status/category filters." action={<button onClick={()=>{setQ('');setStatus('All');setCategory('All')}} className="secondary-btn">Clear filters</button>}/>} 
  </>
}
