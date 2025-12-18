import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Circle, Clock, Users, FileText, Video, Cake } from 'lucide-react';
import calendarService from '../services/calendarService';
import './Calendar.css';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filter, setFilter] = useState('all');

    const eventTypes = [
        { key: 'all', label: 'All Events', color: '#6366f1' },
        { key: 'event', label: 'Events', color: '#8b5cf6', icon: Cake },
        { key: 'holiday', label: 'Holidays', color: '#ef4444', icon: CalendarIcon },
        { key: 'meeting', label: 'Meetings', color: '#3b82f6', icon: Video },
        { key: 'leave', label: 'Leaves', color: '#f97316', icon: Users },
        { key: 'interview', label: 'Interviews', color: '#22c55e', icon: FileText },
    ];

    useEffect(() => {
        loadEvents();
    }, [currentDate, filter]);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            // Load events from multiple sources
            const [eventsRes, holidaysRes, meetingsRes, leavesRes] = await Promise.all([
                calendarService.getEvents({ year, month }),
                calendarService.getHolidays({ year, month }),
                calendarService.getMeetings({ year, month }),
                calendarService.getLeaves({ year, month, status: 'approved' })
            ]);

            const allEvents = [
                ...(eventsRes.data.data || []).map(e => ({ ...e, type: 'event', date: e.start_date || e.date })),
                ...(holidaysRes.data.data || []).map(e => ({ ...e, type: 'holiday', title: e.occasion || e.name })),
                ...(meetingsRes.data.data || []).map(e => ({ ...e, type: 'meeting', date: e.meeting_date || e.date })),
                ...(leavesRes.data.data?.data || leavesRes.data.data || []).map(e => ({
                    ...e,
                    type: 'leave',
                    title: `${e.staff_member?.full_name || 'Employee'} - Leave`,
                    date: e.start_date
                })),
            ];

            setEvents(allEvents);
        } catch (error) {
            console.error('Error loading events:', error);
            setEvents([]);
        }
        setLoading(false);
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const getEventsForDate = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => {
            const eventDate = new Date(e.date);
            const eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
            return eventDateStr === dateStr && (filter === 'all' || e.type === filter);
        });
    };

    const getEventColor = (type) => {
        const eventType = eventTypes.find(t => t.key === type);
        return eventType?.color || '#6366f1';
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDate(day);
            const isSelected = selectedDate === day;

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday(day) ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
                    onClick={() => setSelectedDate(day)}
                >
                    <span className="day-number">{day}</span>
                    {dayEvents.length > 0 && (
                        <div className="day-events">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                                <div
                                    key={idx}
                                    className="event-dot"
                                    style={{ backgroundColor: getEventColor(event.type) }}
                                    title={event.title || event.name}
                                ></div>
                            ))}
                            {dayEvents.length > 3 && <span className="more-events">+{dayEvents.length - 3}</span>}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="calendar-page">
            <div className="page-header">
                <div>
                    <h1>HR Calendar</h1>
                    <p className="breadcrumb">Calendar &gt; {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
                </div>
            </div>

            <div className="calendar-layout">
                {/* Sidebar - Event Types */}
                <div className="calendar-sidebar">
                    <h3>Event Types</h3>
                    <div className="event-filters">
                        {eventTypes.map(type => (
                            <button
                                key={type.key}
                                className={`filter-btn ${filter === type.key ? 'active' : ''}`}
                                onClick={() => setFilter(type.key)}
                            >
                                <Circle size={12} fill={type.color} color={type.color} />
                                <span>{type.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Selected Day Events */}
                    {selectedDate && (
                        <div className="selected-events">
                            <h4>Events on {monthNames[currentDate.getMonth()]} {selectedDate}</h4>
                            {selectedDateEvents.length === 0 ? (
                                <p className="no-events">No events</p>
                            ) : (
                                <div className="event-list">
                                    {selectedDateEvents.map((event, idx) => (
                                        <div key={idx} className="event-item" style={{ borderLeftColor: getEventColor(event.type) }}>
                                            <span className="event-type">{event.type}</span>
                                            <span className="event-title">{event.title || event.name || event.occasion}</span>
                                            {event.start_time && <span className="event-time"><Clock size={12} /> {event.start_time}</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Calendar */}
                <div className="calendar-main">
                    {/* Calendar Header */}
                    <div className="calendar-header">
                        <button className="nav-btn" onClick={() => navigateMonth(-1)}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <button className="nav-btn" onClick={() => navigateMonth(1)}>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="calendar-grid">
                        {/* Weekday Headers */}
                        <div className="weekday-header">Sun</div>
                        <div className="weekday-header">Mon</div>
                        <div className="weekday-header">Tue</div>
                        <div className="weekday-header">Wed</div>
                        <div className="weekday-header">Thu</div>
                        <div className="weekday-header">Fri</div>
                        <div className="weekday-header">Sat</div>

                        {/* Calendar Days */}
                        {loading ? (
                            <div className="loading-calendar">Loading...</div>
                        ) : (
                            renderCalendarDays()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
