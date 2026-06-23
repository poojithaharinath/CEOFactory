import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import OpportunityCard from '../components/OpportunityCard';
import OpportunityForm from '../components/OpportunityForm';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  FolderOpen
} from 'lucide-react';

const Dashboard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Search
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, value_desc, value_asc, follow_up
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  // Fetch opportunities on load
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/api/opportunities');
      setOpportunities(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch pipeline opportunities. Please check database connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingOpportunity) {
        await api.put(`/api/opportunities/${editingOpportunity._id}`, formData);
      } else {
        await api.post('/api/opportunities', formData);
      }
      setIsFormOpen(false);
      setEditingOpportunity(null);
      fetchOpportunities();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      setError('');
      await api.delete(`/api/opportunities/${id}`);
      fetchOpportunities();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unauthorized action: Failed to delete opportunity');
    }
  };

  const openEditModal = (opp) => {
    setEditingOpportunity(opp);
    setIsFormOpen(true);
  };

  const openCreateModal = () => {
    setEditingOpportunity(null);
    setIsFormOpen(true);
  };

  // Metrics calculations
  const totalPipelineValue = opportunities.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const wonValue = opportunities
    .filter(opp => opp.stage === 'Won')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const highPriorityCount = opportunities.filter(opp => opp.priority === 'High').length;

  // Process sorting and filtering
  const filteredOpportunities = opportunities
    .filter((opp) => {
      const matchesStage = stageFilter === 'All' || opp.stage === stageFilter;
      const matchesPriority = priorityFilter === 'All' || opp.priority === priorityFilter;
      const matchesSearch = 
        opp.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.requirement && opp.requirement.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (opp.contactName && opp.contactName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStage && matchesPriority && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'value_desc') {
        return (b.estimatedValue || 0) - (a.estimatedValue || 0);
      }
      if (sortBy === 'value_asc') {
        return (a.estimatedValue || 0) - (b.estimatedValue || 0);
      }
      if (sortBy === 'follow_up') {
        if (!a.nextFollowUpDate) return 1;
        if (!b.nextFollowUpDate) return -1;
        return new Date(a.nextFollowUpDate) - new Date(b.nextFollowUpDate);
      }
      return 0;
    });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Error notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-700 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-650" />
            <span>{error}</span>
          </div>
        )}

        {/* Dashboard summary stats - Clean Light Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-sm shadow-slate-100">
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pipeline</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                {formatCurrency(totalPipelineValue)}
              </h2>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-sm shadow-slate-100">
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Closed Deals Won</p>
              <h2 className="text-2xl font-bold text-emerald-600 mt-1">
                {formatCurrency(wonValue)}
              </h2>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-sm shadow-slate-100">
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">High Priority Deals</p>
              <h2 className="text-2xl font-bold text-rose-600 mt-1">
                {highPriorityCount}
              </h2>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Controls Board */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm shadow-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Deals Pipeline
              </h2>
              <p className="text-xs text-slate-500">
                Monitor and process opportunities across active pipeline stages
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Opportunity</span>
            </button>
          </div>

          {/* Filtering and Search Controls */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="All">All Stages</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="value_desc">Value: High to Low</option>
                <option value="value_asc">Value: Low to High</option>
                <option value="follow_up">Sort by: Follow-up Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities Pipelines Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
            <p className="text-xs text-slate-400 font-medium">Loading opportunities...</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto shadow-sm">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-400 mb-3 border border-slate-200/60">
              <FolderOpen className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">No opportunities found</h3>
            <p className="text-xs text-slate-500 mb-5 max-w-xs">
              Create an opportunity or refine your filters to browse the pipeline.
            </p>
            <button
              onClick={openCreateModal}
              className="bg-slate-50 hover:bg-slate-100 text-indigo-650 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              Create New Deal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity._id}
                opportunity={opportunity}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Opportunity Creation/Editing Modal */}
      {isFormOpen && (
        <OpportunityForm
          opportunity={editingOpportunity}
          onClose={() => {
            setIsFormOpen(false);
            setEditingOpportunity(null);
          }}
          onSave={handleCreateOrUpdate}
        />
      )}
    </div>
  );
};

export default Dashboard;
