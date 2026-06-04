# Validation Rules — Phase 4: Appointment Booking

## Field Validation

### POST /appointments

| Field | Rule | Error Message | HTTP Status |
|---|---|---|---|
| `agentId` | Required, non-empty string | `"agentId is required"` | 400 |
| `slotId` | Required, non-empty string | `"slotId is required"` | 400 |
| slot (by slotId) | Must exist in the slots table | `"Slot not found"` | 404 |
| slot.status | Must be `available` (not `booked`) | `"Slot is already booked"` | 409 |

### PATCH /appointments/:id/cancel

| Field | Rule | Error Message | HTTP Status |
|---|---|---|---|
| `:id` | Appointment must exist | `"Appointment not found"` | 404 |
| `appointment.status` | Must be `confirmed` (not already `cancelled`) | `"Appointment is already cancelled"` | 409 |

### GET /appointments

| Field | Rule | Error Message | HTTP Status |
|---|---|---|---|
| `agentId` (query param) | Required, non-empty string | `"agentId query parameter is required"` | 400 |

### GET /slots

No required parameters. `therapyId` query param is optional; if provided, filters results to that therapy only. No error is returned for an unknown therapyId — the response is simply an empty array.

## Validation Behaviour by Endpoint

### POST /appointments

1. Check `agentId` is present and non-empty → 400 if missing
2. Check `slotId` is present and non-empty → 400 if missing
3. Look up slot by `slotId` → 404 if not found
4. Check `slot.status === 'available'` → 409 if `booked`
5. Execute booking transaction (insert appointment + update slot status) → 201 with appointment object

### PATCH /appointments/:id/cancel

1. Look up appointment by `:id` → 404 if not found
2. Check `appointment.status === 'confirmed'` → 409 if already `cancelled`
3. Execute cancellation transaction (update appointment status + update slot status) → 200 with updated appointment object

### GET /appointments

1. Check `agentId` query param is present and non-empty → 400 if missing
2. Query appointments by `agentId` where `status = 'confirmed'` → 200 with array (may be empty)

### GET /slots

1. If `therapyId` query param is present, query slots by `therapyId` where `status = 'available'`
2. Otherwise, query all slots where `status = 'available'`
3. Always return 200 with array (may be empty)

## Error Response Shape

All error responses use the following JSON body:

```json
{ "error": "<message>" }
```

Examples:

```json
{ "error": "agentId is required" }
{ "error": "slotId is required" }
{ "error": "Slot not found" }
{ "error": "Slot is already booked" }
{ "error": "Appointment not found" }
{ "error": "Appointment is already cancelled" }
{ "error": "agentId query parameter is required" }
```
