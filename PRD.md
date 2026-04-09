# Product Requirements Document (PRD)

**Product:** Full-stack Todo application  
**Repository:** [nearform-todo](https://github.com/boerkey/nearform-todo)  
**Version:** 1.1  
**Last updated:** 2026-04-09  

**Architecture (separate doc):** System design and technical decisions are in **[ARCHITECTURE.md](ARCHITECTURE.md)** — use that file for reviewers who expect an explicit *Architecture Document*.

This file states *what* the product must do and *why*. Detailed specs, OpenAPI, and tasks live under [`specs/001-fullstack-todo-app/`](specs/001-fullstack-todo-app/).

---

## Product vision (source instructions)

The goal of this project is to design and build a simple full-stack Todo application that allows individual users to manage personal tasks in a clear, reliable, and intuitive way. The application should focus on clarity and ease of use, avoiding unnecessary features or complexity, while providing a solid technical foundation that can be extended in the future if needed.

From a user perspective, the application should allow the creation, visualization, completion, and deletion of todo items. Each todo represents a single task and should include a short textual description, a completion status, and basic metadata such as creation time. Users should be able to immediately see their list of todos upon opening the application and interact with it without any onboarding or explanation.

The frontend experience should be fast and responsive, with updates reflected instantly when the user performs an action such as adding or completing a task. Completed tasks should be visually distinguishable from active ones to clearly communicate status at a glance. The interface should work well across desktop and mobile devices and include sensible empty, loading, and error states to maintain a polished user experience.

The backend will expose a small, well-defined API responsible for persisting and retrieving todo data. This API should support basic CRUD operations and ensure data consistency and durability across user sessions. While authentication and multi-user support are not required for the initial version, the architecture should not prevent these features from being added later if the product evolves.

From a non-functional standpoint, the system should prioritize simplicity, performance, and maintainability. Interactions should feel instantaneous under normal conditions, and the overall solution should be easy to understand, deploy, and extend by future developers. Basic error handling is expected both client-side and server-side to gracefully handle failures without disrupting the user flow.

The first version of the application intentionally excludes advanced features such as user accounts, collaboration, task prioritization, deadlines, or notifications. These capabilities may be considered in future iterations, but the initial delivery should remain focused on delivering a clean and reliable core experience.

Success for this project will be measured by the ability of a user to complete all core task-management actions without guidance, the stability of the application across refreshes and sessions, and the clarity of the overall user experience. The final result should feel like a complete, usable product despite its deliberately minimal scope.

**Implementation note (MVP):** The delivered v1 follows the exercise spec: a **single shared todo list** without authentication, with **basic** (not marketing-grade) UI. Multi-user / personal data per account is an explicit **future** extension; see [ARCHITECTURE.md](ARCHITECTURE.md) for how the design stays extensible.

---

## 1. Purpose & summary (structured)

Deliver a web application where users can **create**, **view**, **complete/uncomplete**, and **delete** todos. Data is **persisted in a database** (not only in the browser). Titles are **required** (max **255** characters). The UI handles **empty**, **loading**, and **error** states and surfaces validation failures clearly.

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

- **Primary user:** Demo / trusted environment; v1 has **no login** (single shared list).
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

- **Todo:** Stable id, **title** (1–255 chars after trim), **completed** (boolean), **creation time** and update metadata (`createdAt` / `updatedAt`).

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

- Authentication / per-user tenancy (v1).
- Advanced visual design systems or heavy styling.
- Real-time sync across clients (manual refresh or polling is fine).
- Priorities, deadlines, notifications, collaboration (per source instructions).

---

## 10. Assumptions

- Single shared list for v1 (demo/trusted context).
- Consistent list ordering (e.g. newest first) is an implementation choice.
- Last-write-wins on a single todo id is acceptable for concurrency.
- Online use; offline-first not required.

---

## 11. Architecture

**System architecture, technical design, and key decisions** are documented in:

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — use this filename for reviewers or automated checks that look for an *Architecture Document*.

---

## 12. Related documents

| Document | Path |
|----------|------|
| **Architecture Document** | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| Feature specification | [`specs/001-fullstack-todo-app/spec.md`](specs/001-fullstack-todo-app/spec.md) |
| Implementation plan | [`specs/001-fullstack-todo-app/plan.md`](specs/001-fullstack-todo-app/plan.md) |
| API contract (OpenAPI) | [`specs/001-fullstack-todo-app/contracts/openapi.yaml`](specs/001-fullstack-todo-app/contracts/openapi.yaml) |
| Run & test instructions | [`specs/001-fullstack-todo-app/quickstart.md`](specs/001-fullstack-todo-app/quickstart.md) |
