import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  Download, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle,
  CheckCircle,
  Circle,
  ExternalLink,
  Plus
} from 'lucide-react';

function SessionDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedThemes, setExpandedThemes] = useState(new Set(['1', '2']));

  // Mock data for prototype
  const sessionData = {
    id: id,
    title: 'E-commerce App Redesign',
    client: 'TechCorp',
    date: '2024-01-15',
    meetingType: 'Initial Review',
    status: 'processed',
    images: [
      {
        id: 1,
        url: 'https://via.placeholder.com/800x600/2563EB/white?text=Homepage+Design',
        name: 'Homepage Design',
        feedbackCount: 8
      },
      {
        id: 2,
        url: 'https://via.placeholder.com/800x600/10B981/white?text=Product+Page',
        name: 'Product Page',
        feedbackCount: 5
      },
      {
        id: 3,
        url: 'https://via.placeholder.com/800x600/F59E0B/white?text=Checkout+Flow',
        name: 'Checkout Flow',
        feedbackCount: 12
      }
    ],
    themes: [
      {
        id: '1',
        title: 'Navigation & Information Architecture',
        sentiment: 'mixed',
        count: 7,
        priority: 'high',
        feedback: [
          {
            id: 1,
            text: 'The main navigation feels cluttered. Consider reducing the number of top-level items.',
            sentiment: 'negative',
            source: 'voice',
            linkedImage: 1
          },
          {
            id: 2,
            text: 'Users might get confused by the breadcrumb placement. It should be more prominent.',
            sentiment: 'negative',
            source: 'text',
            linkedImage: 1
          },
          {
            id: 3,
            text: 'The search functionality is well-positioned and easily discoverable.',
            sentiment: 'positive',
            source: 'voice',
            linkedImage: 1
          }
        ]
      },
      {
        id: '2',
        title: 'Visual Design & Branding',
        sentiment: 'positive',
        count: 5,
        priority: 'medium',
        feedback: [
          {
            id: 4,
            text: 'The color palette aligns well with our brand guidelines. Great work!',
            sentiment: 'positive',
            source: 'text',
            linkedImage: 2
          },
          {
            id: 5,
            text: 'Typography hierarchy is clear and helps with readability.',
            sentiment: 'positive',
            source: 'voice',
            linkedImage: 2
          }
        ]
      },
      {
        id: '3',
        title: 'User Experience & Flow',
        sentiment: 'mixed',
        count: 10,
        priority: 'high',
        feedback: [
          {
            id: 6,
            text: 'The checkout process has too many steps. Consider consolidating.',
            sentiment: 'negative',
            source: 'text',
            linkedImage: 3
          },
          {
            id: 7,
            text: 'Progress indicators in the checkout are helpful for users.',
            sentiment: 'positive',
            source: 'voice',
            linkedImage: 3
          }
        ]
      }
    ],
    actionItems: [
      {
        id: 1,
        title: 'Simplify main navigation structure',
        priority: 'high',
        effort: 'medium',
        status: 'pending',
        linkedTheme: '1',
        dueDate: '2024-01-22'
      },
      {
        id: 2,
        title: 'Redesign breadcrumb component',
        priority: 'medium',
        effort: 'low',
        status: 'pending',
        linkedTheme: '1',
        dueDate: '2024-01-25'
      },
      {
        id: 3,
        title: 'Optimize checkout flow to 3 steps max',
        priority: 'high',
        effort: 'high',
        status: 'in_progress',
        linkedTheme: '3',
        dueDate: '2024-01-30'
      },
      {
        id: 4,
        title: 'Add loading states for better UX',
        priority: 'low',
        effort: 'low',
        status: 'completed',
        linkedTheme: '3',
        dueDate: '2024-01-20'
      }
    ]
  };

  const toggleTheme = (themeId) => {
    const newExpanded = new Set(expandedThemes);
    if (newExpanded.has(themeId)) {
      newExpanded.delete(themeId);
    } else {
      newExpanded.add(themeId);
    }
    setExpandedThemes(newExpanded);
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp size={14} color="var(--success)" />;
      case 'negative':
        return <ThumbsDown size={14} color="var(--error)" />;
      default:
        return <AlertCircle size={14} color="var(--warning)" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--error)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--gray-400)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} color="var(--success)" />;
      case 'in_progress':
        return <Circle size={16} color="var(--warning)" />;
      default:
        return <Circle size={16} color="var(--gray-400)" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'var(--white)',
        padding: 'var(--space-4)',
        borderRadius: '12px',
        marginBottom: 'var(--space-4)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-2)',
        }}>
          <div>
            <h1 style={{ marginBottom: 'var(--space-1)' }}>{sessionData.title}</h1>
            <div style={{
              display: 'flex',
              gap: 'var(--space-4)',
              fontSize: '0.875rem',
              color: 'var(--gray-600)',
            }}>
              <span>{sessionData.client}</span>
              <span>{sessionData.date}</span>
              <span>{sessionData.meetingType}</span>
              <span style={{
                color: 'var(--success)',
                fontWeight: '500',
              }}>
                {sessionData.status}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn-secondary">
              <Share2 size={16} />
              Share
            </button>
            <button className="btn-secondary">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.5fr 1fr',
        gap: 'var(--space-4)',
        height: 'calc(100vh - 280px)',
      }}>
        
        {/* Left Column - Visual Context */}
        <div style={{
          background: 'var(--white)',
          borderRadius: '12px',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-3)',
          }}>
            <h3>Design Screenshots</h3>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <button 
                className="btn-secondary"
                onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                disabled={currentImageIndex === 0}
                style={{ padding: 'var(--space-1)' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setCurrentImageIndex(Math.min(sessionData.images.length - 1, currentImageIndex + 1))}
                disabled={currentImageIndex === sessionData.images.length - 1}
                style={{ padding: 'var(--space-1)' }}
              >
                <ChevronRight size={16} />
              </button>
              <button className="btn-secondary" style={{ padding: 'var(--space-1)' }}>
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          {/* Main Image */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--gray-200)',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: 'var(--space-3)',
          }}>
            <img
              src={sessionData.images[currentImageIndex].url}
              alt={sessionData.images[currentImageIndex].name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Image Thumbnails */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            overflowX: 'auto',
          }}>
            {sessionData.images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  minWidth: '80px',
                  height: '60px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: `2px solid ${index === currentImageIndex ? 'var(--primary)' : 'var(--gray-200)'}`,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  background: 'var(--gray-900)',
                  color: 'var(--white)',
                  fontSize: '0.625rem',
                  padding: '1px 4px',
                  borderRadius: '2px',
                }}>
                  {image.feedbackCount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column - Organized Feedback */}
        <div style={{
          background: 'var(--white)',
          borderRadius: '12px',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>Feedback Themes</h3>
          
          <div style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}>
            {sessionData.themes.map((theme) => (
              <div
                key={theme.id}
                style={{
                  border: '1px solid var(--gray-200)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  onClick={() => toggleTheme(theme.id)}
                  style={{
                    padding: 'var(--space-3)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: expandedThemes.has(theme.id) ? 'var(--gray-50)' : 'var(--white)',
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      marginBottom: 'var(--space-1)',
                    }}>
                      <h4 style={{ fontSize: '0.875rem' }}>{theme.title}</h4>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: getPriorityColor(theme.priority),
                      }} />
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      fontSize: '0.75rem',
                      color: 'var(--gray-500)',
                    }}>
                      {getSentimentIcon(theme.sentiment)}
                      <span>{theme.count} items</span>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    style={{
                      transform: expandedThemes.has(theme.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </div>

                {expandedThemes.has(theme.id) && (
                  <div style={{
                    borderTop: '1px solid var(--gray-200)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--gray-50)',
                  }}>
                    {theme.feedback.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: 'var(--space-2)',
                          marginBottom: 'var(--space-2)',
                          backgroundColor: 'var(--white)',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'var(--space-2)',
                          marginBottom: 'var(--space-1)',
                        }}>
                          {getSentimentIcon(item.sentiment)}
                          <p style={{ flex: 1, lineHeight: '1.4' }}>{item.text}</p>
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: 'var(--space-2)',
                          fontSize: '0.75rem',
                          color: 'var(--gray-500)',
                        }}>
                          <span>{item.source}</span>
                          <span>• Image {item.linkedImage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Action Items */}
        <div style={{
          background: 'var(--white)',
          borderRadius: '12px',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-3)',
          }}>
            <h3>Action Items</h3>
            <button className="btn-secondary" style={{ padding: 'var(--space-1)' }}>
              <Plus size={16} />
            </button>
          </div>

          <div style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}>
            {sessionData.actionItems.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: 'var(--space-3)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-2)',
                }}>
                  {getStatusIcon(item.status)}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontWeight: '500',
                      marginBottom: 'var(--space-1)',
                      textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                      opacity: item.status === 'completed' ? 0.7 : 1,
                    }}>
                      {item.title}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: 'var(--space-2)',
                      fontSize: '0.75rem',
                      color: 'var(--gray-500)',
                      marginBottom: 'var(--space-2)',
                    }}>
                      <span style={{ color: getPriorityColor(item.priority) }}>
                        {item.priority}
                      </span>
                      <span>• {item.effort} effort</span>
                      <span>• {item.dueDate}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-1)',
                  fontSize: '0.75rem',
                }}>
                  <button className="btn-secondary" style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  }}>
                    <ExternalLink size={12} />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Export Actions */}
          <div style={{
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--gray-200)',
          }}>
            <button className="btn-primary" style={{
              width: '100%',
              justifyContent: 'center',
              fontSize: '0.875rem',
            }}>
              Export All Actions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionDetail;