import { ArrowRight, CheckCircle2, Clock3, FileSearch2, ShieldCheck, UsersRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, EmptyState, PageHeader, Progress, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function LessonDetail(){
  const {id}=useParams()
  const {lessons,debriefs,publishLesson,persona,currentActor,audit,profiles,acknowledgements,acknowledgeLesson}=useDemo()
  const l=lessons.find(x=>x.id===id)
  if(!l)return <EmptyState icon={<FileSearch2 size={18}/>} title="Lesson not found" description="This knowledge item is not available in the current demo state."/>

  const canPublish=persona==='Trainer'||persona==='Checker'
  const timeline=audit.filter(event=>event.entityId===l.id).slice(0,8)
  const acknowledgedProfiles=profiles.filter(profile=>acknowledgements.some(a=>a.lessonId===l.id&&a.profileId===profile.id))

  return <>
    <PageHeader
      eyebrow={`${l.category} · ${l.id}`}
      title={l.title}
      description={l.summary}
      actions={l.status==='Draft'?<button disabled={!canPublish} onClick={()=>publishLesson(l.id)} className="primary-btn"><CheckCircle2 size={15}/>Validate & publish</button>:<Badge tone="success"><CheckCircle2 size={11}/>Published knowledge</Badge>}
    />

    <div className="mb-4 grid gap-3 sm:grid-cols-4">
      <div className="card p-3.5"><div className="data-label">Occurrences</div><div className="mt-1.5 text-xl font-semibold text-ink">{l.occurrences}</div></div>
      <div className="card p-3.5"><div className="data-label">Crews</div><div className="mt-1.5 text-xl font-semibold text-ink">{l.crews}</div></div>
      <div className="card p-3.5"><div className="data-label">Evidence records</div><div className="mt-1.5 text-xl font-semibold text-ink">{l.sourceDebriefIds.length}</div></div>
      <div className="card p-3.5"><div className="data-label">AI confidence</div><div className="mt-1.5 text-xl font-semibold text-accent">{l.confidence}%</div><div className="mt-2"><Progress value={l.confidence} tone={l.confidence>=90?'success':'accent'}/></div></div>
    </div>

    <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <SectionCard title="Supporting evidence" description="Every lesson remains traceable to the human-authored crew, training and assessment observations that support it">
          <div className="space-y-2">{l.sourceDebriefIds.map(sid=>{
            const d=debriefs.find(x=>x.id===sid)
            return d?<Link to={`/debriefs/${sid}`} key={sid} className="group flex items-start gap-3 rounded-xl border border-line bg-panel/40 p-3.5 transition hover:border-accent/30">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-accent"><FileSearch2 size={15}/></div>
              <div className="min-w-0 flex-1"><div className="text-[11px] font-semibold text-ink group-hover:text-accent">{d.title}</div><div className="mt-1 text-[9px] text-faint">{d.id} · {d.type} · {d.date} · {d.crew.join(', ')}</div><div className="mt-2 line-clamp-2 text-[10px] leading-4 text-muted">{d.aiSummary||d.rawNotes}</div></div>
              <ArrowRight size={12} className="mt-1 shrink-0 text-faint transition group-hover:text-accent"/>
            </Link>:<div key={sid} className="rounded-xl border border-line bg-panel/30 p-3 text-[10px] text-muted">Historical evidence reference {sid}</div>
          })}</div>
        </SectionCard>

        <SectionCard title="Knowledge distribution" description="Published lessons become searchable across the wider organization while remaining evidence-linked">
          <div className="rounded-xl border border-line bg-panel/40 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="text-xs font-semibold text-ink">Distribution readiness</div><div className="mt-1 text-[10px] leading-4 text-muted">{l.status==='Published'?'Human validation is complete and this lesson is available in the Knowledge Base.':'This candidate remains private to the review workflow until a Trainer or Checker validates it.'}</div></div>
              <Badge tone={l.status==='Published'?'success':'accent'}>{l.status==='Published'?'Searchable':'Validation required'}</Badge>
            </div>
          </div>
        </SectionCard>

        {l.status==='Published'&&<SectionCard title="Acknowledgement tracking" description="Optional extensive demo capability showing which crew profiles have acknowledged this published lesson">
          <div className="grid gap-2 sm:grid-cols-2">{profiles.map(profile=>{
            const acknowledged=acknowledgements.some(a=>a.lessonId===l.id&&a.profileId===profile.id)
            return <div key={profile.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-panel/35 p-3.5">
              <div className="min-w-0"><div className="truncate text-[11px] font-semibold text-ink">{profile.name}</div><div className="mt-1 text-[9px] text-faint">{profile.role} · {profile.base}</div></div>
              {acknowledged?<Badge tone="success">Acknowledged</Badge>:<button onClick={()=>acknowledgeLesson(l.id,profile.id)} className="secondary-btn h-9 min-h-0 px-3 text-[10px]">Mark acknowledged</button>}
            </div>
          })}</div>
          <div className="mt-3 text-[9px] text-faint">{acknowledgedProfiles.length} of {profiles.length} profiles acknowledged in this demo.</div>
        </SectionCard>}
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl border p-4 ${l.status==='Published'?'border-success/20 bg-success/5':'border-accent/20 bg-accent/5'}`}>
          <div className="flex items-start gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${l.status==='Published'?'bg-success/10 text-success':'bg-accent/10 text-accent'}`}><ShieldCheck size={16}/></div><div><div className="text-sm font-semibold text-ink">Human validation</div><div className="mt-2 text-[10px] leading-5 text-muted">{l.safetyNote}</div><div className="mt-3 text-[9px] text-faint">Current persona: {currentActor} · {persona}</div>{l.status==='Draft'&&!canPublish&&<div className="mt-2 rounded-lg bg-purple/10 px-2.5 py-2 text-[9px] font-medium text-purple">Crew persona can inspect evidence but cannot publish this lesson.</div>}</div></div>
        </div>

        <SectionCard title="Knowledge timeline" description="When this learning signal appeared and how current it is">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3"><div className="inline-flex items-center gap-2 text-[10px] text-muted"><Clock3 size={12}/>First seen</div><div className="text-[10px] font-semibold text-ink">{l.firstSeen}</div></div>
            <div className="flex items-center justify-between gap-3"><div className="inline-flex items-center gap-2 text-[10px] text-muted"><Clock3 size={12}/>Last seen</div><div className="text-[10px] font-semibold text-ink">{l.lastSeen}</div></div>
            <div className="flex items-center justify-between gap-3"><div className="inline-flex items-center gap-2 text-[10px] text-muted"><UsersRound size={12}/>Crews represented</div><div className="text-[10px] font-semibold text-ink">{l.crews}</div></div>
          </div>
        </SectionCard>

        <SectionCard title="Audit history" description="AI actions and human actions are explicitly separated">
          {timeline.length?<div className="space-y-2">{timeline.map(event=><div key={event.id} className="rounded-xl border border-line bg-panel/35 p-3"><div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${event.tone==='success'?'bg-success':event.tone==='purple'?'bg-purple':'bg-accent'}`}/><div className="text-[10px] font-semibold text-ink">{event.action}</div></div><div className="mt-1 text-[9px] leading-4 text-muted">{event.detail}</div><div className="mt-1 text-[8px] text-faint">{event.actor} · {event.role} · {event.time}</div></div>)}</div>:<div className="text-[10px] text-muted">No audit history yet.</div>}
        </SectionCard>
      </div>
    </div>
  </>
}
