import type {ActivityEvent,Debrief,Lesson,MissionType,TrainingProfile,Trend} from './types'

const coreDebriefs:Debrief[]=[
  {
    id:'DBR-2048',type:'Post-Mission',missionType:'SAR',title:'Northern Ridge Search Support',mission:'SAR-817',date:'2026-08-28',crew:['Capt. Maya Reynolds','FO Liam Hart'],aircraft:'AW139',location:'Northern Ridge Sector',
    rawNotes:'Approach briefing was completed, but a late wind shift increased workload. Crew coordination remained effective. Recommend earlier weather reassessment before final approach.',
    whatWentWell:'Clear task sharing, stable CRM, effective go-around discussion.',improve:'Earlier weather reassessment and approach briefing update.',selfEvaluation:'I maintained the approach profile safely but should have initiated the weather reassessment earlier.',teamEvaluation:'Crew coordination remained calm and effective as conditions changed.',
    status:'Published',createdBy:'Capt. Maya Reynolds',createdAt:'28 Aug · 18:42',peakSeason:true,
    observations:[
      {id:'OBS-1',category:'Crew Resource Management',text:'Clear task sharing maintained during increased approach workload.',sentiment:'Positive',trainingRelevant:true,source:'Team Evaluation'},
      {id:'OBS-2',category:'Weather Awareness',text:'Late wind shift was identified after the initial approach briefing.',sentiment:'Improvement',trainingRelevant:true,source:'General Debrief'},
      {id:'OBS-3',category:'Approach Planning',text:'Briefing should be refreshed earlier when forecast conditions change.',sentiment:'Improvement',trainingRelevant:true,source:'Self Evaluation'},
    ],
    aiSummary:'Crew coordination remained strong. The main learning point is earlier weather reassessment and briefing refresh when conditions change during approach preparation.',
    aiLessonTitle:'Refresh approach briefing earlier after weather changes',
    aiLessonText:'When operational weather changes during approach preparation, reassess conditions and refresh the crew briefing before workload increases.',
    similarDebriefIds:['DBR-2034','DBR-1998','DBR-1972','DBR-2201','DBR-2202','DBR-2203'],linkedProfileIds:['P-101','P-102'],
    relatedMaintenanceNote:{
      id:'MX-4821',title:'Weather radar intermittent caution',status:'Inspection completed',loggedAt:'27 Aug 2026 · 16:10',aircraft:'AW139',
      summary:'Intermittent weather radar caution observed during the pre-flight test before the Northern Ridge support mission.',
      outcome:'Avionics connector inspected, reseated and function-tested serviceable. This is mocked demo context to show how operational learning could bridge to maintenance information without claiming a live MRO integration.',
    },
  },
  {
    id:'DBR-2034',type:'Training Sortie',missionType:'Training',title:'Instrument Approach Training',mission:'TRG-552',date:'2026-08-19',crew:['Capt. Daniel Cole','FO Sofia Grant'],aircraft:'AW139',location:'Coastal Training Area',
    rawNotes:'Weather deterioration was correctly identified, though briefing update happened late. Good decision to discontinue the approach.',whatWentWell:'Sound discontinue decision, calm crew communication.',improve:'Earlier briefing update after weather deterioration.',trainerCheckerNotes:'The crew identified the threat correctly; the training point is the timing of the briefing refresh.',
    status:'Published',createdBy:'Trainer Alex Morgan',createdAt:'19 Aug · 14:10',
    observations:[{id:'OBS-4',category:'Weather Awareness',text:'Weather deterioration recognized correctly.',sentiment:'Positive',trainingRelevant:true,source:'Trainer / Checker'},{id:'OBS-5',category:'Approach Planning',text:'Briefing update occurred later than ideal.',sentiment:'Improvement',trainingRelevant:true,source:'Trainer / Checker'}],
    aiSummary:'Good decision-making, with a recurring opportunity to update the approach briefing earlier as conditions change.',aiLessonTitle:'Update briefing promptly as conditions change',aiLessonText:'Crews should refresh the active approach plan as soon as changing conditions materially affect the expected profile.',similarDebriefIds:['DBR-2048','DBR-1998','DBR-2203'],linkedProfileIds:['P-103'],
  },
  {
    id:'DBR-1998',type:'Assessment Flight',missionType:'Training',title:'Line Assessment — Sector Bravo',mission:'ASM-410',date:'2026-07-29',crew:['Capt. Maya Reynolds'],aircraft:'AW139',location:'Sector Bravo',
    rawNotes:'Strong handling and communication. Trainer noted a tendency to defer weather reassessment until workload was already increasing.',whatWentWell:'Handling, communication, checklist discipline.',improve:'Move weather reassessment earlier in the approach cycle.',trainerCheckerNotes:'Assessment outcome remains trainer/checker-owned. The learning signal is earlier weather reassessment.',
    status:'Published',createdBy:'Checker Priya Shah',createdAt:'29 Jul · 16:02',
    observations:[{id:'OBS-6',category:'Approach Planning',text:'Weather reassessment was delayed until workload increased.',sentiment:'Improvement',trainingRelevant:true,source:'Trainer / Checker'},{id:'OBS-7',category:'Crew Resource Management',text:'Communication and checklist discipline were strong.',sentiment:'Positive',trainingRelevant:true,source:'Trainer / Checker'}],
    aiSummary:'Assessment indicates strong core performance with a development opportunity around earlier weather reassessment.',aiLessonTitle:'Reassess weather before workload rises',aiLessonText:'Move weather reassessment earlier in the approach cycle to preserve spare capacity for changing conditions.',similarDebriefIds:['DBR-2048','DBR-2034'],linkedProfileIds:['P-101'],
  },
  {
    id:'DBR-1972',type:'Post-Mission',missionType:'EMS',title:'Offshore Medical Support Return',mission:'EMS-366',date:'2026-07-15',crew:['Capt. Noah Bennett','FO Liam Hart'],aircraft:'H175',location:'Offshore West',
    rawNotes:'Return sector encountered changing crosswind. Team handled it safely, but revised threat briefing happened after descent.',whatWentWell:'Stable communication and threat sharing.',improve:'Refresh threat briefing before descent when crosswind trend changes.',
    status:'Published',createdBy:'Capt. Noah Bennett',createdAt:'15 Jul · 19:24',
    observations:[{id:'OBS-8',category:'Weather Awareness',text:'Crosswind trend changed before descent.',sentiment:'Neutral',trainingRelevant:true,source:'General Debrief'},{id:'OBS-9',category:'Approach Planning',text:'Revised threat briefing occurred after descent began.',sentiment:'Improvement',trainingRelevant:true,source:'General Debrief'}],
    aiSummary:'Safe outcome with a recurring lesson around earlier briefing refresh when environmental threats change.',aiLessonTitle:'Move threat briefing update before descent',aiLessonText:'When a material environmental threat changes, refresh the threat briefing before descent whenever operationally practical.',similarDebriefIds:['DBR-2048','DBR-2202'],linkedProfileIds:['P-102'],
  },
  {
    id:'DBR-2050',type:'Training Sortie',missionType:'Training',title:'CRM Scenario Training',mission:'TRG-561',date:'2026-08-29',crew:['FO Sofia Grant','Trainer Alex Morgan'],aircraft:'H145',location:'Training Centre',
    rawNotes:'Strong challenge-and-response behavior. One task handover lacked explicit confirmation.',whatWentWell:'Good assertiveness and communication.',improve:'Use explicit closed-loop confirmation for task handovers.',trainerCheckerNotes:'Closed-loop confirmation is the primary development point for this sortie.',
    status:'Review Required',createdBy:'Trainer Alex Morgan',createdAt:'Today · 09:18',peakSeason:true,
    observations:[{id:'OBS-10',category:'Crew Resource Management',text:'Strong challenge-and-response behavior.',sentiment:'Positive',trainingRelevant:true,source:'Trainer / Checker'},{id:'OBS-11',category:'Crew Resource Management',text:'One task handover lacked explicit confirmation.',sentiment:'Improvement',trainingRelevant:true,source:'Trainer / Checker'}],
    aiSummary:'Training performance was strong overall. The primary development point is explicit closed-loop confirmation during task handovers.',aiLessonTitle:'Confirm critical task handovers explicitly',aiLessonText:'Use clear closed-loop confirmation when transferring operational tasks, especially during high-workload phases.',similarDebriefIds:[],linkedProfileIds:['P-103'],
  },
]

