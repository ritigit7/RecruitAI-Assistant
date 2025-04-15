
import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Hero } from '@/components/Hero';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="bg-white">
      {/* This is our landing page - no PageLayout wrapper to have full-width hero */}
      <div className="min-h-screen font-nunito">
        <Hero />
        
        {/* CTA Section */}
        <div className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ready to transform your hiring process?</h2>
            <p className="mt-4 text-lg text-neutral-gray">
              Start using our resume parser and interview scheduler today.
            </p>
            <div className="mt-8">
              <Link to="/dashboard">
                <Button className="bg-blue-primary hover:bg-blue-primary/90 px-6 py-5 text-lg">
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-blue-primary">RecruitAI</h2>
                <p className="text-neutral-gray mt-2">Streamline your hiring process</p>
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
                <div>
                  <h3 className="font-semibold mb-2">Product</h3>
                  <ul className="space-y-2">
                    <li><Link to="/parser" className="text-neutral-gray hover:text-blue-primary">Resume Parser</Link></li>
                    <li><Link to="/scheduler" className="text-neutral-gray hover:text-blue-primary">Interview Scheduler</Link></li>
                    <li><Link to="/meetings" className="text-neutral-gray hover:text-blue-primary">Meeting History</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Resources</h3>
                  <ul className="space-y-2">
                    <li><Link to="#" className="text-neutral-gray hover:text-blue-primary">Documentation</Link></li>
                    <li><Link to="#" className="text-neutral-gray hover:text-blue-primary">Support</Link></li>
                    <li><Link to="#" className="text-neutral-gray hover:text-blue-primary">FAQ</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Company</h3>
                  <ul className="space-y-2">
                    <li><Link to="#" className="text-neutral-gray hover:text-blue-primary">About</Link></li>
                    <li><Link to="#" className="text-neutral-gray hover:text-blue-primary">Careers</Link></li>
                    <li><Link to="#" className="text-neutral-gray hover:text-blue-primary">Contact</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-8 text-center md:text-left">
              <p className="text-neutral-gray text-sm">
                © 2025 RecruitAI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
