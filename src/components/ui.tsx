import type { ReactNode } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

export function PageHeader({eyebrow,title,description,actions}:{eyebrow?:string;title:string;description?:string;actions?:ReactNode}){
  return <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div className="min-w-0">
      {eyebrow&&<div className="label mb-2 text-accent">{eyebrow}</div>}
      <h1 className="page-title">{title}</h1>
      {description&&<p className="mt-2 max-w-4xl text-sm leading-6 text-muted">{description}</p>}
    </div>
    {actions&&<div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
}

export function SectionCard({title,description,action,className='',bodyClassName='p-5',children}:{title?:string;description?:string;action?:ReactNode;className?:string;bodyClassName?:string;children:ReactNode}){
  return <section className={`card overflow-hidden ${className}`}>
    {(title||description||action)&&<div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div className="min-w-0">
        {title&&<h2 className="text-sm font-semibold tracking-[-.01em] text-ink">{title}</h2>}
        {description&&<p className="mt-1 text-[11px] leading-5 text-muted">{description}</p>}
      </div>
      {action&&<div className="shrink-0">{action}</div>}
    </div>}
    <div className={bodyClassName}>{children}</div>
  </section>
}

export function MetricCard({label,value,caption,icon,tone='accent',change}:{label:string;value:string;caption:string;icon:ReactNode;tone?:'accent'|'success'|'purple'|'danger'|'info';change?:string}){
  const toneClass={
    accent:'bg-accent/10 text-accent',
    success:'bg-success/10 text-success',
    purple:'bg-purple/10 text-purple',
    danger:'bg-danger/10 text-danger',
    info:'bg-info-soft text-info',
  }[tone]
  return <div className="card relative overflow-hidden p-4">
    <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-accent/5 blur-2xl"/>
    <div className="relative flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="data-label">{label}</div>
        <div className="mt-2 flex items-end gap-2">
          <div className="text-[26px] font-semibold tracking-[-.04em] text-ink">{value}</div>
          {change&&<span className="mb-1 rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-semibold text-success">{change}</span>}
        </div>
        <div className="mt-1 text-[10px] leading-4 text-muted">{caption}</div>
      </div>
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line ${toneClass}`}>{icon}</div>
    </div>
  </div>
}

export function Badge({children,tone='muted'}:{children:ReactNode;tone?:'success'|'accent'|'purple'|'danger'|'muted'|'info'}){
  const cls={
    success:'border-success/25 bg-success/10 text-success',
    accent:'border-accent/25 bg-accent/10 text-accent',
    purple:'border-purple/25 bg-purple/10 text-purple',
    danger:'border-danger/25 bg-danger/10 text-danger',
    info:'border-info-soft bg-info-soft text-info',
    muted:'border-line bg-panel text-muted',
  }[tone]
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${cls}`}>{children}</span>
}

export function Progress({value,tone='accent'}:{value:number;tone?:'accent'|'success'|'purple'|'danger'|'info'}){
  const color={accent:'bg-accent',success:'bg-success',purple:'bg-purple',danger:'bg-danger',info:'bg-info'}[tone]
  return <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel"><div className={`h-full rounded-full ${color}`} style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div>
}