const backlogMissionTypes:MissionType[]=['SAR','EMS','Firefighting','Training']
const backlogAircraft=['AW139','H175','H145','S-92','Bell 412']
const backlogLocations=['North Sector','Coastal Sector','Mountain Zone','Training Centre','Wildland Sector']

const backlogDebriefs:Debrief[]=Array.from({length:37},(_,index)=>{
  const n=index+1
  const missionType=backlogMissionTypes[index%backlogMissionTypes.length]
  const type=missionType==='Training'?(index%3===0?'Assessment Flight':'Training Sortie'):'Post-Mission'
  const missionPrefix=missionType==='Firefighting'?'FIRE':missionType==='Training'?'TRG':missionType
  const weatherTheme=index%3!==1
  const title=missionType==='SAR'
    ?`Peak Search Sector ${String(n).padStart(2,'0')}`
    :missionType==='EMS'
      ?`Medical Transfer Review ${String(n).padStart(2,'0')}`
      :missionType==='Firefighting'
        ?`Wildfire Support Debrief ${String(n).padStart(2,'0')}`
        :`Seasonal Training Review ${String(n).padStart(2,'0')}`

  return {
    id:`DBR-${2200+n}`,
    type,
    missionType,
    title,
    mission:`${missionPrefix}-${600+n}`,
    date:`2026-08-${String(1+(index%27)).padStart(2,'0')}`,
    crew:[index%2===0?'Capt. Maya Reynolds':'Capt. Noah Bennett',index%3===0?'FO Sofia Grant':'FO Liam Hart'],
    aircraft:backlogAircraft[index%backlogAircraft.length],
    location:backlogLocations[index%backlogLocations.length],
    rawNotes:weatherTheme
      ?'Changing wind and visibility increased workload. Crew managed the event safely, with a useful learning point around earlier threat and weather briefing refresh.'
      :'Operational task handover was completed safely, though explicit closed-loop confirmation could have been clearer during the high-workload phase.',
    whatWentWell:'Safe outcome, calm communication and disciplined task execution.',
    improve:weatherTheme?'Refresh weather and threat briefing earlier as conditions change.':'Use explicit closed-loop confirmation for critical task handovers.',
    selfEvaluation:'The crew maintained control and identified one practical improvement for future operations.',
    teamEvaluation:'Team coordination remained effective; the learning point should be reviewed before the next similar mission.',
    trainerCheckerNotes:type==='Post-Mission'?'':'Trainer/checker review is awaiting completion in the seasonal backlog.',
    status:'Review Required',
    createdBy:type==='Post-Mission'?'Crew Operations':type==='Training Sortie'?'Trainer Alex Morgan':'Checker Priya Shah',
    createdAt:`Aug ${String(1+(index%27)).padStart(2,'0')} · ${String(8+(index%10)).padStart(2,'0')}:20`,
    peakSeason:index<11,
    observations:[],
    aiSummary:weatherTheme
      ?'AI organization found an approach/weather briefing theme and queued the record for human review.'
      :'AI organization found a crew-coordination handover theme and queued the record for human review.',
    aiLessonTitle:weatherTheme?'Refresh briefing earlier as conditions change':'Use explicit closed-loop confirmation for task handovers',
    aiLessonText:weatherTheme?'Reassess conditions and refresh the briefing before workload rises.':'Confirm critical task ownership explicitly when transferring responsibilities.',
    similarDebriefIds:weatherTheme?['DBR-2048','DBR-2034']:['DBR-2050'],
    linkedProfileIds:type==='Post-Mission'?[]:[index%2===0?'P-101':'P-103'],
  }
})

