import React from 'react';
import { BookOpen, Users, TrendingUp } from 'lucide-react';

export default function ProgramEnrollment() {
  const programs = [
    {
      name: 'Abacus',
      enrolled: 450,
      capacity: 600,
      percentage: 75,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: '+12%'
    },
    {
      name: 'Phonics',
      enrolled: 380,
      capacity: 500,
      percentage: 76,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      trend: '+8%'
    },
    {
      name: 'Vedic Maths',
      enrolled: 320,
      capacity: 400,
      percentage: 80,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: '+15%'
    }
  ];

  const totalEnrolled = programs.reduce((sum, program) => sum + program.enrolled, 0);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Program Enrollment</h3>
          <div className="flex items-center gap-2 mt-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{totalEnrolled} Total Enrolled</span>
          </div>
        </div>
        <BookOpen className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        {programs.map((program, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`${program.color} p-2 rounded-lg`}>
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{program.name}</h4>
                  <p className="text-sm text-gray-600">
                    {program.enrolled} / {program.capacity} students
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{program.trend}</span>
                </div>
                <span className="text-sm text-gray-500">{program.percentage}% filled</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${program.color} h-2 rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${program.percentage}%` }}
                ></div>
              </div>
              
              <div className={`${program.bgColor} ${program.textColor} px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between`}>
                <span>{program.enrolled} students enrolled</span>
                <span>{program.capacity - program.enrolled} spots available</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Capacity</span>
            <p className="font-semibold text-gray-900">
              {programs.reduce((sum, program) => sum + program.capacity, 0)} students
            </p>
          </div>
          <div>
            <span className="text-gray-600">Overall Utilization</span>
            <p className="font-semibold text-gray-900">
              {Math.round((totalEnrolled / programs.reduce((sum, program) => sum + program.capacity, 0)) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}