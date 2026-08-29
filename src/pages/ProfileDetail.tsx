import { ArrowRight, CalendarCheck2, GraduationCap, ShieldCheck, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, EmptyState, PageHeader, Progress, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function ProfileDetail(){
  const {id}=useParams()
  const {profiles,debriefs,audit}=useDemo()
  const p=profiles.find(x=>x.id===id)
  if(!p)return <EmptyState icon={<UserRound size={18}/>} title="Profile not found" description="This training profile is not available in the current demo state."/>

  const linked=p.debriefIds.map(did=>debriefs.find(d=>d.id===did)).filter(Boolean)
  const timeline=audit.filter(event=>event.entityId===p.id).slice(0,8)
  const average=Math.round(p.skills.reduce((sum,s)=>sum+s.score,0)/p.skills.length)
  const watch=p.skills.filter(s=>s.trend==='Watch').length

  return <>
    <PageHeader
      eyebrow={`${p.role} · ${p.base}`}
      title={p.name}
      description="Trainer/checker development history linked directly to source training-sortie and assessment-flight records. AI organizes evidence but does not alter assessment outcomes or trainer-owned scores."
      actions={<Badge tone={watch?'accent':'success'}>{watch?`${watch} watch area${watch===1?'':'s'}`:'Development on track'}</Badge>}
    />

    <div className="mb-4 grid gap-3 sm:grid-cols-4">
      <div className="card p-3.5"><div className="data-label">Development average</div><div className="mt-1.5 text-xl font-semibold text-ink">{average}/100</div></div>
      <div className="card p-3.5"><div className="data-label">Linked records</div><div className="mt-1.5 text-xl font-semibold text-ink">{linked.length}</div></div>
      <div className="card p-3.5"><div className="data-label">Last assessment</div><div className="mt-1.5 text-sm font-semibold text-ink">{p.lastAssessment}</div></div>
      <div className="card p-3.5"><div className="data-label">Watch areas</div><div className={`mt-1.5 text-xl font-semibold ${watch?'text-accent':'text-success'}`}>{watch}</div></div>
    </div>

    <div className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
      <div className="space-y-4">
        <SectionCard title="Development intelligence" description="Trainer/checker-maintained indicators — AI does not edit these scores">
          <div className="space-y-4">{p.skills.map(s=><div key={s.name}>
            <div className="mb-2 flex items-center justify-between gap-3"><div className="text-[11px] font-semibold text-ink">{s.name}</div><Badge tone={s.trend==='Watch'?'accent':s.trend==='Improving'?'success':'muted'}>{s.trend}</Badge></div>
            <div className="flex items-center gap-3"><div className="flex-1"><Progress value={s.score} tone={s.trend==='Watch'?'accent':'success'}/></div><div className="w-10 text-right text-[10px] font-semibold text-ink">{s.score}</div></div>
            <div className="mt-1 text-[8px] text-faint">Trainer/checker maintained</div>
          </div>)}</div>
        </SectionCard>

        <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
          <div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success/10 text-success"><ShieldCheck size={16}/></div><div><div className="text-sm font-semibold text-ink">Assessment ownership remains human</div><div className="mt-2 text-[10px] leading-5 text-muted">New training and assessment debriefs can be linked to this profile, but AI only organizes the supporting evidence. It does not determine scores, fitness or outcomes.</div></div></div>
        </div>

        <SectionCard title="Profile audit" description="Administrative source-record linking remains traceable">
          {timeline.length?<div className="space-y-2">{timeline.map(event=><div key={event.id} className="rounded-xl border border-line bg-panel/35 p-3"><div className="text-[10px] font-semibold text-ink">{event.action}</div><div className="mt-1 text-[9px] leading-4 text-muted">{event.detail}</div><div className="mt-1 text-[8px] text-faint">{event.actor} · {event.time}</div></div>)}</div>:<div className="text-[10px] text-muted">No new profile-linking actions recorded yet.</div>}
        </SectionCard>
      </div>

      <SectionCard title="Linked training & assessment history" description="Every development observation remains traceable to its source record">
        {linked.length?<div className="space-y-3">{linked.map(d=>d?<Link to={`/debriefs/${d.id}`} key={d.id} className="card-hover group block rounded-xl border border-line bg-panel/40 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${d.type==='Assessment Flight'?'border-purple/20 bg-purple/10 text-purple':'border-accent/20 bg-accent/10 text-accent'}`}><GraduationCap size={15}/></div><div className="min-w-0"><div className="truncate text-[11px] font-semibold text-ink group-hover:text-accent">{d.title}</div><div className="mt-1 text-[9px] text-faint">{d.type} · {d.date} · {d.id}</div></div></div>
            <Badge tone={d.type==='Assessment Flight'?'purple':'accent'}>{d.type}</Badge>
          </div>
          <div className="mt-3 text-[10px] leading-5 text-muted">{d.aiSummary||d.rawNotes}</div>
          {d.trainerCheckerNotes&&<div className="mt-3 rounded-xl border border-success/15 bg-success/5 px-3 py-2.5 text-[9px] leading-4 text-muted"><span className="font-semibold text-success">Trainer/checker:</span> {d.trainerCheckerNotes}</div>}
          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-3"><div className="inline-flex items-center gap-1.5 text-[9px] text-faint"><CalendarCheck2 size={10}/>{d.createdAt}</div><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open source <ArrowRight size={12}/></span></div>
        </Link>:null)}</div>:<EmptyState icon={<GraduationCap size={18}/>} title="No linked training records" description="Create a Training Sortie or Assessment Flight debrief and select this profile to demonstrate live linkage."/>}
      </SectionCard>
    </div>
  </>
}
