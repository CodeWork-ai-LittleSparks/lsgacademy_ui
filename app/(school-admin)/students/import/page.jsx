"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { importStudents, downloadImportTemplate } from "@/lib/api/services/studentService";

const REQUIRED_COLUMNS = ['full_name','roll_number','grade','date_of_birth','gender','parent_name','parent_phone','parent_email','address'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function ImportStudentsPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [progressText, setProgressText] = useState("");
  const inputRef = useRef(null);

  const previewInfo = useMemo(() => {
    if (!file) return null;
    return { name: file.name, sizeKB: Math.round(file.size / 1024) };
  }, [file]);

  const validateFile = async (f) => {
    const errs = [];
    if (!f) { errs.push('Select a CSV file'); }
    else {
      const isCsv = /\.csv$/i.test(f.name) || f.type === 'text/csv';
      if (!isCsv) errs.push('File must be a CSV');
      if (f.size > MAX_SIZE_BYTES) errs.push('File must be under 5MB');
      // Basic client-side header/row validation
      try {
        const text = await f.text();
        const lines = text.split(/\r?\n/).filter(Boolean);
        const header = lines[0]?.split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const missing = REQUIRED_COLUMNS.filter((c) => !header.includes(c));
        if (missing.length) errs.push('Missing columns: ' + missing.join(', '));
        const rows = Math.max(0, lines.length - 1);
        if (rows > 500) errs.push('Max 500 rows allowed');
        setProgressText(`Ready: ${rows} rows`);
      } catch (e) {
        errs.push('Failed to read CSV');
      }
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleImport = async () => {
    const ok = await validateFile(file);
    if (!ok) return;
    setImporting(true);
    setProgressText('Uploading and processing...');
    const res = await importStudents(file);
    setImporting(false);
    if (res?.success) {
      setResults(res.data);
      setProgressText('Done');
    } else {
      setErrors([res?.error || 'Import failed']);
    }
  };

  const downloadErrorsCSV = () => {
    if (!results?.errors?.length) return;
    const header = ['row','roll_number','error'];
    const rows = results.errors.map((e) => [e.row, e.roll_number, e.error]);
    const csv = [header, ...rows].map(r => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import_errors.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/students')}>{`< Back`}</Button>
          <h1 className="text-xl font-semibold">Import Students from CSV</h1>
        </div>
      </div>

      {/* Step 1: Template */}
      <div className="bg-white border rounded p-4">
        <div className="font-medium mb-1">Step 1: Download Template</div>
        <div className="text-sm text-gray-700 mb-2">Download our CSV template to ensure correct format.</div>
        <Button variant="secondary" onClick={() => downloadImportTemplate()}>Download Template</Button>
      </div>

      {/* Step 2: Prepare Data */}
      <div className="bg-white border rounded p-4 mt-4">
        <div className="font-medium mb-1">Step 2: Prepare Your Data</div>
        <ul className="text-sm text-gray-700 list-disc pl-5">
          {REQUIRED_COLUMNS.map((c) => (<li key={c}>{c}</li>))}
        </ul>
      </div>

      {/* Step 3: Upload */}
      <div className="bg-white border rounded p-4 mt-4">
        <div className="font-medium mb-2">Step 3: Upload CSV File</div>
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center text-gray-600 bg-white"
          onClick={() => inputRef.current?.click()}
          role="button"
          aria-label="Upload CSV"
        >
          <div className="mb-2">Click to browse or drag and drop</div>
          <div className="text-sm">CSV files only (max 5MB, 500 rows)</div>
          <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={async (e) => { setFile(e.target.files?.[0] || null); if (e.target.files?.[0]) await validateFile(e.target.files[0]); }} />
        </div>
        {previewInfo && (
          <div className="mt-2 text-sm text-gray-700">Selected: {previewInfo.name} • {previewInfo.sizeKB} KB</div>
        )}
        {errors.length > 0 && (
          <div className="mt-2 p-3 bg-red-50 text-red-700 rounded text-sm">
            {errors.map((e, i) => (<div key={i}>{e}</div>))}
          </div>
        )}
        {progressText && <div className="mt-2 text-xs text-gray-600">{progressText}</div>}

        <div className="flex items-center justify-end gap-2 mt-3">
          <Button variant="outline" disabled={importing} onClick={() => router.push('/students')}>Cancel</Button>
          <Button variant="primary" disabled={importing || !file} onClick={handleImport}>{importing ? 'Importing...' : 'Import Students'}</Button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white border rounded p-4 mt-4">
          <div className="text-green-700 font-medium">Successfully imported: {results.successful}</div>
          <div className="text-red-700 font-medium">Failed: {results.failed}</div>
          {results.errors?.length > 0 && (
            <div className="mt-2">
              <div className="font-medium mb-1">Errors:</div>
              <ul className="text-sm text-gray-700 list-disc pl-5">
                {results.errors.map((e, i) => (<li key={i}>Row {e.row}: Roll number "{e.roll_number}" {e.error}</li>))}
              </ul>
            </div>
          )}
          <div className="flex items-center gap-2 mt-3">
            {results.errors?.length > 0 && <Button variant="secondary" onClick={downloadErrorsCSV}>Download Error Report</Button>}
            <Button variant="primary" onClick={() => router.push('/students')}>View Imported Students</Button>
          </div>
        </div>
      )}
    </div>
  );
}

