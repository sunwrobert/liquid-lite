'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (href === '/trade' && (pathname === '/' || pathname.startsWith('/trade')));

  return (
    <Link
      className={cn(
        'px-2.5 py-2 transition-colors hover:text-highlight',
        isActive && 'text-highlight',
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