export const initialDebriefs:Debrief[]=[...coreDebriefs,...backlogDebriefs]

export const initialLessons:Lesson[]=[
  {
    id:'LSN-301',title:'Refresh approach briefing earlier after weather changes',summary:'Changing weather should trigger an earlier briefing refresh before workload rises during the approach sequence.',category:'Approach Planning',
    sourceDebriefIds:['DBR-2048','DBR-2034','DBR-1998','DBR-1972','DBR-2201','DBR-2202','DBR-2203','DBR-2204'],occurrences:12,crews:5,firstSeen:'2026-04-12',lastSeen:'2026-08-28',status:'Published',confidence:94,
    safetyNote:'Advisory knowledge only. Operational and safety-critical decisions remain with qualified crew, trainers and checkers.',
    relevantRoles:['Captain','First Officer','Trainer'],relevantAircraft:['AW139','H175','H145'],correctiveActionStatus:'In Progress',correctiveActionOwner:'Flight Standards',correctiveActionUpdatedAt:'02 Sep 2026',
  },
  {
    id:'LSN-302',title:'Use explicit closed-loop confirmation for task handovers',summary:'Critical task handovers are more reliable when the receiving crew member confirms responsibility explicitly.',category:'Crew Resource Management',
    sourceDebriefIds:['DBR-2050','DBR-2206','DBR-2210','DBR-2214'],occurrences:4,crews:3,firstSeen:'2026-06-11',lastSeen:'2026-08-29',status:'Draft',confidence:82,
    safetyNote:'AI-generated lesson awaiting human validation.',relevantRoles:['Captain','First Officer','Trainer','Checker'],relevantAircraft:['AW139','H175','H145','S-92','Bell 412'],correctiveActionStatus:'Open',correctiveActionOwner:'Training Standards',correctiveActionUpdatedAt:'29 Aug 2026',
  },
  {
    id:'LSN-303',title:'Surface abnormal procedure assumptions during briefing',summary:'Explicitly state assumptions about likely abnormal branches during briefing to reduce ambiguity under pressure.',category:'Decision Making',
    sourceDebriefIds:['DBR-2207','DBR-2211','DBR-2215','DBR-2219'],occurrences:7,crews:4,firstSeen:'2026-05-07',lastSeen:'2026-08-04',status:'Published',confidence:88,
    safetyNote:'Advisory knowledge only. Human judgement remains authoritative.',relevantRoles:['Captain','First Officer','Checker'],relevantAircraft:['AW139','H145','S-92'],correctiveActionStatus:'Closed',correctiveActionOwner:'Operational Standards',correctiveActionUpdatedAt:'28 Aug 2026',
  },
]

