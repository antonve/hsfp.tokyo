# Modifying Point Calculations

Edit the matcher functions in `src/lib/domain/visa.{type}.ts`.

Each matcher:
- Receives the qualifications object
- Returns `MatchResult[]` with `{ criteria, points }`

Example:

```typescript
function matchAge(q: EngineerQualifications): MatchResult[] {
  if (q.age && q.age < 30) {
    return [{ criteria: 'age_under_30', points: 15 }]
  }
  if (q.age && q.age < 35) {
    return [{ criteria: 'age_under_35', points: 10 }]
  }
  return []
}
```

The core matching algorithm is in `src/lib/domain/matching.ts`.
