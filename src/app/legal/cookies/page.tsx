export default function CookiesPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Cookie Policy</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: January 1, 2025</p>

        <div className="glass-card rounded-2xl p-8 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">1. What Are Cookies</h2>
            <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">2. Types of Cookies We Use</h2>
            <ul className="space-y-3 mt-2">
              <li><strong className="text-[var(--text-primary)]">Essential Cookies:</strong> Required for the platform to function properly. These cannot be disabled.</li>
              <li><strong className="text-[var(--text-primary)]">Performance Cookies:</strong> Help us understand how visitors interact with the platform to improve performance.</li>
              <li><strong className="text-[var(--text-primary)]">Functional Cookies:</strong> Remember your preferences such as language and region.</li>
              <li><strong className="text-[var(--text-primary)]">Analytics Cookies:</strong> Collect anonymized data about platform usage for statistical analysis.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">3. Managing Cookies</h2>
            <p>You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">4. Contact</h2>
            <p>For questions about our use of cookies, please contact us at support@toloexchange.biz.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
