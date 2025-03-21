import { render, screen, fireEvent, within } from '@testing-library/react';

import { useQueryClient } from '@tanstack/react-query';
import CurrencyConverter from '@/components/currency-converter';
import userEvent from '@testing-library/user-event';

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));


describe('CurrencyConverter Component', () => {
  let mockQueryClient;

  beforeEach(() => {
    mockQueryClient = {
      getQueryData: jest.fn(() => ({
        btc: { id: 'btc', symbol: 'BTC', name: 'Bitcoin', priceUsd: '50000' },
        eth: { id: 'eth', symbol: 'ETH', name: 'Ethereum', priceUsd: '3000' },
      })),
    };
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
  });

  it('renders correctly', () => {
    render(<CurrencyConverter />);
    expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<CurrencyConverter />);
    const input = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(input, { target: { value: '10' } });
    expect(input).toHaveValue(10);
  });

  it('shows error when amount is negative', () => {
    render(<CurrencyConverter />);
    const input = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(input, { target: { value: '-10' } });
    fireEvent.click(screen.getByText('Convert'));
    expect(screen.getByTestId('currency-error')).toBeInTheDocument();
  });

  it('swaps currencies correctly', () => {
    const user = userEvent.setup();

    render(<CurrencyConverter />);
    fireEvent.mouseDown(screen.getByText('Select currency'));
    user.click(screen.getByText('Bitcoin (BTC)'));

    fireEvent.mouseDown(screen.getAllByText('Select currency')[1]);
    user.click(screen.getByText('Ethereum (ETH)'));

    user.click(screen.getByRole('button', { name: /swap/i }));
    expect(screen.getByDisplayValue('eth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('btc')).toBeInTheDocument();
  });
});
