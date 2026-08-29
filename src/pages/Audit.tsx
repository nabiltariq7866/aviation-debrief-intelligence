import { Search, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, PageHeader } from '../components/ui'
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
  const entities=['All','Debrief','Lesson','Training Profile','Knowledge','System']

  const visible=useMemo(()=>audit.filter(event=>(entity==='All'||event.entityType===entity)&&`${event.entityId} ${event.action} ${event.detail} ${event.actor} ${event.role}`.toLowerCase().includes(q.toLowerCase())),[audit,q,entity])

  return <>
    <PageHeader eyebrow="Traceability" title="Audit & AI / human action history" description="Show exactly what the human submitted, what AI organized, and what an authorized human later validated. This makes the demo's human-in-the-loop boundary visible and inspectable." actions={<Badge tone="success"><ShieldCheck size={11}/>Traceable workflow</Badge>}/>

    <div className="mb-4 card p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"/><input value={q} onChange={e=>setQ(e.target.value)} className="field h-10 pl-9" placeholder="Search action, record ID, actor or role…"/></div>
        <div className="flex gap-2 overflow-x-auto">{entities.map(item=><button key={item} onClick={()=>setEntity(item)} className={`whitespace-nowrap rounded-xl border px-3 py-2 text-[10px] font-semibold ${entity===item?'border-accent/30 bg-accent/10 text-accent':'border-line bg-panel/40 text-muted'}`}>{item}</button>)}</div>
      </div>
    </div>

    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left">
          <thead><tr className="border-b border-line/60 bg-panel/25 text-[9px] uppercase tracking-[.08em] text-faint"><th className="px-4 py-3">Time</th><th>Record</th><th>Action</th><th>Actor</th><th>Role</th><th>Detail</th></tr></thead>
          <tbody>{visible.map(event=><tr key={event.id} className="border-b border-line/45 last:border-0 hover:bg-panel/35">
            <td className="px-4 py-3 text-[9px] text-faint">{event.time}</td>
            <td className="py-3"><Link to={toFor(event.entityType,event.entityId)} className="text-[10px] font-semibold text-ink hover:text-accent">{event.entityId}</Link><div className="mt-0.5 text-[8px] text-faint">{event.entityType}</div></td>
            <td className="py-3"><div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${event.tone==='success'?'bg-success':event.tone==='danger'?'bg-danger':event.tone==='purple'?'bg-purple':event.tone==='accent'?'bg-accent':'bg-faint'}`}/><span className="text-[10px] font-semibold text-ink">{event.action}</span></div></td>
            <td className="py-3 text-[10px] text-muted">{event.actor}</td>
            <td className="py-3"><Badge tone={event.role==='AI System'?'purple':event.role==='Checker'?'success':event.role==='Trainer'?'accent':'muted'}>{event.role}</Badge></td>
            <td className="max-w-[420px] py-3 pr-4 text-[10px] leading-4 text-muted">{event.detail}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  </>
}
