import Header from './Header';

function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--space-4)',
        width: '100%',
      }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;