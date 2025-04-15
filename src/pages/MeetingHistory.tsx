import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, Search, Filter, User, Calendar, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getMeetings } from "@/services/api";
import { parseISO, isBefore, isAfter, format } from 'date-fns';

const MeetingHistory = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const data = await getMeetings();
        setMeetings(data);
      } catch (error) {
        console.error("Failed to fetch meetings", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMeetings();
  }, []);

  // Categorize meetings based on date and status
  const categorizeMeetings = () => {
    const now = new Date();
    
    return meetings.filter(meeting => {
      // Filter by search term if one exists
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          meeting.title?.toLowerCase().includes(searchLower) ||
          meeting.meeting_description?.toLowerCase().includes(searchLower) ||
          meeting.participants?.some((p: string) => p.toLowerCase().includes(searchLower))
        );
      }
      return true;
    }).reduce((acc, meeting) => {
      const meetingDate = meeting.datetime ? parseISO(meeting.datetime) : null;
      
      if (meeting.status?.toLowerCase() === 'canceled') {
        acc.canceled.push(meeting);
      } else if (meetingDate && isBefore(meetingDate, now)) {
        acc.completed.push(meeting);
      } else if (meetingDate && isAfter(meetingDate, now)) {
        acc.scheduled.push(meeting);
      } else {
        acc.other.push(meeting);
      }
      
      return acc;
    }, {
      scheduled: [] as any[],
      completed: [] as any[],
      canceled: [] as any[],
      other: [] as any[],
    });
  };

  const { scheduled, completed, canceled, other } = categorizeMeetings();

  if (loading) {
    return <div className="p-6">Loading meetings...</div>;
  }

  return (
    <PageLayout title="Meeting History">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Interview History</h1>
            <p className="text-neutral-gray">
              View and manage your past and upcoming interviews.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-blue-primary hover:bg-blue-primary/90" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule New
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-gray" />
          <Input
            placeholder="Search meetings by candidate, position, or interviewer..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>

          {/* All Meetings */}
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...scheduled, ...completed, ...canceled, ...other].map((meeting) => (
                <MeetingCard key={meeting._id} meeting={meeting} />
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Meetings */}
          <TabsContent value="scheduled" className="mt-4">
            {scheduled.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {scheduled.map((meeting) => (
                  <MeetingCard key={meeting._id} meeting={meeting} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-neutral-gray">
                <Calendar className="h-12 w-12 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No Upcoming Meetings</h3>
                <p className="text-sm">
                  You don't have any scheduled meetings at this time.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Completed Meetings */}
          <TabsContent value="completed" className="mt-4">
            {completed.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {completed.map((meeting) => (
                  <MeetingCard key={meeting._id} meeting={meeting} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-neutral-gray">
                <Clock className="h-12 w-12 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No Completed Meetings</h3>
                <p className="text-sm">
                  Your completed meetings will appear here.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Canceled Meetings */}
          <TabsContent value="canceled" className="mt-4">
            {canceled.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {canceled.map((meeting) => (
                  <MeetingCard key={meeting._id} meeting={meeting} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-neutral-gray">
                <Clock className="h-12 w-12 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No Canceled Meetings</h3>
                <p className="text-sm">
                  You haven't canceled any meetings.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

const MeetingCard = ({ meeting }: { meeting: any }) => {
  const statusColor = {
    completed: "bg-green-100 text-green-800",
    scheduled: "bg-blue-100 text-blue-800",
    canceled: "bg-red-100 text-red-800",
  };

  // Format date and time nicely
  const formattedDate = meeting.datetime 
    ? format(parseISO(meeting.datetime), 'MMM d, yyyy')
    : meeting.date || 'No date';
  
  const formattedTime = meeting.datetime 
    ? format(parseISO(meeting.datetime), 'h:mm a')
    : meeting.time || 'No time';

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Left: Meeting Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-blue-primary/10 rounded-full flex items-center justify-center mt-1">
                <User className="h-5 w-10 text-blue-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{meeting.title}</h3>
                <p className="text-neutral-gray">{meeting.meeting_description}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-neutral-gray">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formattedTime}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{meeting.participants?.join(', ')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Duration: {meeting.duration_of_meeting} hour(s)</span>
                  </div>
                  {meeting.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Location: {meeting.location}</span>
                    </div>
                  )}
                </div>

                {meeting.notes && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium">Notes:</p>
                    <p className="text-neutral-gray">{meeting.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Status and Actions */}
          <div className="flex flex-col items-end justify-between">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColor[meeting.status?.toLowerCase() as keyof typeof statusColor] ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {meeting.status || "Not Set"}
            </span>

            <div className="flex gap-2 mt-4 md:mt-0">
              {meeting.status?.toLowerCase() === "scheduled" && (
                <>
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button variant="destructive" size="sm">Cancel</Button>
                </>
              )}
              {/* <Button variant="outline" size="sm">View Details</Button> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingHistory;