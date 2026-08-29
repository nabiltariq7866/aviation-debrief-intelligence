import { ArrowRight, Bot, Search, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, CustomSelect, EmptyState, PageHeader, SearchField } from '../components/ui'
import { useDemo } from '../state/DemoContext'

const toFor=(entityType:string,entityId:string)=>{
  if(entityType==='Debrief')return `/debriefs/${entityId}`
  if(entityType==='Lesson'||entityType==='Knowledge')return `/lessons/${entityId}`
  if(entityType==='Training Profile')return `/training-profiles/${entityId}`
  return '/settings'
}

export default function Audit(){
  const {audit}=useDemo()
  const [q,setQ]=useState('')
  const [entity,setEntity]=useState('All')
  const [role,setRole]=useState('All')

  const visible=useMemo(()=>audit.filter(event=>(entity==='All'||event.entityType===entity)&&(role==='All'||event.role===role)&&`${event.entityId} ${event.action} ${event.detail} ${event.actor} ${event.role}`.toLowerCase().includes(q.toLowerCase())),[audit,q,entity,role])
  const aiCount=audit.filter(e=>e.role==='AI System').length
  const humanCount=audit.length-aiCount

  return <>
    <PageHeader
      eyebrow="Traceability"
      title="Audit & AI / human action history"
      description="Inspect the complete separation between human-authored source records, AI organization steps and later human validation decisions."
      actions={<Badge tone="success"><ShieldCheck size={11}/>Traceable workflow</Badge>}
    />

    <div className="grid gap-3 sm:grid-cols-3">
      <div className="card p-4"><div className="data-label">Audit events</div><div className="mt-2 text-2xl font-semibold text-ink">{audit.length}</div><div className="mt-1 text-[10px] text-muted">Persisted demo traceability events</div></div>
      <div className="card p-4"><div className="flex items-center justify-between"><div><div className="data-label">Human actions</div><div className="mt-2 text-2xl font-semibold text-ink">{humanCount}</div><div className="mt-1 text-[10px] text-muted">Crew, trainer and checker activity</div></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-success/10 text-success"><UserRoundCheck size={16}/></div></div></div>
      <div className="card p-4"><div className="flex items-center justify-between"><div><div className="data-label">AI actions</div><div className="mt-2 text-2xl font-semibold text-ink">{aiCount}</div><div className="mt-1 text-[10px] text-muted">Organization and similarity events</div></div><div className="grid h-9 w-9 place-items-center rounded-xl bg-purple/10 text-purple"><Bot size={16}/></div></div></div>
    </div>

    <div className="card my-4 p-3.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <SearchField value={q} onChange={setQ} placeholder="Search action, record ID, actor or role…" className="min-w-[280px] flex-1"/>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <CustomSelect value={entity} onChange={setEntity} options={['All','Debrief','Lesson','Training Profile','Knowledge','System']} className="sm:w-[190px]"/>
          <CustomSelect value={role} onChange={setRole} options={['All','Crew Member','Trainer','Checker','AI System']} className="sm:w-[170px]"/>
        </div>
      </div>
    </div>

    {visible.length?<div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] text-left">
          <thead><tr className="border-b border-line bg-panel/35 text-[9px] uppercase tracking-[.11em] text-faint"><th className="px-4 py-3 font-semibold">Time</th><th className="px-3 font-semibold">Record</th><th className="px-3 font-semibold">Action</th><th className="px-3 font-semibold">Actor</th><th className="px-3 font-semibold">Role</th><th className="px-3 pr-4 font-semibold">Detail</th></tr></thead>
          <tbody>{visible.map(event=><tr key={event.id} className="group border-b border-line/60 last:border-0 transition hover:bg-panel/35">
            <td className="px-4 py-3 text-[9px] text-faint">{event.time}</td>
            <td className="px-3 py-3"><Link to={toFor(event.entityType,event.entityId)} className="inline-flex items-center gap-1 text-[10px] font-semibold text-ink transition group-hover:text-accent">{event.entityId}<ArrowRight size={10}/></Link><div className="mt-1 text-[8px] text-faint">{event.entityType}</div></td>
            <td className="px-3 py-3"><div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${event.tone==='success'?'bg-success':event.tone==='danger'?'bg-danger':event.tone==='purple'?'bg-purple':event.tone==='accent'?'bg-accent':'bg-faint'}`}/><span className="text-[10px] font-semibold text-ink">{event.action}</span></div></td>
            <td className="px-3 py-3 text-[10px] text-muted">{event.actor}</td>
            <td className="px-3 py-3"><Badge tone={event.role==='AI System'?'purple':event.role==='Checker'?'success':event.role==='Trainer'?'accent':'muted'}>{event.role}</Badge></td>
            <td className="max-w-[460px] px-3 py-3 pr-4 text-[10px] leading-4 text-muted">{event.detail}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>:<EmptyState icon={<Search size={18}/>} title="No audit events match" description="Clear the filters or search a different action, actor or record ID." action={<button onClick={()=>{setQ('');setEntity('All');setRole('All')}} className="secondary-btn">Clear filters</button>}/>} 
  </>
}
