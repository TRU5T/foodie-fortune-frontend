const Privacy = () => {
  return (
    <div className="container py-10 max-w-3xl prose prose-sm dark:prose-invert">
      <h1 className="text-3xl font-bold mb-2 not-prose">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8 not-prose">Last updated: March 2026</p>

      <h2>1. Introduction</h2>
      <p>
        Redeemr ("we", "us", "our") is committed to protecting your privacy. This policy explains
        how we collect, use, and safeguard your personal information when you use our platform.
      </p>

      <h2>2. Information We Collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>Name, email address, and phone number during registration</li>
        <li>Profile photo (optional)</li>
        <li>Messages sent through our contact form</li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>Device information and push notification tokens</li>
        <li>Usage data such as pages visited and features used</li>
        <li>QR code scan history for loyalty tracking</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide and maintain the loyalty rewards service</li>
        <li>Track and manage your stamps, points, and rewards</li>
        <li>Send push notifications about new rewards and promotions</li>
        <li>Communicate important service updates</li>
        <li>Improve and personalise your experience</li>
        <li>Prevent fraud and ensure platform security</li>
      </ul>

      <h2>4. Data Sharing</h2>
      <p>
        We do not sell your personal information. We share data only with:
      </p>
      <ul>
        <li>
          <strong>Participating restaurants</strong> — limited to what is necessary to provide
          loyalty services (e.g., your stamp count, reward eligibility)
        </li>
        <li>
          <strong>Service providers</strong> — third parties that help us operate the platform
          (hosting, analytics, push notification delivery)
        </li>
        <li>
          <strong>Legal requirements</strong> — when required by law or to protect our rights
        </li>
      </ul>

      <h2>5. Data Security</h2>
      <p>
        We use industry-standard security measures including encryption in transit (TLS), secure
        authentication, and row-level security policies on our database. However, no system is 100%
        secure, and we cannot guarantee absolute security.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your personal data for as long as your account is active or as needed to provide
        services. You may request deletion of your account and associated data at any time by
        contacting support.
      </p>

      <h2>7. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Withdraw consent for data processing</li>
        <li>Export your data in a portable format</li>
      </ul>

      <h2>8. Push Notifications</h2>
      <p>
        If you enable push notifications, we store your device token to deliver alerts about rewards,
        promotions, and account activity. You can disable notifications at any time through your
        device settings.
      </p>

      <h2>9. Cookies & Local Storage</h2>
      <p>
        We use browser local storage and session storage to maintain your authentication state and
        preferences. We do not use third-party tracking cookies.
      </p>

      <h2>10. Children's Privacy</h2>
      <p>
        Redeemr is not intended for children under 13. We do not knowingly collect information from
        children under 13. If we learn we have collected such data, we will delete it promptly.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. We will notify you of significant changes via
        email or in-app notification.
      </p>

      <h2>12. Contact</h2>
      <p>
        For privacy-related enquiries, contact us at{" "}
        <a href="mailto:support@redeemr.app" className="text-primary">
          support@redeemr.app
        </a>
        .
      </p>
    </div>
  );
};

export default Privacy;
