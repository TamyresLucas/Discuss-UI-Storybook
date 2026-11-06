import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const tokens = readFileSync(resolve(__dirname, '../../../tokens/src/tokens.css'), 'utf8')
const globals = readFileSync(resolve(__dirname, 'globals.css'), 'utf8')
const definition = /--sys-color-overlay-destructive-20: color-mix\(in srgb, var\(--sys-color-destructive-soft-foreground\) 20%, transparent\);/g

describe('overlay-destructive-20', () => {
  it('is the destructive text colour at 20%, defined in the Light and the Dark scope', () => {
    expect(tokens.match(definition)).toHaveLength(2)
  })
  it('is available as a Tailwind colour utility', () => {
    expect(globals).toContain('--color-overlay-destructive-20: var(--sys-color-overlay-destructive-20);')
  })
})
