import ReactDOM from 'react-dom/client';
import App from './App';
import './utils/sentry';

const lang = localStorage.getItem('user-lang') ?? undefined;

ReactDOM.createRoot(document.getElementById('app-root')!).render(
  <App language={lang} />
);
