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
