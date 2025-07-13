import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MessageSquare, Video, User, Phone, Mail, MapPin, Award, Shield, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useMoodStore } from '../store/moodStore';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

// Mock therapist data
const mockTherapists = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Clinical Psychologist',
    specializations: ['Anxiety', 'Depression', 'Stress Management'],
    experience: '12 years',
    rating: 4.9,
    reviewCount: 124,
    bio: 'Dr. Johnson specializes in cognitive behavioral therapy and mindfulness-based approaches. She has extensive experience helping clients manage anxiety, depression, and work-related stress.',
    education: 'Ph.D. in Clinical Psychology, Stanford University',
    certifications: ['Licensed Clinical Psychologist', 'Certified CBT Practitioner'],
    availability: [
      { day: 'Monday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '1:00 PM', '4:00 PM'] },
      { day: 'Friday', slots: ['9:00 AM', '12:00 PM', '3:00 PM'] },
    ],
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    contactInfo: {
      email: 'dr.johnson@mindwellness.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA (Virtual appointments available)'
    }
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    title: 'Psychiatrist',
    specializations: ['Mood Disorders', 'Anxiety', 'ADHD'],
    experience: '15 years',
    rating: 4.8,
    reviewCount: 98,
    bio: 'Dr. Chen is a board-certified psychiatrist specializing in the treatment of mood disorders, anxiety, and ADHD. He takes a holistic approach to mental health, considering biological, psychological, and social factors.',
    education: 'M.D., Johns Hopkins University School of Medicine',
    certifications: ['Board Certified Psychiatrist', 'American Board of Psychiatry and Neurology'],
    availability: [
      { day: 'Tuesday', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
      { day: 'Thursday', slots: ['9:00 AM', '12:00 PM', '4:00 PM'] },
      { day: 'Saturday', slots: ['10:00 AM', '12:00 PM'] },
    ],
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    contactInfo: {
      email: 'dr.chen@mindwellness.com',
      phone: '(555) 987-6543',
      location: 'New York, NY (Virtual appointments available)'
    }
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    title: 'Licensed Therapist',
    specializations: ['Trauma', 'Relationships', 'Self-Esteem'],
    experience: '8 years',
    rating: 4.7,
    reviewCount: 76,
    bio: 'Dr. Rodriguez specializes in trauma-informed therapy and relationship counseling. She helps clients process past experiences, improve communication skills, and build healthier relationships with themselves and others.',
    education: 'Ph.D. in Counseling Psychology, University of Michigan',
    certifications: ['Licensed Professional Counselor', 'EMDR Certified Therapist'],
    availability: [
      { day: 'Monday', slots: ['1:00 PM', '3:00 PM', '5:00 PM'] },
      { day: 'Wednesday', slots: ['11:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
    ],
    profileImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    contactInfo: {
      email: 'dr.rodriguez@mindwellness.com',
      phone: '(555) 456-7890',
      location: 'Chicago, IL (Virtual appointments available)'
    }
  }
];

// Mock messages
const mockMessages = [
  {
    id: '1',
    senderId: 'user1',
    receiverId: '1',
    content: 'Hello Dr. Johnson, I\'ve been feeling more anxious lately and would like to discuss some coping strategies.',
    timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
    read: true
  },
  {
    id: '2',
    senderId: '1',
    receiverId: 'user1',
    content: 'Hi there, I\'m sorry to hear you\'ve been feeling anxious. I have some availability this week to discuss coping strategies. Would you prefer a video session or messaging?',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    read: true
  },
  {
    id: '3',
    senderId: 'user1',
    receiverId: '1',
    content: 'I think a video session would be more helpful. Do you have any availability on Thursday afternoon?',
    timestamp: new Date(Date.now() - 43200000), // 12 hours ago
    read: true
  },
  {
    id: '4',
    senderId: '1',
    receiverId: 'user1',
    content: 'Yes, I have an opening at 3:00 PM on Thursday. I\'ll send you a calendar invite with the video link. In the meantime, try to practice the breathing exercises we discussed in our last session.',
    timestamp: new Date(Date.now() - 21600000), // 6 hours ago
    read: false
  }
];

// Mock appointments
const mockAppointments = [
  {
    id: '1',
    therapistId: '1',
    therapistName: 'Dr. Sarah Johnson',
    therapistImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    time: '3:00 PM',
    duration: 50,
    type: 'video',
    status: 'scheduled'
  },
  {
    id: '2',
    therapistId: '3',
    therapistName: 'Dr. Emily Rodriguez',
    therapistImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
    time: '11:00 AM',
    duration: 50,
    type: 'video',
    status: 'completed'
  }
];

const TherapistPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [messageContent, setMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('find');
  const [messages, setMessages] = useState(mockMessages);
  const [appointments, setAppointments] = useState(mockAppointments);
  
  // Simulate loading therapist data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleTherapistSelect = (therapist: any) => {
    setSelectedTherapist(therapist);
  };
  
  const handleBookAppointment = (therapist: any) => {
    setSelectedTherapist(therapist);
    setIsBookingModalOpen(true);
  };
  
  const handleSendMessage = (therapist: any) => {
    setSelectedTherapist(therapist);
    setIsMessageModalOpen(true);
  };
  
  const handleSubmitBooking = () => {
    if (!selectedDate || !selectedTime) return;
    
    // In a real app, you would send this to your API
    const newAppointment = {
      id: Math.random().toString(36).substring(2, 9),
      therapistId: selectedTherapist.id,
      therapistName: selectedTherapist.name,
      therapistImage: selectedTherapist.profileImage,
      date: new Date(selectedDate),
      time: selectedTime,
      duration: 50,
      type: 'video',
      status: 'scheduled'
    };
    
    setAppointments([...appointments, newAppointment]);
    setIsBookingModalOpen(false);
    setSelectedDate('');
    setSelectedTime('');
    setActiveTab('appointments');
  };
  
  const handleSubmitMessage = () => {
    if (!messageContent.trim()) return;
    
    // In a real app, you would send this to your API
    const newMessage = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: 'user1',
      receiverId: selectedTherapist.id,
      content: messageContent,
      timestamp: new Date(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setIsMessageModalOpen(false);
    setMessageContent('');
    setActiveTab('messages');
  };
  
  const tabs = [
    {
      id: 'find',
      label: 'Find Therapist',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-16 w-16"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              mockTherapists.map((therapist) => (
                <Card 
                  key={therapist.id} 
                  className={`cursor-pointer transition-shadow hover:shadow-md ${
                    selectedTherapist?.id === therapist.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleTherapistSelect(therapist)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={therapist.profileImage}
                        name={therapist.name}
                        size="lg"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {therapist.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {therapist.title}
                        </p>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(therapist.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                            {therapist.rating} ({therapist.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {therapist.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary" size="sm">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {therapist.bio}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<MessageSquare size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendMessage(therapist);
                        }}
                        className="flex-1"
                      >
                        Message
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Calendar size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookAppointment(therapist);
                        }}
                        className="flex-1"
                      >
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {selectedTherapist && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Therapist Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={selectedTherapist.profileImage}
                        alt={selectedTherapist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedTherapist.contactInfo.email}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedTherapist.contactInfo.phone}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <MapPin size={16} className="text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedTherapist.contactInfo.location}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <Button
                        variant="primary"
                        fullWidth
                        leftIcon={<Calendar size={16} />}
                        onClick={() => handleBookAppointment(selectedTherapist)}
                      >
                        Book Appointment
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        leftIcon={<MessageSquare size={16} />}
                        onClick={() => handleSendMessage(selectedTherapist)}
                      >
                        Send Message
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedTherapist.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedTherapist.title} • {selectedTherapist.experience} experience
                    </p>
                    
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(selectedTherapist.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="ml-2 text-gray-600 dark:text-gray-300">
                        {selectedTherapist.rating} ({selectedTherapist.reviewCount} reviews)
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">About</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {selectedTherapist.bio}
                      </p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Specializations</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedTherapist.specializations.map((spec) => (
                            <Badge key={spec} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Education</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          {selectedTherapist.education}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Certifications</h3>
                      <ul className="mt-2 space-y-1">
                        {selectedTherapist.certifications.map((cert, index) => (
                          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                            <Award size={16} className="text-blue-500 mr-2" />
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Availability</h3>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {selectedTherapist.availability.map((avail, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                            <p className="font-medium text-gray-700 dark:text-gray-300">{avail.day}</p>
                            <div className="mt-1 space-y-1">
                              {avail.slots.map((slot, i) => (
                                <p key={i} className="text-sm text-gray-600 dark:text-gray-400">
                                  <Clock size={12} className="inline mr-1" />
                                  {slot}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Appointments</h2>
            <Button
              variant="outline"
              leftIcon={<Calendar size={16} />}
              onClick={() => setActiveTab('find')}
            >
              Book New Appointment
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming</h3>
            {appointments.filter(a => a.status === 'scheduled').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments
                  .filter(a => a.status === 'scheduled')
                  .map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar
                            src={appointment.therapistImage}
                            name={appointment.therapistName}
                            size="md"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {appointment.therapistName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <Calendar size={14} className="inline mr-1" />
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <Clock size={14} className="inline mr-1" />
                              {appointment.duration} minutes
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Video size={14} />}
                            className="flex-1"
                          >
                            Join Session
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
                No upcoming appointments. Book a session with a therapist to get started.
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Past Appointments</h3>
            {appointments.filter(a => a.status === 'completed').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments
                  .filter(a => a.status === 'completed')
                  .map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar
                            src={appointment.therapistImage}
                            name={appointment.therapistName}
                            size="md"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {appointment.therapistName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <Calendar size={14} className="inline mr-1" />
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </p>
                            <Badge variant="success" size="sm">Completed</Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<MessageSquare size={14} />}
                            className="flex-1"
                          >
                            Send Message
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Calendar size={14} />}
                            className="flex-1"
                          >
                            Book Again
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
          
          {messages.length > 0 ? (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={mockTherapists[0].profileImage}
                    name={mockTherapists[0].name}
                    size="md"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {mockTherapists[0].name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {mockTherapists[0].title}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 h-96 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'user1' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.senderId === 'user1'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'user1'
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
                    onClick={() => handleSubmitMessage()}
                    disabled={!messageContent.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No messages yet. Start a conversation with a therapist.
            </p>
          )}
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Therapist Connection</h1>
      </div>
      
      <Tabs tabs={tabs} defaultTabId="find" onChange={setActiveTab} />
      
      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Book Appointment"
        size="md"
      >
        {selectedTherapist && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar
                src={selectedTherapist.profileImage}
                name={selectedTherapist.name}
                size="md"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {selectedTherapist.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedTherapist.title}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a time</option>
                {selectedTherapist.availability.flatMap((avail) => 
                  avail.slots.map((slot) => (
                    <option key={`${avail.day}-${slot}`} value={slot}>
                      {avail.day} - {slot}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session Type
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="video"
                    name="session-type"
                    type="radio"
                    checked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="video" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Video Call
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="phone"
                    name="session-type"
                    type="radio"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="phone" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Phone Call
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                rows={3}
                className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Any specific topics you'd like to discuss?"
              />
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsBookingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitBooking}
                disabled={!selectedDate || !selectedTime}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Message Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title="Send Message"
        size="md"
      >
        {selectedTherapist && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar
                src={selectedTherapist.profileImage}
                name={selectedTherapist.name}
                size="md"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {selectedTherapist.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedTherapist.title}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                rows={5}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Type your message here..."
              />
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsMessageModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitMessage}
                disabled={!messageContent.trim()}
              >
                Send Message
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TherapistPage;