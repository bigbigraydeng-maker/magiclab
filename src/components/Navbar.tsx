'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/magic-engine', label: 'Magic Engine' },
  { href: '/magic-engine#magic-engine-interest', label: 'Investor' },
  { href: '/insights', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-5">
        <Link href="/" aria-label="Magic Lab home" className="relative block h-9 w-[170px]" onClick={() => setOpen(false)}>
            <Image
              src="/images/brand/brand-wordmark.jpg"
              alt=""
              fill
              sizes="170px"
              className="object-contain object-left"
              priority
            />
        </Link>

        <div className="hidden md:flex items-center space-x-5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-silver/75 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="hidden lg:inline-flex btn-secondary rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Book Strategy Call
        </Link>

        <div className="md:hidden">
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-white p-2 -mr-2"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-primary/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-silver/80 hover:text-white hover:bg-white/5 transition-colors px-3 py-3 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 rounded-lg px-3 py-3 text-center font-semibold"
            >
              Book Strategy Call
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
