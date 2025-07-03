import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BusinessProfileSetup = () => {
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: '',
    businessDescription: '',
    businessLogo: '',
    businessWebsite: '',
    businessLocation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put(
        `/api/users/${currentUser._id}/business-profile`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: '48px auto',
      background: 'var(--search-bg)',
      borderRadius: 16,
      padding: 32,
      boxShadow: '0 2px 16px rgba(0,0,0,0.12)'
    }}>
      <h2 style={{ color: 'var(--accent)', marginBottom: 24 }}>Set Up Your Business Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input
          name="businessName"
          placeholder="Business Name"
          value={form.businessName}
          onChange={handleChange}
          required
          style={{ padding: 12, fontSize: 16 }}
        />
        <textarea
          name="businessDescription"
          placeholder="Business Description"
          value={form.businessDescription}
          onChange={handleChange}
          required
          rows={3}
          style={{ padding: 12, fontSize: 16, resize: 'vertical' }}
        />
        <input
          name="businessLogo"
          placeholder="Logo URL (optional)"
          value={form.businessLogo}
          onChange={handleChange}
          style={{ padding: 12, fontSize: 16 }}
        />
        <input
          name="businessWebsite"
          placeholder="Website (optional)"
          value={form.businessWebsite}
          onChange={handleChange}
          style={{ padding: 12, fontSize: 16 }}
        />
        <input
          name="businessLocation"
          placeholder="Location (optional)"
          value={form.businessLocation}
          onChange={handleChange}
          style={{ padding: 12, fontSize: 16 }}
        />
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 'bold',
            padding: '12px 0',
            fontSize: 18,
            border: 'none',
            borderRadius: 8,
            marginTop: 12,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </form>
    </div>
  );
};

export default BusinessProfileSetup; 