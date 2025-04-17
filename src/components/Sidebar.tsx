
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Calendar, Clock, Archive, Settings, Menu, X, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Resume Parser', href: '/parser', icon: FileText },
  { name: 'Interview Scheduler', href: '/scheduler', icon: Users },
  { name: 'Calendar View', href: '/calendar', icon: Calendar }, 
  { name: 'Meeting History', href: '/meetings', icon: Clock },
  { name: 'Resume Archive', href: '/archive', icon: Archive },
  { name: 'Settings', href: '/settings', icon: Settings },
];


export function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="text-blue-primary hover:bg-blue-primary hover:bg-opacity-10"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-blue-primary font-nunito">RecruitAI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-grow px-3 py-5 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-blue-primary text-white"
                          : "text-neutral-gray hover:text-blue-primary hover:bg-soft-gray"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-neutral-gray")} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-primary text-white flex items-center justify-center font-semibold">
                HR
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-dark-gray">HR Manager</p>
                <p className="text-xs text-neutral-gray">hr@aether.co.in</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
