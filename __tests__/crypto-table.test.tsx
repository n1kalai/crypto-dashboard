import { render, screen, fireEvent } from '@testing-library/react';

import CryptoTable from '@/components/crypto-table';
import { useCryptoData } from '@/hooks/use-crypto-data';

import userEvent from '@testing-library/user-event';
import { CryptoTableRow } from '@/components/crypto-table/components/crypt-table-row';

jest.mock('@/hooks/use-crypto-data');
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useRouter: jest.fn(() => ({ push: jest.fn() })), 
}));

describe('CryptoTable Component', () => {

  it('renders price change indicators correctly', () => {
    (useCryptoData as jest.Mock).mockReturnValue(new URLSearchParams());

    render(
      <CryptoTableRow
      crypto={{ id: 'btc', name: 'Bitcoin', symbol: 'BTC', rank: '1', priceUsd: '50000', marketCapUsd: '1T', className: '', changePercent24Hr: '', volumeUsd24Hr: '' }}
      price='50000'
        priceIncreased={true}
      />
    );

    expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-up-icon')).toBeInTheDocument();
  });


  it('filters cryptocurrencies by search input', () => {
    (useCryptoData as jest.Mock).mockReturnValue({
      data: {
        btc: { id: 'btc', name: 'Bitcoin', symbol: 'BTC', rank: '1', priceUsd: '50000', marketCapUsd: '1T' },
        eth: { id: 'eth', name: 'Ethereum', symbol: 'ETH', rank: '2', priceUsd: '3000', marketCapUsd: '500B' },
      },
      isFetching: false,
      error: null,
      dataUpdatedAt: null,
      refetchCryptoData: jest.fn(),
    });

    render(<CryptoTable />);
    const input = screen.getByTestId(/search/i);
    fireEvent.change(input, { target: { value: 'coin' } });
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  it('renders error state', () => {
    (useCryptoData as jest.Mock).mockReturnValue({
      data: {},
      error: {message: 'error'},
      isFetching: false,
      dataUpdatedAt: null,
      refetchCryptoData: jest.fn(),
    });

    render(<CryptoTable />);
    expect(screen.getByTestId(/crypto-table-error/i)).toBeInTheDocument();
  });
  
  it('renders refresh btn', () => {
    (useCryptoData as jest.Mock).mockReturnValue({
      data: {   btc: { id: 'btc', name: 'Bitcoin', symbol: 'BTC', rank: '1', priceUsd: '50000', marketCapUsd: '1T' },},
      isFetching: true,
      error: null,
      dataUpdatedAt: null,
      refetchCryptoData: jest.fn(),
    });

    render(<CryptoTable />);
    expect(screen.getByText(/Refresh/i)).toBeInTheDocument();
  });
 
  it('refresh btn styles should change when it was clicked', () => {
    const user = userEvent.setup();

    (useCryptoData as jest.Mock).mockReturnValue({
      data: {   btc: { id: 'btc', name: 'Bitcoin', symbol: 'BTC', rank: '1', priceUsd: '50000', marketCapUsd: '1T' },},
      isFetching: true,
      error: null,
      dataUpdatedAt: null,
      refetchCryptoData: jest.fn(),
    });

    render(<CryptoTable />);
    const refreshBtn = screen.getByText(/Refresh/i);
    user.click(refreshBtn);

    const refreshIcon = screen.getByTestId('refresh-icon');
    expect(refreshIcon).toHaveClass("animate-spin");


  });


  it('renders the table with cryptocurrency data', () => {
    (useCryptoData as jest.Mock).mockReturnValue({
      data: {
        btc: { id: 'btc', name: 'Bitcoin', symbol: 'BTC', rank: '1', priceUsd: '50000', marketCapUsd: '1T' },
      },
      isFetching: false,
      error: null,
      dataUpdatedAt: null,
      refetchCryptoData: jest.fn(),
    });

    render(<CryptoTable />);
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });


describe('CryptoTableRow Component', () => {
  it('renders cryptocurrency row with correct values', () => {
    (useCryptoData as jest.Mock).mockReturnValue(new URLSearchParams());

    render(
      <CryptoTableRow
        crypto={{ id: 'btc', name: 'Bitcoin', symbol: 'BTC', rank: '1', priceUsd: '50000', marketCapUsd: '1T', className: '', changePercent24Hr: '', volumeUsd24Hr: '' }}
        price='50000'
        priceIncreased={true}
      />
    );

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText("$50,000.00")).toBeInTheDocument();
  });
})


});