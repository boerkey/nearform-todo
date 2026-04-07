# Data Model: Todo

## Entity: Todo

| Field | Type | Constraints | Notes |
|-------|------|-------------|--------|
| `id` | UUID (string in API) | Primary key, server-generated | Exposed as string in JSON |
| `title` | String | Required, trim whitespace, length 1–255 after trim | Reject empty or whitespace-only |
| `completed` | Boolean | Default `false` | User can toggle |
| `createdAt` | DateTime (UTC) | Set on create, immutable | Used for default sort (desc) |
| `updatedAt` | DateTime (UTC) | Auto-update on row change | Optional for MVP UX; useful for auditing |

## Validation rules (authoritative on server)

1. **Create**: `title` must be present (non-null), string, trim, length between 1 and 255 inclusive.
2. **Update completion**: `completed` boolean only for PATCH; no partial title edit required for MVP unless spec extended (out of scope — title edit not in FR list).
3. **Delete**: By `id`; 404 if not found.

## State transitions

```
[created] completed=false  --toggle--> completed=true
         completed=true   --toggle--> completed=false
any      --delete--> removed (hard delete)
```

## Relationships

None. Single-table feature; no users table (no auth).

## API projection (JSON)

Example:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy milk",
  "completed": false,
  "createdAt": "2026-04-07T12:00:00.000Z",
  "updatedAt": "2026-04-07T12:00:00.000Z"
}
```

List response: JSON array of the above objects, ordered by `createdAt` descending.
