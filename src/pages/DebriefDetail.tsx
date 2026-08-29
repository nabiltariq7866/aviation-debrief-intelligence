import { ArrowRight, BrainCircuit, Search, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, PageHeader, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function DebriefDetail(){
  const {id}=useParams()
  const {debriefs,lessons,profiles,audit,analyzeDebrief}=useDemo()
  const d=debriefs.find(x=>x.id===id)
  if(!d)return <div className="card p-6 text-sm text-muted">Debrief not found.</div>

  const linkedLesson=lessons.find(l=>l.sourceDebriefIds.includes(d.id))
  const linkedProfiles=profiles.filter(p=>d.linkedProfileIds?.includes(p.id))
  const timeline=audit.filter(e=>e.entityId===d.id||e.entityId===linkedLesson?.id).slice(0,8)

  return <>
    <PageHeader
      eyebrow={`${d.type} · ${d.id}`}
      title={d.title}
      description={`${d.mission} · ${d.aircraft} · ${d.location} · ${d.date}`}
      actions={d.status==='Draft'?<button onClick={()=>analyzeDebrief(d.id)} className="primary-btn"><Sparkles size={15}/>Run AI organization</button>:<Badge tone={d.status==='Published'?'success':'accent'}>{d.status}</Badge>}
    />

    <div className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
      <div className="space-y-4">
        <SectionCard title="Crew debrief" description="Original human-authored source remains visible and separate from AI output">
          <div className="grid gap-3 md:grid-cols-3">
            <div><div className="text-[9px] text-faint">Crew</div><div className="mt-1 text-xs font-semibold text-ink">{d.crew.join(', ')}</div></div>
            <div><div className="text-[9px] text-faint">Submitted by</div><div className="mt-1 text-xs font-semibold text-ink">{d.createdBy}</div></div>
            <div><div className="text-[9px] text-faint">Created</div><div className="mt-1 text-xs font-semibold text-ink">{d.createdAt}</div></div>
          </div>

          <div className="mt-4 rounded-xl bg-panel/55 p-4 text-xs leading-6 text-muted">{d.rawNotes}</div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-purple/15 bg-purple/5 p-3"><div className="text-[10px] font-semibold text-purple">Individual self-evaluation</div><div className="mt-2 text-xs leading-5 text-muted">{d.selfEvaluation||'No separate self-evaluation was stored in this historical seed record.'}</div></div>
            <div className="rounded-xl border border-accent/15 bg-accent/5 p-3"><div className="text-[10px] font-semibold text-accent">Team / crew evaluation</div><div className="mt-2 text-xs leading-5 text-muted">{d.teamEvaluation||d.whatWentWell}</div></div>
          </div>

          {d.type!=='Post-Mission'&&<div className="mt-3 rounded-xl border border-success/15 bg-success/5 p-3"><div className="text-[10px] font-semibold text-success">Trainer / checker observations</div><div className="mt-2 text-xs leading-5 text-muted">{d.trainerCheckerNotes||'Historical assessment/training record — trainer/checker notes remain represented in the source documentation.'}</div></div>}

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-success/15 bg-success/5 p-3"><div className="text-[10px] font-semibold text-success">What went well</div><div className="mt-2 text-xs leading-5 text-muted">{d.whatWentWell}</div></div>
            <div className="rounded-xl border border-accent/15 bg-accent/5 p-3"><div className="text-[10px] font-semibold text-accent">Could improve</div><div className="mt-2 text-xs leading-5 text-muted">{d.improve}</div></div>
          </div>
        </SectionCard>

        {d.type!=='Post-Mission'&&<SectionCard title="Individual training-profile linkage" description="Training and assessment records are attached to selected individual profiles without allowing AI to change assessment outcomes">
          {linkedProfiles.length?(
            <div className="grid gap-2 sm:grid-cols-2">{linkedProfiles.map(profile=><Link to={`/training-profiles/${profile.id}`} key={profile.id} className="rounded-xl border border-line/60 bg-panel/40 p-3 transition hover:border-accent/30"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-purple/10 text-purple"><UserRoundCheck size={14}/></div><div><div className="text-xs font-semibold text-ink">{profile.name}</div><div className="mt-0.5 text-[9px] text-faint">{profile.role} · record linked</div></div></div></Link>)}</div>
          ):<div className="text-xs text-muted">This historical seed record is represented in existing profile history where applicable.</div>}
        </SectionCard>}

        <SectionCard title="Structured observations" description="AI organizes source material; humans retain interpretation and judgement">
          {d.observations.length?(
            <div className="space-y-2">{d.observations.map(o=><div key={o.id} className="rounded-xl border border-line/60 bg-panel/40 p-3"><div className="flex items-center justify-between gap-2"><div><div className="text-[10px] font-semibold text-ink">{o.category}</div>{o.source&&<div className="mt-0.5 text-[8px] text-faint">Source: {o.source}</div>}</div><Badge tone={o.sentiment==='Positive'?'success':o.sentiment==='Improvement'?'accent':'muted'}>{o.sentiment}</Badge></div><div className="mt-2 text-xs leading-5 text-muted">{o.text}</div></div>)}</div>
          ):(
            <div className="rounded-xl border border-dashed border-line p-5 text-center"><BrainCircuit size={22} className="mx-auto text-faint"/><div className="mt-2 text-sm font-semibold text-ink">Waiting for AI organization</div><div className="mt-1 text-xs text-muted">Run the AI organization step to structure this debrief and search historical evidence.</div></div>
          )}
        </SectionCard>
      </div>

      <div className="space-y-4">
        <SectionCard title="AI debrief organization" description="Explainable, evidence-linked knowledge support">
          {d.aiSummary?<>
            <div className="rounded-xl border border-purple/20 bg-purple/5 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-purple"><Sparkles size={14}/>AI summary</div><div className="mt-2 text-xs leading-6 text-muted">{d.aiSummary}</div></div>
            <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 p-4"><div className="text-[10px] font-semibold uppercase tracking-wider text-accent">Candidate lesson</div><div className="mt-2 text-sm font-semibold text-ink">{d.aiLessonTitle}</div><div className="mt-2 text-xs leading-5 text-muted">{d.aiLessonText}</div></div>
          </>:<div className="text-xs leading-5 text-muted">AI output has not been generated yet. The original debrief remains the authoritative source until human-reviewed knowledge is published.</div>}
        </SectionCard>

        <SectionCard title="Historical similarity" description="Connect one crew's experience to wider organizational evidence" action={<Search size={15} className="text-accent"/>}>
          {d.similarDebriefIds?.length?(
            <div className="space-y-2">{d.similarDebriefIds.map(sid=>{const sd=debriefs.find(x=>x.id===sid);return sd?<Link key={sid} to={`/debriefs/${sid}`} className="block rounded-xl border border-line/60 bg-panel/40 p-3 hover:border-accent/30"><div className="text-xs font-semibold text-ink">{sd.title}</div><div className="mt-1 text-[9px] text-faint">{sd.id} · {sd.type} · {sd.date}</div></Link>:null})}</div>
          ):<div className="text-xs text-muted">{d.aiSummary?'No strong historical similarity was found for this record.':'Run AI organization to search historical debriefs.'}</div>}
        </SectionCard>

        <SectionCard title="Audit & traceability" description="Clear separation between human source, AI actions and human publication decisions">
          <div className="space-y-2">{timeline.map(event=><div key={event.id} className="flex gap-3 rounded-xl border border-line/55 bg-panel/35 p-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${event.tone==='success'?'bg-success':event.tone==='danger'?'bg-danger':event.tone==='purple'?'bg-purple':'bg-accent'}`}/><div className="min-w-0 flex-1"><div className="text-[10px] font-semibold text-ink">{event.action}</div><div className="mt-1 text-[9px] leading-4 text-muted">{event.detail}</div><div className="mt-1 text-[8px] text-faint">{event.actor} · {event.role} · {event.time}</div></div></div>)}{!timeline.length&&<div className="text-xs text-muted">No audit events recorded for this record yet.</div>}</div>
        </SectionCard>

        <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck size={16} className="text-success"/>Human-in-the-loop safety control</div>
          <div className="mt-2 text-xs leading-5 text-muted">AI output is advisory. A trainer/checker validates the lesson before it becomes organization-wide knowledge.</div>
          {linkedLesson&&<Link to={`/lessons/${linkedLesson.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">Open lesson candidate <ArrowRight size={13}/></Link>}
        </div>
      </div>
    </div>
  </>
}
