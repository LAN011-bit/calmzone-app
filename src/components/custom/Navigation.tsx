'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Users, Heart, Wind, Home } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/chat', icon: MessageCircle, label: 'Chat' },
    { href: '/mural', icon: Users, label: 'Mural' },
    { href: '/humor', icon: Heart, label: 'Humor' },
    { href: '/exercicios', icon: Wind, label: 'Calma' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? 'text-[#4A90E2]'
                    : 'text-gray-400 hover:text-[#4A90E2]'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
