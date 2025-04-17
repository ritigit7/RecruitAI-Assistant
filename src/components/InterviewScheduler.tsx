// InterviewScheduler.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, MessageSquare, CalendarPlus, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { scheduleMeeting, getInterviewers, sendEmail } from '@/services/api';

interface InterviewSchedulerProps {
  extractedInfo?: any;
}

interface Interviewer {
  id: string;
  name: string;
  email: string;
  role: string;
  available: boolean;
}



const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ extractedInfo }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [interviewer, setInterviewer] = useState<string | undefined>(undefined);
  const [interviewerEmail, setInterviewerEmail] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>("");
  const [candidateName, setCandidateName] = useState<string>("");
  const [candidateEmail, setCandidateEmail] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [meetingInfo, setMeetingInfo] = useState<any>(null);
  const { toast } = useToast();

  // Time slots for the dropdown
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM"
  ];

  // Duration options
  const durationOptions = [
    { value: 0.5, label: "30 minutes" },
    { value: 1, label: "1 hour" },
    { value: 1.5, label: "1.5 hours" },
    { value: 2, label: "2 hours" }
  ];

  useEffect(() => {
    async function fetchInterviewers() {
      try {
        const data = await getInterviewers();
        const flattenedInterviewers = data.flatMap((team: any) =>
          team.sub_teams.flatMap((subTeam: any) =>
            subTeam.members.map((member: any) => ({
              id: member.email,  // Unique ID based on email
              name: member.name,
              email: member.email,
              role: subTeam.name, // Or assign a role here based on the team/subTeam info
              available: true // You can manage availability logic as needed
            }))
          )
        );
        setInterviewers(flattenedInterviewers);
      } catch (error) {
        console.error("Error fetching interviewers:", error);
        toast({
          title: "Error",
          description: "Failed to load interviewers data",
          variant: "destructive"
        });
      }
    }
    fetchInterviewers();
  }, [toast]);

  useEffect(() => {
    if (extractedInfo) {
      if (extractedInfo.datetime) {
        setDate(new Date(extractedInfo.datetime));
      }
      if (extractedInfo.time) {
        // Convert 24h time to 12h format for the select
        const [hours, minutes] = extractedInfo.time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        setTime(`${hour12}:${minutes} ${period}`);
      }
      if (extractedInfo.duration_of_meeting) {
        setDuration(extractedInfo.duration_of_meeting);
      }
      if (extractedInfo.participants && extractedInfo.participants.length > 1) {
        setCandidateEmail(extractedInfo.participants[0]);

        // Find interviewer by email
        const foundInterviewer = interviewers.find(i => i.email === extractedInfo.participants[1]);
        if (foundInterviewer) {
          setInterviewer(foundInterviewer.name);
          setInterviewerEmail(foundInterviewer.email);
        } else {
          setInterviewer(extractedInfo.participants[1]);
        }
      }
      if (extractedInfo.description) {
        setDescription(extractedInfo.description);
      }
      if (extractedInfo.title) {
        // Extract candidate name from title if possible
        const nameMatch = extractedInfo.title.match(/with (.+?) on|$/);
        if (nameMatch && nameMatch[1]) {
          setCandidateName(nameMatch[1]);
        }
      }
    }
  }, [extractedInfo, interviewers]);

  const handleScheduleInterview = async () => {
    if (!date || !time || !interviewer || !interviewerEmail || !candidateName || !candidateEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Convert date and time to ISO format
    const [hours, minutes] = time.split(':');
    const period = time.includes('PM') ? 'PM' : 'AM';
    let hour = parseInt(hours);
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const meetingDate = new Date(date);
    meetingDate.setHours(hour);
    meetingDate.setMinutes(parseInt(minutes));
    const isoDateTime = meetingDate.toISOString();

    setIsLoading(true);

    try {
      // Prepare meeting data
      const meetingData = {
        title: `Interview with ${candidateName}`,
        datetime: isoDateTime,
        duration_of_meeting: duration,
        participants: [candidateEmail, interviewerEmail],
        description: description || `Interview for ${candidateName}`,
        meeting_description: description || `Interview for ${candidateName}`,
        location: "Virtual Meeting",
        is_calendar_event: false,
        confidence_score: 0.95,
        date: format(date, 'yyyy-MM-dd'),
        time: time,
        confirmation_message: `You are scheduled for an interview on ${format(date, 'PPP')} at ${time}.`,
        calendar_link: null,
        start: isoDateTime,
        end: new Date(new Date(isoDateTime).getTime() + duration * 60 * 60 * 1000).toISOString(),
      };

      // Schedule the meeting and get the response
      const meetingResponse = await scheduleMeeting(meetingData);
      setMeetingInfo(meetingResponse);

      // Send email notification with meeting details
      const emailSubject = `Interview Invitation: ${format(date, 'PPP')} at ${time}`;
      const emailText = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #2c3e50; margin-bottom: 15px;">Dear ${candidateName},</h2>
        <p style="margin-bottom: 20px;">${meetingResponse.confirmation_message || `You are invited to an interview with <strong>${interviewer}</strong>!`}</p>
        <h3 style="color: #34495e; margin-bottom: 10px;">Meeting Details:</h3>
        <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
          <li style="margin-bottom: 10px;"><strong>Title:</strong> ${meetingResponse.title || meetingData.title}</li>
          <li style="margin-bottom: 10px;"><strong>Time:</strong> ${format(parseISO(meetingResponse.datetime || isoDateTime), 'PPPp')}</li>
          <li style="margin-bottom: 10px;"><strong>Duration:</strong> ${meetingResponse.duration_of_meeting || duration} ${duration === 1 ? 'hour' : 'hours'}</li>
          ${meetingResponse.calendar_link ? `<li style="margin-bottom: 10px;"><strong>Calendar Link:</strong> <a href="${meetingResponse.calendar_link}" style="color: #3498db; text-decoration: none;">${meetingResponse.calendar_link}</a></li>` : ''}
        </ul>
        <p style="margin-bottom: 20px;">${meetingResponse.meeting_description || description || ''}</p>
        <p style="margin-top: 20px; font-weight: bold;">Best regards,<br/><strong>RecruitAI Team</strong></p>
      </div>
    `;
      const emailInterviewrText = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #2c3e50; margin-bottom: 15px;">Dear ${interviewer},</h2>
        <p style="margin-bottom: 20px;">${meetingResponse.confirmation_message || `You are invited to an interview with <strong>${candidateName}</strong>!`}</p>
        <h3 style="color: #34495e; margin-bottom: 10px;">Meeting Details:</h3>
        <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
          <li style="margin-bottom: 10px;"><strong>Title:</strong> ${meetingResponse.title || meetingData.title}</li>
          <li style="margin-bottom: 10px;"><strong>Time:</strong> ${format(parseISO(meetingResponse.datetime || isoDateTime), 'PPPp')}</li>
          <li style="margin-bottom: 10px;"><strong>Duration:</strong> ${meetingResponse.duration_of_meeting || duration} ${duration === 1 ? 'hour' : 'hours'}</li>
          ${meetingResponse.calendar_link ? `<li style="margin-bottom: 10px;"><strong>Calendar Link:</strong> <a href="${meetingResponse.calendar_link}" style="color: #3498db; text-decoration: none;">${meetingResponse.calendar_link}</a></li>` : ''}
        </ul>
        <p style="margin-bottom: 20px;">${meetingResponse.meeting_description || description || ''}</p>
        <p style="margin-top: 20px; font-weight: bold;">Best regards,<br/><strong>RecruitAI Team</strong></p>
      </div>
      `;

      await sendEmail({
        recipients: [candidateEmail],
        subject: emailSubject,
        text: emailText
      });
      await sendEmail({
        recipients: [interviewerEmail],
        subject: emailSubject,
        text: emailInterviewrText
      });

      toast({
        title: meetingResponse.title || "Interview Scheduled!",
        description: meetingResponse.confirmation_message ||
          `Interview with ${candidateName} scheduled successfully for ${format(parseISO(meetingResponse.datetime || isoDateTime), 'PPPp')}`,
      });

    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling the interview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format time from 24h to 12h format
  const formatTimeFromAPI = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const handleInterviewerChange = (value: string) => {
    const selectedInterviewer = interviewers.find(i => i.name === value);
    if (selectedInterviewer) {
      setInterviewer(selectedInterviewer.name);
      setInterviewerEmail(selectedInterviewer.email);
    }
  };

  const getInterviewerFromMeeting = () => {
    if (!meetingInfo) return null;

    if (meetingInfo.participants && meetingInfo.participants.length > 1) {
      const interviewerEmail = meetingInfo.participants.find((p: string) => p !== candidateEmail);
      return interviewers.find(i => i.email === interviewerEmail)?.name || interviewerEmail;
    }

    return null;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Scheduling Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <CalendarPlus className="mr-2 h-5 w-5 text-blue-primary" />
            Schedule Interview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Candidate Details */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Candidate Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="candidateName">Name</Label>
                <Input
                  id="candidateName"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter candidate name"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="candidateEmail">Email</Label>
                <Input
                  id="candidateEmail"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="Enter candidate email"
                  type="email"
                />
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-1">
            <Label>Interview Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time & Duration Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="time">Interview Time</Label>
              <Select onValueChange={(value) => setTime(value)} value={time}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="duration">Duration</Label>
              <Select
                onValueChange={(value) => setDuration(parseFloat(value))}
                value={duration.toString()}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="1 hour" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Interviewer Selection */}
          <div className="space-y-1">
            <Label htmlFor="interviewer">Interviewer</Label>
            <Select onValueChange={handleInterviewerChange} value={interviewer}>
              <SelectTrigger id="interviewer">
                <SelectValue placeholder="Select interviewer" />
              </SelectTrigger>
              <SelectContent>
                {interviewers.map((interviewer) => (
                  <SelectItem
                    key={interviewer.id}
                    value={interviewer.name}
                    disabled={!interviewer.available}
                  >
                    {interviewer.name} - {interviewer.role} {!interviewer.available && "(Unavailable)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interview Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Interview Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the interview (position, topics to cover, etc.)"
              rows={3}
            />
          </div>

          <Button
            onClick={handleScheduleInterview}
            className="w-full bg-blue-primary hover:bg-blue-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Interview Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-5 bg-gray-50">
            {(date && time && interviewer) || meetingInfo ? (
              <div className="space-y-4">
                {/* Header with title and status */}
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">
                    {meetingInfo?.title || `Interview with ${candidateName || "Candidate"}`}
                  </h3>
                  <span className="px-2 py-1 bg-blue-primary text-white text-xs rounded-full">
                    {meetingInfo?.is_calendar_event ? "Calendar Event" : "Scheduled"}
                  </span>
                </div>

                {/* Confidence score if available */}
                {meetingInfo?.confidence_score && (
                  <div className="text-sm text-neutral-gray">
                    <span className="font-medium">Confidence:</span> {Math.round(meetingInfo.confidence_score * 100)}%
                  </div>
                )}

                {/* Main meeting details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date and Time Section */}
                  <div className="space-y-3">
                    <div className="flex items-center text-neutral-gray">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p>
                          {meetingInfo?.date ? format(parseISO(meetingInfo.date), "PPPP") :
                            date ? format(date, "PPPP") : "Not selected"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-neutral-gray">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p>
                          {meetingInfo?.time ? formatTimeFromAPI(meetingInfo.time) :
                            time || "Not selected"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-neutral-gray">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p>
                          {meetingInfo?.duration_of_meeting || duration} {duration === 1 ? 'hour' : 'hours'}
                        </p>
                      </div>
                    </div>

                    {meetingInfo?.location && (
                      <div className="flex items-center text-neutral-gray">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p>{meetingInfo.location || "Virtual Meeting"}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Participants Section */}
                  <div className="space-y-3">
                    <div className="flex items-start text-neutral-gray">
                      <Users className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Participants</p>
                        <div className="space-y-1">
                          <p>
                            <span className="font-medium">Candidate:</span> {candidateName || "Not provided"}
                            <br />
                            <span className="text-sm">{candidateEmail || "No email provided"}</span>
                          </p>
                          <p>
                            <span className="font-medium">Interviewer:</span> {getInterviewerFromMeeting() || interviewer || "Not selected"}
                            <br />
                            {interviewerEmail && <span className="text-sm">{interviewerEmail}</span>}
                          </p>
                        </div>
                      </div>
                    </div>

                    {(meetingInfo?.meeting_description || description) && (
                      <div className="flex items-start text-neutral-gray">
                        <MessageSquare className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Description</p>
                          <p>{meetingInfo?.meeting_description || description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional meeting details */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Additional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Start Time</p>
                      <p>
                        {meetingInfo?.start ? format(parseISO(meetingInfo.start), "PPPpp") :
                          date && time ? `${format(date, "PPP")} at ${time}` : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">End Time</p>
                      <p>
                        {meetingInfo?.end ? format(parseISO(meetingInfo.end), "PPPpp") :
                          date && time ? `${format(date, "PPP")} at ${formatTimeFromAPI(
                            new Date(new Date(`${format(date, "yyyy-MM-dd")} ${time}`).getTime() + duration * 60 * 60 * 1000).toISOString()
                          )}` : "Not specified"}
                      </p>
                    </div>
                    {meetingInfo?.calendar_link && (
                      <div className="md:col-span-2">
                        <p className="font-medium">Calendar Link</p>
                        <a
                          href={meetingInfo.calendar_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <Link className="h-4 w-4 mr-1" />
                          {meetingInfo.calendar_link}
                        </a>
                      </div>
                    )}
                    {meetingInfo?.confirmation_message && (
                      <div className="md:col-span-2">
                        <p className="font-medium">Confirmation Message</p>
                        <p className="italic">{meetingInfo.confirmation_message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-neutral-gray">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-blue-primary opacity-50" />
                <h3 className="text-lg font-medium mb-1">No Interview Scheduled</h3>
                <p className="text-sm">
                  Fill out the form to see the interview details here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewScheduler;