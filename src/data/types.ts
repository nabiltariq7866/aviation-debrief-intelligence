export type DebriefType='Post-Mission'|'Training Sortie'|'Assessment Flight'
export type DebriefStatus='Draft'|'AI Structured'|'Review Required'|'Published'
export type LessonStatus='Draft'|'Published'
export type Persona='Crew Member'|'Trainer'|'Checker'
export type AuditTone='success'|'accent'|'purple'|'danger'|'muted'

export interface Observation{
  id:string
  category:string
  text:string
  sentiment:'Positive'|'Improvement'|'Neutral'
  trainingRelevant:boolean
  source?:'Self Evaluation'|'Team Evaluation'|'Trainer / Checker'|'General Debrief'
}

export interface Debrief{
  id:string
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
  selfEvaluation?:string
  teamEvaluation?:string
  trainerCheckerNotes?:string
  status:DebriefStatus
  createdBy:string
  createdAt:string
  observations:Observation[]
  aiSummary?:string
  aiLessonTitle?:string
  aiLessonText?:string
  similarDebriefIds?:string[]
  linkedProfileIds?:string[]
}

export interface Lesson{
  id:string
  title:string
  summary:string
  category:string
  sourceDebriefIds:string[]
  occurrences:number
  crews:number
  firstSeen:string
  lastSeen:string
  status:LessonStatus
  confidence:number
  safetyNote:string
}

export interface Trend{
  id:string
  title:string
  category:string
  occurrences:number
  crews:number
  direction:'Up'|'Stable'|'Down'
  change:number
  sourceDebriefIds:string[]
  description:string
  months:Array<{month:string;count:number}>
}

export interface TrainingProfile{
  id:string
  name:string
  role:string
  base:string
  skills:Array<{name:string;score:number;trend:'Improving'|'Stable'|'Watch'}>
  debriefIds:string[]
  lastAssessment:string
}

export interface ActivityEvent{
  id:string
  title:string
  detail:string
  time:string
  tone:'success'|'accent'|'purple'|'danger'
}

export interface AuditEvent{
  id:string
  entityType:'Debrief'|'Lesson'|'Training Profile'|'Knowledge'|'System'
  entityId:string
  action:string
  detail:string
  actor:string
  role:Persona|'AI System'
  time:string
  tone:AuditTone
}

export interface Acknowledgement{
  id:string
  lessonId:string
  profileId:string
  acknowledgedAt:string
  acknowledgedBy:string
}

export interface DemoSettings{
  retentionDays:number
  detailedAudit:boolean
  audioIngestion:boolean
  aircraftFilter:string
}
