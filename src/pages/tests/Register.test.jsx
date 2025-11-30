import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Register from '../Register';
import * as api from '../../services/api';

vi.mock('../../services/api');

function renderWithRouter(ui) {
  const router = createMemoryRouter(
    [
      { path: "/", element: ui }
    ],
    { initialEntries: ["/"] }
  );

  return render(<RouterProvider router={router} />);
}

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form', () => {
    renderWithRouter(<Register />);
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  it('submits form', async () => {
    const mockRegister = vi.fn().mockResolvedValue({ userId: 1 });
    vi.mocked(api.registerUser).mockImplementation(mockRegister);

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Test123!' } });

    fireEvent.click(screen.getByRole('button'));

    expect(mockRegister).toHaveBeenCalled();
  });
});