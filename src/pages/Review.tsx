import { ArrowRight, CheckCircle2, FileSearch2, LockKeyhole, ShieldCheck, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, CustomSelect, EmptyState, PageHeader, Progress } from '../components/ui'
import { useDemo } from '../state/DemoContext'
import type { Persona } from '../data/types'

export default function Review(){
  const {lessons,publishLesson,persona,setPersona,currentActor}=useDemo()
  const pending=lessons.filter(l=>l.status==='Draft')
  const canPublish=persona==='Trainer'||persona==='Checker'

  return <>
    <PageHeader
      eyebrow="Human-in-the-loop"
      title="Trainer / checker review"
      description="Review AI-generated lesson candidates against their supporting human-authored evidence before anything becomes organization-wide operational knowledge."
      actions={<div className="w-[220px]"><CustomSelect size="sm" value={persona} onChange={value=>setPersona(value as Persona)} options={[
        {value:'Crew Member',label:'Crew Member',description:'Evidence access only'},
        {value:'Trainer',label:'Trainer',description:'Can validate & publish'},
        {value:'Checker',label:'Checker',description:'Can validate & publish'},
      ]} menuWidth={240}/></div>}
    />

    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {pending.length?pending.map(l=><div key={l.id} className="card overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><Badge tone="accent">AI candidate</Badge><span className="text-[9px] text-faint">{l.id} · {l.category}</span></div>
                <h2 className="mt-3 text-[15px] font-semibold leading-5 text-ink">{l.title}</h2>
                <p className="mt-2 max-w-4xl text-[11px] leading-5 text-muted">{l.summary}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="panel-soft p-2.5"><div className="data-label">Evidence</div><div className="mt-1 text-base font-semibold text-ink">{l.sourceDebriefIds.length}</div></div>
                  <div className="panel-soft p-2.5"><div className="data-label">Occurrences</div><div className="mt-1 text-base font-semibold text-ink">{l.occurrences}</div></div>
                  <div className="panel-soft p-2.5"><div className="data-label">Crews</div><div className="mt-1 text-base font-semibold text-ink">{l.crews}</div></div>
                </div>
                <div className="mt-4"><div className="mb-2 flex justify-between text-[9px]"><span className="text-faint">AI confidence — advisory only</span><span className="font-semibold text-accent">{l.confidence}%</span></div><Progress value={l.confidence} tone="accent"/></div>
              </div>
              <div className="flex shrink-0 flex-row gap-2 lg:flex-col">
                <Link to={`/lessons/${l.id}`} className="secondary-btn"><FileSearch2 size={14}/>Review evidence</Link>
                <button disabled={!canPublish} onClick={()=>publishLesson(l.id)} className="primary-btn"><CheckCircle2 size={15}/>Validate & publish</button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line bg-panel/30 px-4 py-3"><div className="text-[9px] text-muted">Publication authority: <span className="font-semibold text-ink">Trainer / Checker only</span></div><Link to={`/lessons/${l.id}`} className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open traceability <ArrowRight size={12}/></Link></div>
        </div>):<EmptyState icon={<CheckCircle2 size={18}/>} title="Review queue clear" description="There are no AI-generated lesson candidates waiting for trainer/checker validation."/>}
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl border p-4 ${canPublish?'border-success/20 bg-success/5':'border-purple/20 bg-purple/5'}`}>
          <div className="flex items-start gap-3">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${canPublish?'bg-success/10 text-success':'bg-purple/10 text-purple'}`}>{canPublish?<UserCheck size={16}/>:<LockKeyhole size={16}/>}</div>
            <div><div className="text-sm font-semibold text-ink">{canPublish?'Validation authority active':'Read-only crew persona'}</div><div className="mt-1 text-[10px] leading-5 text-muted">{currentActor} · {persona}. {canPublish?'This persona can validate lesson candidates after reviewing evidence.':'Crew members can inspect evidence but cannot publish organization-wide lessons.'}</div></div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck size={16} className="text-success"/>Safety-critical boundary</div>
          <div className="mt-3 space-y-3 text-[10px] leading-5 text-muted">
            <div className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success"/><span>AI can organize, summarize, classify and find similar historical material.</span></div>
            <div className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"/><span>Qualified humans determine whether the candidate accurately reflects the evidence.</span></div>
            <div className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger"/><span>The platform does not determine flight safety, crew fitness or assessment outcomes.</span></div>
          </div>
        </div>
      </div>
    </div>
  </>
}
