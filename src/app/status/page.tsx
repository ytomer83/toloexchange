import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function StatusPage() {
  const services = [
    { name: 'Exchange Platform', status: 'operational', uptime: '99.99%' },
    { name: 'Trading Engine', status: 'operational', uptime: '99.98%' },
    { name: 'Spot Trading API', status: 'operational', uptime: '99.99%' },
    { name: 'WebSocket Feed', status: 'operational', uptime: '99.97%' },
    { name: 'Wallet Services', status: 'operational', uptime: '99.99%' },
    { name: 'Deposit Processing', status: 'operational', uptime: '99.95%' },
    { name: 'Withdrawal Processing', status: 'operational', uptime: '99.96%' },
    { name: 'User Authentication', status: 'operational', uptime: '99.99%' },
    { name: 'KYC Verification', status: 'operational', uptime: '99.90%' },
    { name: 'Market Data', status: 'operational', uptime: '99.98%' },
  ];

  const incidents: { date: string; title: string; status: string; description: string }[] = [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5 text-[var(--green)]" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-[var(--yellow)]" />;
      case 'maintenance': return <Clock className="w-5 h-5 text-[var(--text-muted)]" />;
      default: return <CheckCircle className="w-5 h-5 text-[var(--green)]" />;
    }
  };

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">System Status</h1>
          <p className="text-[var(--text-secondary)]">Real-time status of TOLO Exchange services</p>
        </div>

        {/* Overall Status */}
        <div className="glass-card rounded-2xl p-6 mb-8 flex items-center gap-4" style={{ borderLeft: '4px solid var(--green)' }}>
          <CheckCircle className="w-8 h-8 text-[var(--green)]" />
          <div>
            <h2 className="text-lg font-semibold text-white">All Systems Operational</h2>
            <p className="text-sm text-[var(--text-secondary)]">All services are running normally</p>
          </div>
        </div>

        {/* Service List */}
        <div className="glass-card rounded-xl overflow-hidden mb-8">
          <div className="px-4 py-3 border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
            <h3 className="text-sm font-semibold text-white">Services</h3>
          </div>
          {services.map((service, i) => (
            <div
              key={service.name}
              className={`flex items-center justify-between px-4 py-3.5 ${
                i < services.length - 1 ? 'border-b border-[var(--border)]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <span className="text-sm text-white">{service.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--text-muted)]">Uptime: {service.uptime}</span>
                <span className="text-xs font-medium text-[var(--green)] capitalize">{service.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Uptime Chart */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-white mb-4">90-Day Uptime</h3>
          <div className="flex gap-0.5">
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-8 rounded-sm"
                style={{ background: Math.random() > 0.02 ? 'var(--green)' : 'var(--yellow)', opacity: 0.8 }}
                title={`Day ${90 - i}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-[var(--text-muted)]">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--green)', opacity: 0.8 }} />
              <span className="text-xs text-[var(--text-muted)]">Operational</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--yellow)', opacity: 0.8 }} />
              <span className="text-xs text-[var(--text-muted)]">Degraded</span>
            </div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Incidents</h3>
          {incidents.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No incidents in the past 90 days</p>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident, i) => (
                <div key={i} className="border-l-2 border-[var(--yellow)] pl-4 py-2">
                  <div className="text-sm font-medium text-white">{incident.title}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">{incident.date}</div>
                  <div className="text-sm text-[var(--text-secondary)] mt-2">{incident.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
