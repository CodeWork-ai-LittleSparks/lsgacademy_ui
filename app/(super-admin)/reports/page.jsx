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
  // History removed per requirement; downloads now trigger immediately after generation

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
    // preload dropdowns
    getPrograms({ limit: 50, page: 1 }).then((r) => setPrograms(r.success ? (r.data?.programs || []) : []));
    // Normalize teachers: service returns { data: { teachers: [] } }
    getTeachers({ limit: 50, page: 1 }).then((r) => setTeachers(r.success ? (r.data?.teachers || []) : []));
    if (showSchool) {
      getSchools({ limit: 50, page: 1 }).then((r) => {
        const data = r.success ? (r.data?.schools || r.data?.items || r.data || []) : [];
        setSchools(data);
      });
    }
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // At least one filter selected besides dates
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
    // Immediately trigger the file download (history UI removed)
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Generate custom reports and analyze data</p>
      </div>

      {/* Generate New Report */}
      <div className="rounded-lg border bg-white p-4 space-y-4">
        <h2 className="text-lg font-semibold">Generate New Report</h2>
        {typesLoading ? (
          <div className="text-sm text-gray-600">Loading report types...</div>
        ) : typesError ? (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{typesError}</div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700">Report Type *</label>
                <Dropdown options={typeOptions} value={form.report_type} onChange={(e) => setForm({ ...form, report_type: e.target.value })} />
                {selectedType ? (
                  <p className="text-xs text-gray-600 mt-1">{selectedType.description}</p>
                ) : null}
                {errors.report_type ? (<p className="text-xs text-red-600 mt-1">{errors.report_type}</p>) : null}
              </div>
              <div>
                <label className="text-sm text-gray-700">Format *</label>
                <div className="flex items-center gap-4 mt-1">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="radio" name="format" value="csv" checked={form.format === 'csv'} onChange={(e) => setForm({ ...form, format: e.target.value })} />
                    CSV
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm opacity-60">
                    <input type="radio" name="format" value="pdf" disabled checked={form.format === 'pdf'} onChange={(e) => setForm({ ...form, format: e.target.value })} />
                    PDF <Badge>Coming Soon</Badge>
                  </label>
                </div>
                {errors.format ? (<p className="text-xs text-red-600 mt-1">{errors.format}</p>) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-gray-700">From *</label>
                <Input type="date" value={form.date_from} onChange={(e) => setForm({ ...form, date_from: e.target.value })} />
                {errors.date_from ? (<p className="text-xs text-red-600 mt-1">{errors.date_from}</p>) : null}
              </div>
              <div>
                <label className="text-sm text-gray-700">To *</label>
                <Input type="date" value={form.date_to} onChange={(e) => setForm({ ...form, date_to: e.target.value })} />
                {errors.date_to ? (<p className="text-xs text-red-600 mt-1">{errors.date_to}</p>) : null}
              </div>
            </div>

            {/* Dynamic Filters */}
            <div className="pt-2 border-t">
              <p className="text-sm font-medium text-gray-800 mb-2">Filters</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {showSchool && (
                  <div>
                    <label className="text-sm text-gray-700">School</label>
                    <Dropdown value={form.school_id} onChange={(e) => setForm({ ...form, school_id: e.target.value })} options={schoolOptions} />
                  </div>
                )}
                {(showStudentProgressFilters || showTeacherPerformanceFilters || showProgramAnalyticsFilters || showEvaluationHistoryFilters) && (
                  <div>
                    <label className="text-sm text-gray-700">Program</label>
                    <Dropdown value={form.program_id} onChange={(e) => setForm({ ...form, program_id: e.target.value })} options={programOptions} />
                  </div>
                )}
                {(showStudentProgressFilters || showTeacherPerformanceFilters || showEvaluationHistoryFilters) && (
                  <div>
                    <label className="text-sm text-gray-700">Teacher</label>
                    <Dropdown value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })} options={teacherOptions} />
                  </div>
                )}
                {(showStudentProgressFilters || showEvaluationHistoryFilters) && (
                  <div>
                    <label className="text-sm text-gray-700">Student (UUID)</label>
                    <Input value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} placeholder="uuid-optional" />
                  </div>
                )}
                {showStudentProgressFilters && (
                  <>
                    <div>
                      <label className="text-sm text-gray-700">Performance Category</label>
                      <Dropdown value={form.performance_category} onChange={(e) => setForm({ ...form, performance_category: e.target.value })} options={PERFORMANCE_CATEGORIES} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Grade</label>
                      <Dropdown value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} options={GRADES} />
                    </div>
                  </>
                )}
              </div>
              {errors.filters ? (<p className="text-xs text-red-600 mt-2">{errors.filters}</p>) : null}
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={resetFilters}>Clear Filters</Button>
              <Button variant="primary" disabled={generating || pdfDisabled} onClick={onGenerate}>{generating ? 'Generating...' : 'Generate Report'}</Button>
            </div>
            {errors.submit ? (<div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{errors.submit}</div>) : null}
          </div>
        )}
      </div>

      {/* Report Preview */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold">Report Preview</h2>
        {selectedType ? (
          <div className="mt-2">
            <p className="text-sm text-gray-800 font-medium">{selectedType.name}</p>
            <p className="text-xs text-gray-600">{selectedType.description}</p>
            <p className="text-xs text-gray-700 mt-2">Expected Columns ({expectedColumns.length}):</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {expectedColumns.map((c) => (<span key={c} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">{c}</span>))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Select a report type to preview its columns.</p>
        )}
      </div>

      {/* Report History section removed */}
    </div>
  );
}
