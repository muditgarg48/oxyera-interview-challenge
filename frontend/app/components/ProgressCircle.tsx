// components/ProgressCircle.tsx
'use client';

export default function ProgressCircle({
  total,
  completed,
  color,
  size = 'md',
  showTooltip = true,
  frequency = 0
}: {
  total: number,
  completed: number,
  color?: 'gray' | 'orange' | 'green' | 'blue' | 'red',
  size?: 'sm' | 'md' | 'lg',
  showTooltip?: boolean,
  frequency: number
}) {
  const progressPercentage = Math.min(100, Math.max(0, (completed / total) * 100));
  const remaining = total - completed;

  // Determine color classes
  const borderColorClass = color 
    ? `border-${color}-300`
    : progressPercentage <= 25 
      ? 'border-gray-200' 
      : progressPercentage <= 60 
        ? 'border-orange-300' 
        : 'border-green-400';

  const fillColorClass = color 
    ? `bg-${color}-300`
    : progressPercentage <= 25 
      ? 'bg-gray-200' 
      : progressPercentage <= 60 
        ? 'bg-orange-300' 
        : 'bg-green-400';

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="relative group">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Border circle */}
        <div className={`absolute w-full h-full rounded-full border-2 ${borderColorClass}`}></div>
        
        {/* Progress fill */}
        <div 
          className={`absolute w-full h-full rounded-full ${fillColorClass}`}
          style={{
            clipPath: `circle(${progressPercentage}% at 50% 50%)`,
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          }}
        ></div>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-800">
            {completed}/{total}
          </span>
        </div>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute hidden group-hover:block z-10 w-48 p-2 bg-white border border-gray-200 rounded shadow-lg text-xs mt-1 right-0">
            <div className="font-semibold text-gray-800 mb-1">
              Progress: {Math.round(progressPercentage)}%
            </div>
            <div className="text-gray-600">
              {remaining} {total === 1 ? 'item' : 'items'} remaining
            </div>
            {frequency>0? <div className="text-gray-600">
              {completed*frequency}/{total*frequency} doses completed
            </div>: null}
          </div>
        )}
      </div>
    </div>
  );
}