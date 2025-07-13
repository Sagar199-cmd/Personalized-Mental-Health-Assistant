import React from 'react';
import { Brain, Shield, Heart, Users, Award, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About MindWellness</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Empowering individuals to take control of their mental health journey through technology and human connection.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300">
            At MindWellness, we believe that mental health care should be accessible, personalized, and empowering. Our mission is to bridge the gap between technology and mental wellness by providing tools that help you understand your emotional patterns, connect with qualified therapists, and take proactive steps toward better mental health.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            We're committed to creating a world where mental health is prioritized, stigma is eliminated, and everyone has the resources they need to thrive emotionally and psychologically.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
            alt="Team collaboration" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto mb-4">
              <Heart size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">Compassion</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-center">
              We approach mental health with empathy, understanding, and a genuine desire to help others on their wellness journey.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">Privacy</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-center">
              We prioritize the security and confidentiality of your data, ensuring that your personal information remains protected.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">Innovation</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-center">
              We continuously explore new technologies and approaches to improve mental health care and make it more accessible.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Our Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-lg order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Founder" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-gray-600 dark:text-gray-300">
              MindWellness was founded in 2023 by a team of mental health professionals, technologists, and individuals with lived experience of mental health challenges. After witnessing the gaps in traditional mental health care—long wait times, lack of personalization, and limited accessibility—our founders set out to create a solution that leverages technology to make mental wellness support more effective and available to everyone.
            </p>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              What began as a simple mood tracking app has evolved into a comprehensive platform that combines AI-driven insights with human expertise. Today, MindWellness serves thousands of users worldwide, helping them understand their emotional patterns, connect with qualified therapists, and take proactive steps toward better mental health.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Our Approach</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto mb-4">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">Technology-Enhanced Care</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              We harness the power of artificial intelligence and data analytics to provide personalized insights into your mental health patterns. Our mood tracking and analysis tools help you identify triggers, recognize patterns, and understand your emotional well-being on a deeper level.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">Human Connection</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              While technology is powerful, we believe in the irreplaceable value of human connection. Our platform connects you with licensed therapists who can provide professional guidance, support, and evidence-based interventions tailored to your unique needs.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Join Us on Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Whether you're seeking support for your own mental health journey, looking to connect with a therapist, or simply interested in tracking your mood patterns, MindWellness is here to help. Join our community today and take the first step toward a healthier, more balanced mind.
        </p>
        <div className="mt-8">
          <a 
            href="/register" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;