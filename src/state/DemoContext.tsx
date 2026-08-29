import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  initialAcknowledgements,
  initialActivity,
  initialAudit,
  initialDebriefs,
  initialLessons,
  initialProfiles,
  initialSettings,
  initialTrends,
} from '../data/mock'
import type {
  Acknowledgement,
  ActivityEvent,
  AuditEvent,
  Debrief,
  DebriefType,
  DemoSettings,
  Lesson,
  Persona,
  TrainingProfile,
  Trend,
} from '../data/types'

type NewDebriefInput={
  type:DebriefType
  title:string
  mission:string
  date:string
  crew:string[]
  aircraft:string
  location:string
  rawNotes:string
  whatWentWell:string
  improve:string
  selfEvaluation:string
  teamEvaluation:string
  trainerCheckerNotes:string
  createdBy:string
  linkedProfileIds:string[]
}

type DemoContextValue={
  debriefs:Debrief[]
  lessons:Lesson[]
  trends:Trend[]
  profiles:TrainingProfile[]
  activity:ActivityEvent[]
  audit:AuditEvent[]
  acknowledgements:Acknowledgement[]
  settings:DemoSettings
  persona:Persona
  currentActor:string
  createDebrief:(input:NewDebriefInput)=>string
  analyzeDebrief:(id:string)=>void
  publishLesson:(lessonId:string)=>void
  acknowledgeLesson:(lessonId:string,profileId:string)=>void
  updateSettings:(patch:Partial<DemoSettings>)=>void
  setPersona:(persona:Persona)=>void
  resetDemo:()=>void
}

const DemoContext=createContext<DemoContextValue|null>(null)

const load=<T,>(key:string,fallback:T):T=>{
  try{
    const raw=localStorage.getItem(key)
    return raw?JSON.parse(raw):fallback
  }catch{
    return fallback
  }
}

const actorForPersona=(persona:Persona)=>{
  if(persona==='Crew Member')return 'Capt. Maya Reynolds'
  if(persona==='Trainer')return 'Trainer Alex Morgan'
  return 'Checker Priya Shah'
}

