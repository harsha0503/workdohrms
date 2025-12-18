import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Plus, MapPin, Clock } from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { format } from 'date-fns';
import './Events.css';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [activeTab, setActiveTab] = useState('events');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'events') {
                const response = await eventsService.getEvents();
                setEvents(response.data.data.data || []);
            } else {
                const response = await eventsService.getHolidays();
                setHolidays(response.data.data.data || []);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTime) => {
        return format(new Date(dateTime), 'MMM dd, yyyy hh:mm a');
    };

    const formatDate = (date) => {
        return format(new Date(date), 'MMMM dd, yyyy');
    };

    return (
        <div className="events-page">
            <div className="page-header">
                <div>
                    <h1>Events & Holidays</h1>
                    <p>Company events and holiday calendar</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Add {activeTab === 'events' ? 'Event' : 'Holiday'}
                </button>
            </div>

            <div className="card">
                <div className="org-tabs">
                    <button
                        className={activeTab === 'events' ? 'active' : ''}
                        onClick={() => setActiveTab('events')}
                    >
                        <CalendarIcon size={18} />
                        Company Events
                    </button>
                    <button
                        className={activeTab === 'holidays' ? 'active' : ''}
                        onClick={() => setActiveTab('holidays')}
                    >
                        <CalendarIcon size={18} />
                        Public Holidays
                    </button>
                </div>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : activeTab === 'events' ? (
                    <div className="events-grid">
                        {events.length === 0 ? (
                            <p className="empty-state">No upcoming events</p>
                        ) : (
                            events.map((event) => (
                                <div key={event.id} className="event-card">
                                    <div className="event-date">
                                        <div className="event-day">
                                            {format(new Date(event.event_start), 'd')}
                                        </div>
                                        <div className="event-month">
                                            {format(new Date(event.event_start), 'MMM')}
                                        </div>
                                    </div>
                                    <div className="event-content">
                                        <h4>{event.title}</h4>
                                        <p className="event-description">{event.description}</p>
                                        <div className="event-meta">
                                            <div className="meta-item">
                                                <Clock size={14} />
                                                <span>{formatDateTime(event.event_start)}</span>
                                            </div>
                                            {event.location && (
                                                <div className="meta-item">
                                                    <MapPin size={14} />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="holidays-grid">
                        {holidays.length === 0 ? (
                            <p className="empty-state">No holidays defined</p>
                        ) : (
                            holidays.map((holiday) => (
                                <div key={holiday.id} className="holiday-card">
                                    <div className="holiday-icon">
                                        <CalendarIcon size={24} />
                                    </div>
                                    <div className="holiday-content">
                                        <h4>{holiday.title}</h4>
                                        <p>{formatDate(holiday.holiday_date)}</p>
                                        {holiday.is_recurring && (
                                            <span className="badge badge-info">Recurring</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
