# Product Requirements Document (PRD)

**Product:** Full-stack Todo application  
**Repository:** [nearform-todo](https://github.com/boerkey/nearform-todo)  
**Version:** 1.0  
**Last updated:** 2026-04-08  

This document states *what* the product must do and *why*. Implementation details, API contracts, and task breakdowns live under [`specs/001-fullstack-todo-app/`](specs/001-fullstack-todo-app/).

---

## 1. Purpose & summary

Deliver a small web application where users can manage a shared list of todos: create items, see all items, mark items complete or incomplete, and delete items. Data must survive server restarts (database-backed). The experience must handle invalid input and an empty list clearly.

---

## 2. Goals

| Goal | Description |
|------|-------------|
| **G1** | Users can capture work as todos with a required title (max 255 characters). |
| **G2** | Users see all todos in one place, with a clear empty state when there are none. |
| **G3** | Users can toggle completion and delete todos; changes persist. |
| **G4** | Invalid input produces understandable errors; nothing invalid is stored. |
| **G5** | The solution is testable: unit, integration (API + DB), and E2E (UI) coverage. |

---

## 3. Personas & context

- **Primary user:** A single user or team in a trusted/demo environment (no login required).
- **Deployment:** Local or simple hosted stack: HTTP API + browser UI.

---

## 4. User stories (priorities)

### P1 — Create and list (MVP)

- User can add todos with a title and see them in a single list.
- With no todos, the UI shows an explicit **empty state** (not a blank screen).

### P2 — Complete / incomplete

- User can mark a todo completed or not completed; state is visible and persists after reload.

### P3 — Delete

- User can delete a todo; it disappears and does not return after reload; deleting the last item returns to the empty state.

---

## 5. Functional requirements

| ID | Requirement |
|----|----------------|
| FR-001 | Create a todo with a **title**; required; max **255** characters. |
| FR-002 | Persist todos in a **database** (survive restarts; not browser-only). |
| FR-003 | Show all todos in **one list**. |
| FR-004 | **Toggle** completed / not completed; show state in the list. |
| FR-005 | **Delete** a todo permanently from storage. |
| FR-006 | Expose operations via an **HTTP JSON API** (create, list, update completion, delete). |
| FR-007 | Provide a **browser UI** for all of the above without extra tools for normal use. |
| FR-008 | Dedicated **empty state** when there are no todos. |
| FR-009 | **Client-side** errors for invalid input; do not persist invalid todos. |
| FR-010 | **API** returns structured errors mappable to user-facing messages. |
| FR-011 | **Unit tests** for validation and core behaviors. |
| FR-012 | **Integration tests** against the real database. |
| FR-013 | **E2E tests** for primary UI flows (add, complete, delete). |

---

## 6. Data model (conceptual)

- **Todo:** Stable id, **title** (1–255 chars after trim), **completed** (boolean), timestamps as needed for ordering and auditing.

---

## 7. Edge cases & errors

- Empty or whitespace-only title → reject; show clear error; no row created.
- Title over 255 characters → reject; show clear error; no partial write.
- Malformed API payloads → error response; no data corruption.
- Backend/DB unavailable → user-visible failure (no silent empty UI).
- After deleting the last todo → same empty state as “never had todos.”

---

## 8. Success criteria (acceptance)

- User can add a first todo and see it in the list within **one minute** on a typical dev setup without docs.
- **100%** of created todos remain after backend restart + client refresh.
- Invalid title attempts: **100%** show a visible error; **0** invalid rows stored.
- With zero todos, **100%** of visits show the empty state.
- Unit, integration, and E2E suites exist, pass, and cover FR-011–FR-013.

---

## 9. Out of scope (non-goals)

- Authentication / per-user tenancy.
- Advanced visual design systems or heavy styling.
- Real-time sync across clients (manual refresh or polling is fine).

---

## 10. Assumptions

- Single shared list (demo/trusted context).
- Consistent list ordering (e.g. newest first) is acceptable as an implementation choice.
- Last-write-wins on a single todo id is acceptable for concurrency.
- Online use; offline-first not required.

---

## 11. Related documents

| Document | Path |
|----------|------|
| Feature specification (source user stories & FR numbering) | [`specs/001-fullstack-todo-app/spec.md`](specs/001-fullstack-todo-app/spec.md) |
| Implementation plan | [`specs/001-fullstack-todo-app/plan.md`](specs/001-fullstack-todo-app/plan.md) |
| API contract (OpenAPI) | [`specs/001-fullstack-todo-app/contracts/openapi.yaml`](specs/001-fullstack-todo-app/contracts/openapi.yaml) |
| Run & test instructions | [`specs/001-fullstack-todo-app/quickstart.md`](specs/001-fullstack-todo-app/quickstart.md) |

---

*This PRD aligns with the product scope agreed for the Nearform todo exercise. If the external instructions included a separate PDF or link, treat this file as the canonical in-repo copy of those requirements.*
