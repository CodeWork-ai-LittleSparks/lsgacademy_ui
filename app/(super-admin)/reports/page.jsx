"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRole } from '@/hooks/useRole';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import Badge from '@/components/ui/Badge';
import { getReportTypes, generateReport, downloadReport } from '@/lib/api/services/reportService';
import { getSchools } from '@/lib/api/services/schoolService';
import { getPrograms } from '@/lib/api/services/programService';
import { getTeachers } from '@/lib/api/services/teacherService';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Users, 
  School, 
  BookOpen,
  AlertCircle,
  Check,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
  X,
  Settings
} from 'lucide-react';

const PERFORMANCE_CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Average', label: 'Average' },
  { value: 'In Process of Learning', label: 'In Process of Learning' },
];
const GRADES = [{ value: '', label: 'All Grades' }, ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))];

function last30DaysDefault() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  const toStr = to.toISOString().slice(0, 10);
  const fromStr = from.toISOString().slice(0, 10);
  return { from: fromStr, to: toStr };
}

function formatRelative(ts) {
  const d = new Date(ts);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function timeUntil(ts) {
  const d = new Date(ts);
  const diff = d.getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m left`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h left`;
  const days = Math.floor(hrs / 24);
  return `${days}d left`;
}

export default function ReportsPage() {
  const { role } = useRole();
  const showSchool = role === 'super-admin' || role === 'super_admin';

  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState('');
  const [reportTypes, setReportTypes] = useState([]);
  const [formats, setFormats] = useState([]);

  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const defaultDates = useMemo(() => last30DaysDefault(), []);
  const [form, setForm] = useState({
    report_type: '',
    format: 'csv',
    date_from: defaultDates.from,
    date_to: defaultDates.to,
    school_id: '',
    program_id: '',
    level_id: '',
    teacher_id: '',
    student_id: '',
    performance_category: '',
    grade: '',
  });
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let mounted = true;
    setTypesLoading(true); setTypesError('');
    getReportTypes()
      .then((res) => {
        if (!mounted) return;
        if (res.success) {
          setReportTypes(res.data.reportTypes || []);
          setFormats(res.data.formats || []);
        } else {
          setTypesError(res.error || 'Failed to load report types');
        }
      })
      .finally(() => mounted && setTypesLoading(false));
    getPrograms({ limit: 50, page: 1 }).then((r) => setPrograms(r.success ? (r.data?.programs || []) : []));
    getTeachers({ limit: 50, page: 1 }).then((r) => setTeachers(r.success ? (r.data?.teachers || []) : []));
    if (showSchool) {
      getSchools({ limit: 50, page: 1 }).then((r) => {
        const data = r.success ? (r.data?.schools || r.data?.items || r.data || []) : [];
        setSchools(data);
      });
    }
    return () => { mounted = false; };
  }, [showSchool]);

  const selectedType = reportTypes.find((t) => t.type === form.report_type);
  const expectedColumns = selectedType?.columns || [];
  const typeOptions = reportTypes.map((t) => ({ value: t.type, label: t.name }));
  const formatOptions = formats.map((f) => ({ value: f.format, label: f.name }));

  function resetFilters() {
    setForm((f) => ({
      ...f,
      school_id: '',
      program_id: '',
      level_id: '',
      teacher_id: '',
      student_id: '',
      performance_category: '',
      grade: '',
    }));
    setErrors({});
  }

  function validateForm() {
    const e = {};
    if (!form.report_type) e.report_type = 'Please select a report type';
    if (!form.format) e.format = 'Please select a format';
    if (!form.date_from) e.date_from = 'Start date is required';
    if (!form.date_to) e.date_to = 'End date is required';
    const df = new Date(form.date_from);
    const dt = new Date(form.date_to);
    if (df > dt) e.date_to = 'End date must be after start date';
    const rangeDays = Math.ceil((dt - df) / (1000 * 60 * 60 * 24));
    if (rangeDays > 365) e.date_to = 'Date range cannot exceed 1 year';
    const hasExtraFilter = [form.school_id, form.program_id, form.level_id, form.teacher_id, form.student_id, form.performance_category, form.grade].some((v) => v && String(v).length > 0);
    if (!hasExtraFilter) e.filters = 'Select at least one filter besides dates';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onGenerate() {
    if (!validateForm()) return;
    setGenerating(true);
    const filters = {
      date_from: form.date_from,
      date_to: form.date_to,
      school_id: showSchool ? (form.school_id || undefined) : undefined,
      program_id: form.program_id || undefined,
      level_id: form.level_id || undefined,
      teacher_id: form.teacher_id || undefined,
      student_id: form.student_id || undefined,
      performance_category: form.performance_category || undefined,
      grade: form.grade ? Number(form.grade) : undefined,
    };
    const res = await generateReport(form.report_type, form.format, filters);
    setGenerating(false);
    if (!res.success) {
      setErrors({ submit: res.error || 'Failed to generate report. Please try again.' });
      return;
    }
    const dl = await downloadReport(res.data.reportId, res.data.format);
    if (!dl.success) {
      setErrors({ submit: dl.error || 'Download failed. Please try again.' });
    }
  }

  const pdfDisabled = useMemo(() => (form.format === 'pdf'), [form.format]);

  const showStudentProgressFilters = form.report_type === 'student_progress';
  const showTeacherPerformanceFilters = form.report_type === 'teacher_performance';
  const showProgramAnalyticsFilters = form.report_type === 'program_analytics';
  const showEvaluationHistoryFilters = form.report_type === 'evaluation_history';

  const schoolOptions = [{ value: '', label: 'All Schools' }, ...schools.map((s) => ({ value: s.id || s.school_id, label: s.name }))];
  const programOptions = [{ value: '', label: 'All Programs' }, ...programs.map((p) => ({ value: p.program_id || p.id, label: p.name }))];
  const teacherOptions = [
    { value: '', label: 'All Teachers' },
    ...teachers.map((t) => ({
      value: t.id || t.teacher_id,
      label:
        t?.user?.full_name
        || t?.full_name
        || t?.name
        || `${t?.first_name || ''} ${t?.last_name || ''}`.trim()
        || t?.email
        || t?.employee_id
        || 'Unknown Teacher',
    })),
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-sm">
          <BarChart3 className="w-6 h-6 text-indigo-600" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-600 font-medium mt-0.5">
            Generate custom reports and analyze data
          </p>
        </div>
      </div>

      {/* Generate New Report */}
      <div className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-200">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Generate New Report
          </h2>
        </div>

        {typesLoading ? (
          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-xl">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-blue-700">Loading report types...</span>
          </div>
        ) : typesError ? (
          <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <p className="text-sm font-semibold text-red-700">{typesError}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Report Type & Format */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                  <FileText className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                  Report Type *
                </label>
                <Dropdown 
                  options={typeOptions} 
                  value={form.report_type} 
                  onChange={(e) => setForm({ ...form, report_type: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white text-gray-900 font-medium transition-all duration-200"
                />
                {selectedType && (
                  <p className="text-xs text-gray-600 mt-2 font-medium">{selectedType.description}</p>
                )}
                {errors.report_type && (
                  <p className="text-xs text-red-600 mt-2 font-semibold">{errors.report_type}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                  <Download className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                  Format *
                </label>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 bg-white">
                    <input 
                      type="radio" 
                      name="format" 
                      value="csv" 
                      checked={form.format === 'csv'} 
                      onChange={(e) => setForm({ ...form, format: e.target.value })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-semibold text-gray-900">CSV</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl cursor-not-allowed opacity-60 bg-white">
                    <input 
                      type="radio" 
                      name="format" 
                      value="pdf" 
                      disabled 
                      checked={form.format === 'pdf'} 
                      onChange={(e) => setForm({ ...form, format: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-700">PDF</span>
                    <Badge className="ml-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-lg font-bold">Coming Soon</Badge>
                  </label>
                </div>
                {errors.format && (
                  <p className="text-xs text-red-600 mt-2 font-semibold">{errors.format}</p>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                  <Calendar className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                  From Date *
                </label>
                <Input 
                  type="date" 
                  value={form.date_from} 
                  onChange={(e) => setForm({ ...form, date_from: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white text-gray-900 font-medium transition-all duration-200"
                />
                {errors.date_from && (
                  <p className="text-xs text-red-600 mt-2 font-semibold">{errors.date_from}</p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                  <Calendar className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                  To Date *
                </label>
                <Input 
                  type="date" 
                  value={form.date_to} 
                  onChange={(e) => setForm({ ...form, date_to: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white text-gray-900 font-medium transition-all duration-200"
                />
                {errors.date_to && (
                  <p className="text-xs text-red-600 mt-2 font-semibold">{errors.date_to}</p>
                )}
              </div>
            </div>

            {/* Dynamic Filters */}
            <div className="pt-4 border-t-2 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <Filter className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Filters</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {showSchool && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                      <School className="w-3.5 h-3.5 text-purple-600" strokeWidth={2.5} />
                      School
                    </label>
                    <Dropdown 
                      value={form.school_id} 
                      onChange={(e) => setForm({ ...form, school_id: e.target.value })} 
                      options={schoolOptions}
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 bg-white text-gray-900 font-medium text-sm"
                    />
                  </div>
                )}
                {(showStudentProgressFilters || showTeacherPerformanceFilters || showProgramAnalyticsFilters || showEvaluationHistoryFilters) && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
                      Program
                    </label>
                    <Dropdown 
                      value={form.program_id} 
                      onChange={(e) => setForm({ ...form, program_id: e.target.value })} 
                      options={programOptions}
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white text-gray-900 font-medium text-sm"
                    />
                  </div>
                )}
                {(showStudentProgressFilters || showTeacherPerformanceFilters || showEvaluationHistoryFilters) && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                      <Users className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
                      Teacher
                    </label>
                    <Dropdown 
                      value={form.teacher_id} 
                      onChange={(e) => setForm({ ...form, teacher_id: e.target.value })} 
                      options={teacherOptions}
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 bg-white text-gray-900 font-medium text-sm"
                    />
                  </div>
                )}
                {(showStudentProgressFilters || showEvaluationHistoryFilters) && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                      <Users className="w-3.5 h-3.5 text-orange-600" strokeWidth={2.5} />
                      Student UUID
                    </label>
                    <Input 
                      value={form.student_id} 
                      onChange={(e) => setForm({ ...form, student_id: e.target.value })} 
                      placeholder="Optional UUID"
                      className="px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-white text-gray-900 font-medium text-sm placeholder:text-gray-500"
                    />
                  </div>
                )}
                {showStudentProgressFilters && (
                  <>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-pink-600" strokeWidth={2.5} />
                        Performance
                      </label>
                      <Dropdown 
                        value={form.performance_category} 
                        onChange={(e) => setForm({ ...form, performance_category: e.target.value })} 
                        options={PERFORMANCE_CATEGORIES}
                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-500 bg-white text-gray-900 font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" strokeWidth={2.5} />
                        Grade
                      </label>
                      <Dropdown 
                        value={form.grade} 
                        onChange={(e) => setForm({ ...form, grade: e.target.value })} 
                        options={GRADES}
                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white text-gray-900 font-medium text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
              {errors.filters && (
                <div className="flex items-start gap-2 mt-3 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-xs font-semibold text-yellow-700">{errors.filters}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t-2 border-gray-200">
              <Button 
                variant="ghost" 
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold transition-all duration-200"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
                Clear Filters
              </Button>
              <Button 
                variant="primary" 
                disabled={generating || pdfDisabled} 
                onClick={onGenerate}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-white">Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" strokeWidth={2.5} />
                    <span className="text-white">Generate Report</span>
                  </>
                )}
              </Button>
            </div>
            
            {errors.submit && (
              <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50 animate-in fade-in duration-300">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-sm font-semibold text-red-700">{errors.submit}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Preview */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-200">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-sm">
            <FileText className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Report Preview
          </h2>
        </div>

        {selectedType ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{selectedType.name}</h3>
              <p className="text-sm text-gray-600 font-medium">{selectedType.description}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Settings className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                </div>
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  Expected Columns ({expectedColumns.length})
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {expectedColumns.map((c) => (
                  <span key={c} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner mb-3">
              <FileText className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-gray-600">Select a report type to preview columns</p>
          </div>
        )}
      </div>
    </div>
  );
}
