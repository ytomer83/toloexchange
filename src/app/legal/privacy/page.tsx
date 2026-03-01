export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: January 1, 2025</p>

        <div className="glass-card rounded-2xl p-8 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
            <p>Simha Fintech Sp. z o.o. (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your personal data. This Privacy Policy explains how we collect, use, process, and protect your personal data when you use the TOLO Exchange platform.</p>
            <p className="mt-2">We comply with the General Data Protection Regulation (GDPR) and all applicable Polish data protection laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Data Controller</h2>
            <p>The data controller is Simha Fintech Sp. z o.o., registered at ul. Juliana Tuwima 48/11, 90-021 Łódź, Poland, KRS: 0001138948, NIP: 7252349639.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Data We Collect</h2>
            <p>We collect the following categories of personal data:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong className="text-white">Identity Data:</strong> Full name, date of birth, nationality, government-issued ID documents</li>
              <li><strong className="text-white">Contact Data:</strong> Email address, phone number, residential address</li>
              <li><strong className="text-white">Financial Data:</strong> Bank account details, transaction history, wallet addresses</li>
              <li><strong className="text-white">Technical Data:</strong> IP address, browser type, device information, login data</li>
              <li><strong className="text-white">Usage Data:</strong> Trading activity, platform interaction, feature usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. How We Use Your Data</h2>
            <p>We use your personal data for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Account registration and management</li>
              <li>KYC/AML compliance and identity verification</li>
              <li>Processing transactions and providing services</li>
              <li>Fraud prevention and security monitoring</li>
              <li>Customer support and communication</li>
              <li>Legal and regulatory compliance</li>
              <li>Platform improvement and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Legal Basis for Processing</h2>
            <p>We process your data based on:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Performance of a contract (providing our services)</li>
              <li>Legal obligations (AML/KYC compliance)</li>
              <li>Legitimate interests (fraud prevention, platform security)</li>
              <li>Your consent (marketing communications)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Data Retention</h2>
            <p>We retain your personal data for as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. AML/KYC records are retained for a minimum of 5 years after the end of the business relationship.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Your Rights</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request data erasure (&quot;right to be forgotten&quot;)</li>
              <li>Restrict processing of your data</li>
              <li>Data portability</li>
              <li>Object to processing</li>
              <li>Lodge a complaint with a supervisory authority (UODO in Poland)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data, including encryption, access controls, regular security audits, and employee training.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. International Transfers</h2>
            <p>Your data may be transferred to and processed in countries outside the EEA. We ensure adequate protection through Standard Contractual Clauses or other approved transfer mechanisms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Cookies</h2>
            <p>We use cookies and similar technologies as described in our Cookie Policy. You can manage cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Contact Us</h2>
            <p>For any questions about this Privacy Policy or to exercise your data rights, contact our Data Protection Officer:</p>
            <p className="mt-2">
              Email: info@simhafintech.com<br />
              Address: ul. Juliana Tuwima 48/11, 90-021 Łódź, Poland
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
