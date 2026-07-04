'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Tổng quan' },
  { href: '/nhu-cau-anh', label: 'Nhu cầu ảnh' },
  { href: '/nguon', label: 'Nguồn' },
  { href: '/muc-tieu', label: 'Mục tiêu' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r bg-muted/30">
      <div className="px-4 py-5 border-b">
        <h1 className="text-lg font-semibold">NCA</h1>
        <p className="text-xs text-muted-foreground">Quản lý nhu cầu đặt ảnh</p>
      </div>
      <nav className="p-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-muted text-foreground/80',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
