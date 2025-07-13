import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MessageSquare, Video, User, ChevronRight, Search, Filter, BarChart2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';

// Mock data for therapist dashboard
const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    age: 32,
    joinDate: new Date(Date.now() - 86400000 * 60), // 60 days ago
    lastSession: new Date(Date.now() - 86400000 * 5), // 5 days ago
    nextSession: new Date(Date.now() + 86400000 * 2), // 2 days from now
    sessions: 8,
    concerns: ['Anxiety', 'Work Stress'],
    notes: 'Making good progress with anxiety management techniques. Still struggling with work-related stress.',
    moodTrend: 'improving',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    age: 28,
    joinDate: new Date(Date.now() - 86400000 * 30), // 30 days ago
    lastSession: new Date(Date.now() - 86400000 * 2), // 2 days ago
    nextSession: new Date(Date.now() + 86400000 * 5), // 5 days from now
    sessions: 4,
    concerns: ['Depression', 'Relationship Issues'],
    notes: 'Showing improvement in mood. Working on communication strategies for relationship challenges.',
    moodTrend: 'stable',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    age: 45,
    joinDate: new Date(Date.now() - 86400000 * 90), // 90 days ago
    lastSession: new Date(Date.now() - 86400000 * 7), // 7 days ago
    nextSession: new Date(Date.now() + 86400000 * 7), // 7 days from now
    sessions: 12,
    concerns: ['Insomnia', 'Anxiety'],
    notes: 'Sleep has improved with cognitive behavioral techniques. Still experiencing occasional anxiety attacks.',
    moodTrend: 'improving',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    age: 35,
    joinDate: new Date(Date.now() - 86400000 * 45), // 45 days ago
    lastSession: new Date(Date.now() - 86400000 * 3), // 3 days ago
    nextSession: new Date(Date.now() + 86400000 * 4), // 4 days from now
    sessions: 6,
    concerns: ['Grief', 'Depression'],
    notes: 'Processing grief from recent loss. Showing signs of depression that need continued monitoring.',
    moodTrend: 'declining',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }
];

const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    patientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    time: '10:00 AM',
    duration: 50,
    type: 'video',
    status: 'scheduled',
    notes: 'Follow-up on anxiety management techniques'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Emily Johnson',
    patientImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    time: '2:00 PM',
    duration: 50,
    type: 'video',
    status: 'scheduled',
    notes: 'Discuss progress with communication strategies'
  },
  {
    id: '3',
    patientId: '4',
    patientName: 'Sarah Williams',
    patientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    date: new Date(Date.now() + 86400000 * 4), // 4 days from now
    time: '11:30 AM',
    duration: 50,
    type: 'video',
    status: 'scheduled',
    notes: 'Continue grief counseling'
  },
  {
    id: '4',
    patientId: '3',
    patientName: 'Michael Chen',
    patientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    date: new Date(Date.now() - 86400000 * 7), // 7 days ago
    time: '3:00 PM',
    duration: 50,
    type: 'video',
    status: 'completed',
    notes: 'Reviewed sleep hygiene practices'
  },
  {
    id: '5',
    patientId: '1',
    patientName: 'John Smith',
    patientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
    time: '9:00 AM',
    duration: 50,
    type: 'video',
    status: 'completed',
    notes: 'Discussed work stressors and coping strategies'
  }
];

const mockMessages = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    patientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    content: 'Hi Dr. Johnson, I\'ve been practicing the breathing exercises you recommended and they\'ve been helping with my anxiety. Looking forward to our next session.',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    read: false
  },
  {
    id: '2',
    patientId: '4',
    patientName: 'Sarah Williams',
    patientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    content: 'I\'ve been having a really difficult week. Is there any way we could move our appointment to an earlier date?',
    timestamp: new Date(Date.now() - 43200000), // 12 hours ago
    read: false
  }
];

const TherapistDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState(mockPatients);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [messages, setMessages] = useState(mockMessages);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [messageContent, setMessageContent] = useState('');
  
  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
  };
  
  const filteredPatients = patients.filter(patient => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        patient.name.toLowerCase().includes(term) ||
        patient.email.toLowerCase().includes(term) ||
        patient.concerns.some(concern => concern.toLowerCase().includes(term))
      );
    }
    return true;
  });
  
  const filteredAppointments = appointments.filter(appointment => {
    if (statusFilter === 'upcoming') {
      return appointment.status === 'scheduled';
    } else if (statusFilter === 'past') {
      return appointment.status === 'completed';
    }
    return true;
  });
  
  const handleSendMessage = () => {
    if (!messageContent.trim() || !selectedPatient) return;
    
    // In a real app, you would send this to your API
    const newMessage = {
      id: Math.random().toString(36).substring(2, 9),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientImage: selectedPatient.profileImage,
      content: messageContent,
      timestamp: new Date(),
      read: true,
      isFromTherapist: true
    };
    
    setMessages([...messages, newMessage]);
    setMessageContent('');
  };
  
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <User size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Patients</p>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {isLoading ? <Spinner size="sm" /> : patients.length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                    <Calendar size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Sessions</p>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {isLoading ? <Spinner size="sm" /> : appointments.filter(a => a.status === 'scheduled').length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                    <MessageSquare size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unread Messages</p>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {isLoading ? <Spinner size="sm" /> : messages.filter(m => !m.read).length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : appointments.filter(a => 
                    a.status === 'scheduled' && 
                    new Date(a.date).toDateString() === new Date().toDateString()
                  ).length > 0 ? (
                    <div className="space-y-4">
                      {appointments
                        .filter(a => 
                          a.status === 'scheduled' && 
                          new Date(a.date).toDateString() === new Date().toDateString()
                        )
                        .map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <Avatar
                                src={appointment.patientImage}
                                name={appointment.patientName}
                                size="md"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {appointment.patientName}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  <Clock size={14} className="inline mr-1" />
                                  {appointment.time} ({appointment.duration} min)
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<Video size={16} />}
                            >
                              Start Session
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No appointments scheduled for today.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Messages</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .slice(0, 3)
                        .map((message) => (
                          <div 
                            key={message.id} 
                            className={`p-4 border rounded-lg ${
                              message.read ? 'border-gray-200 dark:border-gray-700' : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <Avatar
                                src={message.patientImage}
                                name={message.patientName}
                                size="md"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {message.patientName}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {message.content.length > 100 
                                    ? `${message.content.substring(0, 100)}...` 
                                    : message.content}
                                </p>
                                <div className="mt-2 flex justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                  >
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No messages to display.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Patients Requiring Attention</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : patients.filter(p => p.moodTrend === 'declining').length > 0 ? (
                    <div className="space-y-4">
                      {patients
                        .filter(p => p.moodTrend === 'declining')
                        .map((patient) => (
                          <div key={patient.id} className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar
                                src={patient.profileImage}
                                name={patient.name}
                                size="md"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {patient.name}
                                </h4>
                                <Badge variant="danger" size="sm">Declining Mood</Badge>
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                              {patient.notes}
                            </p>
                            <div className="mt-3 flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<MessageSquare size={14} />}
                                className="flex-1"
                              >
                                Message
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<Calendar size={14} />}
                                className="flex-1"
                              >
                                Schedule
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No patients requiring immediate attention.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Weekly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Sessions Completed</p>
                      <p className="font-medium text-gray-900 dark:text-white">12</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">New Patients</p>
                      <p className="font-medium text-gray-900 dark:text-white">3</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Messages Received</p>
                      <p className="font-medium text-gray-900 dark:text-white">28</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Average Session Rating</p>
                      <p className="font-medium text-gray-900 dark:text-white">4.8/5</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={<BarChart2 size={16} />}
                    >
                      View Full Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'patients',
      label: 'Patients',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Patients</h2>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={16} />}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <Card 
                  key={patient.id} 
                  className={`cursor-pointer transition-shadow hover:shadow-md ${
                    selectedPatient?.id === patient.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={patient.profileImage}
                        name={patient.name}
                        size="md"
                      />
                      <div>
                        <h <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {patient.email}
                        </p>
                        <div className="flex items-center mt-1">
                          <Badge 
                            variant={
                              patient.moodTrend === 'improving' ? 'success' : 
                              patient.moodTrend === 'declining' ? 'danger' : 
                              'default'
                            } 
                            size="sm"
                          >
                            {patient.moodTrend === 'improving' ? 'Improving' : 
                             patient.moodTrend === 'declining' ? 'Needs Attention' : 
                             'Stable'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Next Session</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {patient.nextSession.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Sessions</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {patient.sessions}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {patient.concerns.map((concern) => (
                        <Badge key={concern} variant="secondary" size="sm">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No patients match your search criteria.
                </p>
              </div>
            )}
          </div>
          
          {selectedPatient && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={selectedPatient.profileImage}
                        alt={selectedPatient.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Age</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedPatient.age}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Patient Since</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedPatient.joinDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Sessions</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedPatient.sessions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Last Session</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedPatient.lastSession.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Next Session</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedPatient.nextSession.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <Button
                        variant="primary"
                        fullWidth
                        leftIcon={<Calendar size={16} />}
                      >
                        Schedule Session
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<MessageSquare size={16} />}
                      >
                        Send Message
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedPatient.email}
                    </p>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Concerns</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPatient.concerns.map((concern) => (
                          <Badge key={concern} variant="secondary">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notes</h3>
                      <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300">
                          {selectedPatient.notes}
                        </p>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Edit Notes
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Mood History</h3>
                      <div className="mt-2 h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">
                          Mood trend visualization would appear here
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Send Message</h3>
                      <div className="mt-2">
                        <textarea
                          rows={3}
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          className="w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Type your message here..."
                        />
                        <div className="mt-2 flex justify-end">
                          <Button
                            variant="primary"
                            onClick={handleSendMessage}
                            disabled={!messageContent.trim()}
                          >
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )
    },
    {
      id: 'appointments',
      label: 'Appointments',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appointments</h2>
            
            <div className="flex items-center gap-2">
              <Select
                options={[
                  { value: 'all', label: 'All Appointments' },
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'past', label: 'Past' },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : appointments.filter(a => 
              a.status === 'scheduled' && 
              new Date(a.date).toDateString() === new Date().toDateString()
            ).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments
                  .filter(a => 
                    a.status === 'scheduled' && 
                    new Date(a.date).toDateString() === new Date().toDateString()
                  )
                  .map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar
                            src={appointment.patientImage}
                            name={appointment.patientName}
                            size="md"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {appointment.patientName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <Clock size={14} className="inline mr-1" />
                              {appointment.time} ({appointment.duration} min)
                            </p>
                            <Badge variant="primary" size="sm" className="mt-1">
                              {appointment.type === 'video' ? 'Video Call' : 'Phone Call'}
                            </Badge>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                            <p className="font-medium">Notes:</p>
                            <p>{appointment.notes}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Video size={14} />}
                            className="flex-1"
                          >
                            Start Session
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Reschedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No appointments scheduled for today.
              </p>
            )}
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : filteredAppointments.filter(a => 
              a.status === 'scheduled' && 
              new Date(a.date).toDateString() !== new Date().toDateString()
            ).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAppointments
                  .filter(a => 
                    a.status === 'scheduled' && 
                    new Date(a.date).toDateString() !== new Date().toDateString()
                  )
                  .map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar
                            src={appointment.patientImage}
                            name={appointment.patientName}
                            size="md"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {appointment.patientName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <Calendar size={14} className="inline mr-1" />
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </p>
                            <Badge variant="primary" size="sm" className="mt-1">
                              {appointment.type === 'video' ? 'Video Call' : 'Phone Call'}
                            </Badge>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                            <p className="font-medium">Notes:</p>
                            <p>{appointment.notes}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<MessageSquare size={14} />}
                            className="flex-1"
                          >
                            Message
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Reschedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming appointments.
              </p>
            )}
            
            {statusFilter !== 'upcoming' && (
              <>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Past</h3>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : filteredAppointments.filter(a => a.status === 'completed').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAppointments
                      .filter(a => a.status === 'completed')
                      .map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <Avatar
                                src={appointment.patientImage}
                                name={appointment.patientName}
                                size="md"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {appointment.patientName}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar size={14} className="inline mr-1" />
                                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                </p>
                                <Badge variant="success" size="sm" className="mt-1">
                                  Completed
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                View Notes
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                leftIcon={<Calendar size={14} />}
                                className="flex-1"
                              >
                                Schedule Follow-up
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No past appointments.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'messages',
      label: 'Messages',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <Input
                  placeholder="Search messages..."
                  leftIcon={<Search size={16} />}
                />
              </div>
              
              <div className="h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : messages.length > 0 ? (
                  <div>
                    {Array.from(new Set(messages.map(m => m.patientId))).map((patientId) => {
                      const patient = patients.find(p => p.id === patientId);
                      const latestMessage = messages
                        .filter(m => m.patientId === patientId)
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                      
                      return (
                        <div 
                          key={patientId} 
                          className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 ${
                            selectedPatient?.id === patientId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar
                                src={patient?.profileImage}
                                name={patient?.name || 'Unknown'}
                                size="md"
                              />
                              {!latestMessage.read && !latestMessage.isFromTherapist && (
                                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-blue-500"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                  {patient?.name || 'Unknown'}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(latestMessage.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                {latestMessage.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No messages to display.
                  </p>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {selectedPatient ? (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={selectedPatient.profileImage}
                        name={selectedPatient.name}
                        size="md"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {selectedPatient.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedPatient.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 h-[500px] overflow-y-auto">
                    <div className="space-y-4">
                      {messages
                        .filter(m => m.patientId === selectedPatient.id)
                        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.isFromTherapist ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.isFromTherapist
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.isFromTherapist
                                  ? 'text-blue-100'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="primary"
                        onClick={handleSendMessage}
                        disabled={!messageContent.trim()}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Choose a patient from the list to view your conversation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Therapist Dashboard</h1>
      </div>
      
      <Tabs tabs={tabs} defaultTabId="dashboard" />
    </div>
  );
};

export default TherapistDashboardPage;