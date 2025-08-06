import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewSession from './pages/NewSession';
import SessionDetail from './pages/SessionDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-session" element={<NewSession />} />
          <Route path="/session/:id" element={<SessionDetail />} />
          <Route path="/projects" element={<div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <h2>Projects Overview</h2>
            <p>This page is coming soon in the next iteration.</p>
          </div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
