import 'core-js/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';
import App from './App';
import './index.css';

ReactDOM.render((
    <React.StrictMode>
    <App />
    </React.StrictMode>
  ),
  document.getElementById('root'),
);
