'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetchMe } from '@/lib/auth';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const me = await fetchMe().catch(() => null);
      if (cancelled) return;
      if (!me) {
        router.replace(`/account/login?next=${encodeURIComponent(pathname || '/upload')}`);
        return;
      }
      if (!me.is_admin) {
        router.replace('/');
        return;
      }
      setOk(true);
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Checking admin access…
      </div>
    );
  }

  return <>{children}</>;
}
