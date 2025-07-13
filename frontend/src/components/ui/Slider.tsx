import React, { useState } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showLabels?: boolean;
  minLabel?: string;
  maxLabel?: string;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  showLabels = false,
  minLabel,
  maxLabel,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState<number>(value);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    onChange(newValue);
  };
  
  const percentage = ((localValue - min) / (max - min)) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        
        <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
          <span className="text-sm font-medium text-gray-700">
            {localValue}
          </span>
        </div>
      </div>
      
      {showLabels && (
        <div className="flex justify-between mt-6">
          <span className="text-xs text-gray-500">{minLabel || min}</span>
          <span className="text-xs text-gray-500">{maxLabel || max}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;