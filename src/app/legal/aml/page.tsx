export default function AMLPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-white mb-2">Anti-Money Laundering (AML) Policy</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: January 1, 2025</p>

        <div className="glass-card rounded-2xl p-8 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Purpose</h2>
            <p>This Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) Policy outlines the procedures and controls that Polarbit Solutions Limited implements to detect, prevent, and report money laundering, terrorist financing, and other financial crimes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Regulatory Framework</h2>
            <p>Our AML/CTF program is designed in compliance with:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA)</li>
              <li>FINTRAC regulations and guidance</li>
              <li>FATF (Financial Action Task Force) Recommendations</li>
              <li>Canadian sanctions regulations</li>
              <li>Applicable provincial regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Know Your Customer (KYC)</h2>
            <p>All users must complete identity verification before accessing our services. Our KYC procedures include:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong className="text-white">Identity Verification:</strong> Government-issued photo ID (passport, national ID, or driver&apos;s license)</li>
              <li><strong className="text-white">Address Verification:</strong> Proof of residential address (utility bill, bank statement, or government letter)</li>
              <li><strong className="text-white">Enhanced Due Diligence:</strong> Additional verification for high-risk customers, including source of funds documentation</li>
              <li><strong className="text-white">Ongoing Monitoring:</strong> Continuous monitoring of customer transactions and activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Customer Due Diligence (CDD)</h2>
            <p>We perform CDD at the following stages:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>During account registration</li>
              <li>When a transaction exceeds CAD 1,000</li>
              <li>When there is suspicion of money laundering or terrorist financing</li>
              <li>When there are doubts about previously obtained identification data</li>
              <li>On an ongoing basis throughout the business relationship</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Transaction Monitoring</h2>
            <p>We employ automated and manual transaction monitoring to identify suspicious activities, including:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Unusual transaction patterns or volumes</li>
              <li>Transactions inconsistent with customer profile</li>
              <li>Rapid movement of funds (layering)</li>
              <li>Transactions involving high-risk jurisdictions</li>
              <li>Structuring of transactions to avoid reporting thresholds</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Sanctions Screening</h2>
            <p>All customers are screened against relevant sanctions lists, including Canadian, UN, OFAC, and other applicable sanctions lists. Screening is performed at onboarding and on an ongoing basis.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Politically Exposed Persons (PEPs)</h2>
            <p>We identify and apply enhanced due diligence to Politically Exposed Persons, their family members, and known close associates, in accordance with applicable regulations.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Suspicious Activity Reporting</h2>
            <p>We report suspicious transactions to FINTRAC (Financial Transactions and Reports Analysis Centre of Canada). All employees are trained to identify and escalate suspicious activities. We do not inform customers that a report has been or is being made.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Record Keeping</h2>
            <p>We maintain records of all customer identification documents, transaction records, and compliance documentation for a minimum of 5 years after the end of the business relationship, or as otherwise required by law.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Employee Training</h2>
            <p>All employees receive regular AML/CTF training, including identification of suspicious activities, regulatory updates, and internal procedures. Training records are maintained and reviewed annually.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Contact</h2>
            <p>For questions regarding this AML Policy, contact our Compliance Department:</p>
            <p className="mt-2">
              Email: support@toloexchange.biz<br />
              Address: 700-838 W Hastings Street, Vancouver, BC V6C 0A6, Canada
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