export function DemoProvider({children}:{children:ReactNode}){
  const [debriefs,setDebriefs]=useState<Debrief[]>(()=>load('aviation-demo-debriefs',initialDebriefs))
  const [lessons,setLessons]=useState<Lesson[]>(()=>load('aviation-demo-lessons',initialLessons))
  const [trends,setTrends]=useState<Trend[]>(()=>load('aviation-demo-trends',initialTrends))
  const [profiles,setProfiles]=useState<TrainingProfile[]>(()=>load('aviation-demo-profiles',initialProfiles))
  const [activity,setActivity]=useState<ActivityEvent[]>(()=>load('aviation-demo-activity',initialActivity))
  const [audit,setAudit]=useState<AuditEvent[]>(()=>load('aviation-demo-audit',initialAudit))
  const [acknowledgements,setAcknowledgements]=useState<Acknowledgement[]>(()=>load('aviation-demo-acks',initialAcknowledgements))
  const [settings,setSettings]=useState<DemoSettings>(()=>load('aviation-demo-settings',initialSettings))
  const [personaState,setPersonaState]=useState<Persona>(()=>load('aviation-demo-persona','Trainer' as Persona))

  const persist=(key:string,value:unknown)=>localStorage.setItem(key,JSON.stringify(value))
  const currentActor=actorForPersona(personaState)

  const addActivity=(event:Omit<ActivityEvent,'id'>)=>{
    setActivity(prev=>{
      const next=[{...event,id:`EV-${Date.now()}-${Math.random().toString(36).slice(2,6)}`},...prev].slice(0,40)
      persist('aviation-demo-activity',next)
      return next
    })
  }

  const addAudit=(event:Omit<AuditEvent,'id'>)=>{
    if(!settings.detailedAudit&&event.entityType!=='System')return
    setAudit(prev=>{
      const next=[{...event,id:`AUD-${Date.now()}-${Math.random().toString(36).slice(2,6)}`},...prev].slice(0,120)
      persist('aviation-demo-audit',next)
      return next
    })
  }

  const setPersona=(persona:Persona)=>{
    setPersonaState(persona)
    persist('aviation-demo-persona',persona)
    addActivity({title:'Demo persona changed',detail:`Workspace is now demonstrating ${persona} permissions and workflows.`,time:'Just now',tone:'purple'})
  }

  const createDebrief=(input:NewDebriefInput)=>{
    const id=`DBR-${Math.floor(2100+Math.random()*700)}`
    const item:Debrief={
      id,
      ...input,
      status:'Draft',
      createdAt:'Just now',
      observations:[],
    }

    setDebriefs(prev=>{
      const next=[item,...prev]
      persist('aviation-demo-debriefs',next)
      return next
    })

    if(input.type!=='Post-Mission'&&input.linkedProfileIds.length){
      setProfiles(prev=>{
        const next=prev.map(profile=>input.linkedProfileIds.includes(profile.id)?{
          ...profile,
          debriefIds:[id,...profile.debriefIds.filter(existing=>existing!==id)],
          lastAssessment:input.type==='Assessment Flight'?input.date:profile.lastAssessment,
        }:profile)
        persist('aviation-demo-profiles',next)
        return next
      })

      input.linkedProfileIds.forEach(profileId=>{
        addAudit({
          entityType:'Training Profile',
          entityId:profileId,
          action:`${input.type} linked`,
          detail:`${id} was added to the individual development history. AI does not change trainer/checker scores or assessment outcomes.`,
          actor:input.createdBy,
          role:personaState,
          time:'Just now',
          tone:'success',
        })
      })
    }

    addActivity({title:'New debrief submitted',detail:`${input.mission} entered the learning workflow.`,time:'Just now',tone:'purple'})
    addAudit({
      entityType:'Debrief',
      entityId:id,
      action:'Debrief submitted',
      detail:`${input.type} source record preserved with self, team and trainer/checker context where provided.`,
      actor:input.createdBy,
      role:personaState,
      time:'Just now',
      tone:'purple',
    })

    return id
  }

  const analyzeDebrief=(id:string)=>{
    const target=debriefs.find(d=>d.id===id)
    if(!target)return

    const combined=`${target.rawNotes} ${target.improve} ${target.selfEvaluation||''} ${target.teamEvaluation||''} ${target.trainerCheckerNotes||''}`.toLowerCase()
    const category=combined.includes('weather')||combined.includes('wind')
      ?'Weather Awareness'
      :combined.includes('handover')||combined.includes('communication')||combined.includes('crm')
        ?'Crew Resource Management'
        :combined.includes('approach')||combined.includes('brief')
          ?'Approach Planning'
          :'Operational Learning'

    const keyword=category==='Weather Awareness'
      ?'weather'
      :category==='Crew Resource Management'
        ?'communication'
        :category==='Approach Planning'
          ?'brief'
          :'operational'

    const lessonTitle=category==='Weather Awareness'
      ?'Reassess changing conditions before workload rises'
      :category==='Crew Resource Management'
        ?'Use explicit closed-loop confirmation for critical coordination'
        :category==='Approach Planning'
          ?'Refresh the active briefing before workload increases'
          :'Convert the observation into organization-wide operational learning'

    const similar=debriefs
      .filter(d=>d.id!==id&&`${d.rawNotes} ${d.improve} ${d.aiSummary||''}`.toLowerCase().includes(keyword))
      .slice(0,5)
      .map(d=>d.id)

    const observations=[
      ...(target.selfEvaluation?[{id:`OBS-${Date.now()}-self`,category,text:target.selfEvaluation,sentiment:'Neutral' as const,trainingRelevant:target.type!=='Post-Mission',source:'Self Evaluation' as const}]:[]),
      ...(target.teamEvaluation?[{id:`OBS-${Date.now()}-team`,category,text:target.teamEvaluation,sentiment:'Neutral' as const,trainingRelevant:true,source:'Team Evaluation' as const}]:[]),
      ...(target.trainerCheckerNotes?[{id:`OBS-${Date.now()}-trainer`,category,text:target.trainerCheckerNotes,sentiment:'Improvement' as const,trainingRelevant:true,source:'Trainer / Checker' as const}]:[]),
      {id:`OBS-${Date.now()}-positive`,category,text:target.whatWentWell||'Positive operational performance was identified.',sentiment:'Positive' as const,trainingRelevant:true,source:'General Debrief' as const},
      {id:`OBS-${Date.now()}-improve`,category,text:target.improve||target.rawNotes,sentiment:'Improvement' as const,trainingRelevant:true,source:'General Debrief' as const},
    ]

    setDebriefs(prev=>{
      const next=prev.map(d=>d.id===id?{
        ...d,
        status:'Review Required' as const,
        observations,
        aiSummary:`AI organized the human-authored debrief into structured observations. The strongest recurring theme is ${category.toLowerCase()}. ${similar.length} supporting historical record${similar.length===1?'':'s'} were identified for human review.`,
        aiLessonTitle:lessonTitle,
        aiLessonText:target.improve||'Review the identified learning point and decide whether it should become wider organizational knowledge.',
        similarDebriefIds:similar,
      }:d)
      persist('aviation-demo-debriefs',next)
      return next
    })

    const lessonId=`LSN-${Math.floor(350+Math.random()*500)}`
    const candidate:Lesson={
      id:lessonId,
      title:lessonTitle,
      summary:target.improve||target.rawNotes,
      category,
      sourceDebriefIds:[id,...similar],
      occurrences:Math.max(1,similar.length+1),
      crews:Math.max(1,new Set([target.crew.join('|'),...similar.map(sid=>debriefs.find(d=>d.id===sid)?.crew.join('|')||sid)]).size),
      firstSeen:similar.length?'Historical':'Today',
      lastSeen:'Today',
      status:'Draft',
      confidence:similar.length>=3?93:similar.length>=1?84:72,
      safetyNote:'AI-generated knowledge candidate. Human validation is required before publication. AI does not make or replace safety-critical operational, training or assessment decisions.',
    }

    setLessons(prev=>{
      const next=[candidate,...prev]
      persist('aviation-demo-lessons',next)
      return next
    })

    if(similar.length>=2){
      const trend:Trend={
        id:`TRD-${Math.floor(20+Math.random()*80)}`,
        title:`Recurring ${category} pattern`,
        category,
        occurrences:similar.length+1,
        crews:Math.min(similar.length+1,6),
        direction:'Up',
        change:18,
        sourceDebriefIds:[id,...similar],
        description:`AI found a recurring ${category.toLowerCase()} theme across this debrief and ${similar.length} historical records. Supporting evidence remains available for trainer/checker interpretation.`,
        months:[{month:'Mar',count:0},{month:'Apr',count:1},{month:'May',count:1},{month:'Jun',count:1},{month:'Jul',count:2},{month:'Aug',count:similar.length+1}],
      }
      setTrends(prev=>{
        const next=[trend,...prev.filter(t=>t.title!==trend.title)]
        persist('aviation-demo-trends',next)
        return next
      })
    }

    addActivity({title:'AI debrief analysis completed',detail:`${id} structured, lesson candidate created and historical similarity checked.`,time:'Just now',tone:'accent'})
    addAudit({
      entityType:'Debrief',
      entityId:id,
      action:'AI organization completed',
      detail:`Structured ${observations.length} observations, identified ${similar.length} similar records and created lesson candidate ${lessonId}.`,
      actor:'AeroLearn AI',
      role:'AI System',
      time:'Just now',
      tone:'accent',
    })
    addAudit({
      entityType:'Lesson',
      entityId:lessonId,
      action:'Lesson candidate created',
      detail:`Candidate generated from ${id} with ${similar.length} supporting historical record${similar.length===1?'':'s'}.`,
      actor:'AeroLearn AI',
      role:'AI System',
      time:'Just now',
      tone:'accent',
    })
  }

  const publishLesson=(lessonId:string)=>{
    const lesson=lessons.find(l=>l.id===lessonId)
    if(!lesson)return

    setLessons(prev=>{
      const next=prev.map(l=>l.id===lessonId?{...l,status:'Published' as const}:l)
      persist('aviation-demo-lessons',next)
      return next
    })

    setDebriefs(prev=>{
      const next=prev.map(d=>lesson.sourceDebriefIds.includes(d.id)?{...d,status:'Published' as const}:d)
      persist('aviation-demo-debriefs',next)
      return next
    })

    addActivity({title:'Lesson published to operational knowledge',detail:`${lesson.title} is now searchable across the organization.`,time:'Just now',tone:'success'})
    addAudit({
      entityType:'Lesson',
      entityId:lessonId,
      action:'Lesson validated & published',
      detail:'Human validation completed. The lesson is now available in the searchable operational knowledge base.',
      actor:currentActor,
      role:personaState,
      time:'Just now',
      tone:'success',
    })
  }

  const acknowledgeLesson=(lessonId:string,profileId:string)=>{
    const profile=profiles.find(p=>p.id===profileId)
    const lesson=lessons.find(l=>l.id===lessonId)
    if(!profile||!lesson)return
    if(acknowledgements.some(a=>a.lessonId===lessonId&&a.profileId===profileId))return

    const ack:Acknowledgement={
      id:`ACK-${Date.now()}`,
      lessonId,
      profileId,
      acknowledgedAt:'Just now',
      acknowledgedBy:profile.name,
    }
    setAcknowledgements(prev=>{
      const next=[ack,...prev]
      persist('aviation-demo-acks',next)
      return next
    })
    addActivity({title:'Lesson acknowledged',detail:`${profile.name} acknowledged “${lesson.title}”.`,time:'Just now',tone:'success'})
    addAudit({
      entityType:'Knowledge',
      entityId:lessonId,
      action:'Knowledge acknowledged',
      detail:`${profile.name} acknowledged the published lesson.`,
      actor:profile.name,
      role:'Crew Member',
      time:'Just now',
      tone:'success',
    })
  }

  const updateSettings=(patch:Partial<DemoSettings>)=>{
    setSettings(prev=>{
      const next={...prev,...patch}
      persist('aviation-demo-settings',next)
      return next
    })
    addAudit({
      entityType:'System',
      entityId:'DEMO-CONFIG',
      action:'Demo configuration updated',
      detail:Object.entries(patch).map(([key,value])=>`${key}: ${String(value)}`).join(', '),
      actor:currentActor,
      role:personaState,
      time:'Just now',
      tone:'muted',
    })
  }

  const resetDemo=()=>{
    setDebriefs(initialDebriefs)
    setLessons(initialLessons)
    setTrends(initialTrends)
    setProfiles(initialProfiles)
    setActivity(initialActivity)
    setAudit(initialAudit)
    setAcknowledgements(initialAcknowledgements)
    setSettings(initialSettings)
    setPersonaState('Trainer')
    persist('aviation-demo-debriefs',initialDebriefs)
    persist('aviation-demo-lessons',initialLessons)
    persist('aviation-demo-trends',initialTrends)
    persist('aviation-demo-profiles',initialProfiles)
    persist('aviation-demo-activity',initialActivity)
    persist('aviation-demo-audit',initialAudit)
    persist('aviation-demo-acks',initialAcknowledgements)
    persist('aviation-demo-settings',initialSettings)
    persist('aviation-demo-persona','Trainer')
  }

  const value=useMemo(()=>({
    debriefs,
    lessons,
    trends,
    profiles,
    activity,
    audit,
    acknowledgements,
    settings,
    persona:personaState,
    currentActor,
    createDebrief,
    analyzeDebrief,
    publishLesson,
    acknowledgeLesson,
    updateSettings,
    setPersona,
    resetDemo,
  }),[debriefs,lessons,trends,profiles,activity,audit,acknowledgements,settings,personaState,currentActor])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(){
  const ctx=useContext(DemoContext)
  if(!ctx)throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