export const initialTrends:Trend[]=[
  {id:'TRD-11',title:'Approach briefing completeness',category:'Approach Planning',occurrences:12,crews:5,direction:'Up',change:21,sourceDebriefIds:['DBR-2048','DBR-2034','DBR-1998','DBR-1972'],description:'Recurring observations indicate briefing updates are sometimes delayed when weather or threat conditions change late in the approach cycle.',months:[{month:'Mar',count:1},{month:'Apr',count:1},{month:'May',count:2},{month:'Jun',count:2},{month:'Jul',count:3},{month:'Aug',count:3}]},
  {id:'TRD-12',title:'Closed-loop task handover',category:'Crew Resource Management',occurrences:4,crews:3,direction:'Stable',change:3,sourceDebriefIds:['DBR-2050','DBR-2206'],description:'A small but persistent cluster of observations relates to explicit confirmation when operational tasks are transferred.',months:[{month:'Mar',count:0},{month:'Apr',count:1},{month:'May',count:0},{month:'Jun',count:1},{month:'Jul',count:1},{month:'Aug',count:1}]},
]

export const initialProfiles:TrainingProfile[]=[
  {id:'P-101',name:'Capt. Maya Reynolds',role:'Captain',base:'North Base',lastAssessment:'29 Jul 2026',debriefIds:['DBR-2048','DBR-1998'],skills:[{name:'Decision Making',score:88,trend:'Stable'},{name:'Crew Resource Management',score:92,trend:'Improving'},{name:'Approach Planning',score:73,trend:'Watch'},{name:'Weather Assessment',score:76,trend:'Improving'}]},
  {id:'P-102',name:'FO Liam Hart',role:'First Officer',base:'North Base',lastAssessment:'18 Jul 2026',debriefIds:['DBR-2048','DBR-1972'],skills:[{name:'Decision Making',score:82,trend:'Improving'},{name:'Crew Resource Management',score:89,trend:'Stable'},{name:'Approach Planning',score:79,trend:'Improving'},{name:'Weather Assessment',score:81,trend:'Stable'}]},
  {id:'P-103',name:'FO Sofia Grant',role:'First Officer',base:'Coastal Base',lastAssessment:'19 Aug 2026',debriefIds:['DBR-2034','DBR-2050'],skills:[{name:'Decision Making',score:84,trend:'Stable'},{name:'Crew Resource Management',score:86,trend:'Improving'},{name:'Approach Planning',score:78,trend:'Improving'},{name:'Weather Assessment',score:80,trend:'Stable'}]},
]

