import { AlertCircle } from 'lucide-react';

export default function ValidationMessage({ message }) {
  if (!message) return null;
  
  return (
    <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-50 border border-red-200 animate-in slide-in-from-top-1 duration-200">
      <div className="flex-shrink-0 p-0.5 bg-red-100 rounded-md">
        <AlertCircle className="w-3.5 h-3.5 text-red-600" strokeWidth={2.5} />
      </div>
      <p className="text-xs sm:text-sm font-semibold text-red-700 leading-relaxed">
        {message}
      </p>
    </div>
  );
}
