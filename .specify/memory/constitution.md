<!--
Sync Impact Report
- Version change: (unratified template) → 1.0.0
- Principles: Initial adoption — replaced all placeholder principles with five concrete principles
- Added sections: Technology and stack; Workflow and quality gates (replaced SECTION_2/SECTION_3 placeholders)
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ Constitution Check gates aligned
  - .specify/templates/spec-template.md — ✅ no change (already mandates scenarios/requirements)
  - .specify/templates/tasks-template.md — ✅ no change (task model already supports traceability)
- Follow-up TODOs: None
-->

# Todo Constitution

## Core Principles

### I. Spec-driven development

All non-trivial work MUST be captured under `specs/<feature-branch>/` before implementation. The
workflow MUST follow: `spec.md` → `/speckit.plan` → `plan.md` (and related design artifacts) →
`/speckit.tasks` → `tasks.md` → implementation. Merged work MUST NOT introduce features that are
not traceable to an approved spec and plan.

### II. Scope discipline

Each feature MUST have a single coherent scope in `spec.md`. Expanding scope MUST update the spec
and plan before additional code lands. Undocumented scope creep is not permitted.

### III. Traceability

Every requirement MUST map to at least one task in `tasks.md`. Tasks MUST name concrete files,
modules, or deliverables. Code or behavior that cannot be traced to a requirement or task is out of
scope for the feature.

### IV. Testing and quality

When the feature specification requires tests, those tests MUST ship with the same change set.
Regressions MUST be resolved before merge. Critical user paths MUST remain verifiable as described
in the spec (manual or automated).

### V. Simplicity

Designs MUST prefer the simplest approach that satisfies the spec and this constitution. Additional
complexity MUST be recorded in the plan’s Complexity Tracking with justification; silent complexity
is not allowed.

## Technology and stack

- **Stack**: Document language, frameworks, and storage in `plan.md` Technical Context. Resolve
  NEEDS CLARIFICATION entries before implementation where they block work.
- **Dependencies**: Prefer maintained dependencies; pin versions when the project uses a lockfile.

## Workflow and quality gates

- **Speckit order**: Follow `/speckit.specify` → `/speckit.clarify` (optional) → `/speckit.plan` →
  `/speckit.tasks` → `/speckit.implement` unless explicitly waived for a spike (document the waiver
  in the plan).
- **Analysis**: When `spec.md`, `plan.md`, and `tasks.md` are intended to be stable, run
  `/speckit.analyze` before `/speckit.implement`.
- **Review**: Reviews SHOULD verify alignment with the spec, plan, and this constitution.

## Governance

This constitution supersedes informal practice when they conflict. Amendments use `/speckit.constitution`
or an equivalent documented update; each amendment MUST bump **Version**, set **Last Amended** to the
change date, and retain **Ratified** as the original adoption date unless re-ratification is explicitly
recorded.

**Semantic versioning** for this document: **MAJOR** — incompatible governance or principle removal;
**MINOR** — new principle or materially expanded section; **PATCH** — clarifications and non-semantic edits.

Compliance is expected at plan and review time. Use Complexity Tracking in `plan.md` for justified
exceptions to simplicity or other principles.

**Version**: 1.0.0 | **Ratified**: 2026-04-07 | **Last Amended**: 2026-04-07
