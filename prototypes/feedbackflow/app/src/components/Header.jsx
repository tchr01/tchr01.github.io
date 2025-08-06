import { Plus, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--gray-200)',
      padding: '0 var(--space-4)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--primary)',
          textDecoration: 'none',
        }}>
          FeedbackFlow
        </Link>

        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          <Link to="/new-session">
            <button className="btn-primary">
              <Plus size={16} />
              New Session
            </button>
          </Link>
          
          <button className="btn-secondary">
            <User size={16} />
          </button>

          <button className="btn-secondary">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;