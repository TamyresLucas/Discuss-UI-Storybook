import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Checkbox } from './Checkbox';
import { Input } from './Input';
import { RadioGroup, RadioGroupItem } from './RadioGroup';
import { SearchBar } from './SearchBar';
import { Select, SelectTrigger, SelectValue } from './Select';
import { Textarea } from './Textarea';

// `input` (Figma foreground-input) is only the border of checkbox and radio controls; every other input field uses `input-muted`.
describe('input border tokens', () => {
  it('checkbox and radio use the input token', () => {
    render(
      <>
        <Checkbox aria-label="Agree" />
        <RadioGroup>
          <RadioGroupItem value="a" aria-label="A" />
        </RadioGroup>
      </>,
    );
    expect(screen.getByRole('checkbox', { name: 'Agree' })).toHaveClass('border-input');
    expect(screen.getByRole('radio', { name: 'A' })).toHaveClass('border-input');
  });

  it('input, textarea, select and search use the input-muted token', () => {
    const { container } = render(
      <>
        <Input aria-label="Email" />
        <Textarea aria-label="Notes" />
        <Select>
          <SelectTrigger aria-label="Language">
            <SelectValue />
          </SelectTrigger>
        </Select>
        <SearchBar aria-label="Find" />
      </>,
    );
    for (const el of [screen.getByLabelText('Email'), screen.getByLabelText('Notes'), screen.getByRole('combobox', { name: 'Language' })]) {
      const surface = el.closest('[class*="border-input"]') ?? el;
      expect(surface.className).toContain('border-input-muted');
      expect(surface.className).not.toMatch(/border-input(?![-\w])/);
    }
    expect(container.innerHTML).toContain('border-input-muted');
  });
});
