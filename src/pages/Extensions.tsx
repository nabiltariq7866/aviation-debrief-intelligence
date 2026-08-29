import { Headphones, LockKeyhole, Mic2, Plane, ReceiptText, Settings2, UserCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, FieldLabel, Modal, PageHeader } from '../components/ui'
import { useDemo } from '../state/DemoContext'
import type { Persona } from '../data/types'

type ExtensionKey='audio'|'recommendations'|'acknowledgements'|'rbac'|'aircraft'|'retention'

const extensions:Array<{key:ExtensionKey;title:string;desc:string;icon:typeof Mic2}>=[
  {key:'audio',title:'Audio / transcript ingestion',desc:'Capture a verbal debrief transcript and route it into the same structured learning workflow.',icon:Mic2},
  {key:'recommendations',title:'Crew-specific lesson recommendations',desc:'Demonstrate how published lessons could be surfaced against a crew member’s current development context.',icon:UserCheck},
  {key:'acknowledgements',title:'Acknowledgement tracking',desc:'Track whether distributed lessons were viewed or acknowledged by selected crew profiles.',icon:ReceiptText},
  {key:'rbac',title:'Role-based access control',desc:'Switch between Crew Member, Trainer and Checker personas and demonstrate publication permissions.',icon:LockKeyhole},
  {key:'aircraft',title:'Aircraft / platform filtering',desc:'Filter debrief evidence by aircraft type without changing the underlying source records.',icon:Plane},
  {key:'retention',title:'Retention & audit configuration',desc:'Configure a dummy retention period and detailed traceability setting, with changes written to audit history.',icon:Settings2},
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

  return <>
    <PageHeader
      eyebrow="Extensive Demo"
      title="Extended capabilities"
      description="These capabilities go beyond Todd’s explicitly confirmed five core modules. They are implemented as interactive dummy flows so the broader product vision can be demonstrated without presenting them as client-confirmed requirements."
    />

    <div className="mb-4 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-xs leading-5 text-muted">
      Core client flow remains: debrief → AI organization → lesson/trend detection → human validation → searchable knowledge → training-profile linkage. Everything below is clearly labeled as an optional extension.
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {extensions.map(item=>{
        const Icon=item.icon
        return <div key={item.key} className="card p-4">
          <div className="flex items-start justify-between gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-purple/10 text-purple"><Icon size={18}/></div><Badge tone="purple">Optional extension</Badge></div>
          <div className="mt-4 text-sm font-semibold text-ink">{item.title}</div>
          <div className="mt-2 min-h-[52px] text-xs leading-5 text-muted">{item.desc}</div>
          <button onClick={()=>setSelected(item.key)} className="secondary-btn mt-4 w-full">Open interactive demo</button>
        </div>
      })}
    </div>

    <Modal open={selected!==null} onClose={()=>setSelected(null)} title={modalTitle} description="Interactive dummy-data flow for the extensive product demo." footer={<button onClick={()=>setSelected(null)} className="secondary-btn">Close</button>}>
      {selected==='audio'&&<div className="space-y-4">
        <div className="rounded-xl border border-purple/20 bg-purple/5 p-3 text-xs leading-5 text-muted"><Headphones size={15} className="mb-2 text-purple"/>Simulate speech-to-text ingestion. The transcript becomes a normal human-source debrief and then follows the exact same AI organization and human-review workflow.</div>
        {!settings.audioIngestion&&<div className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-xs text-danger">Audio ingestion is disabled in Settings. Enable it to run this extension.</div>}
        <div className="grid gap-4 md:grid-cols-2"><FieldLabel label="Mission ID"><input className="field" value={audio.mission} onChange={e=>setAudio({...audio,mission:e.target.value})}/></FieldLabel><FieldLabel label="Aircraft"><select className="field" value={audio.aircraft} onChange={e=>setAudio({...audio,aircraft:e.target.value})}>{aircraft.map(x=><option key={x}>{x}</option>)}</select></FieldLabel><FieldLabel label="Debrief title"><input className="field" value={audio.title} onChange={e=>setAudio({...audio,title:e.target.value})}/></FieldLabel><FieldLabel label="Crew profile"><select className="field" value={audio.profileId} onChange={e=>setAudio({...audio,profileId:e.target.value})}>{profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></FieldLabel></div>
        <FieldLabel label="Transcribed verbal debrief"><textarea className="field min-h-[150px]" value={audio.transcript} onChange={e=>setAudio({...audio,transcript:e.target.value})}/></FieldLabel>
        <button disabled={!settings.audioIngestion||!audio.transcript.trim()} onClick={ingestAudio} className="primary-btn"><Mic2 size={15}/>Create transcript debrief</button>
      </div>}

      {selected==='recommendations'&&<div className="space-y-4">
        <FieldLabel label="Crew / trainee profile"><select className="field" value={recommendProfile} onChange={e=>setRecommendProfile(e.target.value)}>{profiles.map(p=><option key={p.id} value={p.id}>{p.name} — {p.role}</option>)}</select></FieldLabel>
        <div className="rounded-xl border border-line/60 bg-panel/35 p-3"><div className="text-[10px] font-semibold text-ink">Recommendation context</div><div className="mt-1 text-[9px] text-muted">Demo uses trainer-maintained development indicators only as retrieval context. It does not grade or make safety decisions.</div></div>
        <div className="space-y-2">{recommendations.map(l=><Link key={l.id} to={`/lessons/${l.id}`} onClick={()=>setSelected(null)} className="block rounded-xl border border-line/60 bg-panel/35 p-3 hover:border-accent/30"><div className="text-xs font-semibold text-ink">{l.title}</div><div className="mt-1 text-[9px] text-faint">{l.category} · {l.confidence}% knowledge confidence</div><div className="mt-2 text-[10px] leading-4 text-muted">{l.summary}</div></Link>)}</div>
      </div>}

      {selected==='acknowledgements'&&<div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2"><FieldLabel label="Published lesson"><select className="field" value={ackLesson} onChange={e=>setAckLesson(e.target.value)}>{lessons.filter(l=>l.status==='Published').map(l=><option key={l.id} value={l.id}>{l.title}</option>)}</select></FieldLabel><FieldLabel label="Crew profile"><select className="field" value={ackProfile} onChange={e=>setAckProfile(e.target.value)}>{profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></FieldLabel></div>
        <button disabled={!ackLesson||acknowledgements.some(a=>a.lessonId===ackLesson&&a.profileId===ackProfile)} onClick={()=>acknowledgeLesson(ackLesson,ackProfile)} className="primary-btn">Mark lesson acknowledged</button>
        <div className="space-y-2">{acknowledgements.slice(0,8).map(a=>{const lesson=lessons.find(l=>l.id===a.lessonId);const profile=profiles.find(p=>p.id===a.profileId);return <div key={a.id} className="rounded-xl border border-line/60 bg-panel/35 p-3"><div className="text-[10px] font-semibold text-ink">{profile?.name||a.acknowledgedBy}</div><div className="mt-1 text-[9px] text-muted">Acknowledged “{lesson?.title||a.lessonId}” · {a.acknowledgedAt}</div></div>})}</div>
      </div>}

      {selected==='rbac'&&<div className="space-y-4">
        <div className="text-xs leading-5 text-muted">Current persona: <span className="font-semibold text-ink">{currentActor} · {persona}</span></div>
        <div className="grid gap-2 sm:grid-cols-3">{(['Crew Member','Trainer','Checker'] as Persona[]).map(role=><button key={role} onClick={()=>setPersona(role)} className={`rounded-xl border p-3 text-left transition ${persona===role?'border-accent/35 bg-accent/10':'border-line bg-panel/35'}`}><div className="text-xs font-semibold text-ink">{role}</div><div className="mt-1 text-[9px] leading-4 text-muted">{role==='Crew Member'?'Read/search knowledge; cannot publish lessons.':role==='Trainer'?'Review and validate learning candidates.':'Review, validate and inspect assessment evidence.'}</div></button>)}</div>
        <div className="rounded-xl border border-success/20 bg-success/5 p-3 text-xs leading-5 text-muted">Open <Link className="font-semibold text-accent" to="/review" onClick={()=>setSelected(null)}>Human Review</Link> after switching persona to see permissions change in the actual workflow.</div>
      </div>}

      {selected==='aircraft'&&<div className="space-y-4">
        <FieldLabel label="Aircraft / platform"><select className="field" value={settings.aircraftFilter} onChange={e=>updateSettings({aircraftFilter:e.target.value})}><option>All</option>{aircraft.map(x=><option key={x}>{x}</option>)}</select></FieldLabel>
        <div className="text-xs text-muted">{filteredAircraft.length} debrief record{filteredAircraft.length===1?'':'s'} match the selected platform.</div>
        <div className="space-y-2">{filteredAircraft.slice(0,6).map(d=><Link key={d.id} to={`/debriefs/${d.id}`} onClick={()=>setSelected(null)} className="block rounded-xl border border-line/60 bg-panel/35 p-3 hover:border-accent/30"><div className="text-xs font-semibold text-ink">{d.title}</div><div className="mt-1 text-[9px] text-faint">{d.aircraft} · {d.type} · {d.date}</div></Link>)}</div>
      </div>}

      {selected==='retention'&&<div className="space-y-4">
        <FieldLabel label="Demo retention period" hint="days"><input className="field" type="number" min="30" value={retention} onChange={e=>setRetention(e.target.value)}/></FieldLabel>
        <label className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-panel/35 p-3"><div><div className="text-xs font-semibold text-ink">Detailed audit history</div><div className="mt-1 text-[9px] text-muted">Preserve explicit AI/human traceability events in the demo.</div></div><input type="checkbox" checked={settings.detailedAudit} onChange={e=>updateSettings({detailedAudit:e.target.checked})}/></label>
        <button onClick={()=>updateSettings({retentionDays:Math.max(30,Number(retention)||30)})} className="primary-btn">Save configuration</button>
        <div className="text-[9px] text-faint">Configuration changes are themselves recorded in <Link to="/audit" onClick={()=>setSelected(null)} className="font-semibold text-accent">Audit & Traceability</Link>.</div>
      </div>}
    </Modal>
  </>
}
