'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Image from 'next/image';
import logo from '@/public/just-holistics-logo.png';
import AuthButton from '../ui/AuthButton';

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: '/protocols', label: 'Protocols' },
    { href: '/threads', label: 'Threads' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-green-600">
          <Image src={logo} alt="Just Holistics Logo" width={150} height={60} />
        </Link>
        <div className="flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(l.href)
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}