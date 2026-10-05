# Component Contracts

The API standard every component in `packages/ui/src/components/**` must follow.
None of the 76 components tracked in [COMPONENT_STATUS.md](./COMPONENT_STATUS.md)
are implemented yet — this document is the contract the *first* real
implementation of each one must satisfy, not a retrofit.

## File shape (one component = one folder)

```
src/components/<Section>/<Component>/
  <Component>.tsx            the implementation
  <Component>.stories.tsx     CSF3 stories — see STORYBOOK_RULES.md
  <Component>.test.tsx        unit + a11y assertions (Vitest + Testing Library + axe)
  index.ts                    export barrel: `export * from './<Component>'`
```

`packages/ui/src/index.ts` re-exports each component's barrel. A component that
isn't re-exported from the package root isn't public — internal helper
components used only by one family (e.g. an internal `TableCell` used only by
`Table`) stay un-exported and live alongside the parent instead of getting
their own top-level folder.

A component file is never created without its story sitting next to it in the
same commit/PR — see the "Component-first documentation" rule in
[CLAUDE.md](../CLAUDE.md).

## Standard prop interface

Every component that renders a visible surface (not a pure layout/utility
primitive) accepts, where applicable:

```ts
interface ComponentProps extends React.ComponentPropsWithoutRef<'element'> {
  /** Visual treatment. Maps 1:1 to a comp.* token group — never free-form. */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  /** Physical size. Consistent scale across the whole library: sm | md | lg. */
  size?: 'sm' | 'md' | 'lg';
  /** Render props.children into the child element instead of a wrapper DOM node
   *  (Radix Slot pattern) — lets consumers compose e.g. <Button asChild><Link/></Button>
   *  without double-wrapping in a <button>. */
  asChild?: boolean;
}
```

- `variant`/`size` are the only two props allowed to drive tokenized visual
  differences. Don't add a one-off `color` or `tone` prop that duplicates what
  `variant` already covers.
- Build the `variant`/`size` → class-list mapping with `class-variance-authority`
  (`cva`), not hand-rolled ternaries or template strings. Merge the result with
  any consumer-supplied `className` via `tailwind-merge` (`twMerge`), so a
  consumer's override always wins over the internal default instead of losing
  a specificity fight.
- `asChild` is implemented with `radix-ui`'s `Slot` primitive, not a custom
  `cloneElement` reimplementation.

## Refs — always forward, always typed

Every component that renders a single root DOM element forwards its ref to
that element:

```tsx
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = 'Button';
```

- The ref type matches the actual rendered element (`HTMLButtonElement` for a
  button, `HTMLDivElement` for a generic container), not a generic `HTMLElement`.
- Set `displayName` on every `forwardRef` component — otherwise it shows up as
  `Anonymous` in the React DevTools and in Storybook's error boundaries.
- A component with `asChild` is inherently polymorphic (it can render as
  whatever the child is), so its ref type is only a best-effort default for the
  common case — document that in the prop's TSDoc comment rather than trying
  to make the type fully generic over the rendered tag.

## Slot naming

Compound components (`Card`, `Dialog`, `Accordion`, …) use the
`<Component>.<Slot>` dot-notation export pattern already established by Radix
and shadcn/ui:

```tsx
<Card>
  <Card.Header>…</Card.Header>
  <Card.Content>…</Card.Content>
  <Card.Footer>…</Card.Footer>
</Card>
```

- Slot names are nouns describing structural position (`Header`, `Content`,
  `Footer`, `Trigger`, `Item`, `Indicator`), never behavior (`Clickable`,
  `Wrapper`).
- A slot component gets its own named export too (`export const CardHeader = …`)
  so it can be imported standalone when a consumer needs to recompose the
  parts — the dot-notation is sugar on top (`Card.Header = CardHeader`), not the
  only way in.

## Zero business logic

Components accept data and callback props and render UI. They do not:

- call `fetch`/an API client, read from a store, or know about routing,
- own application state beyond pure UI state local to the component (an open/
  closed boolean, a hover flag, a controlled-vs-uncontrolled value),
- import anything from an app's feature code.

A `SessionCard` takes `{ title, status, date, onOpen, onDelete }` as props; it
does not know how to fetch a session or what "deleting" does downstream. If a
story or the playground app needs realistic data, that data is inlined as
story args/fixtures — never fetched.

## Composition over reinvention

See [TECH_STACK_DS.md](./TECH_STACK_DS.md) for the primitive-first rule: any
component with focus management, portal rendering, or keyboard-navigation
semantics (dialogs, popovers, menus, tooltips, comboboxes, accordions, tabs…)
wraps the matching `radix-ui` primitive. Never rebuild that behavior from
`<div>` + `onKeyDown` + manual `aria-*` wiring by hand.
