import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Image as ImageIcon, ShoppingBag } from 'lucide-react';

interface ScrollSpySection {
  id: string;
  label: string;
  icon: React.ElementType;
  count?: number;
}

interface ReceiptScrollSpyProps {
  itemCount?: number;
}

export const ReceiptScrollSpy: React.FC<ReceiptScrollSpyProps> = React.memo(({ itemCount = 0 }) => {
  const [activeSection, setActiveSection] = useState<string>('section-summary');

  const sections: ScrollSpySection[] = [
    {
      id: 'section-summary',
      label: 'RINGKASAN',
      icon: BarChart3
    },
    {
      id: 'section-photo',
      label: 'FOTO & OCR',
      icon: ImageIcon
    },
    {
      id: 'section-products',
      label: 'DAFTAR PRODUK',
      icon: ShoppingBag,
      count: itemCount
    }
  ];

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      const summaryEl = document.getElementById('section-summary');
      const photoEl = document.getElementById('section-photo');
      const productsEl = document.getElementById('section-products');

      if (!summaryEl && !photoEl && !productsEl) {
        ticking = false;
        return;
      }

      // Fast detection using getBoundingClientRect relative to viewport threshold
      const threshold = 200;
      let nextSection = 'section-summary';

      if (productsEl && productsEl.getBoundingClientRect().top <= threshold) {
        nextSection = 'section-products';
      } else if (photoEl && photoEl.getBoundingClientRect().top <= threshold) {
        nextSection = 'section-photo';
      } else {
        nextSection = 'section-summary';
      }

      setActiveSection((prev) => (prev !== nextSection ? nextSection : prev));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;

    const navOffset = 100;
    const targetPosition =
      targetElement.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    });
  };

  return (
    <div className="sticky top-20 z-30 w-full mb-6 select-none pointer-events-auto">
      {/* Industrial Selector Rack - High performance opaque chassis without expensive backdrop-blur */}
      <div className="bg-[#e0e5ec] rounded-2xl p-1.5 shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] border border-white/60 flex items-center justify-between gap-1 sm:gap-2 max-w-xl mx-auto">
        <div className="flex items-center gap-1 sm:gap-1.5 w-full justify-between sm:justify-center">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                id={`scrollspy-btn-${section.id}`}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#ff4757] shadow-[2px_2px_5px_rgba(166,50,60,0.4),-2px_-2px_5px_rgba(255,100,110,0.4)] border border-white/20'
                    : 'text-[#4a5568] hover:text-[#2d3436] active:translate-y-[1px]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{section.label}</span>
                {section.count !== undefined && (
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? 'bg-black/20 text-white'
                        : 'bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] text-[#4a5568]'
                    }`}
                  >
                    {section.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
