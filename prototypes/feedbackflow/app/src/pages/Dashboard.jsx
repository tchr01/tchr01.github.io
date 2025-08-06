import { Clock, FileText, Mic, FolderOpen, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  // Mock data for prototype
  const recentSessions = [
    {
      id: 1,
      title: 'E-commerce App Redesign',
      client: 'TechCorp',
      date: '2 hours ago',
      status: 'processed',
      themes: 5,
      actions: 8,
      image: 'https://via.placeholder.com/120x80/2563EB/white?text=Design'
    },
    {
      id: 2,
      title: 'Mobile Banking UI',
      client: 'FinanceFlow',
      date: '1 day ago',
      status: 'processing',
      themes: 3,
      actions: 12,
      image: 'https://via.placeholder.com/120x80/10B981/white?text=Mobile'
    },
    {
      id: 3,
      title: 'Dashboard Analytics',
      client: 'DataViz Pro',
      date: '3 days ago',
      status: 'processed',
      themes: 7,
      actions: 15,
      image: 'https://via.placeholder.com/120x80/F59E0B/white?text=Analytics'
    },
  ];

  const stats = [
    { label: 'Sessions this month', value: '12', icon: FileText },
    { label: 'Pending actions', value: '35', icon: Clock },
    { label: 'Projects active', value: '8', icon: FolderOpen },
    { label: 'Avg. sentiment', value: '4.2', icon: TrendingUp },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1>Welcome back!</h1>
        <p style={{ marginTop: 'var(--space-1)' }}>
          Here's what's happening with your feedback sessions
        </p>
      </div>

      {/* Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}>
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}>
            <div style={{
              background: 'var(--gray-100)',
              borderRadius: '8px',
              padding: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <stat.icon size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--space-6)',
      }}>
        {/* Recent Sessions */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
          }}>
            <h2>Recent Sessions</h2>
            <Link to="/projects" style={{ fontSize: '0.875rem' }}>
              View all
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {recentSessions.map((session) => (
              <Link key={session.id} to={`/session/${session.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                }}>
                  <img
                    src={session.image}
                    alt={session.title}
                    style={{
                      width: '120px',
                      height: '80px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: 'var(--space-1)' }}>
                      {session.title}
                    </h3>
                    <p style={{ marginBottom: 'var(--space-2)' }}>
                      {session.client} • {session.date}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: 'var(--space-4)',
                      fontSize: '0.875rem',
                      color: 'var(--gray-500)',
                    }}>
                      <span>{session.themes} themes</span>
                      <span>{session.actions} actions</span>
                      <span style={{
                        color: session.status === 'processed' ? 'var(--success)' : 'var(--warning)',
                        fontWeight: '500',
                      }}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Link to="/new-session">
              <button className="btn-primary" style={{
                width: '100%',
                justifyContent: 'center',
                padding: 'var(--space-4)',
                fontSize: '1rem',
              }}>
                <FileText size={20} />
                Start New Session
              </button>
            </Link>

            <button className="btn-secondary" style={{
              width: '100%',
              justifyContent: 'center',
              padding: 'var(--space-4)',
              fontSize: '1rem',
            }}>
              <Mic size={20} />
              Record Voice Feedback
            </button>

            <Link to="/projects">
              <button className="btn-secondary" style={{
                width: '100%',
                justifyContent: 'center',
                padding: 'var(--space-4)',
                fontSize: '1rem',
              }}>
                <FolderOpen size={20} />
                Browse All Projects
              </button>
            </Link>
          </div>

          {/* Activity Feed */}
          <div style={{ marginTop: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Recent Activity</h3>
            <div className="card" style={{ padding: 'var(--space-3)' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                fontSize: '0.875rem',
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>AI identified 3 new themes</div>
                  <div style={{ color: 'var(--gray-500)' }}>in E-commerce App Redesign</div>
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>8 action items completed</div>
                  <div style={{ color: 'var(--gray-500)' }}>across 3 projects</div>
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>Client sentiment improved</div>
                  <div style={{ color: 'var(--gray-500)' }}>from 3.8 to 4.2 this week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;