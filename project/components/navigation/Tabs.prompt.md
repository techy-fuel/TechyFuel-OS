Underline tab bar for switching views inside a page (e.g. List / Kanban / Calendar, or CRM record sections).

```jsx
<Tabs
  defaultValue="overview"
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks', count: 12 },
    { id: 'files', label: 'Files', count: 8 },
  ]}
  onChange={(id) => setView(id)}
/>
```

Active tab gets a 2px brand underline + strong text. Optional `count` chip and `icon` per tab.
