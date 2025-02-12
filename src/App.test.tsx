import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders competition buttons', () => {
  render(<App />);
  const joinButton = screen.getByText(/Tham gia/i);
  const rulesButton = screen.getByText(/Thể lệ/i);
  expect(joinButton).toBeInTheDocument();
  expect(rulesButton).toBeInTheDocument();
});
