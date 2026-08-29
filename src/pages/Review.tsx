import { CheckCircle2, LockKeyhole, ShieldCheck, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, PageHeader } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function Review(){
  const {lessons,publishLesson,persona,setPersona,currentActor}=useDemo()
  const pending=lessons.filter(l=>l.status==='Draft')
  const canPublish=persona==='Trainer'||persona==='Checker'

  return <>
    <PageHeader
      eyebrow="Human-in-the-loop"
      title="Trainer / checker review"
      description="AI-generated lesson candidates remain advisory until an authorized trainer or checker validates them for wider organizational use."
      actions={<Badge tone={canPublish?'success':'muted'}>{currentActor} · {persona}</Badge>}
    />

    <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck size={16} className="text-success"/>Safety-critical decision boundary preserved</div>
      <p className="mt-2 max-w-4xl text-xs leading-5 text-muted">This review validates whether AI-organized knowledge accurately reflects the supporting human debrief evidence before publication. It does not determine flight safety, crew fitness or assessment outcomes.</p>
    </div>

    {!canPublish&&<div className="mt-4 rounded-2xl border border-purple/20 bg-purple/5 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink"><LockKeyhole size={16} className="text-purple"/>Crew persona is read-only for publication</div>
      <div className="mt-2 text-xs leading-5 text-muted">Crew members can inspect lesson evidence, but only Trainer or Checker personas can validate organization-wide publication in this demo.</div>
      <div className="mt-3 flex gap-2"><button onClick={()=>setPersona('Trainer')} className="secondary-btn"><UserCheck size={14}/>Switch to Trainer</button><button onClick={()=>setPersona('Checker')} className="secondary-btn"><UserCheck size={14}/>Switch to Checker</button></div>
    </div>}

    <div className="mt-4 space-y-3">
      {pending.map(l=><div key={l.id} className="card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div><div className="flex items-center gap-2"><div className="text-sm font-semibold text-ink">{l.title}</div><Badge tone="accent">AI candidate</Badge></div><div className="mt-2 max-w-3xl text-xs leading-5 text-muted">{l.summary}</div><div className="mt-2 text-[9px] text-faint">{l.sourceDebriefIds.length} supporting records · {l.confidence}% AI confidence</div></div>
          <div className="flex shrink-0 gap-2"><Link to={`/lessons/${l.id}`} className="secondary-btn">Review evidence</Link><button disabled={!canPublish} onClick={()=>publishLesson(l.id)} className="primary-btn"><CheckCircle2 size={15}/>Validate & publish</button></div>
        </div>
      </div>)}
      {!pending.length&&<div className="card p-8 text-center"><CheckCircle2 size={24} className="mx-auto text-success"/><div className="mt-2 text-sm font-semibold text-ink">Review queue clear</div><div className="mt-1 text-xs text-muted">There are no AI lesson candidates awaiting validation.</div></div>}
    </div>
  </>
}
