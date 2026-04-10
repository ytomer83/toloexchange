export default function TermsPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: January 1, 2025</p>

        <div className="glass-card rounded-2xl p-8 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
            <p>Welcome to TOLO Exchange (&quot;Platform&quot;), operated by Polarbit Solutions Limited (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a FINTRAC registered MSB (FINTRAC MSB: C10001398, Incorporation No: BC1547199), with its registered office at 700-838 W Hastings Street, Vancouver, BC V6C 0A6, Canada.</p>
            <p className="mt-2">By accessing or using our Platform, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, please do not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Eligibility</h2>
            <p>To use our Platform, you must:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
              <li>Not be a resident of any restricted jurisdiction</li>
              <li>Complete the Know Your Customer (KYC) verification process</li>
              <li>Provide accurate and complete registration information</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Account Registration</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other security breach.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Services</h2>
            <p>Our Platform provides the following services:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Cryptocurrency spot trading</li>
              <li>Token swapping</li>
              <li>Digital asset wallet services</li>
              <li>Market data and analytics</li>
            </ul>
            <p className="mt-2">We reserve the right to modify, suspend, or discontinue any service at any time with or without notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Trading Rules</h2>
            <p>All trades executed on the Platform are final and irreversible. You acknowledge and accept the risks involved in trading digital assets, including but not limited to market volatility, liquidity risk, and technology risk.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Fees</h2>
            <p>TOLO charges 0% fees on all swaps — every currency is completely free to swap. Users are responsible for any network gas fees imposed by the underlying blockchain. We reserve the right to change our fee structure at any time with prior notice to users.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Deposits and Withdrawals</h2>
            <p>You may deposit and withdraw digital assets subject to our processing times and minimum/maximum limits. We are not responsible for any loss arising from incorrect deposit or withdrawal addresses provided by you.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Use the Platform for any illegal activity, including money laundering or terrorist financing</li>
              <li>Manipulate or attempt to manipulate the market</li>
              <li>Use automated systems or bots without authorization</li>
              <li>Circumvent any security measures or access restrictions</li>
              <li>Provide false, misleading, or inaccurate information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Risk Disclosure</h2>
            <p>Trading in digital assets involves significant risk of loss. The value of digital assets can fluctuate widely and may result in significant losses. You should only trade with funds you can afford to lose. Past performance is not indicative of future results.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, Polarbit Solutions Limited and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of Canada. Any disputes shall be resolved in the competent courts of Vancouver, Canada.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Contact</h2>
            <p>For questions regarding these Terms, please contact us at:</p>
            <p className="mt-2">
              Polarbit Solutions Limited<br />
              700-838 W Hastings Street, Vancouver, BC V6C 0A6, Canada<br />
              Email: support@toloexchange.biz<br />
              Support: support@toloexchange.biz
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
