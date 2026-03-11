const Terms = () => {
  return (
    <div className="container py-10 max-w-3xl prose prose-sm dark:prose-invert">
      <h1 className="text-3xl font-bold mb-2 not-prose">Terms of Service</h1>
      <p className="text-muted-foreground mb-8 not-prose">Last updated: March 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the Redeemr platform ("Service"), you agree to be bound by these Terms
        of Service. If you do not agree, please do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Redeemr provides a digital loyalty and rewards platform connecting customers with
        participating restaurants. Features include stamp cards, point accumulation, QR code
        scanning, reward redemption, and restaurant discovery.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials. You must
        provide accurate information during registration and keep it up to date. You may not share
        your account or QR code with others for the purpose of fraudulent reward collection.
      </p>

      <h2>4. Loyalty Rewards</h2>
      <p>
        Stamps, points, and rewards are issued at the sole discretion of participating restaurants.
        Redeemr facilitates the programme but is not responsible for the fulfilment of rewards.
        Rewards have no cash value and cannot be transferred, sold, or exchanged for currency.
        Restaurants may modify or discontinue their loyalty programmes at any time.
      </p>

      <h2>5. Restaurant Vendors</h2>
      <p>
        Vendors who sign up agree to honour rewards earned by customers through the platform.
        Vendors are responsible for the accuracy of their menu items, pricing, and promotions.
        Subscription fees are billed according to the selected plan and are non-refundable except
        where required by law.
      </p>

      <h2>6. Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>Attempt to manipulate stamps, points, or rewards fraudulently</li>
        <li>Interfere with or disrupt the Service's infrastructure</li>
        <li>Scrape, harvest, or collect data from the platform without permission</li>
        <li>Impersonate another user or entity</li>
      </ul>

      <h2>7. Intellectual Property</h2>
      <p>
        All content, branding, and technology on Redeemr are the property of Redeemr or its
        licensors. You may not reproduce, distribute, or create derivative works without prior
        written consent.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        Redeemr is provided "as is" without warranties of any kind. To the maximum extent permitted
        by law, Redeemr shall not be liable for any indirect, incidental, or consequential damages
        arising from your use of the Service.
      </p>

      <h2>9. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time for violations of these
        terms. Upon termination, any accumulated points or stamps may be forfeited.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the Service after changes
        constitutes acceptance of the revised terms.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms? Contact us at{" "}
        <a href="mailto:support@redeemr.app" className="text-primary">
          support@redeemr.app
        </a>
        .
      </p>
    </div>
  );
};

export default Terms;
