import { useState } from 'react';
import { Upload, X, Mic, MicOff, FileText, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function NewSession() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    project: '',
    client: '',
    meetingType: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    files: [],
  });
  const [isRecording, setIsRecording] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...imageFiles]
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    // Simulate processing
    console.log('Session data:', formData);
    alert('Session created! Redirecting to session detail...');
  };

  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 'var(--space-6)',
      gap: 'var(--space-2)',
    }}>
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: step >= stepNum ? 'var(--primary)' : 'var(--gray-300)',
            color: step >= stepNum ? 'var(--white)' : 'var(--gray-500)',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}>
            {stepNum}
          </div>
          {stepNum < 3 && (
            <div style={{
              width: '40px',
              height: '2px',
              backgroundColor: step > stepNum ? 'var(--primary)' : 'var(--gray-300)',
              margin: '0 var(--space-2)',
            }} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Session Setup</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: '500' }}>
            Project / Client
          </label>
          <input
            type="text"
            placeholder="E.g., TechCorp Mobile App"
            value={formData.project}
            onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              border: '1px solid var(--gray-300)',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: '500' }}>
            Client Name
          </label>
          <input
            type="text"
            placeholder="Client organization"
            value={formData.client}
            onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              border: '1px solid var(--gray-300)',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: '500' }}>
            Meeting Type
          </label>
          <select
            value={formData.meetingType}
            onChange={(e) => setFormData(prev => ({ ...prev, meetingType: e.target.value }))}
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              border: '1px solid var(--gray-300)',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          >
            <option value="">Select meeting type</option>
            <option value="initial">Initial Review</option>
            <option value="iteration">Iteration</option>
            <option value="final">Final Approval</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: '500' }}>
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              border: '1px solid var(--gray-300)',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 'var(--space-6)',
      }}>
        <button
          className="btn-primary"
          onClick={() => setStep(2)}
          disabled={!formData.project || !formData.client}
        >
          Next: Upload Content
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Upload Content & Feedback</h2>
      
      {/* File Upload Area */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500' }}>
          Design Screenshots
        </label>
        
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--gray-300)'}`,
            borderRadius: '12px',
            padding: 'var(--space-6)',
            textAlign: 'center',
            backgroundColor: dragActive ? 'var(--gray-50)' : 'var(--white)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
        >
          <Upload size={48} color="var(--gray-400)" style={{ margin: '0 auto var(--space-2)' }} />
          <h3 style={{ marginBottom: 'var(--space-1)' }}>
            Drag & drop your design screenshots here
          </h3>
          <p style={{ marginBottom: 'var(--space-3)' }}>
            or click to browse files
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <button className="btn-secondary" type="button">
              Choose Files
            </button>
          </label>
        </div>

        {/* File Preview */}
        {formData.files.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-4)',
          }}>
            {formData.files.map((file, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid var(--gray-200)',
                  }}
                />
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'var(--error)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} />
                </button>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--gray-600)',
                  marginTop: 'var(--space-1)',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text Feedback */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500' }}>
          Feedback Notes
        </label>
        <textarea
          placeholder="Add any written feedback, observations, or notes from your meeting..."
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={8}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            border: '1px solid var(--gray-300)',
            borderRadius: '8px',
            fontSize: '1rem',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Voice Recording */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500' }}>
          Voice Recording
        </label>
        <div style={{
          border: '1px solid var(--gray-300)',
          borderRadius: '8px',
          padding: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}>
          <button
            className={isRecording ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setIsRecording(!isRecording)}
            style={{
              backgroundColor: isRecording ? 'var(--error)' : undefined,
            }}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          <span style={{ color: 'var(--gray-600)' }}>
            {isRecording ? 'Recording... 0:45' : 'Click to record voice feedback'}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 'var(--space-6)',
      }}>
        <button className="btn-secondary" onClick={() => setStep(1)}>
          Back
        </button>
        <button
          className="btn-primary"
          onClick={() => setStep(3)}
        >
          Next: Review
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Review & Submit</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Session Details</h3>
          <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--gray-50)', borderRadius: '8px' }}>
            <p><strong>Project:</strong> {formData.project}</p>
            <p><strong>Client:</strong> {formData.client}</p>
            <p><strong>Meeting Type:</strong> {formData.meetingType}</p>
            <p><strong>Date:</strong> {formData.date}</p>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Content Summary</h3>
          <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--gray-50)', borderRadius: '8px' }}>
            <p><strong>Images:</strong> {formData.files.length} files uploaded</p>
            <p><strong>Notes:</strong> {formData.notes.length} characters</p>
            <p><strong>Voice Recording:</strong> {isRecording ? 'In progress' : 'None'}</p>
          </div>
        </div>

        {formData.notes && (
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Feedback Preview</h3>
            <div style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--gray-50)',
              borderRadius: '8px',
              maxHeight: '200px',
              overflow: 'auto',
            }}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{formData.notes}</p>
            </div>
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--space-6)',
        padding: 'var(--space-4)',
        backgroundColor: 'var(--gray-50)',
        borderRadius: '8px',
      }}>
        <div>
          <p style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
            Ready to process your feedback?
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            AI will organize themes and generate action items
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn-secondary" onClick={() => setStep(2)}>
            Back
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            <FileText size={16} />
            Create Session
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
        <h1>New Feedback Session</h1>
        <p>Capture and organize your design feedback in 3 simple steps</p>
      </div>

      {renderStepIndicator()}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}

export default NewSession;