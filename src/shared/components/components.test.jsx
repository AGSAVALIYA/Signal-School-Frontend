import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../i18n';
import ContactButtons, { waNumber } from './ContactButtons';
import ErrorBoundary from '../../app/ErrorBoundary';

describe('ContactButtons', () => {
  it('adds the Indian country code to 10-digit numbers only', () => {
    expect(waNumber('98765 43210')).toBe('919876543210');
    expect(waNumber('+91 98765-43210')).toBe('919876543210');
    expect(waNumber('')).toBe('');
  });

  it('writes the WhatsApp message in the guardian language', () => {
    render(<ContactButtons phone="9876543210" language="mr" message="contact.absentMessage" params={{ name: 'Asha', school: 'Signal', date: '1 Oct' }} />);
    const wa = screen.getByRole('link', { name: /WhatsApp/ });
    expect(decodeURIComponent(wa.getAttribute('href'))).toContain('नमस्कार');
    expect(screen.getByRole('link', { name: /Call/ })).toHaveAttribute('href', 'tel:9876543210');
  });

  it('renders nothing without a phone number', () => {
    const { container } = render(<ContactButtons phone={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('ErrorBoundary', () => {
  it('shows a friendly message instead of a blank screen', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/Something went wrong/);
    expect(screen.getByRole('button', { name: /Reload/ })).toBeInTheDocument();
  });
});
