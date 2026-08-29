import { ArrowRight, BookOpen, ClipboardList, GraduationCap, Search, Sparkles, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, EmptyState, PageHeader, SearchField } from '../components/ui'
import { useDemo } from '../state/DemoContext'

type Filter='All'|'Lessons'|'Debriefs'|'Training'|'Assessments'|'Trends'
type SearchResult={
  id:string
  type:Exclude<Filter,'All'>
  title:string
  meta:string
  text:string
  to:string
  tone:'success'|'accent'|'purple'|'muted'|'info'
}

const iconFor=(type:SearchResult['type'])=>{
  if(type==='Lessons')return BookOpen
  if(type==='Trends')return TrendingUp
  if(type==='Training'||type==='Assessments')return GraduationCap
  return ClipboardList
}

export default function Knowledge(){
  const {lessons,debriefs,trends}=useDemo()
  const [q,setQ]=useState('weather')
  const [filter,setFilter]=useState<Filter>('All')

  const results=useMemo<SearchResult[]>(()=>{
    const query=q.trim().toLowerCase()
    const matches=(value:string)=>!query||value.toLowerCase().includes(query)

    const lessonResults=lessons
      .filter(l=>l.status==='Published')
      .filter(l=>matches(`${l.title} ${l.summary} ${l.category}`))
      .map(l=>({
        id:l.id,
        type:'Lessons' as const,
        title:l.title,
        meta:`${l.category} · ${l.occurrences} occurrences · ${l.crews} crews`,
        text:l.summary,
        to:`/lessons/${l.id}`,
        tone:'success' as const,
      }))

    const debriefResults=debriefs
      .filter(d=>matches(`${d.title} ${d.mission} ${d.rawNotes} ${d.whatWentWell} ${d.improve} ${d.selfEvaluation||''} ${d.teamEvaluation||''} ${d.trainerCheckerNotes||''} ${d.observations.map(o=>o.text).join(' ')}`))
      .map(d=>({
        id:d.id,
        type:(d.type==='Training Sortie'?'Training':d.type==='Assessment Flight'?'Assessments':'Debriefs') as SearchResult['type'],
        title:d.title,
        meta:`${d.type} · ${d.mission} · ${d.date}`,
        text:d.aiSummary||d.rawNotes,
        to:`/debriefs/${d.id}`,
        tone:(d.type==='Assessment Flight'?'purple':d.type==='Training Sortie'?'accent':'info') as SearchResult['tone'],
      }))

    const trendResults=trends
      .filter(t=>matches(`${t.title} ${t.category} ${t.description}`))
      .map(t=>({
        id:t.id,
        type:'Trends' as const,
        title:t.title,
        meta:`${t.category} · ${t.occurrences} occurrences · ${t.crews} crews`,
        text:t.description,
        to:'/trends',
        tone:'accent' as const,
      }))

    return [...lessonResults,...debriefResults,...trendResults]
      .filter(r=>filter==='All'||r.type===filter)
      .slice(0,30)
  },[lessons,debriefs,trends,q,filter])

  const counts=useMemo(()=>{
    const query=q.trim().toLowerCase()
    const matches=(value:string)=>!query||value.toLowerCase().includes(query)
    return {
      Lessons:lessons.filter(l=>l.status==='Published'&&matches(`${l.title} ${l.summary} ${l.category}`)).length,
      Debriefs:debriefs.filter(d=>d.type==='Post-Mission'&&matches(`${d.title} ${d.mission} ${d.rawNotes} ${d.observations.map(o=>o.text).join(' ')}`)).length,
      Training:debriefs.filter(d=>d.type==='Training Sortie'&&matches(`${d.title} ${d.mission} ${d.rawNotes} ${d.observations.map(o=>o.text).join(' ')}`)).length,
      Assessments:debriefs.filter(d=>d.type==='Assessment Flight'&&matches(`${d.title} ${d.mission} ${d.rawNotes} ${d.observations.map(o=>o.text).join(' ')}`)).length,
      Trends:trends.filter(t=>matches(`${t.title} ${t.category} ${t.description}`)).length,
    }
  },[lessons,debriefs,trends,q])

  const total=Object.values(counts).reduce((sum,value)=>sum+value,0)

  return <>
    <PageHeader
      eyebrow="Operational Knowledge"
      title="Searchable operational & training knowledge"
      description="Search across published lessons, post-mission evidence, training observations, assessment records and recurring trends so useful learning never remains trapped inside a single crew's debrief."
    />

    <section className="card relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-accent/7 blur-3xl"/>
      <div className="relative grid gap-5 xl:grid-cols-[1fr_340px] xl:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-accent"><Sparkles size={14}/>Organization-wide learning search</div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-ink">Find what the organization has already learned.</h2>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-muted">Search themes such as weather awareness, CRM, approach briefing or task handover and inspect the original evidence behind every result.</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="panel-soft p-3 text-center"><div className="text-xl font-semibold text-ink">{lessons.filter(l=>l.status==='Published').length}</div><div className="mt-1 text-[9px] text-faint">Published lessons</div></div>
          <div className="panel-soft p-3 text-center"><div className="text-xl font-semibold text-ink">{debriefs.length}</div><div className="mt-1 text-[9px] text-faint">Source records</div></div>
          <div className="panel-soft p-3 text-center"><div className="text-xl font-semibold text-ink">{trends.length}</div><div className="mt-1 text-[9px] text-faint">Trend signals</div></div>
        </div>
      </div>

      <div className="relative mt-5">
        <SearchField value={q} onChange={setQ} placeholder="Search weather, CRM, approach briefing, handover, assessment…"/>
      </div>

      <div className="relative mt-3 flex gap-2 overflow-x-auto pb-1">
        {(['All','Lessons','Debriefs','Training','Assessments','Trends'] as Filter[]).map(item=>{
          const active=filter===item
          const count=item==='All'?total:counts[item]
          return <button key={item} onClick={()=>setFilter(item)} className={`tab-btn ${active?'tab-btn-active':''}`}>{item}<span className="rounded-md bg-panel px-1.5 py-0.5 text-[8px] text-faint">{count}</span></button>
        })}
      </div>
    </section>

    <div className="mt-4 flex items-center justify-between gap-3"><div className="text-[10px] text-faint">{results.length} result{results.length===1?'':'s'} across the selected source types</div>{q&&<div className="text-[10px] text-muted">Search term: <span className="font-semibold text-ink">“{q}”</span></div>}</div>

    {results.length?<div className="mt-3 grid gap-3 xl:grid-cols-2">
      {results.map(result=>{
        const Icon=iconFor(result.type)
        const iconClass=result.type==='Lessons'?'bg-success/10 text-success':result.type==='Trends'?'bg-accent/10 text-accent':result.type==='Assessments'?'bg-purple/10 text-purple':result.type==='Training'?'bg-accent/10 text-accent':'bg-info-soft text-info'
        return <Link key={`${result.type}-${result.id}`} to={result.to} className="card card-hover group p-4">
          <div className="flex items-start gap-3">
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line ${iconClass}`}><Icon size={17}/></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><div className="truncate text-sm font-semibold text-ink transition group-hover:text-accent">{result.title}</div><div className="mt-1 text-[9px] text-faint">{result.id} · {result.meta}</div></div>
                <Badge tone={result.tone}>{result.type}</Badge>
              </div>
              <p className="mt-3 line-clamp-3 text-[11px] leading-5 text-muted">{result.text}</p>
              <div className="mt-3 flex justify-end"><span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">Open knowledge source <ArrowRight size={12}/></span></div>
            </div>
          </div>
        </Link>
      })}
    </div>:<div className="mt-4"><EmptyState icon={<Search size={18}/>} title="No matching knowledge" description="Try a broader term or switch the source filter. The search covers published lessons, debrief evidence, training, assessments and trends." action={<button onClick={()=>{setQ('');setFilter('All')}} className="secondary-btn">Clear search</button>}/></div>}
  </>
}