export const initialActivity:ActivityEvent[]=[
  {id:'EV-0',title:'Review backlog triaged',detail:'38 debriefs are awaiting review, including 12 peak-season records.',time:'6m ago',tone:'accent'},
  {id:'EV-1',title:'Recurring trend strengthened',detail:'Approach briefing completeness now spans SAR, EMS, Training and Firefighting evidence.',time:'12m ago',tone:'accent'},
  {id:'EV-2',title:'Training debrief structured',detail:'TRG-561 converted into structured observations.',time:'31m ago',tone:'purple'},
  {id:'EV-3',title:'Lesson published',detail:'Weather reassessment lesson added to operational knowledge.',time:'1h ago',tone:'success'},
  {id:'EV-4',title:'Human review required',detail:'CRM handover lesson is waiting for trainer/checker validation.',time:'2h ago',tone:'danger'},
]

export const initialAudit=[
  {id:'AUD-1001',entityType:'Debrief' as const,entityId:'DBR-2048',action:'Debrief submitted',detail:'Post-mission observations captured and preserved as the human-authored source.',actor:'Capt. Maya Reynolds',role:'Crew Member' as const,time:'28 Aug · 18:42',tone:'purple' as const},
  {id:'AUD-1002',entityType:'Debrief' as const,entityId:'DBR-2048',action:'AI organization completed',detail:'Observations structured, historical similarity checked and a lesson candidate surfaced.',actor:'AeroLearn AI',role:'AI System' as const,time:'28 Aug · 18:43',tone:'accent' as const},
  {id:'AUD-1003',entityType:'Lesson' as const,entityId:'LSN-301',action:'Lesson validated & published',detail:'Trainer/checker validation completed before organization-wide publication.',actor:'Checker Priya Shah',role:'Checker' as const,time:'28 Aug · 18:51',tone:'success' as const},
  {id:'AUD-1004',entityType:'Training Profile' as const,entityId:'P-101',action:'Assessment record linked',detail:'Assessment flight DBR-1998 linked to the individual training profile.',actor:'Checker Priya Shah',role:'Checker' as const,time:'29 Jul · 16:04',tone:'success' as const},
  {id:'AUD-1005',entityType:'Lesson' as const,entityId:'LSN-301',action:'Corrective action updated',detail:'Corrective action moved from Open to In Progress. Owner: Flight Standards.',actor:'Trainer Alex Morgan',role:'Trainer' as const,time:'02 Sep · 10:12',tone:'accent' as const},
]

export const initialAcknowledgements=[
  {id:'ACK-1',lessonId:'LSN-301',profileId:'P-102',acknowledgedAt:'29 Aug · 08:14',acknowledgedBy:'FO Liam Hart'},
]

export const initialSettings={
  retentionDays:2555,
  detailedAudit:true,
  audioIngestion:true,
  aircraftFilter:'All',
}
