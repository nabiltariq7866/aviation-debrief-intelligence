import { ArrowRight, CheckCircle2, Sparkles, UserRoundCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, FieldLabel, PageHeader } from '../components/ui'
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
      description="Capture post-mission, training-sortie and assessment-flight observations with separate self, team and trainer/checker perspectives. The original human record remains visible throughout the AI-assisted workflow."
      actions={<Badge tone="muted">Acting as {persona}</Badge>}
    />

    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldLabel label="Debrief type">
            <select className="field" value={form.type} onChange={e=>setForm({...form,type:e.target.value as DebriefType})}>
              <option>Post-Mission</option>
              <option>Training Sortie</option>
              <option>Assessment Flight</option>
            </select>
          </FieldLabel>

          <FieldLabel label="Date"><input className="field" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></FieldLabel>
          <FieldLabel label="Title"><input className="field" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></FieldLabel>
          <FieldLabel label="Mission / sortie / assessment ID"><input className="field" value={form.mission} onChange={e=>setForm({...form,mission:e.target.value})}/></FieldLabel>
          <FieldLabel label="Aircraft"><input className="field" value={form.aircraft} onChange={e=>setForm({...form,aircraft:e.target.value})}/></FieldLabel>
          <FieldLabel label="Location / operating area"><input className="field" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></FieldLabel>
          <FieldLabel label="Submitted by"><input className="field" value={form.createdBy} onChange={e=>setForm({...form,createdBy:e.target.value})}/></FieldLabel>
          <div className="rounded-xl border border-line/70 bg-panel/35 p-3">
            <div className="text-[10px] font-semibold text-ink">Crew / profile linkage</div>
            <div className="mt-1 text-[9px] leading-4 text-muted">{needsTrainingProfile?'Selected people will receive this training/assessment record in their profile history.':'Crew selection is preserved as debrief context. Post-mission records do not change training scores.'}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs font-semibold text-ink">Select crew / trainees</div>
            {needsTrainingProfile&&<div className="text-[9px] text-accent">Required for training & assessment</div>}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {profiles.map(profile=>{
              const active=linkedProfileIds.includes(profile.id)
              return <button key={profile.id} type="button" onClick={()=>toggleProfile(profile.id)} className={`rounded-xl border p-3 text-left transition ${active?'border-accent/35 bg-accent/10':'border-line/70 bg-panel/30 hover:border-accent/20'}`}>
                <div className="flex items-center gap-2"><div className={`grid h-8 w-8 place-items-center rounded-lg ${active?'bg-accent/12 text-accent':'bg-panel text-muted'}`}><UserRoundCheck size={14}/></div><div><div className="text-[10px] font-semibold text-ink">{profile.name}</div><div className="mt-0.5 text-[8px] text-faint">{profile.role} · {profile.base}</div></div></div>
              </button>
            })}
          </div>
          {needsTrainingProfile&&!linkedProfileIds.length&&<div className="mt-2 text-[10px] text-danger">Select at least one training profile before creating this record.</div>}
        </div>

        <div className="mt-5 space-y-4">
          <FieldLabel label="Raw debrief observations"><textarea className="field min-h-[120px]" value={form.rawNotes} onChange={e=>setForm({...form,rawNotes:e.target.value})}/></FieldLabel>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label="Individual self-evaluation" hint="Crew member perspective"><textarea className="field min-h-[110px]" value={form.selfEvaluation} onChange={e=>setForm({...form,selfEvaluation:e.target.value})}/></FieldLabel>
            <FieldLabel label="Team / crew evaluation" hint="Team perspective"><textarea className="field min-h-[110px]" value={form.teamEvaluation} onChange={e=>setForm({...form,teamEvaluation:e.target.value})}/></FieldLabel>
          </div>

          {needsTrainingProfile&&<FieldLabel label="Trainer / checker observations" hint="Training & assessment only"><textarea className="field min-h-[110px]" value={form.trainerCheckerNotes} onChange={e=>setForm({...form,trainerCheckerNotes:e.target.value})} placeholder="Record trainer/checker observations without allowing AI to determine the assessment outcome."/></FieldLabel>}

          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label="What went well"><textarea className="field min-h-[95px]" value={form.whatWentWell} onChange={e=>setForm({...form,whatWentWell:e.target.value})}/></FieldLabel>
            <FieldLabel label="What could improve"><textarea className="field min-h-[95px]" value={form.improve} onChange={e=>setForm({...form,improve:e.target.value})}/></FieldLabel>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button disabled={saving||!form.title.trim()||!form.rawNotes.trim()||(needsTrainingProfile&&!linkedProfileIds.length)} onClick={submit} className="primary-btn">
            {saving?'Creating & linking record…':<>Create debrief <ArrowRight size={15}/></>}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink"><Sparkles size={16} className="text-accent"/>Connected demo flow</div>
          <div className="mt-3 space-y-3 text-xs leading-5 text-muted">
            <div>1. Original human-authored debrief is preserved.</div>
            <div>2. Self, team and trainer/checker observations are separately identifiable.</div>
            <div>3. Training and assessment records are linked to selected individual profiles.</div>
            <div>4. AI structures observations and searches historical similarity.</div>
            <div>5. A lesson and recurring-pattern candidate may be surfaced.</div>
            <div>6. Trainer/checker validates before wider publication.</div>
          </div>
        </div>

        <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink"><CheckCircle2 size={16} className="text-success"/>Safety-critical boundary</div>
          <p className="mt-2 text-xs leading-5 text-muted">AI does not grade crew performance, determine flight safety, change assessment outcomes or replace qualified trainer/checker judgement. Profile linkage is administrative and evidence-based only.</p>
        </div>
      </div>
    </div>
  </>
}
