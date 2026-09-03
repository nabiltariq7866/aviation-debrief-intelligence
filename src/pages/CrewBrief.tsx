import { ArrowRight, BookOpenCheck, CheckCircle2, Plane, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, CustomSelect, EmptyState, PageHeader, Progress, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function CrewBrief(){
  const {lessons,debriefs}=useDemo()
  const [role,setRole]=useState('First Officer')
  const [aircraft,setAircraft]=useState('AW139')
  const [generated,setGenerated]=useState(true)

  const recommendations=useMemo(()=>lessons
    .filter(l=>l.status==='Published')
    .map(l=>{
      const roleMatch=l.relevantRoles.includes(role)
      const aircraftMatch=l.relevantAircraft.includes(aircraft)
      const score=(roleMatch?45:0)+(aircraftMatch?40:0)+Math.round(l.confidence*.15)
      const missionTypes=Array.from(new Set(l.sourceDebriefIds.map(id=>debriefs.find(d=>d.id===id)?.missionType).filter(Boolean)))
      return {...l,roleMatch,aircraftMatch,score,missionTypes}
    })
    .filter(l=>l.roleMatch||l.aircraftMatch)
    .sort((a,b)=>b.score-a.score)
    .slice(0,5),[lessons,debriefs,role,aircraft])

  const totalEvidence=recommendations.reduce((sum,l)=>sum+l.sourceDebriefIds.length,0)

  return <>
    <PageHeader
      eyebrow="Pre-Flight Knowledge"
      title="New crew brief"
      description="Select a crew role and aircraft to surface the highest-value validated lessons relevant to that operating context — turning accumulated organizational knowledge into a practical onboarding and pre-mission brief."
      actions={<Badge tone="success"><ShieldCheck size={11}/>Validated lessons only</Badge>}
    />

    <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
      <div className="space-y-4 xl:sticky xl:top-[96px] xl:self-start">
        <SectionCard title="Brief context" description="Choose the operating role and platform">
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink"><UserRoundCheck size={14} className="text-accent"/>Crew role</div>
              <CustomSelect value={role} onChange={value=>{setRole(value);setGenerated(false)}} options={[
                {value:'Captain',label:'Captain',description:'Command / supervisory perspective'},
                {value:'First Officer',label:'First Officer',description:'Operational crew perspective'},
                {value:'Trainer',label:'Trainer',description:'Training delivery and coaching'},
                {value:'Checker',label:'Checker',description:'Assessment and standards oversight'},
              ]}/>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink"><Plane size={14} className="text-purple"/>Aircraft / platform</div>
              <CustomSelect value={aircraft} onChange={value=>{setAircraft(value);setGenerated(false)}} options={['AW139','H175','H145','S-92','Bell 412']}/>
            </div>
            <button onClick={()=>setGenerated(true)} className="primary-btn w-full"><Sparkles size={15}/>Generate crew brief</button>
          </div>
        </SectionCard>

        <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
          <div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success/10 text-success"><ShieldCheck size={16}/></div><div><div className="text-sm font-semibold text-ink">Knowledge, not instruction</div><div className="mt-2 text-[10px] leading-5 text-muted">This brief surfaces validated organizational lessons relevant to the selected context. It does not replace SOPs, mission planning, commander judgement or safety-critical decision-making.</div></div></div>
        </div>
      </div>

      <div>
        {generated&&recommendations.length?<div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-accent/10 via-surface to-purple/5 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div><div className="label text-accent">Crew learning brief</div><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-ink">{role} · {aircraft}</h2><p className="mt-2 max-w-2xl text-[11px] leading-5 text-muted">Top validated lessons selected from organizational evidence that matches this role and/or platform.</p></div>
                <div className="grid grid-cols-2 gap-2"><div className="panel-soft min-w-[120px] p-3"><div className="data-label">Validated lessons</div><div className="mt-1 text-xl font-semibold text-ink">{recommendations.length}</div></div><div className="panel-soft min-w-[120px] p-3"><div className="data-label">Evidence records</div><div className="mt-1 text-xl font-semibold text-accent">{totalEvidence}</div></div></div>
              </div>
            </div>
          </div>

          <SectionCard title="Priority learning" description="Ranked validated knowledge for this role / aircraft combination">
            <div className="space-y-3">{recommendations.map((lesson,index)=>
              <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="group block rounded-2xl border border-line bg-panel/35 p-4 transition hover:-translate-y-0.5 hover:border-accent/30 hover:bg-panel/55">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-sm font-bold text-accent">{String(index+1).padStart(2,'0')}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><div className="text-sm font-semibold text-ink group-hover:text-accent">{lesson.title}</div><Badge tone="success"><CheckCircle2 size={10}/>Validated</Badge></div>
                    <p className="mt-2 text-[10px] leading-5 text-muted">{lesson.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">{lesson.roleMatch&&<Badge tone="accent">Role match</Badge>}{lesson.aircraftMatch&&<Badge tone="purple">{aircraft} match</Badge>}{lesson.missionTypes.map(type=><span key={String(type)} className="rounded-lg border border-line bg-surface px-2 py-1 text-[8px] font-semibold text-muted">{String(type)}</span>)}</div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="mb-1.5 flex justify-between text-[9px]"><span className="text-faint">Knowledge confidence</span><span className="font-semibold text-accent">{lesson.confidence}%</span></div><Progress value={lesson.confidence} tone={lesson.confidence>=90?'success':'accent'}/></div><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open lesson <ArrowRight size={12}/></span></div>
                  </div>
                </div>
              </Link>
            )}</div>
          </SectionCard>

          <div className="rounded-2xl border border-line bg-surface p-4"><div className="flex items-start gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-purple/10 text-purple"><BookOpenCheck size={16}/></div><div><div className="text-xs font-semibold text-ink">Onboarding / knowledge-loss use case</div><div className="mt-1 text-[10px] leading-5 text-muted">A new or transferring crew member can quickly see validated organizational learning relevant to their role and aircraft rather than relying only on who happens to be available to brief them.</div></div></div></div>
        </div>:generated?<EmptyState icon={<BookOpenCheck size={18}/>} title="No validated lessons match" description="Try another role or aircraft. Only published, human-validated lessons are eligible for the crew brief."/>:<div className="card grid min-h-[420px] place-items-center p-8 text-center"><div><Sparkles size={24} className="mx-auto text-accent"/><div className="mt-3 text-sm font-semibold text-ink">Ready to generate</div><div className="mt-1 text-[10px] text-muted">Update the role or aircraft, then generate a fresh validated learning brief.</div></div></div>}
      </div>
    </div>
  </>
}
