import React from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar, FileText, Users, ExternalLink } from 'lucide-react';

export default function ActivityFeed() {
  const activities = [
    {
      id: 1,
      title: 'Teacher Priya evaluated 15 students in Abacus Level 2',
      time: '5 mins ago',
      status: 'Completed',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      title: 'New batch enrollment for Phonics Program started',
      time: '15 mins ago',
      status: 'Active',
      icon: Users,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      title: 'Vedic Maths Level 3 curriculum updated by Admin Rajesh',
      time: '1 hour ago',
      status: 'Updated',
      icon: FileText,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      title: 'Teacher Anjali submitted progress reports for 20 students',
      time: '2 hours ago',
      status: 'Completed',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 5,
      title: 'Parent-Teacher meeting scheduled for Springfield School',
      time: '3 hours ago',
      status: 'Scheduled',
      icon: Calendar,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Updated':
        return 'bg-purple-100 text-purple-800';
      case 'Scheduled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className={`${activity.bgColor} p-2 rounded-lg flex-shrink-0`}>
                <IconComponent className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-relaxed">
                  {activity.title}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Activities Today</span>
          <span className="font-semibold text-gray-900">{activities.length} activities</span>
        </div>
      </div>
    </div>
  );
}