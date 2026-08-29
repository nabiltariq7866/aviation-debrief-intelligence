import { CheckCircle2, ShieldCheck, UsersRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, PageHeader, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function LessonDetail(){
  const {id}=useParams()
  const {lessons,debriefs,publishLesson,persona,currentActor,audit,profiles,acknowledgements,acknowledgeLesson}=useDemo()
  const l=lessons.find(x=>x.id===id)
  if(!l)return <div className="card p-6 text-sm text-muted">Lesson not found.</div>

  const canPublish=persona==='Trainer'||persona==='Checker'
  const timeline=audit.filter(event=>event.entityId===l.id).slice(0,8)
  const acknowledgedProfiles=profiles.filter(profile=>acknowledgements.some(a=>a.lessonId===l.id&&a.profileId===profile.id))

  return <>
    <PageHeader
      eyebrow={`${l.category} · ${l.id}`}
      title={l.title}
      description={l.summary}
      actions={l.status==='Draft'
        ?<button disabled={!canPublish} onClick={()=>publishLesson(l.id)} className="primary-btn"><CheckCircle2 size={15}/>Validate & publish</button>
        :<Badge tone="success">Published</Badge>}
    />

    <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <SectionCard title="Supporting evidence" description="Every lesson remains traceable to the crew, training and assessment observations that support it">
          <div className="space-y-2">{l.sourceDebriefIds.map(sid=>{
            const d=debriefs.find(x=>x.id===sid)
            return d?<Link to={`/debriefs/${sid}`} key={sid} className="block rounded-xl border border-line/60 bg-panel/40 p-3 hover:border-accent/30"><div className="text-xs font-semibold text-ink">{d.title}</div><div className="mt-1 text-[9px] text-faint">{d.id} · {d.type} · {d.date} · {d.crew.join(', ')}</div><div className="mt-2 line-clamp-2 text-[10px] leading-4 text-muted">{d.aiSummary||d.rawNotes}</div></Link>:<div key={sid} className="rounded-xl border border-line/60 p-3 text-xs text-muted">Historical evidence reference {sid}</div>
          })}</div>
        </SectionCard>

        <SectionCard title="Knowledge distribution" description="Once published, this lesson becomes searchable across the wider organization">
          <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-panel/50 p-3"><div className="text-[9px] text-faint">Occurrences</div><div className="mt-1 text-xl font-semibold text-ink">{l.occurrences}</div></div><div className="rounded-xl bg-panel/50 p-3"><div className="text-[9px] text-faint">Crews</div><div className="mt-1 text-xl font-semibold text-ink">{l.crews}</div></div><div className="rounded-xl bg-panel/50 p-3"><div className="text-[9px] text-faint">Confidence</div><div className="mt-1 text-xl font-semibold text-accent">{l.confidence}%</div></div></div>
        </SectionCard>

        {l.status==='Published'&&<SectionCard title="Acknowledgement tracking" description="Optional extensive demo capability: show which crew profiles have acknowledged the published lesson">
          <div className="grid gap-2 sm:grid-cols-2">{profiles.map(profile=>{
            const acknowledged=acknowledgements.some(a=>a.lessonId===l.id&&a.profileId===profile.id)
            return <div key={profile.id} className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-panel/35 p-3"><div><div className="text-xs font-semibold text-ink">{profile.name}</div><div className="mt-1 text-[9px] text-faint">{profile.role} · {profile.base}</div></div>{acknowledged?<Badge tone="success">Acknowledged</Badge>:<button onClick={()=>acknowledgeLesson(l.id,profile.id)} className="secondary-btn text-[10px]">Mark acknowledged</button>}</div>
          })}</div>
          <div className="mt-3 text-[9px] text-faint">{acknowledgedProfiles.length} of {profiles.length} profiles acknowledged in this demo.</div>
        </SectionCard>}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck size={16} className="text-success"/>Human validation</div>
          <div className="mt-2 text-xs leading-5 text-muted">{l.safetyNote}</div>
          <div className="mt-3 text-[9px] text-faint">Current persona: {currentActor} · {persona}</div>
          {l.status==='Draft'&&!canPublish&&<div className="mt-2 text-[10px] font-medium text-purple">Crew persona can inspect evidence but cannot publish the lesson.</div>}
        </div>

        <div className="card p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-faint">Timeline</div>
          <div className="mt-3 space-y-3 text-xs text-muted"><div className="flex justify-between"><span>First seen</span><span className="font-semibold text-ink">{l.firstSeen}</span></div><div className="flex justify-between"><span>Last seen</span><span className="font-semibold text-ink">{l.lastSeen}</span></div><div className="flex justify-between"><span>Status</span><span className="font-semibold text-ink">{l.status}</span></div></div>
        </div>

        <SectionCard title="Audit history" description="AI actions and human actions are explicitly separated">
          <div className="space-y-2">{timeline.map(event=><div key={event.id} className="rounded-xl border border-line/55 bg-panel/35 p-3"><div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${event.tone==='success'?'bg-success':event.tone==='purple'?'bg-purple':'bg-accent'}`}/><div className="text-[10px] font-semibold text-ink">{event.action}</div></div><div className="mt-1 text-[9px] leading-4 text-muted">{event.detail}</div><div className="mt-1 text-[8px] text-faint">{event.actor} · {event.role} · {event.time}</div></div>)}{!timeline.length&&<div className="text-xs text-muted">No audit history yet.</div>}</div>
        </SectionCard>
      </div>
    </div>
  </>
}
