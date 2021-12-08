import { render, screen } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import App from './App';

test('renders react logo', () => {
  render(<BrowserRouter> <App /> </BrowserRouter>);
  const reactLogo = screen.getByAltText(/logo/i);
  expect(reactLogo).toBeInTheDocument();
});
