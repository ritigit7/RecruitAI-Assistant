import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-nunito">
      <Sidebar />

      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header
          className={cn(
            "sticky top-0 z-30 w-full bg-white shadow-sm transition-all duration-300",
            scrolled ? "py-2" : "py-4"
          )}
        >
          <div className="px-4 md:px-6 flex justify-between items-center relative">
            {title && <h1 className="text-xl md:text-2xl font-bold text-blue-primary">{title}</h1>}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-neutral-gray hover:text-blue-primary">
                <Bell size={20} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-gray hover:text-blue-primary"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <User size={20} />
              </Button>

              {isProfileOpen && (
                <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-64">
                  <p className="font-bold text-gray-800">User Profile</p>
                  <p className="text-sm text-gray-600">user@example.com</p>
                  <button
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-gray-200 text-center text-sm text-neutral-gray">
          <p>© 2025 RecruitAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
