import { Buffer } from 'buffer';
window.Buffer = Buffer;
import React from 'react';
import ReactDOM from 'react-dom/client';
import AuctionRoom from './components/AuctionRoom';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div style={{ padding: '20px', color: 'white', background: '#900' }}>
    <h1>Something went wrong:</h1>
    <pre>{error.message}</pre>
    <pre>{error.stack}</pre>
  </div>
);

window.onerror = (message, source, lineno, colno, error) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: white; background: #900;">
      <h1>Global Error:</h1>
      <pre>${message}</pre>
    </div>`;
  }
};

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AuctionRoom />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Render error:", error);
}
