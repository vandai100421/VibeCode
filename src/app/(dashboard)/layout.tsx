import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { QueryProvider } from '@/lib/query-provider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </QueryProvider>
  );
}
