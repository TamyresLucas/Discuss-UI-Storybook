interface PlaceholderProps {
  name: string;
}

/**
 * Docs-only stand-in used by not-yet-implemented component stories (see
 * COMPONENT_STATUS.md). Styled from tokens, not literals, per DESIGN_TOKENS.md —
 * even a placeholder doesn't get an exemption from the no-arbitrary-values rule.
 */
export const Placeholder = ({ name }: PlaceholderProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 240,
      minHeight: 120,
      border: '1px dashed var(--sys-color-border)',
      borderRadius: 'var(--sys-radius-md)',
      color: 'var(--sys-color-muted-foreground)',
      fontFamily: 'var(--sys-font-family-sans)',
      fontSize: 'var(--sys-font-size-sm)',
      padding: 'var(--sys-space-4)',
      textAlign: 'center',
    }}
  >
    {name} — coming soon
  </div>
);
