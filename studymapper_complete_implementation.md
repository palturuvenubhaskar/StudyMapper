# StudyMapper — Complete Legal, Auth, Settings & Utility Pages Implementation Guide

> **One-shot prompt for Antigravity / AI coding agents.**  
> Copy the entire contents of this file into your agent and execute section by section.

---

## Table of Contents

1. [Project Context & Constraints](#1-project-context--constraints)
2. [Database Schema](#2-database-schema-additions)
3. [File Structure](#3-complete-file-structure)
4. [Shared Infrastructure](#4-shared-infrastructure)
5. [Legal Pages](#5-legal-pages)
6. [Cookie Consent System](#6-cookie-consent-system)
7. [Authentication Flows](#7-authentication-flows)
8. [Account Settings & Support](#8-account-settings--support)
9. [Error & Utility Pages](#9-error--utility-pages)
10. [Loading & Empty States](#10-loading--empty-states)
11. [Offline Indicator](#11-offline-indicator)
12. [App Integration](#12-app-integration)
13. [Implementation Order](#13-implementation-order)
14. [Testing Requirements](#14-testing-requirements)

---

## 1. Project Context & Constraints

**StudyMapper** is an offline-first, AI-powered learning workspace for engineering students.

- **Stack:** React 19 + Vite 8, Vanilla CSS, Lucide React icons, Dexie.js (IndexedDB), Firebase Auth (Google, Email/Password, Phone OTP), React Router.
- **Constraints:**
  1. Offline-first. All data MUST persist in IndexedDB via Dexie.js. Firebase is ONLY for auth and optional cloud backup.
  2. No server-side code execution. Entirely client-side.
  3. AI Streaming: All AI responses use `callOpenRouterStream` with fallback model iteration.
  4. No external CSS frameworks. Use ONLY Vanilla CSS. Lucide React for icons.
  5. Preserve existing data. All schema upgrades must be backward-compatible (Dexie.js migration strategy).
  6. Accessible: ARIA labels, keyboard navigation, focus management.
  7. Mobile-first responsive design for all new UI components.

---

## 2. Database Schema Additions

Upgrade `StudyMapperDB` to **Version 10** in `src/data/db.js`:

```javascript
import Dexie from 'dexie';

export const db = new Dexie('StudyMapperDB');

db.version(10).stores({
  // === EXISTING TABLES (preserve all) ===
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index',
  student_profiles: 'id, branch, career_goal, created_at',
  roadmaps: 'id, profile_id, title, created_at',
  roadmap_skills: 'id, roadmap_id, title, status, order_index',
  placement_sessions: 'id, profile_id, type, score, created_at',
  placement_questions: 'id, session_id, question, user_answer, is_correct',
  coding_problems: 'id, profile_id, language, topic, difficulty, status, created_at',
  learning_tracks: 'id, profile_id, language, title, progress, created_at',
  learning_lessons: 'id, track_id, title, status, order_index',
  study_sessions: 'id, topic_id, duration_minutes, created_at',
  flashcard_decks: 'id, topic_id, title, created_at',
  flashcards: 'id, deck_id, front, back, interval, repetitions, easiness_factor, next_review_date, last_review_date',
  ai_sessions: 'id, title, created_at',
  ai_messages: 'id, session_id, role, content, created_at',

  // === NEW TABLES ===
  cookie_consent: 'id, necessary, analytics, marketing, functional, consent_date, updated_at',
  support_tickets: 'id, user_id, category, subject, message, status, created_at, updated_at',
  user_settings: 'id, user_id, theme, email_notifications, push_notifications, study_reminders, public_profile, language, created_at, updated_at',
  gamification_profiles: 'id, user_id, total_xp, current_level, streak_days, longest_streak, last_study_date',
  achievements: 'id, user_id, achievement_id, unlocked_at, viewed',
  daily_quests: 'id, user_id, date, quests_json, completed_count',
  xp_transactions: 'id, user_id, amount, source, source_id, created_at',
  user_analytics: 'id, user_id, topic_id, action_type, duration_seconds, accuracy_score, created_at',
  study_weaknesses: 'id, user_id, topic_id, weakness_score, last_detected_at, revision_count',
  question_variants: 'id, original_question_id, text, marks, created_at',
}).upgrade(tx => {
  return tx.table('user_settings').toCollection().count(count => {
    if (count === 0) {
      console.log('Migration v10: user_settings table ready');
    }
  });
});
```

---

## 3. Complete File Structure

```
src/
├── pages/
│   ├── Legal/
│   │   ├── LegalPageLayout.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── TermsAndConditions.jsx
│   │   ├── CookiePolicy.jsx
│   │   ├── Disclaimer.jsx
│   │   ├── SecurityPolicy.jsx
│   │   └── CommunityGuidelines.jsx
│   ├── Auth/
│   │   ├── AuthLayout.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── Settings/
│   │   ├── AccountSettings.jsx
│   │   ├── SettingsLayout.jsx
│   │   └── tabs/
│   │       ├── ProfileTab.jsx
│   │       ├── SecurityTab.jsx
│   │       ├── NotificationsTab.jsx
│   │       ├── DataPrivacyTab.jsx
│   │       └── AppearanceTab.jsx
│   ├── Support/
│   │   ├── Support.jsx
│   │   └── TicketHistory.jsx
│   ├── Help/
│   │   ├── HelpCenter.jsx
│   │   ├── HelpArticle.jsx
│   │   └── helpArticles.json
│   └── Errors/
│       ├── NotFound.jsx
│       ├── Forbidden.jsx
│       ├── InternalError.jsx
│       ├── Maintenance.jsx
│       └── Offline.jsx
├── components/
│   ├── CookieConsent/
│   │   ├── CookieConsentBanner.jsx
│   │   └── CookiePreferencesModal.jsx
│   ├── ErrorBoundary/
│   │   └── ErrorBoundary.jsx
│   ├── Modal/
│   │   ├── Modal.jsx
│   │   └── Modal.css
│   ├── Toast/
│   │   ├── ToastContainer.jsx
│   │   └── useToast.js
│   ├── ConfirmDialog/
│   │   └── ConfirmDialog.jsx
│   ├── Loading/
│   │   ├── GlobalLoading.jsx
│   │   ├── SkeletonLoader.jsx
│   │   ├── InlineLoading.jsx
│   │   └── AIStreamingLoader.jsx
│   ├── EmptyStates/
│   │   ├── NoSearchResults.jsx
│   │   ├── EmptyState.jsx
│   │   └── OfflineEmptyState.jsx
│   ├── OfflineIndicator/
│   │   └── OfflineIndicator.jsx
│   └── LegalLayout/
│       └── LegalLayout.jsx
├── hooks/
│   ├── useCookieConsent.js
│   ├── useNetworkStatus.js
│   ├── useDocumentTitle.js
│   └── useToast.js
├── data/
│   ├── db.js
│   └── helpArticles.json
└── styles/
    ├── legal.css
    ├── settings.css
    ├── errors.css
    ├── loading.css
    └── cookie-consent.css
```

---

## 4. Shared Infrastructure

### 4.1 useNetworkStatus Hook
**File:** `src/hooks/useNetworkStatus.js`

```javascript
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    wasOffline: false,
    since: Date.now(),
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({
        isOnline: true,
        wasOffline: !prev.isOnline,
        since: Date.now(),
      }));
    };

    const handleOffline = () => {
      setStatus(prev => ({
        isOnline: false,
        wasOffline: prev.wasOffline,
        since: Date.now(),
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}
```

### 4.2 useDocumentTitle Hook
**File:** `src/hooks/useDocumentTitle.js`

```javascript
import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | StudyMapper` : 'StudyMapper';
    return () => {
      document.title = prev;
    };
  }, [title]);
}
```

### 4.3 Modal Component
**File:** `src/components/Modal/Modal.jsx`

```jsx
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export function Modal({ isOpen, onClose, title, children, variant = 'default', size = 'md' }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e) => {
      if (e.target === overlayRef.current) onClose();
    };

    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);

    const focusable = contentRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`modal-content modal-${size} modal-${variant}`} ref={contentRef}>
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
```

**File:** `src/components/Modal/Modal.css`

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: scaleIn 0.2s ease;
}

.modal-sm { max-width: 400px; }
.modal-md { max-width: 560px; }
.modal-lg { max-width: 720px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.modal-body {
  padding: 24px;
}

.modal-danger .modal-header h2 {
  color: var(--danger);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
```

### 4.4 ConfirmDialog Component
**File:** `src/components/ConfirmDialog/ConfirmDialog.jsx`

```jsx
import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  requireText = null,
}) {
  const [inputValue, setInputValue] = useState('');
  const isConfirmDisabled = requireText ? inputValue !== requireText : false;

  const handleConfirm = () => {
    if (isConfirmDisabled) return;
    onConfirm();
    onClose();
    setInputValue('');
  };

  const handleClose = () => {
    setInputValue('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm" variant={variant}>
      <div className="confirm-dialog" style={{ textAlign: 'center' }}>
        {variant === 'danger' && (
          <AlertTriangle style={{ color: 'var(--danger)', marginBottom: '16px' }} size={40} />
        )}
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
          {description}
        </p>

        {requireText && (
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Type <strong style={{ color: 'var(--text-primary)' }}>{requireText}</strong> to confirm
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.9375rem',
              }}
              autoFocus
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={handleClose}>
            {cancelLabel}
          </button>
          <button
            className={`btn btn-${variant}`}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            style={{ opacity: isConfirmDisabled ? 0.5 : 1 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

---

## 5. Legal Pages

All legal pages must be:
- Static content (no AI generation needed for legal text)
- Responsive (readable on mobile)
- Print-friendly (`@media print` styles)
- SEO-friendly (`<title>`, `<meta name="description">`)
- Accessible (proper heading hierarchy, skip links)

### 5.1 Shared Legal Layout
**File:** `src/components/LegalLayout/LegalLayout.jsx`

```jsx
import { useEffect, useRef, useState } from 'react';
import { Printer, ArrowUp } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function LegalLayout({ title, children, lastUpdated }) {
  useDocumentTitle(title);
  const [activeSection, setActiveSection] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    const headings = contentRef.current?.querySelectorAll('h2[id]');
    if (!headings) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const handlePrint = () => window.print();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const extractHeadings = () => {
    const headings = contentRef.current?.querySelectorAll('h2[id]');
    if (!headings) return [];
    return Array.from(headings).map(h => ({
      id: h.id,
      text: h.textContent,
    }));
  };

  const [tocItems, setTocItems] = useState([]);

  useEffect(() => {
    if (contentRef.current) {
      setTocItems(extractHeadings());
    }
  }, [children]);

  return (
    <div className="legal-page">
      <aside className="legal-sidebar">
        <nav className="legal-toc">
          <h3>Contents</h3>
          <ul>
            {tocItems.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={activeSection === h.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="legal-content" ref={contentRef}>
        <div className="legal-meta">
          <span className="legal-badge">Legal</span>
          <span className="legal-date">Last Updated: {lastUpdated}</span>
          <button onClick={handlePrint} className="legal-print" aria-label="Print this page">
            <Printer size={16} />
          </button>
        </div>

        <h1>{title}</h1>
        {children}

        <button onClick={scrollToTop} className="legal-back-to-top">
          <ArrowUp size={16} />
          Back to top
        </button>
      </main>
    </div>
  );
}
```

### 5.2 Privacy Policy
**Route:** `/privacy-policy`  
**File:** `src/pages/Legal/PrivacyPolicy.jsx`

```jsx
import { LegalLayout } from '../../components/LegalLayout/LegalLayout';

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="August 28, 2026">
      <section id="introduction">
        <h2>Introduction</h2>
        <p>
          StudyMapper (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, store, and protect your personal information 
          when you use our offline-first learning workspace application.
        </p>
        <p>
          By using StudyMapper, you agree to the collection and use of information in accordance with this policy. 
          We prioritize your privacy by design — the majority of your data never leaves your device.
        </p>
      </section>

      <section id="data-collection">
        <h2>What Data We Collect</h2>
        <h3>Information You Provide</h3>
        <ul>
          <li><strong>Account Information:</strong> Email address, display name, and profile photo (via Firebase Authentication).</li>
          <li><strong>Study Content:</strong> Subjects, units, topics, notes, flashcards, and question banks you create.</li>
          <li><strong>Support Requests:</strong> Information you provide when contacting our support team.</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <ul>
          <li><strong>Usage Analytics:</strong> Feature usage, study session durations, and app performance metrics (only if you opt-in to analytics cookies).</li>
          <li><strong>Device Information:</strong> Browser type, operating system, and screen size for optimization purposes.</li>
          <li><strong>AI Interaction Logs:</strong> Prompts sent to OpenRouter API for generating notes, answers, and coding problems.</li>
        </ul>
      </section>

      <section id="data-usage">
        <h2>How We Use Your Data</h2>
        <ul>
          <li>To provide and maintain the StudyMapper service</li>
          <li>To personalize your learning experience using AI-generated content</li>
          <li>To improve our application features and user experience</li>
          <li>To communicate with you about updates, security alerts, and support</li>
          <li>To detect, prevent, and address technical issues and abuse</li>
        </ul>
      </section>

      <section id="storage">
        <h2>Data Storage & Security</h2>
        <p>
          <strong>Local-First Architecture:</strong> StudyMapper is built as an offline-first application. 
          Your study data — including subjects, notes, flashcards, and question banks — is stored locally 
          in your browser using IndexedDB. This data never leaves your device unless you explicitly enable 
          optional cloud backup features.
        </p>
        <p>
          <strong>Encryption:</strong> All data synced to cloud backup is encrypted using AES-256 encryption 
          before transmission. Your encryption key is derived from your account credentials and is never 
          stored on our servers.
        </p>
        <p>
          <strong>Firebase Security:</strong> Authentication data is handled by Firebase Auth, which employs 
          industry-standard security measures including OAuth 2.0, SSL/TLS encryption, and SOC 2 compliance.
        </p>
      </section>

      <section id="third-party">
        <h2>Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Firebase (Google):</strong> Authentication, optional cloud backup, and analytics (if enabled).</li>
          <li><strong>OpenRouter:</strong> AI model aggregation for generating study materials. Prompts are processed according to their privacy policy.</li>
          <li><strong>Google Auth:</strong> Optional social login provider.</li>
        </ul>
      </section>

      <section id="rights">
        <h2>Your Rights</h2>
        <p>You have the following rights regarding your personal data:</p>
        <ul>
          <li><strong>Access:</strong> Export all your data at any time from Account Settings.</li>
          <li><strong>Deletion:</strong> Permanently delete your account and all associated data.</li>
          <li><strong>Correction:</strong> Update your profile information at any time.</li>
          <li><strong>Portability:</strong> Download your data in JSON, PDF, or Anki formats.</li>
          <li><strong>Restriction:</strong> Disable analytics and marketing cookies via Cookie Preferences.</li>
        </ul>
      </section>

      <section id="children">
        <h2>Children&apos;s Privacy</h2>
        <p>
          StudyMapper is not intended for use by children under the age of 13 (or 16 in the European Union). 
          We do not knowingly collect personal information from children. If you believe we have inadvertently 
          collected such information, please contact us immediately for deletion.
        </p>
      </section>

      <section id="contact">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@studymapper.app</li>
          <li>Support: <a href="/support">Submit a ticket</a></li>
        </ul>
      </section>
    </LegalLayout>
  );
}
```

### 5.3 Terms & Conditions
**Route:** `/terms-and-conditions`  
**File:** `src/pages/Legal/TermsAndConditions.jsx`

```jsx
import { LegalLayout } from '../../components/LegalLayout/LegalLayout';

export function TermsAndConditions() {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="August 28, 2026">
      <section id="acceptance">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using StudyMapper, you agree to be bound by these Terms & Conditions. 
          If you disagree with any part of the terms, you may not access the service.
        </p>
      </section>

      <section id="description">
        <h2>Description of Service</h2>
        <p>
          StudyMapper is an offline-first, AI-powered learning workspace designed for engineering and college students. 
          The application transforms static syllabuses and notes into interactive, adaptive learning experiences 
          using client-side AI processing and local data storage.
        </p>
      </section>

      <section id="accounts">
        <h2>User Accounts & Responsibilities</h2>
        <ul>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must provide accurate and complete information during registration.</li>
          <li>You are responsible for all activities that occur under your account.</li>
          <li>You must notify us immediately of any unauthorized use of your account.</li>
        </ul>
      </section>

      <section id="acceptable-use">
        <h2>Acceptable Use</h2>
        <p>You agree NOT to:</p>
        <ul>
          <li>Reverse engineer, decompile, or disassemble any part of the application</li>
          <li>Share, sell, or redistribute your OpenRouter API key or AI credits</li>
          <li>Use the service for any illegal purpose or to violate any laws</li>
          <li>Upload malicious code, viruses, or harmful content</li>
          <li>Attempt to gain unauthorized access to any part of the service</li>
          <li>Use automated scripts or bots to access the service</li>
        </ul>
      </section>

      <section id="intellectual-property">
        <h2>Intellectual Property</h2>
        <p>
          <strong>Your Content:</strong> You retain all rights to the study materials, notes, and content you create. 
          StudyMapper claims no ownership over your educational content.
        </p>
        <p>
          <strong>AI-Generated Content:</strong> Content generated by AI models through StudyMapper is provided 
          for educational purposes. You may use this content for personal study purposes. We recommend verifying 
          AI-generated information against official academic sources.
        </p>
        <p>
          <strong>StudyMapper IP:</strong> All rights, title, and interest in and to the StudyMapper application, 
          including all software, designs, logos, and trademarks, are and will remain the exclusive property of 
          StudyMapper and its licensors.
        </p>
      </section>

      <section id="termination">
        <h2>Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason, 
          including breach of these Terms. Upon termination, your right to use the service will immediately cease. 
          Your locally stored data remains on your device.
        </p>
      </section>

      <section id="liability">
        <h2>Limitation of Liability</h2>
        <p>
          StudyMapper and its creators shall not be liable for any indirect, incidental, special, consequential, 
          or punitive damages resulting from your use of or inability to use the service. This includes but is not 
          limited to academic performance, exam results, or placement outcomes.
        </p>
        <p>
          AI-generated content is provided &quot;as is&quot; without warranties of accuracy, completeness, or reliability. 
          Always verify critical information with official academic sources.
        </p>
      </section>

      <section id="governing-law">
        <h2>Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
          in which StudyMapper operates, without regard to its conflict of law provisions.
        </p>
      </section>

      <section id="changes">
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will provide notice of significant changes 
          by updating the &quot;Last Updated&quot; date. Your continued use of the service after such changes constitutes 
          acceptance of the new terms.
        </p>
      </section>
    </LegalLayout>
  );
}
```

### 5.4 Cookie Policy
**Route:** `/cookie-policy`  
**File:** `src/pages/Legal/CookiePolicy.jsx`

```jsx
import { LegalLayout } from '../../components/LegalLayout/LegalLayout';

export function CookiePolicy() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="August 28, 2026">
      <section id="what-are-cookies">
        <h2>What Are Cookies</h2>
        <p>
          Cookies are small text files that are stored on your device when you visit a website. 
          They are widely used to make websites work more efficiently and provide information to the website owners.
        </p>
      </section>

      <section id="cookies-we-use">
        <h2>Cookies We Use</h2>

        <h3>Necessary Cookies</h3>
        <p>
          These cookies are essential for the website to function properly. They enable core functionality 
          such as security, network management, and account access. You cannot opt out of these cookies.
        </p>

        <h3>Functional Cookies</h3>
        <p>
          These cookies enable enhanced functionality and personalization, such as remembering your theme 
          preferences, language settings, and study planner configurations.
        </p>

        <h3>Analytics Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our application by collecting and 
          reporting information anonymously. This helps us improve our features and user experience.
        </p>

        <h3>Marketing Cookies</h3>
        <p>
          These cookies may be used to deliver relevant advertisements and track the effectiveness of 
          marketing campaigns. StudyMapper currently does not use marketing cookies, but this policy 
          covers future implementation.
        </p>
      </section>

      <section id="third-party-cookies">
        <h2>Third-Party Cookies</h2>
        <p>We use the following third-party services that may set cookies:</p>
        <ul>
          <li><strong>Firebase Analytics:</strong> If enabled, collects usage data to help us improve the app.</li>
          <li><strong>Google Authentication:</strong> Sets cookies when you sign in with Google.</li>
        </ul>
      </section>

      <section id="managing-cookies">
        <h2>How to Manage Cookies</h2>
        <p>
          You can manage your cookie preferences at any time by clicking the &quot;Cookie Preferences&quot; link 
          in the footer or by visiting your Account Settings. You can also control cookies through your browser settings:
        </p>
        <ul>
          <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
          <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
          <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
        </ul>
        <p>
          Please note that disabling certain cookies may affect the functionality of StudyMapper.
        </p>
      </section>

      <section id="changes">
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. We will notify you of any changes by updating 
          the &quot;Last Updated&quot; date at the top of this policy.
        </p>
      </section>
    </LegalLayout>
  );
}
```

### 5.5 Disclaimer
**Route:** `/disclaimer`  
**File:** `src/pages/Legal/Disclaimer.jsx`

```jsx
import { LegalLayout } from '../../components/LegalLayout/LegalLayout';

export function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer" lastUpdated="August 28, 2026">
      <section id="general">
        <h2>General Disclaimer</h2>
        <p>
          The information provided by StudyMapper is for general educational and informational purposes only. 
          All information on the application is provided in good faith, however we make no representation or 
          warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, 
          availability, or completeness of any information.
        </p>
      </section>

      <section id="ai-content">
        <h2>AI-Generated Content Accuracy</h2>
        <p>
          StudyMapper utilizes artificial intelligence (AI) models to generate study notes, answers, 
          coding problems, and other educational content. While we strive for accuracy, AI-generated content:
        </p>
        <ul>
          <li>May contain errors, inaccuracies, or outdated information</li>
          <li>Should not be considered a substitute for official textbooks, lectures, or instructor guidance</li>
          <li>Must be verified against authoritative academic sources before use in examinations or assignments</li>
          <li>May not reflect the specific curriculum requirements of your institution</li>
        </ul>
      </section>

      <section id="educational-purpose">
        <h2>Educational Purpose Only</h2>
        <p>
          StudyMapper is designed as a supplementary study aid and is not intended to replace formal education, 
          professional tutoring, or academic advising. The use of this application does not guarantee academic success, 
          passing grades, or qualification for any degree or certification.
        </p>
      </section>

      <section id="exam-predictions">
        <h2>Exam Score Predictions</h2>
        <p>
          Any exam score predictions, performance estimates, or mock test analyses generated by StudyMapper 
          are purely estimates based on limited data. These predictions:
        </p>
        <ul>
          <li>Are not guarantees of actual exam performance</li>
          <li>Do not account for exam-day variables such as stress, health, or question difficulty</li>
          <li>Should be used as motivational tools rather than definitive forecasts</li>
        </ul>
      </section>

      <section id="academic-integrity">
        <h2>Academic Integrity</h2>
        <p>
          Users are solely responsible for ensuring that their use of StudyMapper complies with their institution's 
          academic integrity policies. StudyMapper should not be used to:
        </p>
        <ul>
          <li>Cheat on examinations or assignments</li>
          <li>Plagiarize content without proper attribution</li>
          <li>Violate any academic honor codes or policies</li>
        </ul>
      </section>

      <section id="placement">
        <h2>Placement & Career Outcomes</h2>
        <p>
          StudyMapper provides placement preparation materials, mock interviews, and career guidance. However, 
          we make no guarantees regarding job placement, interview success, salary outcomes, or career advancement. 
          Results depend on individual effort, market conditions, and numerous factors beyond our control.
        </p>
      </section>

      <section id="external-links">
        <h2>External Links</h2>
        <p>
          StudyMapper may contain links to external websites. We do not endorse, guarantee, or assume responsibility 
          for the accuracy or reliability of any information offered by third-party websites linked through our application.
        </p>
      </section>
    </LegalLayout>
  );
}
```

### 5.6 Security Policy
**Route:** `/security`  
**File:** `src/pages/Legal/SecurityPolicy.jsx`

```jsx
import { LegalLayout } from '../../components/LegalLayout/LegalLayout';

export function SecurityPolicy() {
  return (
    <LegalLayout title="Security Policy" lastUpdated="August 28, 2026">
      <section id="overview">
        <h2>Security Overview</h2>
        <p>
          At StudyMapper, security is foundational to our architecture. As an offline-first application, 
          your study data primarily resides on your local device. This document outlines our security measures, 
          vulnerability reporting procedures, and best practices for users.
        </p>
      </section>

      <section id="measures">
        <h2>Security Measures</h2>

        <h3>Local Data Protection</h3>
        <ul>
          <li>All study data is stored in your browser's IndexedDB, isolated to your device</li>
          <li>No study content is transmitted to our servers unless you explicitly enable cloud backup</li>
          <li>Application data is sandboxed by the browser's same-origin policy</li>
        </ul>

        <h3>Authentication Security</h3>
        <ul>
          <li>Firebase Authentication provides industry-standard OAuth 2.0 and OpenID Connect protocols</li>
          <li>Password-based accounts use Firebase's secure hashing and salting</li>
          <li>Support for Multi-Factor Authentication (MFA) via SMS or authenticator apps</li>
          <li>Session management with automatic timeout and secure token refresh</li>
        </ul>

        <h3>Cloud Backup Encryption</h3>
        <ul>
          <li>End-to-end encryption using AES-256 before data leaves your device</li>
          <li>Encryption keys derived from your credentials using PBKDF2 key derivation</li>
          <li>Keys are never stored on StudyMapper or Firebase servers</li>
          <li>TLS 1.3 for all data in transit</li>
        </ul>

        <h3>API Security</h3>
        <ul>
          <li>OpenRouter API keys are stored locally and never transmitted to StudyMapper servers</li>
          <li>AI prompts are sent directly from your browser to OpenRouter</li>
          <li>Rate limiting and fallback mechanisms prevent API abuse</li>
        </ul>
      </section>

      <section id="reporting">
        <h2>Reporting Vulnerabilities</h2>
        <p>
          We encourage responsible disclosure of security vulnerabilities. If you discover a security issue, 
          please report it to us immediately:
        </p>
        <ul>
          <li>Email: security@studymapper.app</li>
          <li>Include detailed steps to reproduce the vulnerability</li>
          <li>Allow us reasonable time to address the issue before public disclosure</li>
          <li>We commit to acknowledging reports within 48 hours</li>
        </ul>
        <p>
          We do not initiate legal action against researchers who follow responsible disclosure practices.
        </p>
      </section>

      <section id="breach">
        <h2>Data Breach Procedures</h2>
        <p>
          In the unlikely event of a data breach affecting user information, we will:
        </p>
        <ul>
          <li>Investigate and contain the breach within 24 hours of discovery</li>
          <li>Notify affected users within 72 hours as required by applicable regulations</li>
          <li>Provide guidance on protective measures users should take</li>
          <li>Publish a post-incident report detailing cause, impact, and remediation</li>
        </ul>
      </section>

      <section id="best-practices">
        <h2>User Security Best Practices</h2>
        <ul>
          <li>Use a strong, unique password for your StudyMapper account</li>
          <li>Enable Two-Factor Authentication (2FA) in Account Settings</li>
          <li>Keep your browser and operating system updated</li>
          <li>Log out from shared or public devices</li>
          <li>Regularly export and back up your study data</li>
          <li>Do not share your OpenRouter API key with others</li>
          <li>Report suspicious activity immediately</li>
        </ul>
      </section>

      <section id="third-party">
        <h2>Third-Party Security</h2>
        <p>
          StudyMapper relies on Firebase (Google) and OpenRouter for certain services. We recommend reviewing 
          their respective security documentation:
        </p>
        <ul>
          <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase Security & Privacy</a></li>
          <li><a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer">OpenRouter Privacy Policy</a></li>
        </ul>
      </section>
    </LegalLayout>
  );
}
```

### 5.7 Community Guidelines
**Route:** `/community-guidelines`  
**File:** `src/pages/Legal/CommunityGuidelines.jsx`

```jsx
import { LegalLayout } from '../../components/LegalLayout/LegalLayout';

export function CommunityGuidelines() {
  return (
    <LegalLayout title="Community Guidelines" lastUpdated="August 28, 2026">
      <section id="purpose">
        <h2>Our Purpose</h2>
        <p>
          StudyMapper's community features — including Study Rooms, Shared Question Banks, and Leaderboards — 
          are designed to foster collaborative learning and mutual support among engineering students. 
          These guidelines ensure a safe, respectful, and productive environment for all users.
        </p>
      </section>

      <section id="respect">
        <h2>Respectful Behavior</h2>
        <p>All community interactions must be conducted with respect and professionalism:</p>
        <ul>
          <li>Treat fellow students with courtesy and empathy</li>
          <li>Respect diverse backgrounds, learning paces, and academic journeys</li>
          <li>Provide constructive feedback when reviewing shared content</li>
          <li>Celebrate others' achievements and milestones</li>
        </ul>
      </section>

      <section id="prohibited">
        <h2>Prohibited Conduct</h2>
        <p>The following behaviors are strictly prohibited:</p>
        <ul>
          <li><strong>Harassment:</strong> Bullying, intimidation, or persistent unwanted contact</li>
          <li><strong>Hate Speech:</strong> Content that attacks individuals based on race, ethnicity, religion, gender, sexual orientation, disability, or nationality</li>
          <li><strong>Cheating:</strong> Sharing exam answers during active examinations, coordinating academic dishonesty, or distributing stolen exam materials</li>
          <li><strong>Spam:</strong> Repetitive, irrelevant, or promotional content</li>
          <li><strong>Impersonation:</strong> Pretending to be another person, institution, or official representative</li>
          <li><strong>Malicious Content:</strong> Sharing malware, phishing links, or harmful files</li>
          <li><strong>Doxxing:</strong> Sharing private information about others without consent</li>
        </ul>
      </section>

      <section id="content-standards">
        <h2>Content Standards</h2>
        <p>When sharing question banks, notes, or other content:</p>
        <ul>
          <li>Ensure you have the right to share the content</li>
          <li>Do not upload copyrighted materials without permission</li>
          <li>Label content accurately (subject, topic, difficulty)</li>
          <li>Flag inappropriate or incorrect content when encountered</li>
          <li>Credit original authors when sharing adapted materials</li>
        </ul>
      </section>

      <section id="enforcement">
        <h2>Enforcement</h2>
        <p>Violations of these guidelines may result in:</p>
        <ul>
          <li><strong>Warning:</strong> First-time minor violations receive a warning with guidance</li>
          <li><strong>Temporary Suspension:</strong> Repeated or serious violations result in temporary loss of community features</li>
          <li><strong>Permanent Ban:</strong> Severe violations, including harassment or cheating, result in permanent account termination</li>
          <li><strong>Content Removal:</strong> Violating content may be removed without notice</li>
        </ul>
        <p>
          All enforcement decisions are made at StudyMapper's sole discretion. There is no appeal process 
          for severe violations that threaten community safety.
        </p>
      </section>

      <section id="reporting">
        <h2>Reporting Violations</h2>
        <p>If you encounter content or behavior that violates these guidelines:</p>
        <ul>
          <li>Use the in-app "Report" button on shared content or user profiles</li>
          <li>Contact us at: support@studymapper.app</li>
          <li>Include specific details, screenshots, and context</li>
          <li>Reports are confidential and reviewed within 24 hours</li>
        </ul>
      </section>

      <section id="changes">
        <h2>Changes to Guidelines</h2>
        <p>
          We may update these Community Guidelines periodically. Continued use of community features 
          after changes constitutes acceptance of the updated guidelines.
        </p>
      </section>
    </LegalLayout>
  );
}
```

### 5.8 Legal Pages CSS
**File:** `src/styles/legal.css`

```css
.legal-page {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  gap: 40px;
  min-height: 100vh;
}

.legal-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  align-self: flex-start;
  height: fit-content;
}

.legal-toc h3 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.legal-toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legal-toc li {
  margin-bottom: 4px;
}

.legal-toc a {
  display: block;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 2px solid transparent;
}

.legal-toc a:hover {
  background: var(--surface);
  color: var(--text-primary);
}

.legal-toc a.active {
  background: var(--surface);
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}

.legal-content {
  flex: 1;
  max-width: 720px;
}

.legal-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.legal-badge {
  padding: 4px 10px;
  background: var(--accent);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
}

.legal-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.legal-print {
  margin-left: auto;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  transition: all 0.2s;
}

.legal-print:hover {
  background: var(--surface);
  color: var(--text-primary);
}

.legal-content h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0 0 32px;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.legal-content h2 {
  font-size: 1.375rem;
  font-weight: 600;
  margin: 40px 0 16px;
  color: var(--text-primary);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.legal-content h3 {
  font-size: 1.0625rem;
  font-weight: 600;
  margin: 24px 0 12px;
  color: var(--text-primary);
}

.legal-content p {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.legal-content ul,
.legal-content ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

.legal-content li {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.legal-content a {
  color: var(--accent);
  text-decoration: underline;
}

.legal-back-to-top {
  margin-top: 48px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.legal-back-to-top:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

@media (max-width: 900px) {
  .legal-page {
    flex-direction: column;
    padding: 24px 16px;
  }

  .legal-sidebar {
    width: 100%;
    position: static;
  }

  .legal-toc ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .legal-toc li {
    margin: 0;
  }

  .legal-toc a {
    border-left: none;
    border: 1px solid var(--border);
    padding: 6px 12px;
  }

  .legal-toc a.active {
    border-color: var(--accent);
  }
}

@media print {
  .legal-sidebar,
  .legal-print,
  .legal-back-to-top {
    display: none;
  }

  .legal-content {
    max-width: 100%;
  }

  .legal-content h1 {
    font-size: 1.75rem;
  }

  .legal-content h2 {
    font-size: 1.25rem;
  }
}
```


---

## 6. Cookie Consent System

### 6.1 useCookieConsent Hook
**File:** `src/hooks/useCookieConsent.js`

```javascript
import { useState, useEffect, useCallback } from 'react';
import { db } from '../data/db';

const DEFAULT_CONSENT = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export function useCookieConsent() {
  const [consent, setConsentState] = useState(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsent();
  }, []);

  const loadConsent = async () => {
    try {
      const stored = await db.cookie_consent.toCollection().last();
      if (stored) {
        setConsentState(stored);
        setIsBannerVisible(false);
        applyConsentSettings(stored);
      } else {
        setConsentState(DEFAULT_CONSENT);
        setIsBannerVisible(true);
      }
    } catch (e) {
      console.error('Failed to load cookie consent:', e);
      setConsentState(DEFAULT_CONSENT);
      setIsBannerVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsent = useCallback(async (newConsent) => {
    const record = {
      ...newConsent,
      consent_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.cookie_consent.put(record);
    setConsentState(record);
    setIsBannerVisible(false);
    applyConsentSettings(newConsent);
  }, []);

  const acceptAll = useCallback(() => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    updateConsent(allAccepted);
  }, [updateConsent]);

  const rejectNonEssential = useCallback(() => {
    updateConsent(DEFAULT_CONSENT);
  }, [updateConsent]);

  const dismissBanner = useCallback(() => {
    setIsBannerVisible(false);
  }, []);

  const canUseAnalytics = useCallback(() => {
    return consent?.analytics === true;
  }, [consent]);

  const canUseFunctional = useCallback(() => {
    return consent?.functional === true;
  }, [consent]);

  return {
    consent,
    isBannerVisible,
    isLoading,
    updateConsent,
    acceptAll,
    rejectNonEssential,
    dismissBanner,
    canUseAnalytics,
    canUseFunctional,
    hasConsent: consent !== null,
  };
}

function applyConsentSettings(consent) {
  if (typeof window !== 'undefined' && window.firebase?.analytics) {
    if (!consent.analytics) {
      window.firebase.analytics().setAnalyticsCollectionEnabled(false);
    } else {
      window.firebase.analytics().setAnalyticsCollectionEnabled(true);
    }
  }
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
}
```

### 6.2 CookieConsentBanner Component
**File:** `src/components/CookieConsent/CookieConsentBanner.jsx`

```jsx
import { Cookie, X, Settings, Check } from 'lucide-react';
import './CookieConsent.css';

export function CookieConsentBanner({ 
  isVisible, 
  onAcceptAll, 
  onRejectNonEssential, 
  onOpenPreferences,
  onDismiss 
}) {
  if (!isVisible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-banner-content">
        <Cookie className="cookie-icon" size={24} />
        <div className="cookie-text">
          <p>
            We use cookies to enhance your study experience and analyze traffic. 
            By clicking &quot;Accept All&quot;, you consent to our use of cookies.{''}
            <a href="/cookie-policy">Learn more</a>
          </p>
        </div>
        <div className="cookie-actions">
          <button className="cookie-btn cookie-btn-ghost" onClick={onOpenPreferences}>
            <Settings size={14} />
            Customize
          </button>
          <button className="cookie-btn cookie-btn-secondary" onClick={onRejectNonEssential}>
            <X size={14} />
            Reject
          </button>
          <button className="cookie-btn cookie-btn-primary" onClick={onAcceptAll}>
            <Check size={14} />
            Accept All
          </button>
        </div>
        <button className="cookie-close" onClick={onDismiss} aria-label="Dismiss cookie banner">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
```

### 6.3 CookiePreferencesModal Component
**File:** `src/components/CookieConsent/CookiePreferencesModal.jsx`

```jsx
import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { Lock, Settings, BarChart3, Megaphone, Check } from 'lucide-react';

export function CookiePreferencesModal({ isOpen, onClose, currentConsent, onSave }) {
  const [preferences, setPreferences] = useState(currentConsent || {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  const categories = [
    {
      id: 'necessary',
      title: 'Necessary',
      description: 'Essential for the app to function. Cannot be disabled.',
      icon: Lock,
      required: true,
    },
    {
      id: 'functional',
      title: 'Functional',
      description: 'Remember your preferences, themes, and study settings.',
      icon: Settings,
      required: false,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Help us understand how you use StudyMapper to improve features.',
      icon: BarChart3,
      required: false,
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Occasional updates about new features and study tips.',
      icon: Megaphone,
      required: false,
    },
  ];

  const handleToggle = (id) => {
    if (id === 'necessary') return;
    setPreferences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cookie Preferences" size="md">
      <div className="cookie-preferences">
        <p className="cookie-pref-intro">
          Manage your cookie preferences below. Necessary cookies are always active 
          as they are required for the app to work.
        </p>

        <div className="cookie-categories">
          {categories.map(({ id, title, description, icon: Icon, required }) => (
            <div key={id} className="cookie-category">
              <div className="cookie-category-info">
                <Icon size={20} className="cookie-category-icon" />
                <div>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences[id]}
                  onChange={() => handleToggle(id)}
                  disabled={required}
                />
                <span className={`cookie-toggle-slider ${required ? 'disabled' : ''}`} />
              </label>
            </div>
          ))}
        </div>

        <div className="cookie-pref-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} />
            Save Preferences
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

### 6.4 Cookie Consent CSS
**File:** `src/styles/cookie-consent.css`

```css
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 24px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 16px 24px;
  animation: slideUp 0.3s ease;
}

.cookie-banner-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
}

.cookie-icon {
  flex-shrink: 0;
  color: var(--accent);
}

.cookie-text {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.cookie-text a {
  color: var(--accent);
  text-decoration: underline;
}

.cookie-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.cookie-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.cookie-btn-primary {
  background: var(--accent);
  color: white;
}

.cookie-btn-secondary {
  background: var(--surface-hover);
  color: var(--text-primary);
  border-color: var(--border);
}

.cookie-btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.cookie-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  flex-shrink: 0;
}

/* Preferences Modal */
.cookie-preferences {
  padding: 8px 0;
}

.cookie-pref-intro {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
}

.cookie-categories {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.cookie-category {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.cookie-category-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.cookie-category-icon {
  color: var(--accent);
  margin-top: 2px;
}

.cookie-category-info h4 {
  margin: 0 0 4px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.cookie-category-info p {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Toggle Switch */
.cookie-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
}

.cookie-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.cookie-toggle-slider {
  position: absolute;
  inset: 0;
  background: var(--border);
  border-radius: 24px;
  transition: 0.2s;
}

.cookie-toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.2s;
}

.cookie-toggle input:checked + .cookie-toggle-slider {
  background: var(--accent);
}

.cookie-toggle input:checked + .cookie-toggle-slider::before {
  transform: translateX(20px);
}

.cookie-toggle-slider.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cookie-pref-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@media (max-width: 768px) {
  .cookie-banner-content {
    flex-direction: column;
    text-align: center;
  }

  .cookie-actions {
    width: 100%;
    justify-content: center;
  }

  .cookie-category {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

---

## 7. Authentication Flows

### 7.1 Forgot Password
**Route:** `/forgot-password`  
**File:** `src/pages/Auth/ForgotPassword.jsx`

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export function ForgotPassword() {
  useDocumentTitle('Forgot Password');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      setCooldown(60);

      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(
        err.code === 'auth/user-not-found'
          ? 'No account found with this email address'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : 'Failed to send reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '16px' }} />
          <h1>Check Your Email</h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
            We have sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>
          <button 
            onClick={handleSubmit} 
            disabled={cooldown > 0 || isLoading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
          </button>
          <Link to="/login" className="auth-back-link">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Mail size={40} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
        <h1>Reset Password</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
          Enter your email address and we will send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <Link to="/login" className="auth-back-link">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
```

### 7.2 Reset Password
**Route:** `/reset-password`  
**File:** `src/pages/Auth/ResetPassword.jsx`

```jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

export function ResetPassword() {
  useDocumentTitle('Reset Password');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!oobCode) {
      setError('Invalid or expired reset link. Please request a new one.');
      setIsVerifying(false);
      return;
    }

    const verifyCode = async () => {
      try {
        const auth = getAuth();
        await verifyPasswordResetCode(auth, oobCode);
        setIsVerifying(false);
      } catch (err) {
        setError('This reset link has expired or is invalid. Please request a new one.');
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setStrength(calculateStrength(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (strength < 2) {
      setError('Password is too weak. Include uppercase, numbers, and special characters.');
      return;
    }

    setIsLoading(true);
    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, password);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(
        err.code === 'auth/weak-password'
          ? 'Password is too weak. Please choose a stronger password.'
          : err.code === 'auth/expired-action-code'
          ? 'This reset link has expired. Please request a new one.'
          : 'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <Loader2 size={32} className="spin" style={{ color: 'var(--accent)' }} />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '16px' }} />
          <h1>Password Reset Successful</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Your password has been updated. You will be redirected to the login page shortly.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Lock size={40} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
        <h1>Create New Password</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
          Enter a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="strength-bar"
                      style={{
                        background: level <= strength ? strengthColors[strength - 1] : 'var(--border)',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: strengthColors[strength - 1] || 'var(--text-muted)' }}>
                  {strengthLabels[strength - 1] || 'Enter password'}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 7.3 Auth CSS (add to existing auth styles or create `src/styles/auth.css`)

```css
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg-primary);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-card h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--text-primary);
}

.auth-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9375rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent);
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper input {
  width: 100%;
  padding-right: 40px;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}

.password-strength {
  margin-top: 8px;
}

.strength-bars {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  transition: background 0.3s;
}

.auth-error {
  padding: 10px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: var(--danger);
  font-size: 0.875rem;
}

.auth-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.auth-back-link:hover {
  color: var(--accent);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```


---

## 8. Account Settings & Support

### 8.1 Settings Layout
**File:** `src/pages/Settings/SettingsLayout.jsx`

```jsx
import { NavLink, Outlet } from 'react-router-dom';
import { User, Shield, Bell, Database, Palette } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User, path: '/settings/profile' },
  { id: 'security', label: 'Security', icon: Shield, path: '/settings/security' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
  { id: 'data-privacy', label: 'Data & Privacy', icon: Database, path: '/settings/data-privacy' },
  { id: 'appearance', label: 'Appearance', icon: Palette, path: '/settings/appearance' },
];

export function SettingsLayout() {
  return (
    <div className="settings-page">
      <aside className="settings-sidebar">
        <h2>Settings</h2>
        <nav className="settings-nav">
          {tabs.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) => `settings-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="settings-content">
        <Outlet />
      </main>
    </div>
  );
}
```

### 8.2 Account Settings Router
**File:** `src/pages/Settings/AccountSettings.jsx`

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsLayout } from './SettingsLayout';
import { ProfileTab } from './tabs/ProfileTab';
import { SecurityTab } from './tabs/SecurityTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { DataPrivacyTab } from './tabs/DataPrivacyTab';
import { AppearanceTab } from './tabs/AppearanceTab';

export function AccountSettings() {
  return (
    <Routes>
      <Route element={<SettingsLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfileTab />} />
        <Route path="security" element={<SecurityTab />} />
        <Route path="notifications" element={<NotificationsTab />} />
        <Route path="data-privacy" element={<DataPrivacyTab />} />
        <Route path="appearance" element={<AppearanceTab />} />
      </Route>
    </Routes>
  );
}
```

### 8.3 Profile Tab
**File:** `src/pages/Settings/tabs/ProfileTab.jsx`

```jsx
import { useState, useEffect } from 'react';
import { User, Camera, Save, Loader2 } from 'lucide-react';
import { getAuth, updateProfile } from 'firebase/auth';
import { db } from '../../../data/db';

export function ProfileTab() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await updateProfile(auth.currentUser, { displayName, photoURL });
      await db.user_settings.update(user.uid, { display_name: displayName, photo_url: photoURL, updated_at: new Date().toISOString() });
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-tab">
      <h2><User size={20} /> Profile</h2>

      <div className="settings-section">
        <div className="profile-photo-section">
          <div className="profile-photo">
            {photoURL ? (
              <img src={photoURL} alt="Profile" />
            ) : (
              <User size={40} />
            )}
            <button className="photo-upload-btn" aria-label="Change photo">
              <Camera size={14} />
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} disabled />
          <span className="field-hint">Email cannot be changed. Contact support for assistance.</span>
        </div>

        {message && (
          <div className={`settings-message ${message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
          {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
```

### 8.4 Security Tab
**File:** `src/pages/Settings/tabs/SecurityTab.jsx`

```jsx
import { useState } from 'react';
import { Shield, Lock, Trash2, Loader2 } from 'lucide-react';
import { getAuth, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog';
import { db } from '../../../data/db';

export function SecurityTab() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    setIsChanging(true);
    setMessage('');
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.code === 'auth/wrong-password' ? 'Current password is incorrect' : 'Failed to update password');
    } finally {
      setIsChanging(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user);
      await db.delete();
      window.location.href = '/';
    } catch (err) {
      setMessage('Failed to delete account. Please re-authenticate and try again.');
    }
  };

  return (
    <div className="settings-tab">
      <h2><Shield size={20} /> Security</h2>

      <div className="settings-section">
        <h3>Change Password</h3>
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        {message && <div className="settings-message error">{message}</div>}
        <button onClick={handleChangePassword} disabled={isChanging} className="btn btn-primary">
          {isChanging ? <Loader2 size={16} className="spin" /> : <Lock size={16} />}
          Update Password
        </button>
      </div>

      <div className="settings-section danger-zone">
        <h3>Danger Zone</h3>
        <p>Once you delete your account, there is no going back. All your local data and cloud backups will be permanently removed.</p>
        <button onClick={() => setShowDeleteDialog(true)} className="btn btn-danger">
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account?"
        description="This will permanently delete all your study data, notes, flashcards, and account information. This action cannot be undone."
        confirmLabel="Delete Account"
        variant="danger"
        requireText="DELETE"
      />
    </div>
  );
}
```

### 8.5 Notifications Tab
**File:** `src/pages/Settings/tabs/NotificationsTab.jsx`

```jsx
import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Trophy } from 'lucide-react';
import { db } from '../../../data/db';

export function NotificationsTab() {
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: false,
    study_reminders: true,
    social_notifications: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const stored = await db.user_settings.toCollection().last();
    if (stored) {
      setSettings({
        email_notifications: stored.email_notifications ?? true,
        push_notifications: stored.push_notifications ?? false,
        study_reminders: stored.study_reminders ?? true,
        social_notifications: stored.social_notifications ?? true,
      });
    }
  };

  const handleToggle = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await db.user_settings.update(1, { ...updated, updated_at: new Date().toISOString() });
  };

  const items = [
    { key: 'email_notifications', label: 'Email Notifications', description: 'Receive updates about your account and study progress', icon: Mail },
    { key: 'push_notifications', label: 'Push Notifications', description: 'Browser notifications for daily quests and reminders', icon: Smartphone },
    { key: 'study_reminders', label: 'Study Reminders', description: 'Reminders to maintain your study streak', icon: Bell },
    { key: 'social_notifications', label: 'Social Notifications', description: 'Friend activity and leaderboard updates', icon: Trophy },
  ];

  return (
    <div className="settings-tab">
      <h2><Bell size={20} /> Notifications</h2>
      <div className="settings-section">
        {items.map(({ key, label, description, icon: Icon }) => (
          <div key={key} className="settings-toggle-row">
            <div className="settings-toggle-info">
              <Icon size={18} />
              <div>
                <span className="toggle-label">{label}</span>
                <span className="toggle-description">{description}</span>
              </div>
            </div>
            <label className="cookie-toggle">
              <input type="checkbox" checked={settings[key]} onChange={() => handleToggle(key)} />
              <span className="cookie-toggle-slider" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 8.6 Data & Privacy Tab
**File:** `src/pages/Settings/tabs/DataPrivacyTab.jsx`

```jsx
import { useState } from 'react';
import { Database, Download, Trash2, Cookie } from 'lucide-react';
import { db } from '../../../data/db';
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog';

export function DataPrivacyTab() {
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleExportJSON = async () => {
    const data = {};
    for (const table of db.tables) {
      data[table.name] = await table.toArray();
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymapper-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = async () => {
    for (const table of db.tables) {
      if (!['user_settings', 'cookie_consent'].includes(table.name)) {
        await table.clear();
      }
    }
    window.location.reload();
  };

  return (
    <div className="settings-tab">
      <h2><Database size={20} /> Data & Privacy</h2>

      <div className="settings-section">
        <h3>Export Your Data</h3>
        <p>Download a complete copy of all your study data in JSON format.</p>
        <button onClick={handleExportJSON} className="btn btn-secondary">
          <Download size={16} />
          Export All Data (JSON)
        </button>
      </div>

      <div className="settings-section">
        <h3>Cookie Preferences</h3>
        <p>Manage your cookie consent settings at any time.</p>
        <button onClick={() => window.dispatchEvent(new CustomEvent('openCookiePrefs'))} className="btn btn-secondary">
          <Cookie size={16} />
          Manage Cookies
        </button>
      </div>

      <div className="settings-section danger-zone">
        <h3>Clear Local Data</h3>
        <p>Remove all study data from this device. This does not affect your cloud backup if enabled.</p>
        <button onClick={() => setShowClearDialog(true)} className="btn btn-danger">
          <Trash2 size={16} />
          Clear All Local Data
        </button>
      </div>

      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearData}
        title="Clear All Local Data?"
        description="This will permanently delete all subjects, notes, flashcards, and question banks from this device. This action cannot be undone."
        confirmLabel="Clear Data"
        variant="danger"
        requireText="CLEAR"
      />
    </div>
  );
}
```

### 8.7 Appearance Tab
**File:** `src/pages/Settings/tabs/AppearanceTab.jsx`

```jsx
import { useState, useEffect } from 'react';
import { Palette, Moon, Sun, Eye, Type } from 'lucide-react';
import { db } from '../../../data/db';

const themes = [
  { id: 'midnight', name: 'Midnight Coding', description: 'Deep blue tones for late night sessions', icon: Moon },
  { id: 'focus', name: 'Focus Mode', description: 'High contrast black and white', icon: Eye },
  { id: 'eyecare', name: 'Eye Care', description: 'Warm sepia tones to reduce eye strain', icon: Sun },
  { id: 'solarized', name: 'Solarized', description: 'Classic developer favorite', icon: Palette },
  { id: 'forest', name: 'Forest', description: 'Green-tinted dark theme', icon: Palette },
];

const fontSizes = [
  { id: 'small', name: 'Small', scale: '14px' },
  { id: 'medium', name: 'Medium', scale: '16px' },
  { id: 'large', name: 'Large', scale: '18px' },
];

export function AppearanceTab() {
  const [activeTheme, setActiveTheme] = useState('midnight');
  const [fontSize, setFontSize] = useState('medium');
  const [density, setDensity] = useState('comfortable');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const stored = await db.user_settings.toCollection().last();
    if (stored) {
      setActiveTheme(stored.theme || 'midnight');
      setFontSize(stored.font_size || 'medium');
      setDensity(stored.density || 'comfortable');
    }
  };

  const applyTheme = async (themeId) => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    await db.user_settings.update(1, { theme: themeId, updated_at: new Date().toISOString() });
  };

  const applyFontSize = async (size) => {
    setFontSize(size);
    document.documentElement.style.fontSize = fontSizes.find(f => f.id === size)?.scale || '16px';
    await db.user_settings.update(1, { font_size: size, updated_at: new Date().toISOString() });
  };

  return (
    <div className="settings-tab">
      <h2><Palette size={20} /> Appearance</h2>

      <div className="settings-section">
        <h3>Theme</h3>
        <div className="theme-grid">
          {themes.map(({ id, name, description, icon: Icon }) => (
            <button
              key={id}
              onClick={() => applyTheme(id)}
              className={`theme-card ${activeTheme === id ? 'active' : ''}`}
            >
              <Icon size={24} />
              <div>
                <span className="theme-name">{name}</span>
                <span className="theme-desc">{description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>Font Size</h3>
        <div className="font-size-options">
          {fontSizes.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => applyFontSize(id)}
              className={`font-size-btn ${fontSize === id ? 'active' : ''}`}
            >
              <Type size={id === 'small' ? 14 : id === 'medium' ? 18 : 22} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>UI Density</h3>
        <div className="density-options">
          {['compact', 'comfortable'].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDensity(d);
                document.documentElement.setAttribute('data-density', d);
              }}
              className={`density-btn ${density === d ? 'active' : ''}`}
            >
              {d === 'compact' ? 'Compact' : 'Comfortable'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 8.8 Settings CSS
**File:** `src/styles/settings.css`

```css
.settings-page {
  display: flex;
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px;
  gap: 32px;
  min-height: 100vh;
}

.settings-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.settings-sidebar h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 20px;
  color: var(--text-primary);
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.settings-nav-item:hover {
  background: var(--surface);
  color: var(--text-primary);
}

.settings-nav-item.active {
  background: var(--accent);
  color: white;
  font-weight: 500;
}

.settings-content {
  flex: 1;
  min-width: 0;
}

.settings-tab h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 24px;
  color: var(--text-primary);
}

.settings-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.settings-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px;
  color: var(--text-primary);
}

.settings-section p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.settings-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.settings-toggle-row:last-child {
  border-bottom: none;
}

.settings-toggle-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-toggle-info svg {
  color: var(--text-muted);
}

.toggle-label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

.toggle-description {
  display: block;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.profile-photo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.profile-photo {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  overflow: hidden;
}

.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  border: 2px solid var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.photo-upload-btn:hover {
  transform: scale(1.1);
}

.field-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.settings-message {
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.settings-message.success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success);
}

.settings-message.error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.danger-zone {
  border-color: rgba(239, 68, 68, 0.3);
}

.danger-zone h3 {
  color: var(--danger);
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.theme-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-primary);
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.theme-card:hover {
  border-color: var(--accent);
}

.theme-card.active {
  border-color: var(--accent);
  background: rgba(var(--accent-rgb), 0.05);
}

.theme-name {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.theme-desc {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.font-size-options,
.density-options {
  display: flex;
  gap: 12px;
}

.font-size-btn,
.density-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: var(--bg-primary);
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.font-size-btn.active,
.density-btn.active {
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 768px) {
  .settings-page {
    flex-direction: column;
    padding: 16px;
  }

  .settings-sidebar {
    width: 100%;
  }

  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .settings-nav-item {
    white-space: nowrap;
  }

  .theme-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 9. Error & Utility Pages

### 9.1 Error Boundary
**File:** `src/components/ErrorBoundary/ErrorBoundary.jsx`

```jsx
import { Component } from 'react';
import { InternalError } from '../../pages/Errors/InternalError';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <InternalError 
          error={this.state.error} 
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
```

### 9.2 404 Not Found
**Route:** `*` (catch-all)  
**File:** `src/pages/Errors/NotFound.jsx`

```jsx
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { BookX, Home, Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFound() {
  useDocumentTitle('Page Not Found');

  return (
    <div className="error-page">
      <div className="error-container">
        <BookX className="error-icon" size={64} strokeWidth={1.5} />
        <h1>404</h1>
        <h2>This page seems to have gone offline for revision</h2>
        <p>
          The page you are looking for does not exist or may have been moved. 
          Do not worry — your study data is completely safe.
        </p>

        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            Go Home
          </Link>
          <Link to="/subjects" className="btn btn-secondary">
            <Search size={18} />
            Browse Subjects
          </Link>
          <Link to="/help" className="btn btn-ghost">
            <HelpCircle size={18} />
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### 9.3 403 Forbidden
**Route:** `/403`  
**File:** `src/pages/Errors/Forbidden.jsx`

```jsx
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ShieldAlert, ArrowLeft, LogIn, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Forbidden() {
  useDocumentTitle('Access Denied');
  const location = useLocation();
  const isAuthRequired = !localStorage.getItem('firebase_auth_user');

  return (
    <div className="error-page">
      <div className="error-container">
        <ShieldAlert className="error-icon warning" size={64} strokeWidth={1.5} />
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>
          You do not have permission to view this resource. 
          {isAuthRequired 
            ? ' This area may require you to be signed in.' 
            : ' Your account may not have the required privileges.'}
        </p>

        <div className="error-actions">
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft size={18} />
            Go Back
          </button>

          {isAuthRequired ? (
            <Link to="/login" state={{ from: location }} className="btn btn-primary">
              <LogIn size={18} />
              Sign In
            </Link>
          ) : (
            <Link to="/support" className="btn btn-primary">
              <Mail size={18} />
              Contact Support
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 9.4 500 Internal Error
**Route:** `/500` (or Error Boundary fallback)  
**File:** `src/pages/Errors/InternalError.jsx`

```jsx
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ServerCrash, RotateCcw, Home, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InternalError({ error, errorInfo, onReset }) {
  useDocumentTitle('Something Went Wrong');

  return (
    <div className="error-page">
      <div className="error-container">
        <ServerCrash className="error-icon danger" size={64} strokeWidth={1.5} />
        <h1>500</h1>
        <h2>Something went wrong on our end</h2>
        <p>
          Do not worry — all your study data is safe in your browser local storage. 
          This appears to be a temporary issue.
        </p>

        <div className="error-actions">
          {onReset && (
            <button onClick={onReset} className="btn btn-primary">
              <RotateCcw size={18} />
              Reload Page
            </button>
          )}
          <Link to="/" className="btn btn-secondary">
            <Home size={18} />
            Go Home
          </Link>
          <Link to="/support" state={{ category: 'Bug Report' }} className="btn btn-ghost">
            <Bug size={18} />
            Report Issue
          </Link>
        </div>

        {(error || errorInfo) && (
          <details className="error-details">
            <summary>Technical Details (for debugging)</summary>
            <pre>
              {error?.toString()}
              {'
'}
              {errorInfo?.componentStack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
```

### 9.5 Maintenance Mode
**Route:** `/maintenance`  
**File:** `src/pages/Errors/Maintenance.jsx`

```jsx
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Wrench, WifiOff, ArrowRight, RotateCcw } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Link } from 'react-router-dom';

export function Maintenance() {
  useDocumentTitle('Under Maintenance');
  const { isOnline } = useNetworkStatus();

  return (
    <div className="error-page maintenance">
      <div className="error-container">
        <div className="maintenance-icon-wrapper">
          <Wrench className="error-icon" size={64} strokeWidth={1.5} />
          <span className="maintenance-pulse" />
        </div>
        <h1>Under Maintenance</h1>
        <h2>We are upgrading your learning experience</h2>
        <p>
          StudyMapper is temporarily unavailable while we perform scheduled improvements. 
          We will be back as soon as possible.
        </p>

        <div className="maintenance-status">
          <span className="status-dot" />
          <span>Estimated return: Soon</span>
        </div>

        {!isOnline && (
          <div className="offline-notice">
            <WifiOff size={16} />
            <span>You are also offline — but your local data is safe.</span>
          </div>
        )}

        <div className="error-actions">
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            <RotateCcw size={18} />
            Check Status
          </button>
          <Link to="/" className="btn btn-secondary">
            Continue Offline
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### 9.6 Offline Page
**File:** `src/pages/Errors/Offline.jsx`

```jsx
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { CloudOff, Wifi, BookOpen, Brain, Clock, Code } from 'lucide-react';

export function Offline() {
  useDocumentTitle('Offline');

  const offlineFeatures = [
    { icon: BookOpen, label: 'Read Notes & Topics' },
    { icon: Brain, label: 'Review Flashcards' },
    { icon: Clock, label: 'Use Pomodoro Timer' },
    { icon: Code, label: 'Practice Coding (non-evaluated)' },
  ];

  return (
    <div className="error-page offline">
      <div className="error-container">
        <CloudOff className="error-icon muted" size={64} strokeWidth={1.5} />
        <h1>You are Offline</h1>
        <h2>No internet connection detected</h2>
        <p>
          The good news? StudyMapper is built to work offline. 
          All your subjects, notes, and flashcards are available right now.
        </p>

        <div className="offline-features">
          <h3>Available Offline:</h3>
          <div className="feature-grid">
            {offlineFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="feature-item">
                <Icon size={20} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="error-actions">
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            <Wifi size={18} />
            Retry Connection
          </button>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 9.7 Error Pages CSS
**File:** `src/styles/errors.css`

```css
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg-primary);
}

.error-container {
  max-width: 560px;
  text-align: center;
}

.error-icon {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.error-icon.warning {
  color: var(--warning);
}

.error-icon.danger {
  color: var(--danger);
}

.error-icon.muted {
  color: var(--text-muted);
}

.error-container h1 {
  font-size: 5rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -2px;
}

.error-container h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 16px 0 12px;
  color: var(--text-primary);
}

.error-container p {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-actions .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.9375rem;
}

.btn-primary {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border-color: var(--border);
}

.btn-secondary:hover {
  background: var(--surface-hover);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: transparent;
}

.btn-ghost:hover {
  color: var(--text-primary);
  background: var(--surface);
}

.btn-danger {
  background: var(--danger);
  color: white;
  border-color: var(--danger);
}

.error-details {
  margin-top: 32px;
  text-align: left;
  background: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.error-details summary {
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-secondary);
  user-select: none;
}

.error-details pre {
  padding: 16px;
  margin: 0;
  font-size: 0.8125rem;
  overflow-x: auto;
  color: var(--danger);
  background: rgba(239, 68, 68, 0.05);
  border-top: 1px solid var(--border);
}

/* Maintenance specific */
.maintenance-icon-wrapper {
  position: relative;
  display: inline-block;
}

.maintenance-pulse {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  animation: pulse-ring 2s infinite;
}

.maintenance-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 24px;
  padding: 8px 16px;
  background: var(--surface);
  border-radius: 100px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--warning);
  border-radius: 50%;
  animation: blink 2s infinite;
}

.offline-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 12px;
  background: var(--surface);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Offline specific */
.offline-features {
  margin: 24px 0;
  text-align: left;
}

.offline-features h3 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 12px;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--surface);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature-item svg {
  color: var(--accent);
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.3); opacity: 0; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@media (max-width: 480px) {
  .error-container h1 {
    font-size: 3.5rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
```


---

## 10. Loading & Empty States

### 10.1 Skeleton Loader
**File:** `src/components/Loading/SkeletonLoader.jsx`

```jsx
import './Loading.css';

export function SkeletonLoader({ 
  variant = 'text', 
  count = 1, 
  width, 
  height, 
  circle = false,
  className = '' 
}) {
  const items = Array.from({ length: count });

  return (
    <div className={`skeleton-wrapper ${className}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-${variant} ${circle ? 'skeleton-circle' : ''}`}
          style={{
            width: width || undefined,
            height: height || undefined,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
```

### 10.2 Inline Loading
**File:** `src/components/Loading/InlineLoading.jsx`

```jsx
import { Loader2 } from 'lucide-react';
import './Loading.css';

export function InlineLoading({ text = 'Loading...', size = 'sm' }) {
  return (
    <span className={`inline-loading inline-loading-${size}`}>
      <Loader2 className="inline-spinner" size={size === 'sm' ? 14 : 18} />
      <span>{text}</span>
    </span>
  );
}
```

### 10.3 AI Streaming Loader
**File:** `src/components/Loading/AIStreamingLoader.jsx`

```jsx
import { Sparkles, X } from 'lucide-react';
import './Loading.css';

export function AIStreamingLoader({ message = 'AI is crafting your notes...', onCancel }) {
  return (
    <div className="ai-streaming-loader">
      <div className="ai-loader-content">
        <Sparkles className="ai-loader-icon" size={20} />
        <div className="ai-loader-text">
          <span>{message}</span>
          <span className="ai-loader-dots">
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>
      {onCancel && (
        <button onClick={onCancel} className="ai-loader-cancel" aria-label="Cancel generation">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
```

### 10.4 Loading CSS
**File:** `src/styles/loading.css`

```css
/* Skeleton */
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.skeleton {
  background: var(--skeleton-base, var(--bg-secondary));
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    var(--skeleton-highlight, rgba(255,255,255,0.08)),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  height: 1em;
  width: 100%;
}

.skeleton-title {
  height: 1.25em;
  width: 60%;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
}

.skeleton-circle {
  border-radius: 50%;
}

.skeleton-card {
  height: 120px;
  width: 100%;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Inline Loading */
.inline-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.inline-spinner {
  animation: spin 1s linear infinite;
}

.inline-loading-lg {
  font-size: 1rem;
  gap: 10px;
}

/* AI Streaming Loader */
.ai-streaming-loader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin: 16px 0;
}

.ai-loader-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-loader-icon {
  color: var(--accent);
  animation: pulse 2s infinite;
}

.ai-loader-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.ai-loader-dots {
  display: inline-flex;
  gap: 3px;
}

.ai-loader-dots span {
  width: 4px;
  height: 4px;
  background: var(--text-muted);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.ai-loader-dots span:nth-child(1) { animation-delay: -0.32s; }
.ai-loader-dots span:nth-child(2) { animation-delay: -0.16s; }

.ai-loader-cancel {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.ai-loader-cancel:hover {
  background: var(--surface-hover);
  color: var(--danger);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

### 10.5 Empty State Component
**File:** `src/components/EmptyStates/EmptyState.jsx`

```jsx
import { Link } from 'react-router-dom';

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  actionOnClick,
  secondaryLabel,
  secondaryHref,
  secondaryOnClick
}) {
  return (
    <div className="empty-state">
      {Icon && <Icon className="empty-state-icon" size={48} strokeWidth={1.5} />}
      <h3>{title}</h3>
      <p>{description}</p>

      {(actionLabel || secondaryLabel) && (
        <div className="empty-state-actions">
          {actionLabel && (
            actionHref ? (
              <Link to={actionHref} className="btn btn-primary">
                {actionLabel}
              </Link>
            ) : (
              <button onClick={actionOnClick} className="btn btn-primary">
                {actionLabel}
              </button>
            )
          )}
          {secondaryLabel && (
            secondaryHref ? (
              <Link to={secondaryHref} className="btn btn-secondary">
                {secondaryLabel}
              </Link>
            ) : (
              <button onClick={secondaryOnClick} className="btn btn-secondary">
                {secondaryLabel}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
```

### 10.6 No Search Results
**File:** `src/components/EmptyStates/NoSearchResults.jsx`

```jsx
import { SearchX, ArrowLeft } from 'lucide-react';

export function NoSearchResults({ query, context = 'general', onClearSearch }) {
  const suggestions = {
    general: ['Try different keywords', 'Check your spelling', 'Use broader terms'],
    help: ['Try "planner", "flashcards", or "export"', 'Browse categories instead'],
    subjects: ['Create a new subject', 'Browse all subjects'],
    questions: ['Add your first question', 'Upload a question paper'],
  };

  return (
    <div className="empty-state no-search-results">
      <SearchX className="empty-state-icon" size={48} strokeWidth={1.5} />
      <h3>No results found</h3>
      <p>
        We could not find anything matching <strong>"{query}"</strong>
      </p>

      <div className="search-suggestions">
        <span>Try:</span>
        <ul>
          {(suggestions[context] || suggestions.general).map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      {onClearSearch && (
        <button onClick={onClearSearch} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Clear Search
        </button>
      )}
    </div>
  );
}
```

### 10.7 Empty States CSS
**File:** `src/components/EmptyStates/EmptyStates.css`

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
  min-height: 300px;
}

.empty-state-icon {
  color: var(--text-muted);
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  max-width: 400px;
  margin: 0 0 20px;
  line-height: 1.5;
}

.empty-state-actions {
  display: flex;
  gap: 12px;
}

/* No Search Results specific */
.no-search-results .search-suggestions {
  background: var(--surface);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 20px;
  text-align: left;
}

.search-suggestions span {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  display: block;
  margin-bottom: 8px;
}

.search-suggestions ul {
  margin: 0;
  padding-left: 18px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.search-suggestions li {
  margin-bottom: 4px;
}
```

---

## 11. Offline Indicator

**File:** `src/components/OfflineIndicator/OfflineIndicator.jsx`

```jsx
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { WifiOff, X } from 'lucide-react';
import { useState } from 'react';
import './OfflineIndicator.css';

export function OfflineIndicator() {
  const { isOnline } = useNetworkStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <div className="offline-indicator" role="status">
      <WifiOff size={16} />
      <span>You are offline. Your data is safe locally.</span>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss offline notice">
        <X size={14} />
      </button>
    </div>
  );
}
```

**File:** `src/components/OfflineIndicator/OfflineIndicator.css`

```css
.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: var(--warning);
  color: var(--warning-text, #000);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  animation: slideDown 0.3s ease;
}

.offline-indicator button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
  margin-left: 8px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.offline-indicator button:hover {
  opacity: 1;
}

@keyframes slideDown {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}
```

---

## 12. App Integration

### 12.1 App.jsx Updates

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator/OfflineIndicator';
import { CookieConsentBanner } from './components/CookieConsent/CookieConsentBanner';
import { CookiePreferencesModal } from './components/CookieConsent/CookiePreferencesModal';
import { useCookieConsent } from './hooks/useCookieConsent';
import { useState } from 'react';

// Legal Pages
import { PrivacyPolicy } from './pages/Legal/PrivacyPolicy';
import { TermsAndConditions } from './pages/Legal/TermsAndConditions';
import { CookiePolicy } from './pages/Legal/CookiePolicy';
import { Disclaimer } from './pages/Legal/Disclaimer';
import { SecurityPolicy } from './pages/Legal/SecurityPolicy';
import { CommunityGuidelines } from './pages/Legal/CommunityGuidelines';

// Auth Pages
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { ResetPassword } from './pages/Auth/ResetPassword';

// Settings & Support
import { AccountSettings } from './pages/Settings/AccountSettings';
import { Support } from './pages/Support/Support';
import { HelpCenter } from './pages/Help/HelpCenter';
import { HelpArticle } from './pages/Help/HelpArticle';

// Error Pages
import { NotFound } from './pages/Errors/NotFound';
import { Forbidden } from './pages/Errors/Forbidden';
import { InternalError } from './pages/Errors/InternalError';
import { Maintenance } from './pages/Errors/Maintenance';
import { Offline } from './pages/Errors/Offline';

function App() {
  const { 
    consent, 
    isBannerVisible, 
    acceptAll, 
    rejectNonEssential, 
    updateConsent,
    dismissBanner 
  } = useCookieConsent();

  const [showCookiePrefs, setShowCookiePrefs] = useState(false);

  // Listen for custom event from DataPrivacyTab
  useState(() => {
    const handler = () => setShowCookiePrefs(true);
    window.addEventListener('openCookiePrefs', handler);
    return () => window.removeEventListener('openCookiePrefs', handler);
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <OfflineIndicator />

        <Routes>
          {/* Existing app routes go here */}

          {/* Legal Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/security" element={<SecurityPolicy />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />

          {/* Auth Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Settings & Support */}
          <Route path="/settings/*" element={<AccountSettings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/help/:articleId" element={<HelpArticle />} />

          {/* Error Routes */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="/500" element={<InternalError />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <CookieConsentBanner
          isVisible={isBannerVisible}
          onAcceptAll={acceptAll}
          onRejectNonEssential={rejectNonEssential}
          onOpenPreferences={() => setShowCookiePrefs(true)}
          onDismiss={dismissBanner}
        />

        <CookiePreferencesModal
          isOpen={showCookiePrefs}
          onClose={() => setShowCookiePrefs(false)}
          currentConsent={consent}
          onSave={updateConsent}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
```

### 12.2 Support Page
**File:** `src/pages/Support/Support.jsx`

```jsx
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
```

### 12.3 Help Center
**File:** `src/pages/Help/HelpCenter.jsx`

```jsx
import { useState } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Search, BookOpen, Cpu, GraduationCap, Wrench, User, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import helpArticles from './helpArticles.json';

const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
  { id: 'ai-features', name: 'AI Features', icon: Cpu },
  { id: 'study-tools', name: 'Study Tools', icon: GraduationCap },
  { id: 'coding', name: 'Coding Practice', icon: Wrench },
  { id: 'account', name: 'Account & Data', icon: User },
  { id: 'troubleshooting', name: 'Troubleshooting', icon: AlertCircle },
];

export function HelpCenter() {
  useDocumentTitle('Help Center');
  const [search, setSearch] = useState('');

  const filteredArticles = helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Help Center</h1>
        <div className="help-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {search ? (
        <div className="help-results">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Link key={article.id} to={`/help/${article.id}`} className="help-result-card">
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </Link>
            ))
          ) : (
            <div className="help-no-results">
              <p>No articles found for &quot;{search}&quot;</p>
              <button onClick={() => setSearch('')} className="btn btn-secondary">Clear Search</button>
            </div>
          )}
        </div>
      ) : (
        <div className="help-categories">
          {categories.map(({ id, name, icon: Icon }) => {
            const count = helpArticles.filter((a) => a.category === id).length;
            return (
              <Link key={id} to={`/help?category=${id}`} className="help-category-card">
                <Icon size={28} />
                <h3>{name}</h3>
                <span>{count} articles</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

### 12.4 Help Articles JSON
**File:** `src/pages/Help/helpArticles.json`

```json
[
  {
    "id": "getting-started-1",
    "category": "getting-started",
    "title": "How to create your first subject",
    "excerpt": "Learn how to set up a new subject and organize your study materials.",
    "content": "To create your first subject..."
  },
  {
    "id": "getting-started-2",
    "category": "getting-started",
    "title": "Understanding the offline-first approach",
    "excerpt": "How StudyMapper keeps your data safe and accessible without internet.",
    "content": "StudyMapper is built as an offline-first application..."
  },
  {
    "id": "ai-features-1",
    "category": "ai-features",
    "title": "How AI note generation works",
    "excerpt": "Understanding the AI-powered note generation and streaming.",
    "content": "StudyMapper uses OpenRouter to stream AI-generated notes..."
  },
  {
    "id": "ai-features-2",
    "category": "ai-features",
    "title": "Model fallback system",
    "excerpt": "What happens when an AI model fails or times out.",
    "content": "When a primary model fails..."
  },
  {
    "id": "study-tools-1",
    "category": "study-tools",
    "title": "Using the Pomodoro Timer",
    "excerpt": "Maximize focus with built-in Pomodoro technique.",
    "content": "The Pomodoro Timer..."
  },
  {
    "id": "study-tools-2",
    "category": "study-tools",
    "title": "Creating effective flashcards",
    "excerpt": "Tips for generating and using flashcards with spaced repetition.",
    "content": "Flashcards are a powerful tool..."
  },
  {
    "id": "coding-1",
    "category": "coding",
    "title": "How code evaluation works",
    "excerpt": "Understanding AI-based code evaluation without a backend server.",
    "content": "Since StudyMapper is client-side only..."
  },
  {
    "id": "account-1",
    "category": "account",
    "title": "Exporting your data",
    "excerpt": "How to download all your study data for backup or portability.",
    "content": "You can export your data from Account Settings..."
  },
  {
    "id": "troubleshooting-1",
    "category": "troubleshooting",
    "title": "Fixing IndexedDB issues",
    "excerpt": "What to do when local storage fails or data disappears.",
    "content": "If you encounter IndexedDB issues..."
  },
  {
    "id": "troubleshooting-2",
    "category": "troubleshooting",
    "title": "AI generation errors",
    "excerpt": "Common AI errors and how to resolve them.",
    "content": "If AI generation fails..."
  }
]
```

---

## 13. Implementation Order

Execute in this exact order to minimize conflicts and maximize incremental value:

| Phase | Feature | Priority | Reason |
|-------|---------|----------|--------|
| 1 | Error Pages (404, 403, 500, Maintenance, Offline) | Critical | Immediate UX improvement, catches all edge cases |
| 2 | Error Boundary + Offline Indicator | Critical | Prevents app crashes, handles network state |
| 3 | Loading States & Empty States | High | Polish existing UI, reduces perceived load times |
| 4 | Cookie Consent System | Critical | Legal compliance, blocks analytics when rejected |
| 5 | Legal Pages (Privacy, Terms, Cookie Policy, Disclaimer, Security, Community) | High | Trust building, SEO, required for app stores |
| 6 | Auth Flows (Forgot/Reset Password) | High | Complete auth experience, reduces support burden |
| 7 | Account Settings (all 5 tabs) | High | User retention, data control, customization |
| 8 | Support Page + Help Center | Medium | Reduces churn, self-service support |
| 9 | Testing (Vitest for all new modules) | Critical | Validate everything before shipping |

---

## 14. Testing Requirements

Write Vitest tests for every new module. Mock Firebase Auth and Dexie.js using `fake-indexeddb`.

### 14.1 Required Test Files

```
src/
├── components/
│   ├── CookieConsent/
│   │   └── CookieConsentBanner.test.jsx
│   ├── Modal/
│   │   └── Modal.test.jsx
│   ├── Loading/
│   │   └── SkeletonLoader.test.jsx
│   └── EmptyStates/
│       └── EmptyState.test.jsx
├── hooks/
│   ├── useCookieConsent.test.js
│   ├── useNetworkStatus.test.js
│   └── useDocumentTitle.test.js
├── pages/
│   ├── Auth/
│   │   ├── ForgotPassword.test.jsx
│   │   └── ResetPassword.test.jsx
│   ├── Errors/
│   │   ├── NotFound.test.jsx
│   │   └── InternalError.test.jsx
│   └── Settings/
│       └── AccountSettings.test.jsx
```

### 14.2 Test Coverage Checklist

- [ ] **Cookie Consent:** Banner renders on first visit, hides after accept, stores in IndexedDB, analytics disabled when rejected
- [ ] **Modal:** Focus trap works, ESC closes, click outside closes, aria attributes correct
- [ ] **ConfirmDialog:** Require text validation works, confirm/cancel callbacks fire
- [ ] **Auth Forms:** Email validation, password strength meter, Firebase mock interactions, error states
- [ ] **Settings:** Tab navigation, form updates persist to IndexedDB, delete account confirmation flow
- [ ] **Error Pages:** Render correct messages, CTA buttons navigate correctly
- [ ] **Empty States:** Render props correctly, CTAs trigger callbacks
- [ ] **useNetworkStatus:** Simulate online/offline events, return correct values
- [ ] **useDocumentTitle:** Document title updates correctly, restores on unmount
- [ ] **Error Boundary:** Catches thrown errors, renders fallback UI

### 14.3 Sample Test Template

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Example: NotFound test
describe('NotFound', () => {
  it('renders 404 message and navigation links', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/gone offline for revision/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse subjects/i })).toBeInTheDocument();
  });
});
```

---

## 15. Offline Behavior Matrix

| Feature | Online Required | Offline Behavior |
|---------|----------------|------------------|
| Privacy Policy | No | Static route, fully cached |
| Terms & Conditions | No | Static route, fully cached |
| Cookie Preferences | No | Store locally only in IndexedDB |
| Forgot/Reset Password | Yes | Show offline message, queue request |
| Account Settings | Partial | Allow local changes, sync when online |
| Support Ticket | Partial | Save to IndexedDB, sync to Firestore later |
| Help Center | No | Static JSON, fully offline |
| 404/403/500 | No | Static pages, always available |
| Maintenance | No | Show overlay, allow offline study bypass |
| Loading States | No | N/A (UI only) |
| No Search Results | No | N/A (UI only) |

---

## 16. Final Notes for AI Agent

1. **Do NOT break existing features.** The app must remain fully functional after each phase.
2. **Do NOT add new external dependencies** without justification. Prefer built-in APIs.
3. **Do NOT change the authentication flow.** Firebase Auth remains optional.
4. **Preserve all existing AI streaming logic.** Enhance around it, do not replace it.
5. **Ensure all new components are accessible:** ARIA labels, keyboard navigation, focus management.
6. **Mobile-first responsive design** for all new UI components.
7. **Write tests BEFORE marking a feature complete.**
8. **Run `npm test` after each phase** and fix failures before proceeding.

---

> **END OF DOCUMENT**  
> This is a complete one-shot implementation guide. Feed this entire document to your AI coding agent and execute section by section.
