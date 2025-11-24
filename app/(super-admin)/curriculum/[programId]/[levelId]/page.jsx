"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import {
  getLevelDetails,
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  reorderMilestones,
  updateLevel,
  clearLevelContent,
} from '@/lib/api/services/curriculumService';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Target, 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar,
  BookOpen,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  X,
  Save,
  AlertTriangle,
  Sparkles,
  FileText,
  Package
} from 'lucide-react';

export default function LevelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.programId;
  const levelId = params?.levelId;

  const [level, setLevel] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMilestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isLevelModalOpen, setLevelModalOpen] = useState(false);

  const [form, setForm] = useState({ milestone_name: '', description: '', how_to_evaluate: '' });
  const [levelForm, setLevelForm] = useState({
    level_name: '',
    description: '',
    learning_objectives: [],
    teaching_instructions: '',
    required_materials: [],
    duration_weeks: '',
    age_from: '',
    age_to: '',
  });
  const [newObjective, setNewObjective] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLevelDetails(levelId);
      if (!res.success) throw new Error(res.error || 'Failed to load level');
      const { level: lvl, milestones: mls, statistics } = res.data || {};
      setLevel(lvl);
      setMilestones(Array.isArray(mls) ? mls.sort((a, b) => Number(a.order_index) - Number(b.order_index)) : []);
      setStats(statistics || null);
      setLevelForm({
        level_name: lvl?.level_name || '',
        description: lvl?.description || '',
        learning_objectives: Array.isArray(lvl?.learning_objectives) ? [...lvl.learning_objectives] : [],
        teaching_instructions: lvl?.teaching_instructions || '',
        required_materials: Array.isArray(lvl?.required_materials) ? [...lvl.required_materials] : [],
        duration_weeks: typeof lvl?.duration_weeks === 'number' ? String(lvl.duration_weeks) : '',
        age_from: typeof lvl?.age_from === 'number' ? String(lvl.age_from) : '',
        age_to: typeof lvl?.age_to === 'number' ? String(lvl.age_to) : '',
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [levelId]);

  const openAddMilestone = () => {
    setEditingMilestone(null);
    setForm({ milestone_name: '', description: '', how_to_evaluate: '' });
    setMilestoneModalOpen(true);
  };
  const openEditMilestone = (m) => {
    setEditingMilestone(m);
    setForm({ milestone_name: m.milestone_name || '', description: m.description || '', how_to_evaluate: m.how_to_evaluate || '' });
    setMilestoneModalOpen(true);
  };
  const closeMilestoneModal = () => { setMilestoneModalOpen(false); setEditingMilestone(null); };

  const handleSaveMilestone = async () => {
    const milestone_name = form.milestone_name.trim();
    const description = form.description.trim();
    const how_to_evaluate = form.how_to_evaluate.trim();
    if (milestone_name.length < 3 || milestone_name.length > 255) { alert('Milestone name must be 3-255 characters.'); return; }
    if (description.length < 10 || description.length > 500) { alert('Description must be 10-500 characters.'); return; }
    if (how_to_evaluate && how_to_evaluate.length < 3) { alert('Evaluation method must be at least 3 characters if provided.'); return; }
    setSaving(true);
    try {
      if (editingMilestone) {
        const res = await updateMilestone(editingMilestone.id, { milestone_name, description, how_to_evaluate });
        if (!res.success) throw new Error(res.error || 'Failed to update milestone');
        const updated = milestones.map((m) => m.id === editingMilestone.id ? { ...m, milestone_name, description, how_to_evaluate } : m);
        setMilestones(updated.sort((a, b) => Number(a.order_index) - Number(b.order_index)));
      } else {
        const nextIndex = milestones.length ? Math.max(...milestones.map((m) => Number(m.order_index))) + 1 : 1;
        const nextNumber = milestones.length
          ? Math.max(...milestones.map((m) => Number(m.milestone_number ?? m.order_index ?? 0))) + 1
          : 1;
        const res = await createMilestone(levelId, {
          milestone_number: nextNumber,
          milestone_name,
          description,
          how_to_evaluate,
          order_index: nextIndex,
        });
        if (!res.success) throw new Error(res.error || 'Failed to create milestone');
        await load();
      }
      closeMilestoneModal();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const moveMilestone = async (milestoneId, direction) => {
    const idx = milestones.findIndex((m) => m.id === milestoneId);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= milestones.length) return;

    const newList = [...milestones];
    const a = newList[idx];
    const b = newList[swapIdx];
    const aIndex = Number(a.order_index);
    const bIndex = Number(b.order_index);
    newList[idx] = { ...b, order_index: aIndex };
    newList[swapIdx] = { ...a, order_index: bIndex };
    setMilestones(newList);
    try {
      const payload = newList.map((m) => ({ milestone_id: m.id, order_index: Number(m.order_index) }));
      const res = await reorderMilestones(levelId, payload);
      if (!res.success) throw new Error(res.error || 'Failed to reorder milestones');
    } catch (e) {
      alert(e.message);
      setMilestones(milestones);
    }
  };

  const handleDeleteMilestone = async (m) => {
    if (!confirm(`Delete milestone "${m.milestone_name}"? This action cannot be undone.`)) return;
    try {
      const res = await deleteMilestone(m.id);
      if (!res.success) throw new Error(res.error || 'Failed to delete milestone');
      setMilestones(milestones.filter((x) => x.id !== m.id));
    } catch (e) {
      alert(e.message || 'Cannot delete milestone. It may be used in evaluations.');
    }
  };

  const handleSaveLevel = async () => {
    const name = levelForm.level_name.trim();
    const desc = levelForm.description.trim();
    if (name.length < 3 || name.length > 255) { alert('Level name must be 3-255 characters.'); return; }
    if (desc.length < 10 || desc.length > 500) { alert('Description must be 10-500 characters.'); return; }
    const objectives = Array.isArray(levelForm.learning_objectives) ? levelForm.learning_objectives.map((s) => String(s).trim()).filter(Boolean) : [];
    const materials = Array.isArray(levelForm.required_materials) ? levelForm.required_materials.map((s) => String(s).trim()).filter(Boolean) : [];
    const teaching = (levelForm.teaching_instructions || '').trim();
    const duration = Number(levelForm.duration_weeks || 0);
    const ageFrom = Number(levelForm.age_from || 0);
    const ageTo = Number(levelForm.age_to || 0);
    if (!Number.isFinite(duration) || duration < 0) { alert('Duration (weeks) must be a non-negative number.'); return; }
    if (!Number.isFinite(ageFrom) || !Number.isFinite(ageTo) || ageFrom < 0 || ageTo < 0) { alert('Age range must be non-negative numbers.'); return; }
    if (ageFrom > ageTo) { alert('Age from cannot be greater than age to.'); return; }
    setSaving(true);
    try {
      const payload = {
        level_name: name,
        description: desc,
        learning_objectives: objectives,
        teaching_instructions: teaching,
        required_materials: materials,
        duration_weeks: duration,
        age_from: ageFrom,
        age_to: ageTo,
      };
      const res = await updateLevel(levelId, payload);
      if (!res.success) throw new Error(res.error || 'Failed to update level');
      await load();
      setLevelModalOpen(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClearLevel = async () => {
    if (!confirm('Clear all content for this level? This keeps the level placeholder but removes its milestones and details.')) return;
    try {
      const res = await clearLevelContent(levelId);
      if (!res.success) throw new Error(res.error || 'Failed to clear level');
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  const completion = useMemo(() => {
    let rate = stats?.success_rate;
    if (typeof rate !== 'number') return null;
    if (rate <= 1) rate = rate * 100;
    return Math.max(0, Math.min(100, rate));
  }, [stats]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (<div key={i} className="rounded-2xl p-6 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse h-24" />))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-start gap-3 p-5 rounded-xl border-2 border-red-200 bg-red-50">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 hover:bg-gray-50 font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2.5 py-1 bg-purple-100 rounded-lg">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                  Level {level?.level_number}
                </span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {level?.level_name}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setLevelModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
          >
            <Edit className="w-4 h-4" strokeWidth={2.5} />
            Edit Info
          </Button>
          <Button 
            variant="danger" 
            onClick={handleClearLevel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            Clear Content
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-white p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Students</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.students_at_level ?? '—'}</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-white p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Completed</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.completed_students ?? '—'}</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-white p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Success Rate</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {completion != null ? `${completion.toFixed(1)}%` : '—'}
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border-2 border-orange-200 bg-white p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Duration</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {level?.duration_weeks != null ? `${level.duration_weeks}w` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Level Details Card */}
      <Card className="rounded-2xl border-2 border-gray-200 bg-white p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-200">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
            <BookOpen className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Level Details</h2>
        </div>

        <div className="space-y-4">
          {level?.program?.name && (
            <div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Program</span>
              <p className="text-sm font-semibold text-gray-900 mt-1">{level.program.name}</p>
            </div>
          )}

          <div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Description</span>
            <p className="text-sm text-gray-700 leading-relaxed font-medium mt-1">{level?.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Age Range</span>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {level?.age_from != null && level?.age_to != null ? `${level.age_from}–${level.age_to} years` : '—'}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Duration</span>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {level?.duration_weeks != null ? `${level.duration_weeks} week${Number(level.duration_weeks) === 1 ? '' : 's'}` : '—'}
              </p>
            </div>
          </div>

          {Array.isArray(level?.learning_objectives) && level.learning_objectives.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Learning Objectives</span>
              </div>
              <ul className="space-y-1.5">
                {level.learning_objectives.map((lo, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                    <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{lo}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(level?.required_materials) && level.required_materials.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Required Materials</span>
              </div>
              <ul className="space-y-1.5">
                {level.required_materials.map((rm, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                    <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2" />
                    <span>{rm}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {level?.teaching_instructions && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Teaching Instructions</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{level.teaching_instructions}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Milestones Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl shadow-sm">
            <Target className="w-5 h-5 text-pink-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Milestones ({milestones.length})
          </h2>
        </div>
        <Button 
          variant="primary" 
          onClick={openAddMilestone}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add Milestone
        </Button>
      </div>

      {/* Milestones List */}
      <div className="grid gap-3">
        {milestones.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner w-fit mx-auto mb-4">
              <Target className="h-10 w-10 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-base font-semibold text-gray-600 mb-1">No milestones yet</p>
            <p className="text-sm text-gray-500">Add the first milestone to start building this level</p>
          </div>
        ) : milestones.map((m, i) => (
          <Card key={m.id} className="group rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 rounded-xl flex items-center justify-center text-base font-bold shadow-sm">
                {i + 1}
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="font-bold text-gray-900">{m.milestone_name}</h3>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{m.description}</p>
                {m.how_to_evaluate && (
                  <div className="flex items-start gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div>
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wide block mb-1">Evaluation</span>
                      <span className="text-xs text-blue-600 font-medium">{m.how_to_evaluate}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded-lg">Order: {m.order_index}</span>
                  {m.milestone_number != null && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">No. {m.milestone_number}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => moveMilestone(m.id, 'up')}
                  className="p-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all duration-200"
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => moveMilestone(m.id, 'down')}
                  className="p-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all duration-200"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => openEditMilestone(m)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => handleDeleteMilestone(m)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Milestone Modal - keeping original functionality but with modern styling */}
      {isMilestoneModalOpen && (
        <Modal>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="relative overflow-hidden p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-30" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
                    <Target className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingMilestone ? 'Edit Milestone' : 'Add Milestone'}
                  </h3>
                </div>
                <button
                  onClick={closeMilestoneModal}
                  className="p-2 text-gray-500 hover:bg-white/80 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Milestone Name *
                </label>
                <Input 
                  value={form.milestone_name} 
                  onChange={(e) => setForm({ ...form, milestone_name: e.target.value })} 
                  placeholder="e.g., Addition 1-10"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Description *
                </label>
                <textarea 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium resize-none" 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  placeholder="Describe what students will learn..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  How to Evaluate (Optional)
                </label>
                <Input 
                  value={form.how_to_evaluate} 
                  onChange={(e) => setForm({ ...form, how_to_evaluate: e.target.value })} 
                  placeholder="e.g., By hand, quiz, project"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 p-6 border-t-2 border-gray-200 bg-gray-50">
              <Button 
                variant="secondary" 
                onClick={closeMilestoneModal}
                className="flex-1 px-4 py-3 rounded-xl font-bold"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                disabled={saving} 
                onClick={handleSaveMilestone}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold shadow-md hover:shadow-lg"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" strokeWidth={2.5} />
                    <span>Save Milestone</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isLevelModalOpen && (
        <Modal isOpen={isLevelModalOpen} onClose={() => setLevelModalOpen(false)} title="Edit Level" size="lg">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide px-2">Level Name *</label>
              <Input value={levelForm.level_name} onChange={(e) => setLevelForm({ ...levelForm, level_name: e.target.value })} placeholder="Level name" className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Description *</label>
              <textarea rows="4" value={levelForm.description} onChange={(e) => setLevelForm({ ...levelForm, description: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium resize-none" placeholder="Describe this level" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Learning Objectives</label>
                <div className="flex gap-2">
                  <Input value={newObjective} onChange={(e) => setNewObjective(e.target.value)} placeholder="Add objective" className="px-3 py-2 border-2 border-gray-200 rounded-xl" />
                  <Button variant="primary" onClick={() => { const v = String(newObjective).trim(); if (!v) return; setLevelForm({ ...levelForm, learning_objectives: [...(levelForm.learning_objectives || []), v] }); setNewObjective(''); }}>Add</Button>
                </div>
              </div>
              {Array.isArray(levelForm.learning_objectives) && levelForm.learning_objectives.length > 0 && (
                <ul className="space-y-2">
                  {levelForm.learning_objectives.map((lo, idx) => (
                    <li key={idx} className="flex items-center gap-3 p-2 border-2 border-gray-200 rounded-xl">
                      <span className="text-sm font-medium flex-1">{lo}</span>
                      <Button variant="outline" onClick={() => setLevelForm({ ...levelForm, learning_objectives: levelForm.learning_objectives.filter((_, i) => i !== idx) })}>Remove</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Teaching Instructions</label>
              <textarea rows="3" value={levelForm.teaching_instructions} onChange={(e) => setLevelForm({ ...levelForm, teaching_instructions: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium resize-none" placeholder="Guidance for teaching" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Required Materials</label>
                <div className="flex gap-2">
                  <Input value={newMaterial} onChange={(e) => setNewMaterial(e.target.value)} placeholder="Add material" className="px-3 py-2 border-2 border-gray-200 rounded-xl" />
                  <Button variant="primary" onClick={() => { const v = String(newMaterial).trim(); if (!v) return; setLevelForm({ ...levelForm, required_materials: [...(levelForm.required_materials || []), v] }); setNewMaterial(''); }}>Add</Button>
                </div>
              </div>
              {Array.isArray(levelForm.required_materials) && levelForm.required_materials.length > 0 && (
                <ul className="space-y-2">
                  {levelForm.required_materials.map((rm, idx) => (
                    <li key={idx} className="flex items-center gap-3 p-2 border-2 border-gray-200 rounded-xl">
                      <span className="text-sm font-medium flex-1">{rm}</span>
                      <Button variant="outline" onClick={() => setLevelForm({ ...levelForm, required_materials: levelForm.required_materials.filter((_, i) => i !== idx) })}>Remove</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Duration (weeks)</label>
                <Input type="number" value={levelForm.duration_weeks} onChange={(e) => setLevelForm({ ...levelForm, duration_weeks: e.target.value })} placeholder="e.g., 12" className="px-4 py-3 border-2 border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Age From</label>
                <Input type="number" value={levelForm.age_from} onChange={(e) => setLevelForm({ ...levelForm, age_from: e.target.value })} placeholder="e.g., 6" className="px-4 py-3 border-2 border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Age To</label>
                <Input type="number" value={levelForm.age_to} onChange={(e) => setLevelForm({ ...levelForm, age_to: e.target.value })} placeholder="e.g., 10" className="px-4 py-3 border-2 border-gray-200 rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setLevelModalOpen(false)} className="px-6 py-2.5 rounded-xl">Cancel</Button>
              <Button variant="primary" onClick={handleSaveLevel} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">Save</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
