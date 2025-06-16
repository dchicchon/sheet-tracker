import { render } from 'preact';
import './index.css';
import { App } from './app.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

render(
  <QueryClientProvider client={client}>
    <App />
  </QueryClientProvider>,
  document.getElementById('app')!
);
