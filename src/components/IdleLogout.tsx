'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 menit dalam milidetik

export default function IdleLogout() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const performLogout = useCallback(async () => {
    try {
      await fetch('/api/customers/logout', { method: 'POST' });
    } catch {
      // Ignore fetch errors during logout
    }
    localStorage.removeItem('customer_session_marker');
    localStorage.removeItem('customer_id');
    router.push('/login?reason=idle');
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(performLogout, IDLE_TIMEOUT);
  }, [performLogout]);

  useEffect(() => {
    // Hanya jalankan jika user sedang login
    const sessionMarker = localStorage.getItem('customer_session_marker');
    if (!sessionMarker) return;

    // Events yang dianggap sebagai "aktivitas"
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Mulai timer pertama kali
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  return null; // Komponen tidak merender apapun
}
