import tls from 'node:tls';

export interface TlsInfo {
  issuer: string | null;
  validFrom: string | null;
  validTo: string | null;
  daysUntilExpiry: number | null;
}

export function analyzeTls(host: string, port = 443, timeout = 6000): Promise<TlsInfo | null> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (value: TlsInfo | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      resolve(value);
    };

    const timer = setTimeout(() => finish(null), timeout);

    const socket = tls.connect({ host, port, servername: host, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate();
      if (!cert || Object.keys(cert).length === 0) {
        finish(null);
        return;
      }

      const validTo = cert.valid_to ?? null;
      const daysUntilExpiry = validTo
        ? Math.round((new Date(validTo).getTime() - Date.now()) / 86_400_000)
        : null;

      const issuerO = cert.issuer?.O;
      const issuer = Array.isArray(issuerO) ? issuerO.join(', ') : (issuerO ?? null);

      finish({ issuer, validFrom: cert.valid_from ?? null, validTo, daysUntilExpiry });
    });

    socket.once('error', () => finish(null));
  });
}
