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
