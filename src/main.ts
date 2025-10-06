import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('app');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(React.createElement(App));
} else {
  throw new Error("Root element with id 'app' not found.");
}
