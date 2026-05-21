import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer border-t border-white/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-10 w-[190px]">
                <Image
                  src="/images/brand/brand-wordmark.jpg"
                  alt=""
                  fill
                  sizes="190px"
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-mist mb-4 leading-7">
              AI automation infrastructure for the future of ANZ business.
            </p>
            <p className="text-mist/70">
              (c) 2026 Magic Lab. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/ai-workflow-automation" className="text-mist hover:text-white transition-colors">
                  AI Workflow Automation
                </Link>
              </li>
              <li>
                <Link href="/ai-seo-geo-growth-systems" className="text-mist hover:text-white transition-colors">
                  AI SEO / GEO
                </Link>
              </li>
              <li>
                <Link href="/magic-engine" className="text-mist hover:text-white transition-colors">
                  Magic Engine
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-mist hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/work" className="text-mist hover:text-white transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-mist hover:text-white transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/magic-engine#magic-engine-interest" className="text-mist hover:text-white transition-colors">
                  Investor Interest
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-mist hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-mist mb-2">
              Email: grace.gu@magiclab.nz
            </p>
            <p className="text-mist mb-2">
              Phone: +61 499 451 794
            </p>
            <p className="text-mist">
              Auckland / Australia / New Zealand
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
