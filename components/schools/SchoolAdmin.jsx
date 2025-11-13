import { User, Mail, Phone, Shield, ExternalLink } from 'lucide-react';

export default function SchoolAdmin({ admin }) {
  if (!admin) return null;
  
  return (
    <section className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-purple-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              School Admin
            </h3>
          </div>
          
          {/* Admin Badge */}
          <div className="px-3 py-1.5 bg-purple-100 border-2 border-purple-200 rounded-full">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
              Administrator
            </span>
          </div>
        </div>

        {/* Admin Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name Card */}
          <div className="group/card p-4 rounded-xl bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg group-hover/card:scale-110 transition-transform duration-200">
                <User className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Full Name
                </div>
                <div className="text-sm sm:text-base font-bold text-gray-900 truncate">
                  {admin.full_name || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="group/card p-4 rounded-xl bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg group-hover/card:scale-110 transition-transform duration-200">
                <Mail className="w-5 h-5 text-green-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Email Address
                </div>
                {admin.email ? (
                  <a 
                    href={`mailto:${admin.email}`}
                    className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors truncate group/link"
                  >
                    <span className="truncate">{admin.email}</span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" strokeWidth={2.5} />
                  </a>
                ) : (
                  <div className="text-sm sm:text-base font-bold text-gray-900">-</div>
                )}
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="group/card p-4 rounded-xl bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-orange-100 rounded-lg group-hover/card:scale-110 transition-transform duration-200">
                <Phone className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Phone Number
                </div>
                {admin.phone ? (
                  <a 
                    href={`tel:${admin.phone}`}
                    className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors group/link"
                  >
                    <span>{admin.phone}</span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" strokeWidth={2.5} />
                  </a>
                ) : (
                  <div className="text-sm sm:text-base font-bold text-gray-900">-</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Primary contact for school administration and management
          </p>
        </div>
      </div>
    </section>
  );
}
