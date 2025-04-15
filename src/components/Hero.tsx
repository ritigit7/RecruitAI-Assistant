
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Clock } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(#4e73df 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block text-blue-primary xl:inline">RecruitAI : </span>
            <span className="block xl:inline">Automate Your Hiring Process</span>{' '}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-gray">
            Parse resumes and schedule interviews in one seamless workflow. 
            Save time, reduce manual effort, and focus on finding the best candidates.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-blue-primary hover:bg-blue-primary/90 text-white py-6 px-8 rounded-lg text-lg" variant="outline" onClick={() => window.location.href = '/parser'}>
              <FileText className="h-5 w-5 mr-2" />
              Parse Resume
            </Button>
            <Button variant="outline" className="py-6 px-8 rounded-lg text-lg" onClick={() => window.location.href = '/scheduler'} >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Interview
            </Button>
          </div>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="relative mx-auto mt-20 max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-md bg-blue-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Resume Parsing</h3>
            <p className="text-neutral-gray">
              Extract key information from resumes automatically with AI.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-md bg-blue-primary/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Interview Scheduling</h3>
            <p className="text-neutral-gray">
              Schedule interviews with just passinnng the prompt and intuitive calendar integration and automated notifications.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-md bg-blue-primary/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Complete History Tracking</h3>
            <p className="text-neutral-gray">
              Keep track of all candidate interactions, resumes, and interviews in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
