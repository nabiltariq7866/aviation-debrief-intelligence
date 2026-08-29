# AeroLearn AI — Operational Learning & Debrief Intelligence Platform

A React + TypeScript + Tailwind CSS interactive demo built around Todd's confirmed aviation debriefing requirements, with a clearly separated extensive-capabilities layer requested for the broader product demonstration.

## Product objective

The demo is not primarily a data-capture tool. Its central story is:

**Crew debrief → preserve human observations → AI organizes the information → AI finds related historical evidence → lesson / recurring pattern candidate → trainer/checker human validation → searchable organization-wide knowledge → training/assessment records remain linked to individual development profiles.**

The system intentionally does **not** automate or replace safety-critical flight, crew-fitness, training-assessment or operational authorization decisions.

## Core Todd-aligned requirements implemented

### 1. Post-Mission & Training Debriefs

- Post-Mission debriefs
- Training Sorties
- Assessment Flights
- Raw human-authored observations
- Individual self-evaluation
- Team / crew evaluation
- What went well
- What could improve
- Trainer/checker observations for training and assessment records
- Crew/profile selection
- Training and assessment records linked into selected individual training profiles

### 2. AI Debrief Organization

From a draft debrief, `Run AI organization` simulates:

- observation structuring
- source labels for self/team/trainer/general observations
- AI summary
- lesson-candidate extraction
- historical similarity search
- human-review state

The original human-authored record remains visible beside the AI output.

### 3. Lessons Learned Intelligence

- AI lesson candidates
- supporting source records
- occurrence counts
- crew counts
- AI confidence indicator
- trainer/checker evidence review
- role-aware human validation
- organization-wide publication
- acknowledgement tracking as an optional extension

### 4. Trend Identification

- recurring pattern detection
- trend charts
- occurrence / crew counts
- directional indicator
- `View supporting evidence` drill-down
- clickable source debriefs

### 5. Searchable Operational & Training Knowledge

The Knowledge Base searches across:

- published lessons
- post-mission debrief records
- structured observations
- training-sortie records
- assessment-flight records
- recurring trends

Filters are available for each source type.

### 6. Individual Training Profiles

Training Sortie and Assessment Flight creation can select one or more individual profiles.

When submitted:

- the source record is added to the profile development history
- assessment date is updated for Assessment Flights
- the profile links back to the original source record
- trainer/checker-maintained skill indicators remain unchanged by AI

This intentionally demonstrates Todd's statement that observations/outcomes are stored against the individual's training profile while preserving human authority over assessment.

### 7. Human-in-the-loop Safety Controls

Persona switching is available for:

- Crew Member
- Trainer
- Checker

In Human Review:

- Crew Member can inspect evidence but cannot publish organization-wide lessons
- Trainer and Checker can validate and publish
- AI cannot publish by itself

### 8. Audit & Traceability

A dedicated Audit & Traceability screen records demo actions such as:

- debrief submission
- training-profile linkage
- AI organization
- lesson candidate creation
- human publication
- knowledge acknowledgement
- configuration changes

Debrief and Lesson detail screens also show relevant audit history.

## Extensive interactive capabilities

These are deliberately shown as optional extensions rather than claims about Todd's explicit requirements.

### Audio / transcript ingestion

A transcript can be entered in the Extended Capabilities modal and converted into a real demo debrief record. It then follows the same core workflow.

### Crew-specific lesson recommendations

Select a crew profile and the demo surfaces relevant published knowledge using existing development context only for retrieval. It does not grade the person.

### Acknowledgement tracking

Select a published lesson and crew profile, mark it acknowledged, and see the state update in Lesson detail and audit history.

### Role-based access control

Switch Crew / Trainer / Checker personas and then open Human Review to see permission differences.

### Aircraft / platform filtering

Select a platform and immediately see matching debrief evidence.

### Retention & audit configuration

Change dummy retention days and detailed-audit settings. Configuration persists and is written into Audit & Traceability.

## Theme

Uses the same Eurocredit design system:

- Gold accent `#C59B48`
- Teal success `#45E3D3`
- Purple `#9375B5`
- Red danger `#FF6B6B`
- Dark mode default
- Light theme available

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router using `createBrowserRouter`
- Recharts
- Lucide React
- `localStorage` connected dummy-state layer

## Routes

```text
/dashboard
/debriefs
/debriefs/new
/debriefs/:id
/lessons
/lessons/:id
/trends
/knowledge
/training-profiles
/training-profiles/:id
/review
/audit
/extensions
/settings
```

## Recommended core client demo

1. Switch persona to `Trainer` or `Checker`.
2. Open `/debriefs/new`.
3. Select `Training Sortie` or `Assessment Flight`.
4. Select one or more training profiles.
5. Show separate self-evaluation, team evaluation and trainer/checker observations.
6. Submit the record.
7. Open the selected person's Training Profile to show the new record is already linked.
8. Return to the new Debrief.
9. Click `Run AI organization`.
10. Show structured observations and source labels.
11. Show the AI lesson candidate.
12. Show historical similar debriefs.
13. Open `/trends` and use `View supporting evidence`.
14. Open `/review` and validate the lesson as Trainer/Checker.
15. Open `/knowledge` and search the lesson/theme across source types.
16. Open `/audit` to show AI actions and human actions separately.

This directly demonstrates the core pain point: **turning an individual crew's experience into knowledge that benefits the wider operation.**

## Recommended extensive demo

After the core story, open `/extensions` and demonstrate only if useful:

1. Audio transcript → create debrief
2. Profile → recommended published knowledge
3. Lesson acknowledgement
4. Crew vs Trainer vs Checker permissions
5. Aircraft/platform evidence filter
6. Retention/audit settings

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite, usually:

```text
http://localhost:5173/
```

Production build:

```bash
npm run build
```

## Demo persistence

Interactive state is stored in browser `localStorage`, including:

- debriefs
- AI-structured outputs
- lessons
- trends
- training-profile links
- audit events
- acknowledgements
- persona
- extensive-demo configuration

Use Settings → `Reset all demo data` before replaying the presentation.
