import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/pages/dashboard';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// Mock NextAuth session
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock Axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dashboard Page', () => {
  const mockSession = {
    user: { name: 'John Doe' },
    status: 'authenticated',
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });
  });

  it('shows loading state initially', async () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    
    render(<Dashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays error message when recommendations fail to load', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load recommendations')).toBeInTheDocument();
    });
  });

  it('displays recommendations when loaded successfully', async () => {
    const mockData = [{
      id: '1',
      name: 'Jane Smith',
      position: 'Senior Developer',
      skills: ['React', 'Node.js'],
    }];
    
    mockedAxios.get.mockResolvedValue({ data: mockData });
    
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });
  });

  it('displays personalized greeting with user name', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Welcome back, John/)).toBeInTheDocument();
  });
});