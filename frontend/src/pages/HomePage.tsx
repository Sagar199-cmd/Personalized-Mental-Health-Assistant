import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BarChart2, Calendar, MessageSquare, Shield, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-10 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 lg:pr-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Your Personal Mental Wellness Assistant
              </h1>
              <p className="mt-6 text-xl text-gray-500 dark:text-gray-300 max-w-3xl">
                Track your moods, gain AI-powered insights, and connect with therapists all in one secure platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline">
                        Log In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1620147461831-a97b99ade1d3?w=500&auto=format&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVudGFsJTIwaGVhbHRofGVufDB8fDB8fHww" 
                alt="Person meditating" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Features Designed for Your Mental Wellness
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Everything you need to track, understand, and improve your mental health.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                <Brain size={24} />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Mood Tracking</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Log your daily moods, activities, and thoughts. Add notes and tags to better understand your patterns.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                <BarChart2 size={24} />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">AI Insights</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Receive personalized insights and suggestions based on your mood patterns and activities.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                <Calendar size={24} />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Therapist Appointments</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Schedule sessions with licensed therapists and keep all your mental health support in one place.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                <MessageSquare size={24} />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Secure Messaging</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Communicate with your therapist through our encrypted messaging system for complete privacy.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white">
                <Shield size={24} />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Privacy & Security</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Your data is encrypted and protected. We comply with GDPR and other privacy regulations.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">AI Mood Detection</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Our advanced computer vision technology can detect your mood from your webcam, making tracking even easier.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Real stories from people who have improved their mental wellness with our platform.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Sarah K.</h4>
                  <p className="text-gray-500 dark:text-gray-400">Using for 6 months</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "This app has been a game-changer for my anxiety. Being able to track my moods and see patterns has helped me identify triggers I wasn't even aware of."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Michael T.</h4>
                  <p className="text-gray-500 dark:text-gray-400">Using for 1 year</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The AI insights are surprisingly accurate. They've helped me make small lifestyle changes that have had a big impact on my overall mental health."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Jessica L.</h4>
                  <p className="text-gray-500 dark:text-gray-400">Using for 3 months</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Being able to connect with my therapist through the same platform where I track my moods has made therapy so much more effective. My therapist can see my actual data!"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to improve your mental wellness?</span>
            <span className="block text-blue-200">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" className="border-white text-blue-600 hover:bg-blue-50">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;