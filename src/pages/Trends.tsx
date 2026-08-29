import { ArrowRight, Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Modal, PageHeader, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'
import type { Trend } from '../data/types'

export default function Trends(){
  const {trends,debriefs}=useDemo()
  const [selected,setSelected]=useState<Trend|null>(null)

  return <>
    <PageHeader
      eyebrow="Pattern Detection"
      title="Trend intelligence"
      description="Identify recurring operational and training patterns across historical debriefs and assessment records. Every pattern can be drilled back to its supporting human-authored evidence."
    />

    <div className="grid gap-4 xl:grid-cols-2">
      {trends.map(t=><SectionCard
        key={t.id}
        title={t.title}
        description={t.description}
        action={<Badge tone={t.direction==='Up'?'accent':'success'}><TrendingUp size={11}/>{t.direction} {t.change}%</Badge>}
      >
        <div className="grid grid-cols-3 gap-3">
          <div><div className="text-[9px] text-faint">Occurrences</div><div className="mt-1 text-xl font-semibold text-ink">{t.occurrences}</div></div>
          <div><div className="text-[9px] text-faint">Crews</div><div className="mt-1 text-xl font-semibold text-ink">{t.crews}</div></div>
          <div><div className="text-[9px] text-faint">Evidence</div><div className="mt-1 text-xl font-semibold text-ink">{t.sourceDebriefIds.length}</div></div>
        </div>

        <div className="mt-4 h-[190px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={t.months}>
              <defs><linearGradient id={`g-${t.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".28"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="var(--border-primary)" strokeOpacity={.45}/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:9,fill:'var(--text-muted)'}}/>
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fontSize:9,fill:'var(--text-muted)'}}/>
              <Tooltip contentStyle={{background:'var(--bg-elevated)',border:'1px solid var(--border-primary)',borderRadius:12,color:'var(--text-primary)'}}/>
              <Area type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} fill={`url(#g-${t.id})`}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-line/55 bg-panel/35 px-3 py-2.5">
          <div className="text-[9px] text-muted">Evidence remains inspectable before any operational interpretation.</div>
          <button onClick={()=>setSelected(t)} className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">View supporting evidence <ArrowRight size={12}/></button>
        </div>
      </SectionCard>)}
    </div>

    <Modal
      open={Boolean(selected)}
      onClose={()=>setSelected(null)}
      title={selected?.title||'Trend evidence'}
      description="The recurring pattern is grounded in the debriefs below. Open any source record to inspect the original human-authored evidence."
      footer={<button onClick={()=>setSelected(null)} className="secondary-btn">Close</button>}
    >
      <div className="mb-4 rounded-xl border border-success/20 bg-success/5 p-3 text-xs leading-5 text-muted">AI identifies similarity and frequency. Qualified humans decide what the evidence means operationally; the system does not issue safety-critical direction.</div>
      <div className="space-y-2">
        {selected?.sourceDebriefIds.map(id=>{
          const d=debriefs.find(item=>item.id===id)
          return d?<Link to={`/debriefs/${d.id}`} key={d.id} className="group flex items-start gap-3 rounded-xl border border-line/60 bg-panel/35 p-3 transition hover:border-accent/30">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent"><Search size={13}/></div>
            <div className="min-w-0 flex-1"><div className="text-xs font-semibold text-ink group-hover:text-accent">{d.title}</div><div className="mt-1 text-[9px] text-faint">{d.id} · {d.type} · {d.date} · {d.crew.join(', ')}</div><div className="mt-2 line-clamp-2 text-[10px] leading-4 text-muted">{d.aiSummary||d.rawNotes}</div></div>
          </Link>:<div key={id} className="rounded-xl border border-line/60 p-3 text-xs text-muted">Historical evidence reference {id}</div>
        })}
      </div>
    </Modal>
  </>
}
