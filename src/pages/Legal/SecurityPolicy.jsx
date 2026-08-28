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
