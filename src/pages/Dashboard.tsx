import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, MetricCard, PageHeader, Progress, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

const learningActivity=[
  {month:'Mar',debriefs:16,lessons:5},
  {month:'Apr',debriefs:19,lessons:6},
  {month:'May',debriefs:21,lessons:7},
  {month:'Jun',debriefs:25,lessons:8},
  {month:'Jul',debriefs:31,lessons:10},
  {month:'Aug',debriefs:38,lessons:12},
]

const knowledgeGrowth=[
  {month:'Mar',published:6},
  {month:'Apr',published:8},
  {month:'May',published:11},
  {month:'Jun',published:14},
  {month:'Jul',published:17},
  {month:'Aug',published:22},
]

const tooltipStyle={background:'var(--bg-elevated)',border:'1px solid var(--border-primary)',borderRadius:12,color:'var(--text-primary)',boxShadow:'var(--shadow-float)'}

export default function Dashboard(){
  const {debriefs,lessons,trends,profiles,activity}=useDemo()
  const pending=lessons.filter(l=>l.status==='Draft').length
  const published=lessons.filter(l=>l.status==='Published').length
  const recentTrend=trends[0]
  const backlog=debriefs.filter(d=>d.status==='Review Required')
  const peakBacklog=backlog.filter(d=>d.peakSeason).length
  const backlogRate=debriefs.length?Math.round(backlog.length/debriefs.length*100):0

  return <>
    <PageHeader
      eyebrow="Operational Learning"
      title="Learning intelligence command center"
      description="Turn crew, training and assessment debriefs into structured lessons, recurring patterns and searchable organizational knowledge while preserving human authority over safety-critical judgement."
      actions={<Link to="/debriefs/new" className="primary-btn"><Sparkles size={15}/>Run core demo flow</Link>}
    />

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Debriefs captured" value={String(debriefs.length)} caption="Post-mission, training & assessment" icon={<BookOpen size={16}/>} tone="info" change="Live"/>
      <MetricCard label="Published lessons" value={String(published)} caption="Searchable organization-wide" icon={<BrainCircuit size={16}/>} tone="success" change="Validated"/>
      <MetricCard label="Recurring trends" value={String(trends.length)} caption="Evidence-backed pattern signals" icon={<TrendingUp size={16}/>} tone="accent" change="+21%"/>
      <MetricCard label="Human review" value={String(pending)} caption="AI candidates awaiting validation" icon={<ShieldCheck size={16}/>} tone="purple"/>
    </div>

    <div className="mt-4 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/10 via-surface to-purple/5">
      <div className="grid gap-0 xl:grid-cols-[1.1fr_.9fr]">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent"><AlertTriangle size={18}/></div>
            <div className="min-w-0 flex-1">
              <div className="label text-accent">Review backlog</div>
              <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1"><span className="text-[34px] font-semibold tracking-[-.05em] text-ink">{backlog.length}</span><span className="mb-1 text-sm font-semibold text-ink">debriefs awaiting review</span></div>
              <p className="mt-2 max-w-2xl text-[11px] leading-5 text-muted">The workspace now demonstrates triage at operational volume, not just archive search. Peak-season records are visibly separated so reviewers can prioritize the highest-pressure period.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 border-t border-line/70 xl:border-l xl:border-t-0">
          <div className="p-5"><div className="data-label">Peak-season backlog</div><div className="mt-2 text-2xl font-semibold text-accent">{peakBacklog}</div><div className="mt-1 text-[10px] text-muted">flagged for priority review</div></div>
          <div className="border-l border-line/70 p-5"><div className="data-label">Queue share</div><div className="mt-2 text-2xl font-semibold text-ink">{backlogRate}%</div><Link to="/debriefs?status=Review%20Required" className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open triage queue <ArrowRight size={12}/></Link></div>
        </div>
      </div>
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
      <SectionCard title="Learning activity" description="Debrief volume and organization-wide lessons surfaced over time" action={<Badge tone="success">Operational learning growing</Badge>}>
        <div className="mb-4 flex flex-wrap gap-5 text-[10px] text-muted">
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success"/>Debriefs</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent"/>Lessons surfaced</span>
        </div>
        <div className="h-[285px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={learningActivity} barCategoryGap="34%">
              <CartesianGrid vertical={false}/>
              <XAxis dataKey="month" axisLine={false} tickLine={false}/>
              <YAxis axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltipStyle} cursor={{fill:'rgba(197,155,72,.055)'}}/>
              <Bar dataKey="debriefs" fill="var(--success)" radius={[5,5,0,0]} maxBarSize={26}/>
              <Bar dataKey="lessons" fill="var(--accent)" radius={[5,5,0,0]} maxBarSize={18}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Core learning workflow" description="The exact client story, connected end-to-end">
        <div className="space-y-1">
          {[
            ['1','Crew debrief captured','Human-authored source preserved','success'],
            ['2','AI organizes observations','Summary, categories & lesson candidate','purple'],
            ['3','Historical similarity checked','Supporting records remain inspectable','accent'],
            ['4','Trainer / checker validates','Human authority before publication','success'],
            ['5','Knowledge becomes searchable','Available to the wider organization','accent'],
          ].map(([step,title,desc,tone],index)=><div key={step} className="relative flex gap-3 pb-4 last:pb-0">
            {index<4&&<span className="absolute left-[15px] top-8 h-[calc(100%-18px)] w-px bg-line"/>}
            <div className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-xl border text-[10px] font-bold ${tone==='success'?'border-success/25 bg-success/10 text-success':tone==='purple'?'border-purple/25 bg-purple/10 text-purple':'border-accent/25 bg-accent/10 text-accent'}`}>{step}</div>
            <div className="pt-0.5"><div className="text-xs font-semibold text-ink">{title}</div><div className="mt-1 text-[10px] leading-4 text-muted">{desc}</div></div>
          </div>)}
        </div>
        <Link to="/debriefs/new" className="secondary-btn mt-4 w-full">Start with a new debrief <ArrowRight size={14}/></Link>
      </SectionCard>
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
      <SectionCard title="Recurring pattern signal" description="One crew's experience connected to wider evidence" action={<Link to="/trends" className="text-[11px] font-semibold text-accent">Open trend intelligence</Link>}>
        {recentTrend&&<>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><div className="text-sm font-semibold text-ink">{recentTrend.title}</div><div className="mt-1 max-w-xl text-[11px] leading-5 text-muted">{recentTrend.description}</div></div>
              <Badge tone="accent"><TrendingUp size={11}/>{recentTrend.direction} {recentTrend.change}%</Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="panel-soft p-3"><div className="data-label">Occurrences</div><div className="mt-1 text-xl font-semibold text-ink">{recentTrend.occurrences}</div></div>
              <div className="panel-soft p-3"><div className="data-label">Crews</div><div className="mt-1 text-xl font-semibold text-ink">{recentTrend.crews}</div></div>
              <div className="panel-soft p-3"><div className="data-label">Evidence</div><div className="mt-1 text-xl font-semibold text-ink">{recentTrend.sourceDebriefIds.length}</div></div>
            </div>
          </div>
          <div className="mt-4 h-[145px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={knowledgeGrowth}>
                <defs><linearGradient id="knowledgeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".26"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
                <CartesianGrid vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false}/><YAxis hide/>
                <Tooltip contentStyle={tooltipStyle}/><Area dataKey="published" type="monotone" stroke="var(--accent)" strokeWidth={2} fill="url(#knowledgeGradient)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>}
      </SectionCard>

      <SectionCard title="Live learning activity" description="Latest human, AI and publication events" action={<Link to="/audit" className="text-[11px] font-semibold text-accent">Full audit history</Link>}>
        <div className="space-y-2">
          {activity.slice(0,6).map(event=><div key={event.id} className="flex items-start gap-3 rounded-xl border border-line bg-panel/40 p-3.5">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${event.tone==='success'?'bg-success':event.tone==='danger'?'bg-danger':event.tone==='purple'?'bg-purple':'bg-accent'}`}/>
            <div className="min-w-0 flex-1"><div className="text-xs font-semibold text-ink">{event.title}</div><div className="mt-1 text-[10px] leading-4 text-muted">{event.detail}</div></div>
            <div className="inline-flex shrink-0 items-center gap-1 text-[9px] text-faint"><Clock3 size={10}/>{event.time}</div>
          </div>)}
        </div>
      </SectionCard>
    </div>

    <div className="mt-4 grid gap-4 md:grid-cols-3">
      <div className="card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink"><GraduationCap size={16} className="text-purple"/>Training development</div>
        <div className="mt-4 flex items-end justify-between"><div><div className="text-2xl font-semibold text-ink">{profiles.length}</div><div className="mt-1 text-[10px] text-muted">Individual profiles connected to source records</div></div><Link to="/training-profiles" className="text-[10px] font-semibold text-accent">Open profiles</Link></div>
      </div>
      <div className="card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink"><UsersRound size={16} className="text-success"/>Knowledge distribution</div>
        <div className="mt-4"><div className="mb-2 flex justify-between text-[10px]"><span className="text-muted">Published vs total lessons</span><span className="font-semibold text-ink">{published}/{lessons.length}</span></div><Progress value={lessons.length?published/lessons.length*100:0} tone="success"/></div>
      </div>
      <div className="card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink"><CheckCircle2 size={16} className="text-success"/>Safety boundary</div>
        <div className="mt-3 text-[10px] leading-5 text-muted">AI organizes, summarizes and detects similarity. Qualified crew, trainers and checkers retain safety-critical judgement and validation authority.</div>
      </div>
    </div>
  </>
}
