'use client'
import { useState, useEffect } from 'react';

export default function FacebookSettings() {
  const [settings, setSettings] = useState({
    pixel_id: '',
    access_token: '',
    test_event_code: '',
    is_active: false,
    is_test_mode: true,
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);


  const fetchSettings = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/facebook-settings",
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      const data = await response.json();
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token'); // ✅ inside function
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/facebook-settings", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    const token = localStorage.getItem('token'); 
    setTesting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/facebook-settings/test", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pixel_id: settings.pixel_id,
          access_token: settings.access_token,
          test_event_code: settings.test_event_code,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({
          type: 'success',
          text: 'Connection successful! Check Facebook Events Manager → Test Events tab.',
        });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Test failed: ' + error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="col-lg-8 mx-auto">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="mb-4">
              <h3 className="fw-bold mb-2">Facebook Conversions API Settings</h3>
              <p className="text-muted mb-0">
                Configure your Facebook Pixel and Conversions API credentials
              </p>
            </div>

            {/* Message Alert */}
            {message.text && (
              <div
                className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'
                  } d-flex align-items-center`}
                role="alert"
              >
                <span className="me-2">
                  {message.type === 'success' ? '✅' : '❌'}
                </span>
                {message.text}
              </div>
            )}

            {/* Instructions */}
            <div className="alert alert-primary">
              <h6 className="fw-semibold mb-2">📋 How to get credentials:</h6>
              <ol className="mb-0 ps-3 small">
                <li>
                  Go to{' '}
                  <a
                    href="https://business.facebook.com/events_manager"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-primary"
                  >
                    Facebook Events Manager
                  </a>
                </li>
                <li>Select your Pixel → Settings tab</li>
                <li>Copy <strong>Pixel ID</strong> from the top</li>
                <li>Generate <strong>Access Token</strong> in Conversions API section</li>
                <li>Get <strong>Test Event Code</strong> from Test Events tab (for testing)</li>
              </ol>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Pixel ID */}
              <div className="mb-3">
                <label className="form-label">Pixel ID *</label>
                <input
                  type="text"
                  name="pixel_id"
                  value={settings.pixel_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                  placeholder="e.g., 123456789012345"
                />
              </div>

              {/* Access Token */}
              <div className="mb-3">
                <label className="form-label">Access Token *</label>
                <textarea
                  name="access_token"
                  value={settings.access_token}
                  onChange={handleChange}
                  className="form-control font-monospace"
                  rows="3"
                  required
                  placeholder="EAAxxxxxxxxxxxxxxx..."
                ></textarea>
              </div>

              {/* Test Event Code */}
              <div className="mb-3">
                <label className="form-label">Test Event Code (Optional)</label>
                <input
                  type="text"
                  name="test_event_code"
                  value={settings.test_event_code}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="TEST12345"
                />
                <div className="form-text">
                  Use this for testing. Leave empty for production.
                </div>
              </div>

              {/* Checkboxes */}
              <div className="border-top pt-3 mt-4">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_active"
                    checked={settings.is_active}
                    onChange={handleChange}
                    id="activeCheck"
                  />
                  <label className="form-check-label" htmlFor="activeCheck">
                    <strong>Enable Facebook Tracking</strong>
                    <br />
                    <small className="text-muted">
                      Turn on to start sending events to Facebook.
                    </small>
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_test_mode"
                    checked={settings.is_test_mode}
                    onChange={handleChange}
                    id="testModeCheck"
                  />
                  <label className="form-check-label" htmlFor="testModeCheck">
                    <strong>Test Mode</strong>
                    <br />
                    <small className="text-muted">
                      Events will show in Test Events tab (recommended for testing)
                    </small>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={testConnection}
                  disabled={testing || !settings.pixel_id || !settings.access_token}
                  className="btn btn-secondary flex-fill"
                >
                  {testing ? 'Testing...' : '🔍 Test Connection'}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-fill"
                >
                  {loading ? 'Saving...' : '💾 Save Settings'}
                </button>
              </div>
            </form>

            {/* Status Card */}
            <div className="mt-4 p-3 border rounded bg-light">
              <h6 className="fw-semibold mb-2">Current Status</h6>
              <div className="row">
                <div className="col-6">
                  <small className="text-muted d-block">Tracking:</small>
                  <strong className={settings.is_active ? 'text-success' : 'text-danger'}>
                    {settings.is_active ? '✓ Active' : '✗ Inactive'}
                  </strong>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Mode:</small>
                  <strong>
                    {settings.is_test_mode ? '🧪 Test' : '🚀 Production'}
                  </strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
