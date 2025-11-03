"use client"
import { useEffect, useState } from 'react';
import { getDashboardData } from '../lib/api/services/dashboardService';

export default function useDashboardData({ dateFrom, dateTo }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getDashboardData({ date_from: dateFrom, date_to: dateTo })
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.error || 'Failed to fetch dashboard data');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'An error occurred');
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [dateFrom, dateTo]);

  return { data, loading, error };
}