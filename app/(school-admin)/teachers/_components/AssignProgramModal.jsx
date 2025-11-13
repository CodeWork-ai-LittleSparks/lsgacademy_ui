"use client";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { getPrograms } from "@/lib/api/services/programService";

export default function AssignProgramModal({ teacher, isOpen, onClose, onAssign }) {
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true); setError("");
      try {
        const res = await getPrograms({ limit: 50, page: 1 });
        const list = res.success ? (res.data?.programs || []) : [];
        setPrograms(list);
      } catch (err) {
        setError(err?.message || "Failed to load programs");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  if (!isOpen) return null;

  const options = [{ value: "", label: "Select a program" }, ...programs.map((p) => ({ value: p.id, label: p.name }))];

  return (
    <Modal>
      <Card className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Assign Program</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        <div className="space-y-3">
          <div className="text-sm text-gray-700">Teacher: <span className="font-medium">{teacher?.full_name}</span></div>
          <Dropdown value={programId} onChange={(e) => setProgramId(e.target.value)} options={options} />
          {error ? (<div className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-700">{error}</div>) : null}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" disabled={!programId || loading} onClick={() => onAssign(programId)}>Assign</Button>
          </div>
        </div>
      </Card>
    </Modal>
  );
}