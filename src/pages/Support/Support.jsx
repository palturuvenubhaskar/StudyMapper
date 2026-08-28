import { useState } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Mail, MessageSquare, Send, Loader2, CheckCircle } from 'lucide-react';
import { db } from '../../data/db';

export function Support() {
  useDocumentTitle('Support');
  const [form, setForm] = useState({ category: 'general', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const categories = [
    { id: 'general', label: 'General Inquiry' },
    { id: 'bug', label: 'Bug Report' },
    { id: 'feature', label: 'Feature Request' },
    { id: 'account', label: 'Account Issue' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await db.support_tickets.add({
      ...form,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setIsSent(true);
    setForm({ category: 'general', subject: '', message: '' });
  };

  return (
    <div className="support-page">
      <div className="support-container">
        <div className="support-header">
          <MessageSquare size={40} style={{ color: 'var(--accent)' }} />
          <h1>How can we help?</h1>
          <p>Our team typically responds within 24 hours.</p>
        </div>

        {isSent ? (
          <div className="support-success">
            <CheckCircle size={48} style={{ color: 'var(--success)' }} />
            <h2>Ticket Submitted</h2>
            <p>We have received your message and will get back to you soon.</p>
            <button onClick={() => setIsSent(false)} className="btn btn-primary">
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="support-form">
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={6}
                required
                minLength={20}
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%' }}>
              {isSubmitting ? (
                <><Loader2 size={16} className="spin" /> Sending...</>
              ) : (
                <><Send size={16} /> Submit Ticket</>
              )}
            </button>
          </form>
        )}

        <div className="support-links">
          <a href="/help" className="support-link">
            <MessageSquare size={16} />
            Browse Help Center
          </a>
          <a href="mailto:support@studymapper.app" className="support-link">
            <Mail size={16} />
            support@studymapper.app
          </a>
        </div>
      </div>
    </div>
  );
}
