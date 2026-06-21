Action buttons — the primary, secondary, ghost, subtle and danger controls. Use one primary per view; everything else is secondary or ghost.

```jsx
<Button variant="primary" iconLeft={<i data-lucide="plus" />}>Add client</Button>
<Button variant="secondary">Cancel</Button>
<IconButton label="More" variant="ghost"><i data-lucide="more-horizontal" /></IconButton>
```

Variants: `primary` (brand blue + glow), `secondary` (white + hairline), `ghost` (transparent), `subtle` (blue-50 tint), `danger` (red). Sizes: `sm` `md` `lg`. `IconButton` is the square icon-only sibling.
