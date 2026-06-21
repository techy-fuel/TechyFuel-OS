Data-display primitives — `Badge` (status/category pills), `Avatar` + `AvatarGroup`, `Card` (the base white surface), `StatCard` (dashboard KPI tile) and `ProgressBar`.

```jsx
<Badge tone="success" dot>Active client</Badge>
<Badge tone="warning">Proposal sent</Badge>
<Avatar name="Sara Khan" status="online" />
<AvatarGroup people={['Sara Khan','Omar Ali','Lena Cruz','Tom Reed','Mia Wu']} max={4} />
<StatCard label="Monthly revenue" value="$48,250" delta="12.5%" icon={<i data-lucide="dollar-sign" />} tone="success" />
<ProgressBar value={72} tone="brand" showLabel label="Team utilization" />
<Card interactive>…</Card>
```

Badge tones map to the status system (lead/proposal/active/etc). Cards always carry hairline + soft shadow; `interactive` adds the hover lift.
