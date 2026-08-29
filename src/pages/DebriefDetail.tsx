import {
  ArrowRight,
  BrainCircuit,
  ClipboardCheck,
  FileText,
  Link2,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge, EmptyState, PageHeader, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function DebriefDetail(){
  const {id}=useParams()
  const {debriefs,lessons,profiles,audit,analyzeDebrief}=useDemo()
  const d=debriefs.find(x=>x.id===id)
  if(!d)return <EmptyState icon={<FileText size={18}/>} title="Debrief not found" description="This record is not available in the current demo state."/>

  const linkedLesson=lessons.find(l=>l.sourceDebriefIds.includes(d.id))
  const linkedProfiles=profiles.filter(p=>d.linkedProfileIds?.includes(p.id))
  const timeline=audit.filter(e=>e.entityId===d.id||e.entityId===linkedLesson?.id).slice(0,8)
  const analyzed=Boolean(d.aiSummary)

  return <>
    <PageHeader
      eyebrow={`${d.type} · ${d.id}`}
      title={d.title}
      description={`${d.mission} · ${d.aircraft} · ${d.location} · ${d.date}`}
      actions={<div className="flex items-center gap-2">{d.status!=='Draft'&&<Badge tone={d.status==='Published'?'success':'accent'}>{d.status}</Badge>}{d.status==='Draft'&&<button onClick={()=>analyzeDebrief(d.id)} className="primary-btn"><Sparkles size={15}/>Run AI organization</button>}</div>}
    />

    <div className="mb-4 card p-3.5">
      <div className="flex flex-wrap items-center gap-3">
        {[
          {label:'Human source captured',done:true},
          {label:'AI organized',done:analyzed},
          {label:'Evidence connected',done:Boolean(d.similarDebriefIds?.length)},
          {label:'Human validated',done:d.status==='Published'},
          {label:'Knowledge distributed',done:d.status==='Published'},
        ].map((step,index)=><div key={step.label} className="flex min-w-0 flex-1 items-center gap-2"><div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-[9px] font-bold ${step.done?'border-success/25 bg-success/10 text-success':'border-line bg-panel text-faint'}`}>{index+1}</div><span className={`truncate text-[9px] font-semibold ${step.done?'text-ink':'text-faint'}`}>{step.label}</span>{index<4&&<ArrowRight size={12} className="ml-auto hidden shrink-0 text-faint xl:block"/>}</div>)}
      </div>
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.06fr_.94fr]">
      <div className="space-y-4">
        <SectionCard title="Human-authored debrief" description="Original source material remains visible and separate from AI-generated organization">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="panel-soft p-3"><div className="data-label">Crew</div><div className="mt-1 text-[10px] font-semibold leading-4 text-ink">{d.crew.join(', ')}</div></div>
            <div className="panel-soft p-3"><div className="data-label">Submitted by</div><div className="mt-1 text-[10px] font-semibold text-ink">{d.createdBy}</div></div>
            <div className="panel-soft p-3"><div className="data-label">Created</div><div className="mt-1 text-[10px] font-semibold text-ink">{d.createdAt}</div></div>
            <div className="panel-soft p-3"><div className="data-label">Mission</div><div className="mt-1 text-[10px] font-semibold text-ink">{d.mission}</div></div>
          </div>

          <div className="mt-4 rounded-xl border border-line bg-panel/45 p-4"><div className="flex items-center gap-2 text-[10px] font-semibold text-ink"><FileText size={13} className="text-accent"/>Raw observations</div><div className="mt-2 text-[11px] leading-6 text-muted">{d.rawNotes}</div></div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-purple/20 bg-purple/5 p-3.5"><div className="text-[10px] font-semibold text-purple">Individual self-evaluation</div><div className="mt-2 text-[10px] leading-5 text-muted">{d.selfEvaluation||'No separate self-evaluation was stored in this historical seed record.'}</div></div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5"><div className="text-[10px] font-semibold text-accent">Team / crew evaluation</div><div className="mt-2 text-[10px] leading-5 text-muted">{d.teamEvaluation||d.whatWentWell}</div></div>
          </div>

          {d.type!=='Post-Mission'&&<div className="mt-3 rounded-xl border border-success/20 bg-success/5 p-3.5"><div className="text-[10px] font-semibold text-success">Trainer / checker observations</div><div className="mt-2 text-[10px] leading-5 text-muted">{d.trainerCheckerNotes||'Historical training/assessment notes remain represented in the source documentation.'}</div></div>}

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="panel-soft p-3.5"><div className="text-[10px] font-semibold text-success">What went well</div><div className="mt-2 text-[10px] leading-5 text-muted">{d.whatWentWell}</div></div>
            <div className="panel-soft p-3.5"><div className="text-[10px] font-semibold text-accent">What could improve</div><div className="mt-2 text-[10px] leading-5 text-muted">{d.improve}</div></div>
          </div>
        </SectionCard>

        {d.type!=='Post-Mission'&&<SectionCard title="Training-profile linkage" description="Administrative evidence linkage only — AI does not change trainer/checker scores or assessment outcomes">
          {linkedProfiles.length?<div className="grid gap-2 sm:grid-cols-2">{linkedProfiles.map(profile=><Link to={`/training-profiles/${profile.id}`} key={profile.id} className="group flex items-center gap-3 rounded-xl border border-line bg-panel/40 p-3 transition hover:border-accent/30"><div className="grid h-9 w-9 place-items-center rounded-xl border border-purple/20 bg-purple/10 text-purple"><UserRoundCheck size={15}/></div><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold text-ink group-hover:text-accent">{profile.name}</div><div className="mt-0.5 text-[9px] text-faint">{profile.role} · record linked</div></div><ArrowRight size={12} className="text-faint"/></Link>)}</div>:<div className="text-xs text-muted">This seed record is represented in existing profile history where applicable.</div>}
        </SectionCard>}

        <SectionCard title="Structured observations" description="AI organizes source material into readable themes while retaining the source perspective">
          {d.observations.length?<div className="space-y-2">{d.observations.map(o=><div key={o.id} className="rounded-xl border border-line bg-panel/40 p-3.5"><div className="flex items-start justify-between gap-3"><div><div className="text-[10px] font-semibold text-ink">{o.category}</div>{o.source&&<div className="mt-1 text-[8px] text-faint">Source: {o.source}</div>}</div><Badge tone={o.sentiment==='Positive'?'success':o.sentiment==='Improvement'?'accent':'muted'}>{o.sentiment}</Badge></div><div className="mt-2 text-[10px] leading-5 text-muted">{o.text}</div></div>)}</div>:<EmptyState icon={<BrainCircuit size={18}/>} title="Waiting for AI organization" description="Run the AI organization step to structure this debrief, create a lesson candidate and search historical evidence." action={<button onClick={()=>analyzeDebrief(d.id)} className="primary-btn"><Sparkles size={14}/>Run AI organization</button>}/>} 
        </SectionCard>
      </div>

      <div className="space-y-4">
        <SectionCard title="AI debrief organization" description="Explainable, evidence-linked knowledge support">
          {d.aiSummary?<>
            <div className="rounded-xl border border-purple/20 bg-purple/5 p-4"><div className="flex items-center gap-2 text-[10px] font-semibold text-purple"><Sparkles size={13}/>AI summary</div><div className="mt-2 text-[11px] leading-6 text-muted">{d.aiSummary}</div></div>
            <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 p-4"><div className="data-label text-accent">Candidate lesson</div><div className="mt-2 text-sm font-semibold leading-5 text-ink">{d.aiLessonTitle}</div><div className="mt-2 text-[10px] leading-5 text-muted">{d.aiLessonText}</div>{linkedLesson&&<Link to={`/lessons/${linkedLesson.id}`} className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open lesson candidate <ArrowRight size={12}/></Link>}</div>
          </>:<div className="rounded-xl border border-dashed border-line bg-panel/25 p-5 text-center"><Sparkles size={20} className="mx-auto text-faint"/><div className="mt-2 text-xs font-semibold text-ink">No AI output yet</div><div className="mt-1 text-[10px] leading-5 text-muted">The human-authored debrief remains the authoritative source until AI organization is run and later human validation occurs.</div></div>}
        </SectionCard>

        <SectionCard title="Historical similarity" description="Connect one crew's experience to wider organizational evidence" action={<Search size={15} className="text-accent"/>}>
          {d.similarDebriefIds?.length?<div className="space-y-2">{d.similarDebriefIds.map(sid=>{const sd=debriefs.find(x=>x.id===sid);return sd?<Link key={sid} to={`/debriefs/${sid}`} className="group flex items-start gap-3 rounded-xl border border-line bg-panel/40 p-3 transition hover:border-accent/30"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent"><Link2 size={13}/></div><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold text-ink group-hover:text-accent">{sd.title}</div><div className="mt-1 text-[9px] text-faint">{sd.id} · {sd.type} · {sd.date}</div></div><ArrowRight size={12} className="mt-1 shrink-0 text-faint"/></Link>:null})}</div>:<div className="text-[10px] leading-5 text-muted">{d.aiSummary?'No strong historical similarity was found for this record.':'Run AI organization to search historical debrief evidence.'}</div>}
        </SectionCard>

        <SectionCard title="Audit & traceability" description="See which steps were human-authored, AI-generated or human-validated">
          {timeline.length?<div className="space-y-2">{timeline.map(event=><div key={event.id} className="flex gap-3 rounded-xl border border-line bg-panel/35 p-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${event.tone==='success'?'bg-success':event.tone==='danger'?'bg-danger':event.tone==='purple'?'bg-purple':'bg-accent'}`}/><div className="min-w-0 flex-1"><div className="text-[10px] font-semibold text-ink">{event.action}</div><div className="mt-1 text-[9px] leading-4 text-muted">{event.detail}</div><div className="mt-1 text-[8px] text-faint">{event.actor} · {event.role} · {event.time}</div></div></div>)}</div>:<div className="text-[10px] text-muted">No audit events recorded for this record yet.</div>}
        </SectionCard>

        <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
          <div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success/10 text-success"><ShieldCheck size={16}/></div><div><div className="text-sm font-semibold text-ink">Human-in-the-loop safety control</div><div className="mt-2 text-[10px] leading-5 text-muted">AI output is advisory. A trainer/checker validates the lesson before it becomes organization-wide knowledge.</div>{linkedLesson&&<Link to={`/lessons/${linkedLesson.id}`} className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open linked lesson <ArrowRight size={12}/></Link>}</div></div>
        </div>
      </div>
    </div>
  </>
}
