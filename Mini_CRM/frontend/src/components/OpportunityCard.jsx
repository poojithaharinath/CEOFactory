import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, DollarSign, Edit3, Trash2, User } from 'lucide-react';

const OpportunityCard = ({ opportunity, onEdit, onDelete }) => {
  const { user } = useAuth();
  
  const isOwner = user && opportunity.owner && (opportunity.owner._id === user._id || opportunity.owner === user._id);
  const ownerName = opportunity.owner?.name || 'Unknown User';

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStageStyle = (stage) => {
    switch (stage) {
      case 'Won':
        return 'bg-emerald-55 text-emerald-700 border-emerald-200';
      case 'Lost':
        return 'bg-rose-55 text-rose-700 border-rose-200';
      case 'Proposal Sent':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Qualified':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'New':
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not scheduled';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between relative group hover:shadow-lg hover:shadow-slate-200/50 hover:border-indigo-200 transition-all duration-300">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3.5">
          <div className="text-left">
            <h3 className="font-semibold text-sm text-slate-800 mb-1 group-hover:text-indigo-650 transition-colors">
              {opportunity.customerName}
            </h3>
            <p className="text-[10px] text-slate-500 flex items-center gap-1.5 font-medium">
              <User className="h-3 w-3 text-slate-400" />
              <span>By <span className="font-semibold text-slate-600">{ownerName}</span></span>
              {isOwner && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 rounded">
                  Owner
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border ${getPriorityStyle(opportunity.priority)}`}>
              {opportunity.priority}
            </span>
            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border ${getStageStyle(opportunity.stage)}`}>
              {opportunity.stage}
            </span>
          </div>
        </div>

        <p className="text-slate-600 text-xs mb-4 line-clamp-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100/80 leading-relaxed text-left">
          {opportunity.requirement}
        </p>
      </div>

      <div className="mt-auto border-t border-slate-100 pt-3 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="flex items-center gap-2 text-slate-500">
            <DollarSign className="h-4 w-4 text-indigo-600" />
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Value</p>
              <p className="text-xs font-bold text-slate-700">
                {opportunity.estimatedValue !== undefined
                  ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(opportunity.estimatedValue)
                  : '$0'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Follow-up</p>
              <p className="text-xs font-bold text-slate-750">
                {formatDate(opportunity.nextFollowUpDate)}
              </p>
            </div>
          </div>
        </div>

        {opportunity.notes && (
          <div className="text-[10px] text-slate-500 bg-slate-50/50 p-2 rounded-lg border border-slate-100/60 italic text-left">
            "{opportunity.notes}"
          </div>
        )}

        <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100">
          <span className="text-[9px] text-slate-400 font-medium">
            Added {new Date(opportunity.createdAt).toLocaleDateString()}
          </span>

          {isOwner ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(opportunity)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
                title="Edit Opportunity"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(opportunity._id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                title="Delete Opportunity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-[9px] text-slate-400 italic">
              Read-only
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
