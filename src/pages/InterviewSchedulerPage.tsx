// InterviewSchedulerPage.tsx
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { scheduleMeeting } from '@/services/api';
import InterviewScheduler from '@/components/InterviewScheduler';

const InterviewSchedulerPage = () => {
  const [meetingText, setMeetingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<any>(null);
  const { toast } = useToast();

  const handleExtractInfo = async () => {
    if (!meetingText.trim()) {
      toast({
        title: "Error",
        description: "Please enter meeting details to extract",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const response = await scheduleMeeting({ text: meetingText });

      if (response.error) {
        throw new Error(response.error);
      }

      setExtractedInfo(response);
      toast({
        title: "Information Extracted!",
        description: "Meeting details have been extracted successfully",
      });
    } catch (error) {
      console.error("Error extracting meeting info:", error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to extract meeting information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Interview Scheduler">
      {/* Header + Input + Button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Schedule an Interview</h1>
          <p className="text-neutral-gray">
            Set up interviews with candidates by prompt or manually.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-2/3">
          <Input
            type="text"
            placeholder="Example: Schedule interview with John Doe on Friday at 3pm for 1 hour. Participants: john@email.com, interviewer@company.com"
            value={meetingText}
            onChange={(e) => setMeetingText(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleExtractInfo}
            disabled={loading}
            className="w-[150px]"
          >
            {loading ? 'Processing...' : 'Extract Info'}
          </Button>
        </div>
      </div>

      {/* Interview Scheduler Calendar */}
      <InterviewScheduler extractedInfo={extractedInfo} />
    </PageLayout>
  );
};

export default InterviewSchedulerPage;



