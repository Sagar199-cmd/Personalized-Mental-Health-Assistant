import React, { useRef, useState, useEffect } from 'react';
import { Camera, AlertCircle, Check, X } from 'lucide-react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { useMoodStore } from '../../store/moodStore';
import { useAuthStore } from '../../store/authStore';
import { MoodIntensity } from '../../types';

const emotions = ['angry', 'sad', 'neutral', 'happy', 'surprised'];

const MoodDetector: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedMood, setDetectedMood] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  
  const { addEntry, isLoading } = useMoodStore();
  const { user } = useAuthStore();
  
  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        
        // In a real implementation, you would load a pre-trained model
        // For this demo, we'll simulate model loading
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock model (in a real app, you would use tf.loadLayersModel())
        const mockModel = {
          predict: (input: any) => {
            // Simulate prediction with random values
            const randomValues = Array.from({ length: emotions.length }, () => Math.random());
            const sum = randomValues.reduce((a, b) => a + b, 0);
            const normalized = randomValues.map(val => val / sum);
            
            return {
              dataSync: () => normalized,
              dispose: () => {}
            };
          }
        };
        
        setModel(mockModel as unknown as tf.LayersModel);
        setIsModelLoading(false);
      } catch (err) {
        setError('Failed to load mood detection model. Please try again later.');
        setIsModelLoading(false);
        console.error('Error loading model:', err);
      }
    };
    
    loadModel();
    
    return () => {
      // Clean up resources
      if (model) {
        // In a real implementation, you would dispose of the model
        // model.dispose();
      }
    };
  }, []);
  
  // Request camera permission
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraPermission(true);
      } catch (err) {
        setCameraPermission(false);
        setError('Camera access is required for mood detection. Please allow camera access and try again.');
      }
    };
    
    checkCameraPermission();
  }, []);
  
  const captureImage = () => {
    if (webcamRef.current) {
      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCapturing(false);
    }
  };
  
  const detectMood = async () => {
    if (!capturedImage || !model) return;
    
    try {
      setIsCapturing(true);
      
      // In a real implementation, you would:
      // 1. Load the captured image into a tensor
      // 2. Preprocess the image (resize, normalize, etc.)
      // 3. Run the model prediction
      // 4. Process the results
      
      // For this demo, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate model prediction
      const randomIndex = Math.floor(Math.random() * emotions.length);
      const randomConfidence = 0.7 + Math.random() * 0.3; // Random value between 0.7 and 1.0
      
      setDetectedMood(emotions[randomIndex]);
      setConfidence(randomConfidence);
      setIsCapturing(false);
    } catch (err) {
      setError('Failed to detect mood. Please try again.');
      setIsCapturing(false);
      console.error('Error detecting mood:', err);
    }
  };
  
  const resetCapture = () => {
    setCapturedImage(null);
    setDetectedMood(null);
    setConfidence(0);
    setError(null);
  };
  
  const saveMoodEntry = async () => {
    if (!user || !detectedMood) return;
    
    // Map detected emotion to app's mood categories
    const moodMapping: Record<string, string> = {
      'angry': 'angry',
      'sad': 'sad',
      'neutral': 'neutral',
      'happy': 'happy',
      'surprised': 'excited'
    };
    
    // Map confidence to intensity (1-5 scale)
    const intensityMapping = Math.max(1, Math.min(5, Math.round(confidence * 5))) as MoodIntensity;
    
    await addEntry({
      userId: user.id,
      mood: moodMapping[detectedMood] || detectedMood,
      intensity: intensityMapping,
      activities: [],
      notes: `Auto-detected mood: ${detectedMood} (confidence: ${Math.round(confidence * 100)}%)`,
      tags: ['auto-detected'],
      isAutoDetected: true
    });
    
    resetCapture();
  };
  
  if (isModelLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading mood detection model...</p>
      </div>
    );
  }
  
  if (cameraPermission === false) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center text-amber-600 dark:text-amber-500 mb-4">
          <AlertCircle size={24} className="mr-2" />
          <h3 className="text-lg font-medium">Camera Access Required</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Camera access is required for mood detection. Please allow camera access in your browser settings and refresh the page.
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Mood Detection</h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Camera size={16} className="mr-1" />
          <span>Using computer vision</span>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {!capturedImage ? (
          <div className="relative">
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "user"
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                variant="primary"
                onClick={captureImage}
                isLoading={isCapturing}
                leftIcon={<Camera size={16} />}
              >
                Capture Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Captured Image</p>
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detected Mood</p>
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                  {detectedMood ? (
                    <div className="text-center">
                      <div className="text-5xl mb-2">
                        {detectedMood === 'happy' && '😊'}
                        {detectedMood === 'sad' && '😢'}
                        {detectedMood === 'angry' && '😠'}
                        {detectedMood === 'neutral' && '😐'}
                        {detectedMood === 'surprised' && '😲'}
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white capitalize">
                        {detectedMood}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Confidence: {Math.round(confidence * 100)}%
                      </p>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={detectMood}
                      isLoading={isCapturing}
                    >
                      Detect Mood
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={resetCapture}
                leftIcon={<X size={16} />}
              >
                Reset
              </Button>
              
              {detectedMood && (
                <Button
                  variant="primary"
                  onClick={saveMoodEntry}
                  isLoading={isLoading}
                  leftIcon={<Check size={16} />}
                >
                  Save to Mood Log
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">How it works</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Our AI uses computer vision to analyze your facial expressions and detect your current mood.
            The captured image is processed locally on your device for privacy. No images are stored or sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodDetector;