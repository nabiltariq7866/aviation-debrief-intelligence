import { ArrowRight, Search, TrendingDown, TrendingUp, Minus, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Modal, PageHeader, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'
import type { Trend } from '../data/types'

const tooltipStyle={background:'var(--bg-elevated)',border:'1px solid var(--border-primary)',borderRadius:12,color:'var(--text-primary)',boxShadow:'var(--shadow-float)'}

export default function Trends(){
  const {trends,debriefs}=useDemo()
  const [selected,setSelected]=useState<Trend|null>(null)
  const totalSignals=trends.reduce((sum,t)=>sum+t.occurrences,0)
  const totalEvidence=trends.reduce((sum,t)=>sum+t.sourceDebriefIds.length,0)

  return <>
    <PageHeader
      eyebrow="Pattern Detection"
      title="Trend intelligence"
      description="Identify recurring operational and training patterns across historical debriefs and assessment records. Every signal remains grounded in inspectable human-authored evidence."
      actions={<Badge tone="success"><ShieldCheck size={11}/>Evidence-linked patterns</Badge>}
    />

    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      <div className="card p-4"><div className="data-label">Pattern signals</div><div className="mt-2 text-2xl font-semibold text-ink">{trends.length}</div><div className="mt-1 text-[10px] text-muted">Recurring themes currently surfaced</div></div>
      <div className="card p-4"><div className="data-label">Occurrences represented</div><div className="mt-2 text-2xl font-semibold text-ink">{totalSignals}</div><div className="mt-1 text-[10px] text-muted">Across historical learning records</div></div>
      <div className="card p-4"><div className="data-label">Supporting evidence</div><div className="mt-2 text-2xl font-semibold text-ink">{totalEvidence}</div><div className="mt-1 text-[10px] text-muted">Inspectable debrief source records</div></div>
    </div>

    <div className="grid gap-4 xl:grid-cols-2">
      {trends.map(t=>{
        const DirectionIcon=t.direction==='Up'?TrendingUp:t.direction==='Down'?TrendingDown:Minus
        return <SectionCard
          key={t.id}
          title={t.title}
          description={t.description}
          action={<Badge tone={t.direction==='Up'?'accent':t.direction==='Down'?'success':'info'}><DirectionIcon size={11}/>{t.direction} {t.change}%</Badge>}
          bodyClassName="p-0"
        >
          <div className="grid grid-cols-3 gap-px border-b border-line bg-line">
            <div className="bg-surface px-4 py-3"><div className="data-label">Occurrences</div><div className="mt-1 text-xl font-semibold text-ink">{t.occurrences}</div></div>
            <div className="bg-surface px-4 py-3"><div className="data-label">Crews</div><div className="mt-1 text-xl font-semibold text-ink">{t.crews}</div></div>
            <div className="bg-surface px-4 py-3"><div className="data-label">Evidence</div><div className="mt-1 text-xl font-semibold text-ink">{t.sourceDebriefIds.length}</div></div>
          </div>

          <div className="p-4">
            <div className="mb-2 flex items-center justify-between"><div className="text-[10px] font-semibold text-muted">Signal frequency</div><div className="text-[9px] text-faint">Mar — Aug</div></div>
            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={t.months}>
                  <defs><linearGradient id={`trend-${t.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".30"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
                  <CartesianGrid vertical={false}/>
                  <XAxis dataKey="month" axisLine={false} tickLine={false}/>
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={22}/>
                  <Tooltip contentStyle={tooltipStyle}/>
                  <Area type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} fill={`url(#trend-${t.id})`}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <button onClick={()=>setSelected(t)} className="mt-3 flex w-full items-center justify-between rounded-xl border border-line bg-panel/45 px-3.5 py-3 text-left transition hover:border-accent/30 hover:bg-panel">
              <div><div className="text-[10px] font-semibold text-ink">Inspect supporting evidence</div><div className="mt-1 text-[9px] text-muted">Human-authored records remain available before interpretation.</div></div>
              <ArrowRight size={14} className="shrink-0 text-accent"/>
            </button>
          </div>
        </SectionCard>
      })}
    </div>

    <Modal
      open={Boolean(selected)}
      onClose={()=>setSelected(null)}
      title={selected?.title||'Trend evidence'}
      description="Open the source records behind this recurring pattern. AI surfaces similarity and frequency; qualified humans decide what the evidence means operationally."
      size="lg"
      footer={<button onClick={()=>setSelected(null)} className="secondary-btn">Close evidence</button>}
    >
      <div className="mb-4 rounded-xl border border-success/20 bg-success/5 p-3.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink"><ShieldCheck size={14} className="text-success"/>Human interpretation retained</div>
        <div className="mt-1 text-[10px] leading-5 text-muted">No safety-critical instruction is generated from this trend. The system only organizes the supporting operational knowledge.</div>
      </div>
      <div className="space-y-2">
        {selected?.sourceDebriefIds.map(id=>{
          const d=debriefs.find(item=>item.id===id)
          return d?<Link to={`/debriefs/${d.id}`} key={d.id} className="group flex items-start gap-3 rounded-xl border border-line bg-panel/40 p-3.5 transition hover:border-accent/30">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-accent"><Search size={14}/></div>
            <div className="min-w-0 flex-1"><div className="text-xs font-semibold text-ink group-hover:text-accent">{d.title}</div><div className="mt-1 text-[9px] text-faint">{d.id} · {d.type} · {d.date} · {d.crew.join(', ')}</div><div className="mt-2 line-clamp-2 text-[10px] leading-4 text-muted">{d.aiSummary||d.rawNotes}</div></div>
            <ArrowRight size={13} className="mt-1 shrink-0 text-faint transition group-hover:text-accent"/>
          </Link>:<div key={id} className="rounded-xl border border-line p-3 text-xs text-muted">Historical evidence reference {id}</div>
        })}
      </div>
    </Modal>
  </>
}
