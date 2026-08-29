import { Link, useParams } from 'react-router-dom'
import { Badge, PageHeader, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function ProfileDetail(){
  const {id}=useParams()
  const {profiles,debriefs,audit}=useDemo()
  const p=profiles.find(x=>x.id===id)
  if(!p)return <div className="card p-6 text-sm text-muted">Profile not found.</div>

  const linked= p.debriefIds.map(did=>debriefs.find(d=>d.id===did)).filter(Boolean)
  const timeline=audit.filter(event=>event.entityId===p.id).slice(0,8)

  return <>
    <PageHeader eyebrow={`${p.role} · ${p.base}`} title={p.name} description="Trainer/checker development history linked to source training-sortie and assessment-flight records. AI organizes evidence but does not alter assessment outcomes or trainer-owned scores."/>

    <div className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
      <div className="space-y-4">
        <SectionCard title="Development intelligence" description="Existing trainer/checker-maintained development indicators">
          <div className="space-y-4">{p.skills.map(s=><div key={s.name}><div className="mb-2 flex justify-between"><div className="text-xs font-semibold text-ink">{s.name}</div><Badge tone={s.trend==='Watch'?'accent':s.trend==='Improving'?'success':'muted'}>{s.trend}</Badge></div><div className="h-2 overflow-hidden rounded-full bg-panel"><div className={`h-full rounded-full ${s.trend==='Watch'?'bg-accent':'bg-success'}`} style={{width:`${s.score}%`}}/></div><div className="mt-1 text-right text-[9px] text-faint">{s.score}/100 · trainer/checker maintained</div></div>)}</div>
        </SectionCard>

        <SectionCard title="Profile audit" description="Administrative linking is traceable">
          <div className="space-y-2">{timeline.map(event=><div key={event.id} className="rounded-xl border border-line/55 bg-panel/35 p-3"><div className="text-[10px] font-semibold text-ink">{event.action}</div><div className="mt-1 text-[9px] leading-4 text-muted">{event.detail}</div><div className="mt-1 text-[8px] text-faint">{event.actor} · {event.time}</div></div>)}{!timeline.length&&<div className="text-xs text-muted">No new profile-linking actions recorded yet.</div>}</div>
        </SectionCard>
      </div>

      <SectionCard title="Linked training & assessment history" description="Every development observation remains traceable to its source record">
        <div className="space-y-2">{linked.map(d=>d?<Link to={`/debriefs/${d.id}`} key={d.id} className="block rounded-xl border border-line/60 bg-panel/40 p-3 hover:border-accent/30"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-semibold text-ink">{d.title}</div><div className="mt-1 text-[9px] text-faint">{d.type} · {d.date} · {d.id}</div></div><Badge tone={d.type==='Assessment Flight'?'purple':'accent'}>{d.type}</Badge></div><div className="mt-2 text-xs leading-5 text-muted">{d.aiSummary||d.rawNotes}</div>{d.trainerCheckerNotes&&<div className="mt-2 rounded-lg bg-success/5 px-2.5 py-2 text-[9px] leading-4 text-muted"><span className="font-semibold text-success">Trainer/checker:</span> {d.trainerCheckerNotes}</div>}</Link>:null)}{!linked.length&&<div className="rounded-xl border border-dashed border-line p-6 text-center text-xs text-muted">No training or assessment records linked yet.</div>}</div>
      </SectionCard>
    </div>
  </>
}
