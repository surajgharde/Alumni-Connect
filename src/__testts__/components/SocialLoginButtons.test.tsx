import { render, screen, fireEvent } from '@testing-library/react';
import SocialLoginButtons from '@/components/Auth/SocialLoginButtons';
import { signIn } from 'next-auth/react';

// Mock the signIn function from NextAuth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('SocialLoginButtons Component Tests', () => {
  beforeEach(() => {
    render(<SocialLoginButtons />);
  });

  test('should display both Google and GitHub login buttons', () => {
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
  });

  test('should trigger Google sign-in on button click', () => {
    const googleButton = screen.getByText('Continue with Google');
    fireEvent.click(googleButton);
    expect(signIn).toHaveBeenCalledWith('google', { redirect: false });
  });

  test('should trigger GitHub sign-in on button click', () => {
    const githubButton = screen.getByText('Continue with GitHub');
    fireEvent.click(githubButton);
    expect(signIn).toHaveBeenCalledWith('github', { redirect: false });
  });
});