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
