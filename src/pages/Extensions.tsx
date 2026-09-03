import { ArrowRight, Headphones, LockKeyhole, Mic2, Plane, ReceiptText, Settings2, Sparkles, UserCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, CustomSelect, FieldLabel, Modal, PageHeader, Toggle } from '../components/ui'
import { useDemo } from '../state/DemoContext'
import type { Persona } from '../data/types'

type ExtensionKey='audio'|'recommendations'|'acknowledgements'|'rbac'|'aircraft'|'retention'

const extensions:Array<{key:ExtensionKey;title:string;desc:string;icon:typeof Mic2;tone:'accent'|'purple'|'success'|'info'}>=[
  {key:'audio',title:'Audio / transcript ingestion',desc:'Capture a verbal debrief transcript and route it into the same structured learning workflow.',icon:Mic2,tone:'purple'},
  {key:'recommendations',title:'Crew-specific lesson recommendations',desc:'Surface published learning against a selected crew member’s current development context.',icon:UserCheck,tone:'success'},
  {key:'acknowledgements',title:'Acknowledgement tracking',desc:'Track whether distributed lessons were viewed or acknowledged by selected crew profiles.',icon:ReceiptText,tone:'accent'},
  {key:'rbac',title:'Role-based access control',desc:'Switch between Crew Member, Trainer and Checker personas and demonstrate publication permissions.',icon:LockKeyhole,tone:'purple'},
  {key:'aircraft',title:'Aircraft / platform filtering',desc:'Filter debrief evidence by aircraft type without changing the underlying source records.',icon:Plane,tone:'info'},
  {key:'retention',title:'Retention & audit configuration',desc:'Configure dummy retention and detailed traceability settings with audit logging.',icon:Settings2,tone:'accent'},
]

