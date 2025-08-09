import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LandingPage = () => {
  const { user, isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Simple Header */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        background: 'white', 
        padding: '1rem', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          📁 FileInASnap
        </div>
        
        <div>
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>Welcome, {user?.name || user?.email || 'User'}</span>
              <button 
                onClick={() => logout({ returnTo: window.location.origin })}
                style={{ padding: '0.5rem 1rem', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => loginWithRedirect()}
              style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        minHeight: '100vh',
        backgroundImage: 'url(/lovable-uploads/e09ce0e3-e96e-4c20-b3e3-21f8918c993c.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          minHeight: 'calc(100vh - 80px)',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', color: 'white' }}>
            <div style={{ maxWidth: '600px' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                Organize your life's memories effortlessly
              </h1>
              
              <p style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                FileInASnap automatically organizes, securely stores, and easily shares all your photos, videos, and documents.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {!isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => loginWithRedirect()}
                      style={{
                        padding: '1rem 2rem',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Get Started
                    </button>
                    
                    <button 
                      onClick={() => alert('Demo coming soon!')}
                      style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Watch Demo
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => window.location.href = '/dashboard'}
                    style={{
                      padding: '1rem 2rem',
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Features</h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '3rem' }}>
            Powerful tools to organize and manage your digital life
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>AI Review</h3>
              <p style={{ color: '#6b7280' }}>Smart analysis and automatic tagging</p>
            </div>
            
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Memory Timeline</h3>
              <p style={{ color: '#6b7280' }}>Visual timeline of your memories</p>
            </div>
            
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☁️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Cloud Storage</h3>
              <p style={{ color: '#6b7280' }}>Secure cloud storage and sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
            About FileInASnap
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.7' }}>
            FileInASnap was created to solve the problem of scattered digital memories. 
            We use AI to automatically organize your photos, videos, and documents, 
            making them easily searchable and accessible whenever you need them.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '2rem', 
        background: '#111827', 
        color: 'white', 
        textAlign: 'center' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📁</span>
          <span style={{ fontWeight: 'bold' }}>FileInASnap</span>
        </div>
        <p style={{ color: '#9ca3af' }}>&copy; 2025 FileInASnap. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
