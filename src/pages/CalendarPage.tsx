import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Info, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageLayout } from '@/components/PageLayout';
import { getIndianHolidays } from '@/services/holidayApi';
import { getMeetings } from "@/services/api";
import { format, parseISO, isToday } from 'date-fns';

interface Meeting {
    _id: string;
    meeting_description: string;
    is_calendar_event: boolean;
    confidence_score?: number;
    title: string;
    datetime: string;
    date: string;
    time: string;
    duration_of_meeting: number;
    participants: string[];
    confirmation_message?: string;
    calendar_link?: string;
    start: string;
    end: string;
    description: string;
    type: 'meeting';
}

interface Holiday {
    name: string;
    date: Date;
    description?: string;
    type: 'holiday';
}

type CalendarEvent = Meeting | Holiday;

const CalendarView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [viewType, setViewType] = useState<'month' | 'day'>('month');
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [meetingsData, holidayData] = await Promise.all([
                    getMeetings(),
                    getIndianHolidays(2025)
                ]);

                const formattedMeetings = meetingsData.map((meeting: any) => ({
                    ...meeting,
                    date: parseISO(meeting.datetime),
                    type: 'meeting' as const
                }));

                setMeetings(formattedMeetings);
                setHolidays(holidayData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        setEvents([...meetings, ...holidays]);
    }, [meetings, holidays]);

    // Get the first day of the month for the calendar
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Calculate the starting day (might need to show days from previous month)
    const startDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Format date to display
    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Check if a date has events
    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = event.type === 'meeting' ? parseISO(event.datetime) : event.date;
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // View a specific date
    const viewDate = (date: Date) => {
        setSelectedDate(date);
        setViewType('day');
    };

    // Return to month view
    const backToMonthView = () => {
        setViewType('month');
        setSelectedDate(null);
    };

    // Get events for selected date
    const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

    // Handle event click
    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    // Render the month view calendar
    const renderMonthView = () => {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const days = [];
        const totalSlots = Math.ceil((startDay + daysInMonth) / 7) * 7;

        // Previous month days
        for (let i = 0; i < startDay; i++) {
            const prevMonthDay = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                -startDay + i + 1
            );
            days.push(
                <div key={`prev-${i}`} className="p-2 bg-gray-50 text-gray-400">
                    {prevMonthDay.getDate()}
                </div>
            );
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateEvents = getEventsForDate(date);
            const hasMeeting = dateEvents.some(event => event.type === 'meeting');
            const hasHoliday = dateEvents.some(event => event.type === 'holiday');

            days.push(
                <div
                    key={`current-${i}`}
                    className={`p-2 min-h-24 cursor-pointer hover:bg-blue-50 border border-gray-100 ${
                        isToday(date) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => viewDate(date)}
                >
                    <div className="flex justify-between items-start">
                        <span className={`font-medium ${isToday(date) ? 'text-blue-600' : ''}`}>
                            {i}
                        </span>
                        <div className="flex gap-1">
                            {hasMeeting && (
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                            {hasHoliday && (
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                            )}
                        </div>
                    </div>
                    <div className="mt-1 space-y-1">
                        {dateEvents.map((event, idx) => (
                            <div
                                key={idx}
                                className={`text-xs truncate p-1 rounded ${
                                    event.type === 'holiday'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}
                            >
                                {event.type === 'holiday' ? event.name : event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Next month days
        const remainingSlots = totalSlots - (startDay + daysInMonth);
        for (let i = 1; i <= remainingSlots; i++) {
            days.push(
                <div key={`next-${i}`} className="p-2 bg-gray-50 text-gray-400">
                    {i}
                </div>
            );
        }

        return (
            <div className="calendar-container">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {weekdays.map(day => (
                        <div key={day} className="text-center font-medium py-2 bg-gray-100">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        );
    };

    // Render the day view for a selected date
    const renderDayView = () => {
        if (!selectedDate) return null;

        return (
            <div className="day-view">
                <div className="mb-4 flex items-center">
                    <Button variant="outline" onClick={backToMonthView} className="mr-2">
                        <ChevronLeft size={16} />
                        Back
                    </Button>
                    <h3 className="text-lg font-medium">
                        {format(selectedDate, 'PPPP')}
                    </h3>
                </div>

                {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                        {selectedDateEvents.map((event, index) => (
                            <Card key={index} className={event.type === 'holiday' ? 'border-red-400' : 'border-blue-400'}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{event.type === 'holiday' ? event.name : event.title}</h4>
                                            {event.type === 'meeting' && (
                                                <>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {format(parseISO(event.start), 'p')} - {format(parseISO(event.end), 'p')}
                                                        {' '}({event.duration_of_meeting} hour{event.duration_of_meeting !== 1 ? 's' : ''})
                                                    </p>
                                                    {event.confidence_score && (
                                                        <p className="text-sm text-gray-600">
                                                            Confidence: {Math.round(event.confidence_score * 100)}%
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                            <Badge
                                                className={
                                                    event.type === 'holiday'
                                                        ? 'bg-red-100 text-red-800 hover:bg-red-200 mt-2'
                                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200 mt-2'
                                                }
                                            >
                                                {event.type === 'holiday' ? 'Holiday' : 'Meeting'}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEventClick(event)}
                                        >
                                            <Info size={16} />
                                        </Button>
                                    </div>
                                    
                                    {event.type === 'meeting' ? (
                                        <>
                                            <div className="mt-3">
                                                <p className="text-sm font-medium">Participants:</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {event.participants.map((participant, i) => (
                                                        <Badge key={i} variant="outline" className="bg-gray-50">
                                                            {participant}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm mt-2">{event.meeting_description}</p>
                                            {event.calendar_link && (
                                                <a 
                                                    href={event.calendar_link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline text-sm flex items-center mt-2"
                                                >
                                                    <LinkIcon className="h-3 w-3 mr-1" />
                                                    Join Meeting
                                                </a>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm mt-2">{event.description}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No events scheduled for this day
                    </div>
                )}
            </div>
        );
    };

    // Render the event details dialog
    const renderEventDetails = () => {
        if (!selectedEvent) return null;

        return (
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {selectedEvent.type === 'holiday' ? selectedEvent.name : selectedEvent.title}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-gray-500">Date</h3>
                                <p>
                                    {format(
                                        selectedEvent.type === 'meeting' 
                                            ? parseISO(selectedEvent.datetime) 
                                            : selectedEvent.date,
                                        'PPPP'
                                    )}
                                </p>
                            </div>
                            
                            {selectedEvent.type === 'meeting' && (
                                <>
                                    <div>
                                        <h3 className="font-medium text-gray-500">Time</h3>
                                        <p>
                                            {format(parseISO(selectedEvent.start), 'p')} - {format(parseISO(selectedEvent.end), 'p')}
                                            {' '}({selectedEvent.duration_of_meeting} hour{selectedEvent.duration_of_meeting !== 1 ? 's' : ''})
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-medium text-gray-500">Confidence Score</h3>
                                        <p>
                                            {selectedEvent.confidence_score 
                                                ? `${Math.round(selectedEvent.confidence_score * 100)}%` 
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-medium text-gray-500">Calendar Event</h3>
                                        <p>{selectedEvent.is_calendar_event ? 'Yes' : 'No'}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {selectedEvent.type === 'meeting' && selectedEvent.calendar_link && (
                            <div>
                                <h3 className="font-medium text-gray-500">Calendar Link</h3>
                                <a 
                                    href={selectedEvent.calendar_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline flex items-center"
                                >
                                    <LinkIcon className="h-4 w-4 mr-1" />
                                    Join Meeting
                                </a>
                            </div>
                        )}

                        <div>
                            <h3 className="font-medium text-gray-500">
                                {selectedEvent.type === 'meeting' ? 'Participants' : 'Description'}
                            </h3>
                            {selectedEvent.type === 'meeting' ? (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedEvent.participants.map((participant, i) => (
                                        <Badge key={i} variant="outline" className="bg-gray-50">
                                            {participant}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p>{selectedEvent.description}</p>
                            )}
                        </div>

                        {selectedEvent.type === 'meeting' && (
                            <>
                                <div>
                                    <h3 className="font-medium text-gray-500">Meeting Description</h3>
                                    <p>{selectedEvent.meeting_description}</p>
                                </div>
                                
                                {selectedEvent.confirmation_message && (
                                    <div className="bg-blue-50 p-3 rounded">
                                        <h3 className="font-medium text-gray-700">Confirmation Message</h3>
                                        <p>{selectedEvent.confirmation_message}</p>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <Badge
                                    className={selectedEvent.type === 'holiday'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }
                                >
                                    {selectedEvent.type === 'holiday' ? 'Holiday' : 'Meeting'}
                                </Badge>
                                
                                {selectedEvent.type === 'meeting' && (
                                    <div className="text-sm text-gray-500">
                                        Created: {format(parseISO(selectedEvent.datetime), 'PPpp')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <PageLayout title="Resume Parser">
            <div className="space-y-6">
                <Card className="w-full">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-2" />
                                <CardTitle>My Calendar</CardTitle>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={goToPreviousMonth}>
                                    <ChevronLeft size={16} />
                                </Button>
                                <div className="font-medium px-2">
                                    {formatMonth(currentDate)}
                                </div>
                                <Button variant="outline" onClick={goToNextMonth}>
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="sm">
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add Event
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Add new meeting or event feature coming soon!
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span className="text-sm">Meetings</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                <span className="text-sm">Holidays</span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {viewType === 'month' ? renderMonthView() : renderDayView()}
                        {renderEventDetails()}
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    );
};

export default CalendarView;