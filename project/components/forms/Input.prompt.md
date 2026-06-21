Form controls — text input, select, switch and checkbox, all sharing the inset-well + brand-focus-ring system.

```jsx
<Input label="Company name" placeholder="Acme Studio" iconLeft={<i data-lucide="building-2" />} />
<Select label="Industry" options={['E-commerce', 'SaaS', 'Healthcare']} />
<Switch label="Email notifications" defaultChecked />
<Checkbox label="Mark as billable" defaultChecked />
```

Inputs show `hint` or `error` text below; focus draws the brand ring. Switch/Checkbox are controlled or uncontrolled. Switch thumb uses the spring easing.
