import { Database, RotateCcw, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CustomSelect, Modal, PageHeader, SectionCard, Toggle } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function Settings(){
  const {resetDemo,settings,updateSettings,debriefs}=useDemo()
  const [resetOpen,setResetOpen]=useState(false)
  const aircraft=useMemo(()=>['All',...Array.from(new Set(debriefs.map(d=>d.aircraft)))],[debriefs])

  return <>
    <PageHeader eyebrow="Demo Controls" title="Settings" description="Control the extensive demo configuration, optional capabilities and local presentation state without introducing unnecessary production complexity."/>

    <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-4">
        <SectionCard title="Demo configuration" description="Changes persist locally and are written to Audit & Traceability">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink"><span>Retention period</span><span className="text-[10px] font-normal text-faint">Demo extension</span></div>
              <div className="relative"><input className="field pr-14" type="number" min="30" value={settings.retentionDays} onChange={e=>updateSettings({retentionDays:Math.max(30,Number(e.target.value)||30)})}/><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-faint">days</span></div>
            </label>
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink"><span>Aircraft / platform filter</span><span className="text-[10px] font-normal text-faint">Extension state</span></div>
              <CustomSelect value={settings.aircraftFilter} onChange={value=>updateSettings({aircraftFilter:value})} options={aircraft}/>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Toggle checked={settings.detailedAudit} onChange={checked=>updateSettings({detailedAudit:checked})} label="Detailed audit history" description="Record human and AI demo actions in the traceability workspace."/>
            <Toggle checked={settings.audioIngestion} onChange={checked=>updateSettings({audioIngestion:checked})} label="Audio / transcript ingestion" description="Enable the optional transcript-to-debrief extensive demo flow."/>
          </div>
        </SectionCard>

        <SectionCard title="Current demo state" description="Quick summary of the extensive feature configuration">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="panel-soft p-3"><div className="flex items-center gap-2 text-[10px] font-semibold text-muted"><Database size={13} className="text-accent"/>Retention</div><div className="mt-2 text-lg font-semibold text-ink">{settings.retentionDays}</div><div className="mt-1 text-[9px] text-faint">days</div></div>
            <div className="panel-soft p-3"><div className="flex items-center gap-2 text-[10px] font-semibold text-muted"><SlidersHorizontal size={13} className="text-purple"/>Aircraft filter</div><div className="mt-2 truncate text-sm font-semibold text-ink">{settings.aircraftFilter}</div><div className="mt-1 text-[9px] text-faint">optional filtering state</div></div>
            <div className="panel-soft p-3"><div className="flex items-center gap-2 text-[10px] font-semibold text-muted"><Sparkles size={13} className="text-success"/>Audio flow</div><div className={`mt-2 text-sm font-semibold ${settings.audioIngestion?'text-success':'text-muted'}`}>{settings.audioIngestion?'Enabled':'Disabled'}</div><div className="mt-1 text-[9px] text-faint">transcript extension</div></div>
          </div>
        </SectionCard>
      </div>

      <div className="space-y-4">
        <SectionCard title="Safety positioning" description="Core product principle — visible throughout the demo">
          <div className="rounded-xl border border-success/20 bg-success/5 p-4">
            <div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success/10 text-success"><ShieldCheck size={16}/></div><div><div className="text-sm font-semibold text-ink">Human authority is preserved</div><div className="mt-2 text-[10px] leading-5 text-muted">AI structures and connects knowledge. It does not replace crew judgement, trainer/checker authority, assessment decisions or safety-critical operational decisions.</div></div></div>
          </div>
        </SectionCard>

        <SectionCard title="Reset demo scenario" description="Restore the original connected dummy-data story so the presentation can be replayed from the beginning.">
          <div className="rounded-xl border border-danger/20 bg-danger/5 p-4"><div className="text-xs font-semibold text-ink">Reset all local demo state</div><div className="mt-1 text-[10px] leading-5 text-muted">Debriefs, generated lessons, trends, profile links, acknowledgements, audit events, persona and settings return to the original sample scenario.</div><button onClick={()=>setResetOpen(true)} className="secondary-btn mt-4 text-danger"><RotateCcw size={15}/>Reset all demo data</button></div>
        </SectionCard>
      </div>
    </div>

    <Modal open={resetOpen} onClose={()=>setResetOpen(false)} title="Reset complete demo scenario?" description="This clears changes made during the live demo and restores the original interconnected dummy dataset." size="sm" footer={<><button onClick={()=>setResetOpen(false)} className="secondary-btn">Cancel</button><button onClick={()=>{resetDemo();setResetOpen(false)}} className="primary-btn"><RotateCcw size={14}/>Reset demo</button></>}>
      <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-xs leading-5 text-muted">Use this after a presentation or before replaying the core flow from New Debrief → AI Organization → Trend → Human Review → Knowledge Base.</div>
    </Modal>
  </>
}
