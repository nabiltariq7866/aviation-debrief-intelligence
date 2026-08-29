import { RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { PageHeader, SectionCard } from '../components/ui'
import { useDemo } from '../state/DemoContext'

export default function Settings(){
  const {resetDemo,settings,updateSettings}=useDemo()

  return <>
    <PageHeader eyebrow="Demo Controls" title="Settings" description="Control the extensive demo configuration, safety positioning and reset behavior."/>

    <div className="grid gap-4 xl:grid-cols-2">
      <SectionCard title="Extended demo configuration" description="Dummy settings are persisted in localStorage and changes appear in Audit & Traceability">
        <div className="space-y-4">
          <label className="block"><div className="mb-2 text-xs font-semibold text-ink">Retention period</div><div className="flex items-center gap-2"><input className="field" type="number" min="30" value={settings.retentionDays} onChange={e=>updateSettings({retentionDays:Math.max(30,Number(e.target.value)||30)})}/><span className="text-xs text-muted">days</span></div></label>
          <label className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-panel/35 p-3"><div><div className="text-xs font-semibold text-ink">Detailed audit history</div><div className="mt-1 text-[9px] text-muted">When disabled, non-system detailed audit events stop being added.</div></div><input type="checkbox" checked={settings.detailedAudit} onChange={e=>updateSettings({detailedAudit:e.target.checked})}/></label>
          <label className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-panel/35 p-3"><div><div className="text-xs font-semibold text-ink">Audio ingestion extension</div><div className="mt-1 text-[9px] text-muted">Controls the optional transcript-ingestion demo flag.</div></div><input type="checkbox" checked={settings.audioIngestion} onChange={e=>updateSettings({audioIngestion:e.target.checked})}/></label>
          <div className="rounded-xl border border-line/60 bg-panel/35 p-3"><div className="flex items-center gap-2 text-xs font-semibold text-ink"><SlidersHorizontal size={14} className="text-accent"/>Aircraft filter state</div><div className="mt-1 text-[9px] text-muted">Current optional aircraft/platform filter: <span className="font-semibold text-ink">{settings.aircraftFilter}</span></div></div>
        </div>
      </SectionCard>

      <SectionCard title="Safety positioning" description="Core product principle">
        <div className="flex gap-3 rounded-xl border border-success/20 bg-success/5 p-4"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-success"/><div className="text-xs leading-5 text-muted">AI structures and connects knowledge. It does not replace crew judgement, trainer/checker authority, assessment decisions or any safety-critical operational decision.</div></div>
      </SectionCard>

      <SectionCard title="Reset demo" description="Restore the original sample data, profiles, acknowledgements, audit trail, persona and settings so the live story can be replayed from the beginning.">
        <button onClick={()=>{if(confirm('Reset all aviation demo data?'))resetDemo()}} className="secondary-btn"><RotateCcw size={15}/>Reset all demo data</button>
      </SectionCard>
    </div>
  </>
}
