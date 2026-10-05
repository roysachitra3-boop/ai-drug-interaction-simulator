/**
 * localStorage access that never throws. Some browsers/PCs (private mode,
 * blocked third-party storage, locked-down desktops) throw a SecurityError on
 * simple reads, which would otherwise crash the whole page.
 */
export function getStored(key: string): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStored(key: string, value: string): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — ignore */
  }
}

export function removeStored(key: string): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable — ignore */
  }
}
