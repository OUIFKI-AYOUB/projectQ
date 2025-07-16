'use client'; // Add this at the top

import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only access localStorage when mounted (client-side)
  const storedLocale = mounted ? localStorage.getItem('locale') || 'ar' : 'ar';

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      {/* Your not found content */}
    </div>
  );
}