import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SimpleLandingPage = () => {
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

      {/* Hero Section - Simple Side-by-Side Container */}
      <main style={{
        paddingTop: '80px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#f8fafc'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left: Content Container */}
          <div>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              color: '#1f2937'
            }}>
              Organize your life's memories effortlessly
            </h1>
            
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              lineHeight: '1.6',
              color: '#6b7280'
            }}>
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
                      background: 'white',
                      color: '#2563eb',
                      border: '2px solid #2563eb',
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
          
          {/* Right: Image Container */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img 
              src="/lovable-uploads/e09ce0e3-e96e-4c20-b3e3-21f8918c993c.png"
              alt="FileInASnap Interface"
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', background: '#ffffff' }}>
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>AI Review</h3>
              <p style={{ color: '#6b7280' }}>Smart analysis and automatic tagging</p>
            </div>
            
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb' 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Memory Timeline</h3>
              <p style={{ color: '#6b7280' }}>Visual timeline of your memories</p>
            </div>
            
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb' 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☁️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Cloud Storage</h3>
              <p style={{ color: '#6b7280' }}>Secure cloud storage and sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '2rem', 
        background: '#1f2937', 
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

export default SimpleLandingPage;
