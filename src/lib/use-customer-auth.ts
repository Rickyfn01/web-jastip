'use client';

import { useEffect, useState } from 'react';

interface CustomerAuth {
  isLoggedIn: boolean;
  customerId: string | null;
  isLoading: boolean;
}

export function useCustomerAuth(): CustomerAuth {
  const [auth, setAuth] = useState<CustomerAuth>({
    isLoggedIn: false,
    customerId: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check if customer_session cookie exists by trying to fetch a protected endpoint
    // For now, we'll check localStorage as a client-side marker
    const sessionMarker = localStorage.getItem('customer_session_marker');
    const customerId = localStorage.getItem('customer_id');

    if (sessionMarker && customerId) {
      setAuth({
        isLoggedIn: true,
        customerId,
        isLoading: false,
      });
    } else {
      setAuth({
        isLoggedIn: false,
        customerId: null,
        isLoading: false,
      });
    }
  }, []);

  return auth;
}
