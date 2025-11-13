"use client";
import React from 'react';
import ReportsPage from '@/app/(super-admin)/reports/page';

export default function SchoolReportsPage() {
  // Reuse the same ReportsPage; role-based logic hides School filter automatically
  return <ReportsPage />;
}