export default function Extensions(){
  const navigate=useNavigate()
  const {
    debriefs,lessons,profiles,acknowledgements,settings,persona,currentActor,
    createDebrief,acknowledgeLesson,setPersona,updateSettings,
  }=useDemo()
  const [selected,setSelected]=useState<ExtensionKey|null>(null)
  const [audio,setAudio]=useState({mission:'AUDIO-914',title:'Verbal Post-Mission Debrief',aircraft:'AW139',profileId:'P-101',transcript:'During the return sector the wind trend changed. Crew coordination remained strong, but we agreed the weather and threat briefing could have been refreshed earlier before descent.'})
  const [recommendProfile,setRecommendProfile]=useState('P-101')
  const [ackLesson,setAckLesson]=useState(lessons.find(l=>l.status==='Published')?.id||'')
  const [ackProfile,setAckProfile]=useState('P-101')
  const [retention,setRetention]=useState(String(settings.retentionDays))

  const aircraft=Array.from(new Set(debriefs.map(d=>d.aircraft)))
  const filteredAircraft=settings.aircraftFilter==='All'?debriefs:debriefs.filter(d=>d.aircraft===settings.aircraftFilter)
  const recommendationProfile=profiles.find(p=>p.id===recommendProfile)
  const recommendations=useMemo(()=>{
    const watch=recommendationProfile?.skills.filter(s=>s.trend==='Watch').map(s=>s.name.toLowerCase())||[]
    const published=lessons.filter(l=>l.status==='Published')
    const matched=published.filter(l=>watch.some(skill=>l.category.toLowerCase().includes(skill.split(' ')[0])))
    return (matched.length?matched:published).slice(0,3)
  },[recommendationProfile,lessons])

  const ingestAudio=()=>{
    const profile=profiles.find(p=>p.id===audio.profileId)
    const id=createDebrief({
      type:'Post-Mission',
      missionType:'SAR',
      title:audio.title,
      mission:audio.mission,
      date:'2026-08-29',
      crew:profile?[profile.name]:[currentActor],
      aircraft:audio.aircraft,
      location:'Audio transcript intake',
      rawNotes:audio.transcript,
      selfEvaluation:'Verbal debrief transcript captured as submitted. No AI judgement has been applied yet.',
      teamEvaluation:'Crew coordination and shared learning points are preserved for later structuring.',
      trainerCheckerNotes:'',
      whatWentWell:'Crew communication remained effective during the changing conditions.',
      improve:'Refresh weather and threat briefing earlier when conditions materially change.',
      createdBy:currentActor,
      linkedProfileIds:profile?[profile.id]:[],
    })
    setSelected(null)
    navigate(`/debriefs/${id}`)
  }

  const modalTitle=extensions.find(x=>x.key===selected)?.title||'Extended capability'
  const toneClass=(tone:string)=>tone==='success'?'bg-success/10 text-success':tone==='purple'?'bg-purple/10 text-purple':tone==='info'?'bg-info-soft text-info':'bg-accent/10 text-accent'

  return <>
    <PageHeader
      eyebrow="Extensive Demo"
      title="Extended capabilities"
      description="Optional interactive demo extensions that broaden the product vision without presenting them as Todd-confirmed requirements. Each one uses connected dummy data and real UI behavior."
      actions={<Badge tone="purple"><Sparkles size={11}/>Optional product vision</Badge>}
    />

    <div className="mb-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
      <div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><Sparkles size={16}/></div><div><div className="text-sm font-semibold text-ink">Core requirements remain separate</div><div className="mt-1 text-[10px] leading-5 text-muted">The client-confirmed story remains debrief → AI organization → lesson/trend detection → human validation → searchable knowledge → training-profile linkage. The modules below are clearly presented as demo extensions.</div></div></div>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {extensions.map(item=>{
        const Icon=item.icon
        return <button key={item.key} onClick={()=>setSelected(item.key)} className="card card-hover group p-4 text-left">
          <div className="flex items-start justify-between gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl border border-line ${toneClass(item.tone)}`}><Icon size={18}/></div><Badge tone="purple">Optional extension</Badge></div>
          <div className="mt-4 text-sm font-semibold text-ink transition group-hover:text-accent">{item.title}</div>
          <div className="mt-2 min-h-[52px] text-[11px] leading-5 text-muted">{item.desc}</div>
          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3"><span className="text-[9px] text-faint">Interactive dummy-data flow</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open demo <ArrowRight size={12}/></span></div>
        </button>
      })}
    </div>

    <Modal open={selected!==null} onClose={()=>setSelected(null)} title={modalTitle} description="Interactive connected dummy-data flow for the extensive product demo." size={selected==='audio'?'lg':'md'} footer={<button onClick={()=>setSelected(null)} className="secondary-btn">Close</button>}>
      {selected==='audio'&&<div className="space-y-4">
        <div className="rounded-xl border border-purple/20 bg-purple/5 p-3.5"><div className="flex items-center gap-2 text-xs font-semibold text-ink"><Headphones size={14} className="text-purple"/>Transcript-to-debrief simulation</div><div className="mt-1 text-[10px] leading-5 text-muted">The transcript becomes a normal human-source debrief and then follows the same AI organization and human-review workflow.</div></div>
        {!settings.audioIngestion&&<div className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-[10px] text-danger">Audio ingestion is disabled in Settings. Enable it to run this extension.</div>}
        <div className="grid gap-4 md:grid-cols-2">
          <FieldLabel label="Mission ID"><input className="field" value={audio.mission} onChange={e=>setAudio({...audio,mission:e.target.value})}/></FieldLabel>
          <FieldLabel label="Aircraft"><CustomSelect value={audio.aircraft} onChange={aircraftValue=>setAudio({...audio,aircraft:aircraftValue})} options={aircraft}/></FieldLabel>
          <FieldLabel label="Debrief title"><input className="field" value={audio.title} onChange={e=>setAudio({...audio,title:e.target.value})}/></FieldLabel>
          <FieldLabel label="Crew profile"><CustomSelect value={audio.profileId} onChange={profileId=>setAudio({...audio,profileId})} options={profiles.map(p=>({value:p.id,label:p.name,description:`${p.role} · ${p.base}`}))}/></FieldLabel>
        </div>
        <FieldLabel label="Transcribed verbal debrief"><textarea className="textarea-field min-h-[150px]" value={audio.transcript} onChange={e=>setAudio({...audio,transcript:e.target.value})}/></FieldLabel>
        <button disabled={!settings.audioIngestion||!audio.transcript.trim()} onClick={ingestAudio} className="primary-btn"><Mic2 size={15}/>Create transcript debrief</button>
      </div>}

      {selected==='recommendations'&&<div className="space-y-4">
        <FieldLabel label="Crew / trainee profile"><CustomSelect value={recommendProfile} onChange={setRecommendProfile} options={profiles.map(p=>({value:p.id,label:p.name,description:`${p.role} · ${p.base}`}))}/></FieldLabel>
        <div className="rounded-xl border border-line bg-panel/40 p-3.5"><div className="text-[10px] font-semibold text-ink">Recommendation context</div><div className="mt-1 text-[9px] leading-4 text-muted">Demo uses trainer-maintained development indicators only as retrieval context. It does not grade or make safety decisions.</div></div>
        <div className="space-y-2">{recommendations.map(l=><Link key={l.id} to={`/lessons/${l.id}`} onClick={()=>setSelected(null)} className="group block rounded-xl border border-line bg-panel/35 p-3.5 transition hover:border-accent/30"><div className="text-[11px] font-semibold text-ink group-hover:text-accent">{l.title}</div><div className="mt-1 text-[9px] text-faint">{l.category} · {l.confidence}% knowledge confidence</div><div className="mt-2 text-[10px] leading-4 text-muted">{l.summary}</div></Link>)}</div>
      </div>}

      {selected==='acknowledgements'&&<div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldLabel label="Published lesson"><CustomSelect value={ackLesson} onChange={setAckLesson} options={lessons.filter(l=>l.status==='Published').map(l=>({value:l.id,label:l.title,description:l.category}))} menuWidth={320}/></FieldLabel>
          <FieldLabel label="Crew profile"><CustomSelect value={ackProfile} onChange={setAckProfile} options={profiles.map(p=>({value:p.id,label:p.name,description:p.role}))}/></FieldLabel>
        </div>
        <button disabled={!ackLesson||acknowledgements.some(a=>a.lessonId===ackLesson&&a.profileId===ackProfile)} onClick={()=>acknowledgeLesson(ackLesson,ackProfile)} className="primary-btn">Mark lesson acknowledged</button>
        <div className="space-y-2">{acknowledgements.slice(0,8).map(a=>{const lesson=lessons.find(l=>l.id===a.lessonId);const profile=profiles.find(p=>p.id===a.profileId);return <div key={a.id} className="rounded-xl border border-line bg-panel/35 p-3"><div className="text-[10px] font-semibold text-ink">{profile?.name||a.acknowledgedBy}</div><div className="mt-1 text-[9px] text-muted">Acknowledged “{lesson?.title||a.lessonId}” · {a.acknowledgedAt}</div></div>})}</div>
      </div>}

      {selected==='rbac'&&<div className="space-y-4">
        <div className="rounded-xl border border-line bg-panel/40 p-3.5"><div className="data-label">Current persona</div><div className="mt-1 text-sm font-semibold text-ink">{currentActor} · {persona}</div></div>
        <FieldLabel label="Switch demo persona"><CustomSelect value={persona} onChange={value=>setPersona(value as Persona)} options={[
          {value:'Crew Member',label:'Crew Member',description:'Read/search; no publication authority'},
          {value:'Trainer',label:'Trainer',description:'Review and validate lessons'},
          {value:'Checker',label:'Checker',description:'Review, validate & inspect assessments'},
        ]}/></FieldLabel>
        <div className="rounded-xl border border-success/20 bg-success/5 p-3.5 text-[10px] leading-5 text-muted">Open <Link className="font-semibold text-accent" to="/review" onClick={()=>setSelected(null)}>Human Review</Link> after switching persona to see publication permissions change in the actual workflow.</div>
      </div>}

      {selected==='aircraft'&&<div className="space-y-4">
        <FieldLabel label="Aircraft / platform"><CustomSelect value={settings.aircraftFilter} onChange={aircraftFilter=>updateSettings({aircraftFilter})} options={['All',...aircraft]}/></FieldLabel>
        <div className="text-[10px] text-muted">{filteredAircraft.length} debrief record{filteredAircraft.length===1?'':'s'} match the selected platform.</div>
        <div className="space-y-2">{filteredAircraft.slice(0,6).map(d=><Link key={d.id} to={`/debriefs/${d.id}`} onClick={()=>setSelected(null)} className="group block rounded-xl border border-line bg-panel/35 p-3 transition hover:border-accent/30"><div className="text-[11px] font-semibold text-ink group-hover:text-accent">{d.title}</div><div className="mt-1 text-[9px] text-faint">{d.aircraft} · {d.type} · {d.date}</div></Link>)}</div>
      </div>}

      {selected==='retention'&&<div className="space-y-4">
        <FieldLabel label="Demo retention period" hint="days"><input className="field" type="number" min="30" value={retention} onChange={e=>setRetention(e.target.value)}/></FieldLabel>
        <Toggle checked={settings.detailedAudit} onChange={checked=>updateSettings({detailedAudit:checked})} label="Detailed audit history" description="Preserve explicit AI/human traceability events in the demo."/>
        <button onClick={()=>updateSettings({retentionDays:Math.max(30,Number(retention)||30)})} className="primary-btn">Save configuration</button>
        <div className="text-[9px] text-faint">Configuration changes are recorded in <Link to="/audit" onClick={()=>setSelected(null)} className="font-semibold text-accent">Audit & Traceability</Link>.</div>
      </div>}
    </Modal>
  </>
}
