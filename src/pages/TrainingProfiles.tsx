import { ArrowRight, CalendarCheck2, GraduationCap, MapPin, Search, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, EmptyState, PageHeader, Progress, SearchField } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function TrainingProfiles(){
  const {profiles,debriefs}=useDemo()
  const [q,setQ]=useState('')
  const visible=useMemo(()=>profiles.filter(p=>`${p.name} ${p.role} ${p.base}`.toLowerCase().includes(q.toLowerCase())),[profiles,q])
  const linkedRecords=profiles.reduce((sum,p)=>sum+p.debriefIds.length,0)
  const watchSkills=profiles.reduce((sum,p)=>sum+p.skills.filter(s=>s.trend==='Watch').length,0)

  return <>
    <PageHeader
      eyebrow="Crew Development"
      title="Training profiles"
      description="Connect training-sortie and assessment-flight observations to individual development histories so trainers and checkers can track progress while keeping assessment judgement human-owned."
      actions={<Badge tone="purple"><GraduationCap size={11}/>{profiles.length} active profiles</Badge>}
    />

    <div className="grid gap-3 sm:grid-cols-3">
      <div className="card p-4"><div className="data-label">Profiles</div><div className="mt-2 text-2xl font-semibold text-ink">{profiles.length}</div><div className="mt-1 text-[10px] text-muted">Crew members with linked learning history</div></div>
      <div className="card p-4"><div className="data-label">Linked records</div><div className="mt-2 text-2xl font-semibold text-ink">{linkedRecords}</div><div className="mt-1 text-[10px] text-muted">Training and assessment evidence connections</div></div>
      <div className="card p-4"><div className="data-label">Watch indicators</div><div className="mt-2 text-2xl font-semibold text-accent">{watchSkills}</div><div className="mt-1 text-[10px] text-muted">Trainer/checker-maintained development areas</div></div>
    </div>

    <div className="card my-4 p-3.5"><SearchField value={q} onChange={setQ} placeholder="Search crew member, role or base…"/></div>

    {visible.length?<div className="grid gap-4 xl:grid-cols-3">
      {visible.map(p=>{
        const linked=p.debriefIds.map(id=>debriefs.find(d=>d.id===id)).filter(Boolean)
        const avg=Math.round(p.skills.reduce((sum,s)=>sum+s.score,0)/p.skills.length)
        return <Link key={p.id} to={`/training-profiles/${p.id}`} className="card card-hover group overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-purple/20 bg-purple/10 text-purple"><UserRound size={19}/></div>
              <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-ink transition group-hover:text-accent">{p.name}</div><div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-faint"><span>{p.role}</span><span className="inline-flex items-center gap-1"><MapPin size={9}/>{p.base}</span></div></div>
              <Badge tone={p.skills.some(s=>s.trend==='Watch')?'accent':'success'}>{p.skills.some(s=>s.trend==='Watch')?'Development watch':'On track'}</Badge>
            </div>

            <div className="mt-4 rounded-xl border border-line bg-panel/40 p-3">
              <div className="mb-2 flex items-center justify-between"><div className="text-[10px] font-semibold text-ink">Development overview</div><div className="text-[10px] font-semibold text-accent">{avg}/100</div></div>
              <Progress value={avg} tone={avg>=85?'success':'accent'}/>
              <div className="mt-3 space-y-2.5">{p.skills.map(s=><div key={s.name}><div className="mb-1 flex items-center justify-between gap-3 text-[9px]"><span className="truncate text-muted">{s.name}</span><span className={`font-semibold ${s.trend==='Watch'?'text-accent':s.trend==='Improving'?'text-success':'text-ink'}`}>{s.score} · {s.trend}</span></div><Progress value={s.score} tone={s.trend==='Watch'?'accent':'success'}/></div>)}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><GraduationCap size={10}/>Linked records</div><div className="mt-1 text-base font-semibold text-ink">{linked.length}</div></div>
              <div className="panel-soft p-2.5"><div className="flex items-center gap-1.5 text-[9px] text-faint"><CalendarCheck2 size={10}/>Last assessment</div><div className="mt-1 truncate text-[10px] font-semibold text-ink">{p.lastAssessment}</div></div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line bg-panel/30 px-4 py-3"><span className="text-[9px] text-muted">Source records remain traceable</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open profile <ArrowRight size={12}/></span></div>
        </Link>
      })}
    </div>:<EmptyState icon={<Search size={18}/>} title="No profiles found" description="Try a different crew member, role or operating base." action={<button onClick={()=>setQ('')} className="secondary-btn">Clear search</button>}/>} 
  </>
}
