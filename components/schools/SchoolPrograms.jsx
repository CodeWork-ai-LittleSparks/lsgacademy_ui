import { BookOpen, Users, Tag, GraduationCap, Sparkles } from 'lucide-react';

export default function SchoolPrograms({ programs = [] }) {
  if (!programs || programs.length === 0) return null;
  
  return (
    <section className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-purple-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Programs Offered
            </h3>
          </div>
          
          {/* Programs Count Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 border-2 border-purple-200 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            <span className="text-xs font-bold text-purple-700">
              {programs.length} Programs
            </span>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => (
            <div 
              key={p.id} 
              className="group/card relative overflow-hidden rounded-xl bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 border-2 border-gray-200 hover:border-purple-300 p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.03] cursor-pointer"
            >
              {/* Decorative Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              
              <div className="space-y-3">
                {/* Program Icon & Name */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl group-hover/card:scale-110 transition-transform duration-300 shadow-sm">
                    <GraduationCap className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover/card:text-purple-700 transition-colors leading-tight line-clamp-2">
                      {p.name}
                    </h4>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 p-1.5 bg-green-100 rounded-lg">
                    <Tag className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wide">
                    {p.category}
                  </span>
                </div>

                {/* Enrollment Count */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 group-hover/card:border-purple-200 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Users className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Enrolled
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    {p.enrollment_count ?? 0}
                  </span>
                </div>

                {/* View Details Link */}
                <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-purple-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  <span>View Details</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Active programs available for student enrollment and participation
          </p>
        </div>
      </div>
    </section>
  );
}
