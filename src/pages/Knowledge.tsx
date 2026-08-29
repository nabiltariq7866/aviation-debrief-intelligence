import { BookOpen, ClipboardList, GraduationCap, Search, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, PageHeader } from '../components/ui'
import { useDemo } from '../state/DemoContext'

type Filter='All'|'Lessons'|'Debriefs'|'Training'|'Assessments'|'Trends'
type SearchResult={
  id:string
  type:Exclude<Filter,'All'>
  title:string
  meta:string
  text:string
  to:string
  tone:'success'|'accent'|'purple'|'muted'
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
        tone:(d.type==='Assessment Flight'?'purple':d.type==='Training Sortie'?'accent':'muted') as SearchResult['tone'],
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

  return <>
    <PageHeader
      eyebrow="Operational Knowledge"
      title="Searchable operational & training knowledge"
      description="Search across published lessons, raw debrief evidence, training observations, assessment records and recurring trends so learning does not remain trapped inside individual documents."
    />

    <div className="card p-4">
      <div className="relative">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"/>
        <input value={q} onChange={e=>setQ(e.target.value)} className="field h-12 pl-11 text-sm" placeholder="Search weather, CRM, approach briefing, handover, assessment…"/>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {(['All','Lessons','Debriefs','Training','Assessments','Trends'] as Filter[]).map(item=>{
          const active=filter===item
          const count=item==='All'?Object.values(counts).reduce((sum,value)=>sum+value,0):counts[item]
          return <button key={item} onClick={()=>setFilter(item)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-semibold transition ${active?'border-accent/30 bg-accent/10 text-accent':'border-line bg-panel/45 text-muted hover:text-ink'}`}>{item}<span className="rounded-md bg-surface/60 px-1.5 py-0.5 text-[8px] text-faint">{count}</span></button>
        })}
      </div>

      <div className="mt-3 text-[10px] text-faint">{results.length} knowledge result{results.length===1?'':'s'} across the selected source types</div>
    </div>

    <div className="mt-4 grid gap-3 xl:grid-cols-2">
      {results.map(result=>{
        const Icon=iconFor(result.type)
        return <Link key={`${result.type}-${result.id}`} to={result.to} className="card group p-4 transition hover:-translate-y-0.5 hover:border-accent/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-3">
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${result.type==='Lessons'?'bg-success/10 text-success':result.type==='Trends'?'bg-accent/10 text-accent':result.type==='Assessments'?'bg-purple/10 text-purple':'bg-panel text-muted'}`}><Icon size={16}/></div>
              <div className="min-w-0"><div className="truncate text-sm font-semibold text-ink group-hover:text-accent">{result.title}</div><div className="mt-1 text-[10px] text-faint">{result.id} · {result.meta}</div></div>
            </div>
            <Badge tone={result.tone}>{result.type}</Badge>
          </div>
          <div className="mt-3 line-clamp-3 text-xs leading-5 text-muted">{result.text}</div>
        </Link>
      })}
    </div>

    {!results.length&&<div className="mt-4 card p-8 text-center"><Search size={22} className="mx-auto text-faint"/><div className="mt-2 text-sm font-semibold text-ink">No matching knowledge</div><div className="mt-1 text-xs text-muted">Try a broader term or switch the source filter.</div></div>}
  </>
}
