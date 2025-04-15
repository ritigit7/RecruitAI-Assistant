import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  FileText,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { getMeetings, getInterviewers, getResumes } from '@/services/api';

export function DashboardOverview() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [meetingsData, interviewersData, resumesData] = await Promise.all([
          getMeetings(),
          getInterviewers(),
          getResumes(),
        ]);
        setMeetings(meetingsData);
        setInterviewers(interviewersData);
        setResumes(resumesData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    }
    fetchData();
  }, []);

  // Calculate total hours of interviews
  const totalHours = meetings.reduce((sum, meeting) => sum + (meeting.duration || 1), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 pt-4">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-neutral-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumes.length}</div>
            <p className="text-xs text-neutral-gray mt-1">+{resumes.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 pt-4">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Users className="h-4 w-4 text-neutral-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewers.length}</div>
            <p className="text-xs text-neutral-gray mt-1">+{interviewers.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 pt-4">
            <CardTitle className="text-sm font-medium">Interviews and Meetings Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-neutral-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetings.length}</div>
            <p className="text-xs text-neutral-gray mt-1">+{meetings.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 pt-4">
            <CardTitle className="text-sm font-medium">Hours of Interviews</CardTitle>
            <Clock className="h-4 w-4 text-neutral-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-neutral-gray mt-1">Total scheduled hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-[400px]">
          <TabsTrigger value="upcoming">Upcoming Interviews</TabsTrigger>
          <TabsTrigger value="recent">Recent Resumes</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>
                You have {meetings.length} interviews scheduled.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {meetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 mr-3 rounded-full bg-blue-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{meeting.candidateName}</h4>
                        <p className="text-sm text-neutral-gray">{meeting.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{new Date(meeting.date).toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
                      <p className="text-sm text-neutral-gray">{meeting.time} ({meeting.duration} hrs)</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Resumes</CardTitle>
              <CardDescription>Recently processed candidate resumes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 mr-3 rounded-full bg-blue-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{resume.parsed_data?.Personal_Details?.Full_Name}</h4>
                        <p className="text-sm text-neutral-gray">{resume.position}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resume.skills?.slice(0, 3).map((skill: string, index: number) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{resume.date}</p>
                    </div>
                  </div>
                ))}
              
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}