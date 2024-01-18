

// 修正
import React from './core/react.js';
import { App } from './app.jsx';
import { ReactDom } from './core/reactDom.js';

ReactDom.createRoot(document.querySelector('#root')).render(<App></App>);