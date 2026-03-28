export const nowIso = (): string => new Date().toISOString();

export const safeJsonParse = <T>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const maskEmail = (email: string): string => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0] ?? "*"}*@${domain}`;
  return `${name[0]}${"*".repeat(Math.max(name.length - 2, 1))}${name[name.length - 1]}@${domain}`;
};