export function Modal({open,onClose,title,description,children,footer,size='md'}:{open:boolean;onClose:()=>void;title:string;description?:string;children:ReactNode;footer?:ReactNode;size?:'sm'|'md'|'lg'|'xl'}){
  if(!open)return null
  const width=size==='sm'?'max-w-md':size==='lg'?'max-w-3xl':size==='xl'?'max-w-5xl':'max-w-xl'
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-black/65 backdrop-blur-sm"/>
      <div role="dialog" aria-modal="true" className={`relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface ${width}`} style={{boxShadow:'var(--shadow-float)'}}>
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0"><h3 className="text-base font-semibold tracking-[-.02em] text-ink">{title}</h3>{description&&<p className="mt-1 text-xs leading-5 text-muted">{description}</p>}</div>
          <button onClick={onClose} className="icon-btn h-8 w-8 shrink-0 border-0 bg-panel"><X size={15}/></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
        {footer&&<div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-line bg-panel/40 px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

export function FieldLabel({label,hint,children}:{label:string;hint?:string;children:ReactNode}){
  return <label className="block"><span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-ink"><span>{label}</span>{hint&&<span className="text-[10px] font-normal text-faint">{hint}</span>}</span>{children}</label>
}

type SelectOption=string|{value:string;label:string;description?:string;disabled?:boolean}
const normalize=(option:SelectOption)=>typeof option==='string'?{value:option,label:option,description:undefined,disabled:false}:{disabled:false,...option}

export function CustomSelect({value,onChange,options,placeholder='Select option',size='md',className='',menuWidth}:{value:string;onChange:(value:string)=>void;options:SelectOption[];placeholder?:string;size?:'sm'|'md';className?:string;menuWidth?:number}){
  const [open,setOpen]=useState(false)
  const triggerRef=useRef<HTMLButtonElement|null>(null)
  const menuRef=useRef<HTMLDivElement|null>(null)
  const [rect,setRect]=useState<DOMRect|null>(null)
  const normalized=useMemo(()=>options.map(normalize),[options])
  const selected=normalized.find(o=>o.value===value)

  const syncRect=()=>{ if(triggerRef.current)setRect(triggerRef.current.getBoundingClientRect()) }

  useEffect(()=>{
    if(!open)return
    syncRect()
    const onPointer=(event:MouseEvent)=>{
      const target=event.target as Node
      if(triggerRef.current?.contains(target)||menuRef.current?.contains(target))return
      setOpen(false)
    }
    const onKey=(event:KeyboardEvent)=>{ if(event.key==='Escape')setOpen(false) }
    const onMove=()=>syncRect()
    document.addEventListener('mousedown',onPointer)
    document.addEventListener('keydown',onKey)
    window.addEventListener('resize',onMove)
    window.addEventListener('scroll',onMove,true)
    return ()=>{
      document.removeEventListener('mousedown',onPointer)
      document.removeEventListener('keydown',onKey)
      window.removeEventListener('resize',onMove)
      window.removeEventListener('scroll',onMove,true)
    }
  },[open])

  const menu=open&&rect?createPortal(
    <div
      ref={menuRef}
      className="fixed z-[130] max-h-72 overflow-y-auto rounded-xl border border-line bg-elevated p-1.5"
      style={{top:Math.max(12,Math.min(rect.bottom+7,window.innerHeight-310)),left:Math.max(12,Math.min(rect.left,window.innerWidth-(menuWidth||Math.max(rect.width,220))-12)),width:Math.min(menuWidth||Math.max(rect.width,220),window.innerWidth-24),boxShadow:'var(--shadow-float)'}}
    >
      {normalized.map(option=><button
        type="button"
        key={option.value}
        disabled={option.disabled}
        onClick={()=>{if(!option.disabled){onChange(option.value);setOpen(false)}}}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${option.value===value?'bg-accent/10 text-accent':'text-muted hover:bg-panel hover:text-ink'} ${option.disabled?'cursor-not-allowed opacity-40':''}`}
      >
        <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">{option.label}</div>{option.description&&<div className="mt-0.5 truncate text-[9px] text-faint">{option.description}</div>}</div>
        {option.value===value&&<Check size={14} className="shrink-0"/>}
      </button>)}
    </div>,document.body):null

  return <div className={`relative ${className}`}>
    <button
      ref={triggerRef}
      type="button"
      aria-expanded={open}
      onClick={()=>setOpen(v=>!v)}
      className={`custom-select-trigger flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-panel px-3 text-left text-ink outline-none transition ${size==='sm'?'h-9 text-xs':'h-10 text-sm'}`}
    >
      <span className={`truncate ${selected?'text-ink':'text-faint'}`}>{selected?.label||placeholder}</span>
      <ChevronDown size={14} className={`shrink-0 text-faint transition ${open?'rotate-180 text-accent':''}`}/>
    </button>
    {menu}
  </div>
}

export function SearchField({value,onChange,placeholder,className=''}:{value:string;onChange:(value:string)=>void;placeholder:string;className?:string}){
  return <div className={`relative ${className}`}>
    <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"/>
    <input value={value} onChange={e=>onChange(e.target.value)} className="field h-11 pl-10 pr-10" placeholder={placeholder}/>
    {value&&<button type="button" onClick={()=>onChange('')} className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-lg text-faint transition hover:bg-surface hover:text-ink"><X size={12}/></button>}
  </div>
}

export function Toggle({checked,onChange,label,description}:{checked:boolean;onChange:(checked:boolean)=>void;label:string;description?:string}){
  return <button type="button" onClick={()=>onChange(!checked)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-line bg-panel/55 p-3.5 text-left transition hover:border-accent/25">
    <div><div className="text-xs font-semibold text-ink">{label}</div>{description&&<div className="mt-1 text-[10px] leading-4 text-muted">{description}</div>}</div>
    <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked?'bg-accent':'bg-elevated'}`} style={{boxShadow:'inset 0 0 0 1px var(--border-primary)'}}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${checked?'left-6':'left-1'}`}/>
    </span>
  </button>
}

export function EmptyState({icon,title,description,action}:{icon:ReactNode;title:string;description:string;action?:ReactNode}){
  return <div className="rounded-2xl border border-dashed border-line bg-panel/25 p-8 text-center">
    <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-faint">{icon}</div>
    <div className="mt-3 text-sm font-semibold text-ink">{title}</div>
    <div className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted">{description}</div>
    {action&&<div className="mt-4 flex justify-center">{action}</div>}
  </div>
}
