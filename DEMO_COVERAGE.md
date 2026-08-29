# Demo Requirement Coverage

## Todd-confirmed core requirements

| Requirement / pain point | Implemented demo flow |
|---|---|
| Post-mission debriefing is critical | Post-Mission debrief creation, listing and detail workflow |
| Honest self-evaluation | Separate Individual Self-Evaluation field and structured observation source |
| Team evaluation | Separate Team / Crew Evaluation field and structured observation source |
| Problem is converting information into wider learning | AI organization → lesson candidate → historical similarity → trend → human validation → Knowledge Base |
| Individual crew experience should benefit everyone | Published lessons become organization-wide searchable knowledge |
| Debrief after training sortie | Training Sortie type with trainer/checker notes and profile linkage |
| Debrief after assessment flight | Assessment Flight type with trainer/checker notes and profile linkage |
| Assessment documentation against individual profile | Selected training profiles receive linked Training/Assessment source records |
| Trainers/checkers track development | Training Profiles show linked source history and trainer-maintained indicators |
| AI organizes information | Run AI Organization structures and labels observations |
| AI identifies trends | Trend Intelligence creates recurring pattern candidates and charts |
| Knowledge should be accessible | Cross-source Knowledge Base search and filters |
| AI must not interfere with safety-critical decisions | Role-aware human review, safety boundary messaging, AI cannot publish independently |

## Real-feel connected dummy flows

- New debrief persists to localStorage.
- Training/assessment submission updates selected individual profile history.
- AI analysis modifies the same debrief and creates a lesson candidate.
- Strong historical similarity creates a recurring trend candidate.
- Trend evidence opens the supporting source debriefs.
- Trainer/Checker publication changes the lesson to Published.
- Published lessons become searchable in the Knowledge Base.
- Acknowledgements persist and appear against lesson/profile state.
- Audit history records human, AI and configuration actions.
- Persona switching changes Human Review permissions.
- Reset Demo restores the entire state.

## Extensive optional capabilities implemented interactively

- Audio/transcript ingestion → creates a real debrief record.
- Profile-based published lesson recommendations.
- Knowledge acknowledgement tracking.
- Crew / Trainer / Checker persona switching and publication permissions.
- Aircraft/platform filtering.
- Retention configuration and detailed-audit toggle.
- Dedicated Audit & Traceability workspace.

## Safety design

The demo explicitly prevents the AI from being presented as the authority for:

- flight-safety decisions
- crew fitness
- operational authorization
- trainer/checker assessment outcomes
- automatic performance grading

AI is positioned as an organization, retrieval, similarity and knowledge-intelligence layer with human validation.
