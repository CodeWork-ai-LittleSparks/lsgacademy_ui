import { FileText } from 'lucide-react';

export default function FormSection({ title, children }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-10" />
      
      <div className="relative z-10">
        {/* Section Header */}
        {title && (
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-200">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
              <FileText className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              {title}
            </h3>
            {/* Decorative Accent Line */}
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-transparent rounded-full" />
          </div>
        )}
        
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {children}
        </div>
      </div>

      {/* Bottom Accent Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
    </section>
  );
}
