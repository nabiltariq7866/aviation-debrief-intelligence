import { ArrowRight, CheckCircle2, ClipboardList, Link2, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, CustomSelect, FieldLabel, PageHeader, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'
import type { DebriefType } from '../data/types'

export default function NewDebrief(){
  const {createDebrief,profiles,currentActor,persona}=useDemo()
  const navigate=useNavigate()
  const [saving,setSaving]=useState(false)
  const [linkedProfileIds,setLinkedProfileIds]=useState<string[]>(['P-101','P-102'])
  const [form,setForm]=useState({
    type:'Post-Mission' as DebriefType,
    title:'Coastal Support Mission Debrief',
    mission:'OPS-902',
    date:'2026-08-29',
    aircraft:'AW139',
    location:'Coastal Sector',
    rawNotes:'Weather changed during the return sector. Crew communication remained strong, but the revised threat briefing happened later than ideal.',
    selfEvaluation:'I maintained stable task execution but could have initiated the weather reassessment earlier.',
    teamEvaluation:'Crew coordination remained calm and effective as conditions changed. The briefing refresh should have happened earlier.',
    trainerCheckerNotes:'',
    whatWentWell:'Clear task sharing and calm communication under changing conditions.',
    improve:'Refresh the threat and weather briefing earlier when conditions change before descent.',
    createdBy:currentActor,
  })

  const toggleProfile=(id:string)=>setLinkedProfileIds(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
  const selectedCrew=profiles.filter(p=>linkedProfileIds.includes(p.id)).map(p=>p.name)
  const needsTrainingProfile=form.type!=='Post-Mission'
  const aircraftOptions=['AW139','H175','H145','S-92','Bell 412']

  const submit=()=>{
    if(!form.title.trim()||!form.rawNotes.trim()||(needsTrainingProfile&&!linkedProfileIds.length))return
    setSaving(true)
    window.setTimeout(()=>{
      const id=createDebrief({
        ...form,
        createdBy:form.createdBy||currentActor,
        crew:selectedCrew.length?selectedCrew:[currentActor],
        linkedProfileIds,
      })
      setSaving(false)
      navigate(`/debriefs/${id}`)
    },850)
  }

  return <>
    <PageHeader
      eyebrow="New Debrief"
      title="Capture operational learning"
      description="Create a realistic mission, training-sortie or assessment-flight debrief with separate self, team and trainer/checker perspectives. The original human record remains visible throughout the AI-assisted flow."
      actions={<Badge tone="muted">Acting as {persona} · {currentActor}</Badge>}
    />

    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <SectionCard title="Debrief context" description="Identify the flight activity and preserve the original operational source context">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label="Debrief type"><CustomSelect value={form.type} onChange={value=>setForm({...form,type:value as DebriefType})} options={[
              {value:'Post-Mission',label:'Post-Mission',description:'Operational crew debrief'},
              {value:'Training Sortie',label:'Training Sortie',description:'Trainer-linked learning record'},
              {value:'Assessment Flight',label:'Assessment Flight',description:'Checker-linked assessment evidence'},
            ]}/></FieldLabel>
            <FieldLabel label="Date"><input className="field" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></FieldLabel>
            <FieldLabel label="Title"><input className="field" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></FieldLabel>
            <FieldLabel label="Mission / sortie / assessment ID"><input className="field" value={form.mission} onChange={e=>setForm({...form,mission:e.target.value})}/></FieldLabel>
            <FieldLabel label="Aircraft"><CustomSelect value={form.aircraft} onChange={aircraft=>setForm({...form,aircraft})} options={aircraftOptions}/></FieldLabel>
            <FieldLabel label="Location / operating area"><input className="field" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></FieldLabel>
            <FieldLabel label="Submitted by"><input className="field" value={form.createdBy} onChange={e=>setForm({...form,createdBy:e.target.value})}/></FieldLabel>
            <div className="rounded-xl border border-line bg-panel/45 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-ink"><Link2 size={14} className="text-accent"/>Crew / profile linkage</div>
              <div className="mt-1 text-[10px] leading-4 text-muted">{needsTrainingProfile?'Selected profiles receive this training or assessment source record in their development history.':'Selected people remain part of the debrief context; post-mission records do not alter training scores.'}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Crew / trainee selection" description={needsTrainingProfile?'At least one profile is required for training and assessment records.':'Select the crew members represented by this post-mission debrief.'}>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {profiles.map(profile=>{
              const active=linkedProfileIds.includes(profile.id)
              return <button key={profile.id} type="button" onClick={()=>toggleProfile(profile.id)} className={`rounded-xl border p-3 text-left transition ${active?'border-accent/35 bg-accent/10':'border-line bg-panel/35 hover:border-accent/25 hover:bg-panel/60'}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${active?'border-accent/20 bg-accent/10 text-accent':'border-line bg-surface text-muted'}`}><UserRoundCheck size={15}/></div>
                  <div className="min-w-0"><div className="truncate text-[11px] font-semibold text-ink">{profile.name}</div><div className="mt-0.5 truncate text-[9px] text-faint">{profile.role} · {profile.base}</div></div>
                  <span className={`ml-auto grid h-5 w-5 shrink-0 place-items-center rounded-full border ${active?'border-accent bg-accent text-[#0B0B0D]':'border-line text-transparent'}`}><CheckCircle2 size={12}/></span>
                </div>
              </button>
            })}
          </div>
          {needsTrainingProfile&&!linkedProfileIds.length&&<div className="mt-3 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2.5 text-[10px] text-danger">Select at least one training profile before creating this record.</div>}
        </SectionCard>

        <SectionCard title="Human-authored observations" description="Capture the material that AI will later organize — without replacing or overwriting the source">
          <div className="space-y-4">
            <FieldLabel label="Raw debrief observations"><textarea className="textarea-field min-h-[125px]" value={form.rawNotes} onChange={e=>setForm({...form,rawNotes:e.target.value})}/></FieldLabel>
            <div className="grid gap-4 md:grid-cols-2">
              <FieldLabel label="Individual self-evaluation" hint="Crew member perspective"><textarea className="textarea-field min-h-[115px]" value={form.selfEvaluation} onChange={e=>setForm({...form,selfEvaluation:e.target.value})}/></FieldLabel>
              <FieldLabel label="Team / crew evaluation" hint="Team perspective"><textarea className="textarea-field min-h-[115px]" value={form.teamEvaluation} onChange={e=>setForm({...form,teamEvaluation:e.target.value})}/></FieldLabel>
            </div>
            {needsTrainingProfile&&<FieldLabel label="Trainer / checker observations" hint="Training & assessment only"><textarea className="textarea-field min-h-[115px]" value={form.trainerCheckerNotes} onChange={e=>setForm({...form,trainerCheckerNotes:e.target.value})} placeholder="Record trainer/checker observations without allowing AI to determine the assessment outcome."/></FieldLabel>}
            <div className="grid gap-4 md:grid-cols-2">
              <FieldLabel label="What went well"><textarea className="textarea-field min-h-[100px]" value={form.whatWentWell} onChange={e=>setForm({...form,whatWentWell:e.target.value})}/></FieldLabel>
              <FieldLabel label="What could improve"><textarea className="textarea-field min-h-[100px]" value={form.improve} onChange={e=>setForm({...form,improve:e.target.value})}/></FieldLabel>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/70 pt-4"><div className="text-[10px] text-muted">Next step: preserve the record, then open it and run AI organization.</div><button disabled={saving||!form.title.trim()||!form.rawNotes.trim()||(needsTrainingProfile&&!linkedProfileIds.length)} onClick={submit} className="primary-btn">{saving?'Creating & linking record…':<>Create debrief <ArrowRight size={15}/></>}</button></div>
        </SectionCard>
      </div>

      <div className="space-y-4 xl:sticky xl:top-[96px] xl:self-start">
        <div className="card overflow-hidden">
          <div className="border-b border-line px-4 py-3.5"><div className="flex items-center gap-2 text-sm font-semibold text-ink"><Sparkles size={16} className="text-accent"/>Connected demo flow</div><div className="mt-1 text-[10px] text-muted">What this submission will demonstrate</div></div>
          <div className="p-4">
            {[
              ['1','Preserve original debrief','Human-authored source remains inspectable.'],
              ['2','Structure observations','AI separates self, team and trainer/checker context.'],
              ['3','Search historical similarity','Related operational evidence is surfaced.'],
              ['4','Create lesson / trend candidate','Knowledge is proposed, not automatically imposed.'],
              ['5','Human validation','Trainer/checker decides whether to publish.'],
              ['6','Organization-wide search','Published learning enters the Knowledge Base.'],
            ].map(([n,title,desc],index)=><div key={n} className="relative flex gap-3 pb-4 last:pb-0">{index<5&&<span className="absolute left-[14px] top-8 h-[calc(100%-17px)] w-px bg-line"/>}<div className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-accent/25 bg-accent/10 text-[9px] font-bold text-accent">{n}</div><div><div className="text-[11px] font-semibold text-ink">{title}</div><div className="mt-1 text-[9px] leading-4 text-muted">{desc}</div></div></div>)}
          </div>
        </div>

        <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
          <div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success/10 text-success"><ShieldCheck size={16}/></div><div><div className="text-sm font-semibold text-ink">Safety-critical boundary</div><p className="mt-2 text-[10px] leading-5 text-muted">AI does not grade crew performance, determine flight safety, change assessment outcomes or replace qualified trainer/checker judgement. Profile linkage is administrative and evidence-based only.</p></div></div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink"><ClipboardList size={14} className="text-purple"/>Submission preview</div>
          <div className="mt-3 space-y-2 text-[10px]"><div className="flex justify-between gap-3"><span className="text-faint">Type</span><span className="font-semibold text-ink">{form.type}</span></div><div className="flex justify-between gap-3"><span className="text-faint">Mission</span><span className="font-semibold text-ink">{form.mission}</span></div><div className="flex justify-between gap-3"><span className="text-faint">Crew linked</span><span className="font-semibold text-ink">{linkedProfileIds.length}</span></div><div className="flex justify-between gap-3"><span className="text-faint">Aircraft</span><span className="font-semibold text-ink">{form.aircraft}</span></div></div>
        </div>
      </div>
    </div>
  </>
}
