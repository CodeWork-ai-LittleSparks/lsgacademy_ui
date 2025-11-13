"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEvaluationById } from '@/lib/api/services/evaluationService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/ui/Modal';
import { toPublicAssetUrl } from '@/lib/utils/urlUtils';

function formatDateTime(dtStr) {
  try {
    const d = new Date(dtStr);
    return d.toLocaleString();
  } catch {
    return dtStr;
  }
}

function perfColor(perfObjOrName) {
  const name = typeof perfObjOrName === 'string' ? perfObjOrName : perfObjOrName?.name;
  const p = String(name || '').toLowerCase();
  if (p.includes('excellent')) return 'bg-green-100 text-green-800 border-green-300';
  if (p.includes('average')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  return 'bg-blue-100 text-blue-800 border-blue-300';
}

function recommendationLabel(rec) {
  const v = String(rec || '').toLowerCase();
  if (v === 'move_next' || v === 'movenext' || v === 'move_next_level') return '➡️ Move to Next Level';
  if (v === 'continue_current' || v === 'continue') return '🔄 Continue Current Level';
  if (v === 'review_previous' || v === 'review' || v === 'review_previous_level') return '⬅️ Review Previous Level';
  return '—';
}

export default function EvaluationDetailPage({ params }) {
  const router = useRouter();
  const evaluationId = params?.id;
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  async function loadEvaluation() {
    setLoading(true);
    setError(null);
    try {
      const res = await getEvaluationById(evaluationId);
      if (res?.success) setEvaluation(res.data);
      else setError(res?.error || 'Failed to load evaluation');
    } catch (e) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (evaluationId) loadEvaluation();
  }, [evaluationId]);

  if (loading) {
    return (
      <div className="p-4">
        <Card className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mt-2" />
        </Card>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="p-4">
        <Button variant="outline" onClick={() => router.back()}>{'< Back'}</Button>
        <EmptyState title="Evaluation not available" message={error || 'No data found'} />
      </div>
    );
  }

  const s = evaluation?.student || {};
  const p = evaluation?.program || {};
  const l = evaluation?.level || {};
  const t = evaluation?.teacher || {};
  const pct = evaluation?.achievement_percentage ?? Math.round(((evaluation?.milestones_achieved_count || 0) / (evaluation?.total_milestones || 1)) * 100);
  const perf = evaluation?.performance_category || evaluation?.performance || {};
  const photos = evaluation?.photo_urls || [];
  const achieved = evaluation?.milestones_achieved || [];
  const totalMilestones = evaluation?.total_milestones || achieved.length;
  const achievedCount = evaluation?.milestones_achieved_count || achieved.length;
  const notAchievedCount = Math.max(0, totalMilestones - achievedCount);

  const detailsLine = [
    s?.grade ? `Grade ${s.grade}` : null,
    s?.roll_number ? `Roll: ${s.roll_number}` : null,
    typeof s?.age !== 'undefined' && s?.age !== null ? `Age: ${s.age}` : null,
  ].filter(Boolean).join(' • ');

  function openPhoto(idx) {
    setCurrentPhotoIndex(idx);
    setLightboxOpen(true);
  }

  function nextPhoto() {
    setCurrentPhotoIndex((i) => (i + 1) % photos.length);
  }

  function prevPhoto() {
    setCurrentPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>{'< Back'}</Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.print()}>Print</Button>
          <Button variant="secondary" onClick={() => navigator.clipboard?.writeText(window.location.href)}>Share</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <img src={s?.photo_url ? toPublicAssetUrl(s.photo_url) : '/images/loginimage.jpg'} alt={s?.full_name || 'Student'} className="w-36 h-36 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{s?.full_name}</h1>
              <Badge className={`border ${perfColor(perf)}`}>{perf?.name || String(perf)}</Badge>
            </div>
            <div className="text-sm text-gray-600">{detailsLine || (s?.roll_number ? `Roll: ${s.roll_number}` : '')}</div>
            <div className="text-sm text-gray-700">{p?.name} • {l?.level_name || `Level ${l?.level_number ?? ''}`}</div>
            <div className="text-sm text-gray-600">Evaluated by: {t?.full_name} ({t?.employee_id})</div>
            <div className="text-sm text-gray-600">Date: {formatDateTime(evaluation?.evaluated_at)}</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="font-medium text-gray-800 mb-2">Achievement Summary</div>
        <div>Milestones Achieved: ({pct}%)</div>
        <div className="h-3 bg-gray-200 rounded mt-2">
          <div className="h-3 bg-green-600 rounded" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 text-sm text-gray-700">{perf?.name || String(perf)} — {perf?.description || ''}</div>
      </Card>

      <Card className="p-6">
        <div className="font-medium text-gray-800 mb-4">Milestones Achieved ({achievedCount})</div>
        <div className="space-y-2">
          {achieved?.map((m, idx) => (
            <div key={typeof m === 'object' ? (m.id || idx) : idx} className="p-3 bg-green-50 rounded border border-green-200">
              <div className="font-medium">✅ {typeof m === 'string' ? m : (m?.title || 'Milestone')}</div>
              {typeof m === 'object' && (
                <>
                  <div className="text-sm text-gray-700">{m?.description}</div>
                  <div className="text-xs text-gray-500">{m?.is_required ? 'Required milestone' : 'Optional milestone'}</div>
                </>
              )}
            </div>
          ))}
          {!achieved?.length && <div className="text-sm text-gray-600">No achieved milestones listed</div>}
        </div>
      </Card>

      {notAchievedCount > 0 && (
        <Card className="p-6">
          <div className="font-medium text-gray-800 mb-2">Milestones Not Achieved ({notAchievedCount})</div>
          <div className="text-sm text-gray-600">Details not provided in API; showing count based on totals.</div>
        </Card>
      )}

      <Card className="p-6">
        <div className="font-medium text-gray-800 mb-2">Teacher Notes</div>
        <div className="text-gray-700 whitespace-pre-line">{evaluation?.teacher_notes || 'No additional notes provided'}</div>
      </Card>

      <Card className="p-6">
        <div className="font-medium text-gray-800 mb-2">Teacher Recommendation</div>
        <div className="text-gray-700">{recommendationLabel(evaluation?.recommendation)}</div>
      </Card>

      <Card className="p-6">
        <div className="font-medium text-gray-800 mb-4">Evaluation Photos ({photos.length})</div>
        {photos.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((src, idx) => (
              <img key={idx} src={toPublicAssetUrl(src)} alt={`Photo ${idx + 1}`} className="w-full h-32 object-cover rounded cursor-pointer" onClick={() => openPhoto(idx)} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600">No photos uploaded</div>
        )}
      </Card>

      <Card className="p-6">
        <div className="font-medium text-gray-800 mb-2">Metadata</div>
        <div className="text-sm text-gray-700">Evaluation ID: {evaluation?.id}</div>
        {evaluation?.created_at && (<div className="text-sm text-gray-700">Created: {formatDateTime(evaluation?.created_at)}</div>)}
        {evaluation?.updated_at && (<div className="text-sm text-gray-700">Last Updated: {formatDateTime(evaluation?.updated_at)}</div>)}
        <div className="text-sm text-gray-700">Evaluated by: {t?.full_name} ({t?.employee_id})</div>
      </Card>

      <Modal isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} title={`Photo ${currentPhotoIndex + 1} of ${photos.length}`}>
        {photos.length > 0 && (
          <div className="space-y-3">
            <img src={toPublicAssetUrl(photos[currentPhotoIndex])} alt={`Photo ${currentPhotoIndex + 1}`} className="w-full max-h-[70vh] object-contain rounded" />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={prevPhoto}>Previous</Button>
              <Button variant="secondary" onClick={nextPhoto}>Next</Button>
              <Button variant="primary" onClick={() => {
                const url = toPublicAssetUrl(photos[currentPhotoIndex]);
                const a = document.createElement('a');
                a.href = url;
                a.download = `photo_${currentPhotoIndex + 1}.jpg`;
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}>Download</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}