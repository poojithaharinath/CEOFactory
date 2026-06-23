import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const OpportunityForm = ({ opportunity, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requirement: '',
    estimatedValue: '',
    stage: 'New',
    priority: 'Medium',
    nextFollowUpDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (opportunity) {
      setFormData({
        customerName: opportunity.customerName || '',
        contactName: opportunity.contactName || '',
        contactEmail: opportunity.contactEmail || '',
        contactPhone: opportunity.contactPhone || '',
        requirement: opportunity.requirement || '',
        estimatedValue: opportunity.estimatedValue !== undefined ? opportunity.estimatedValue : '',
        stage: opportunity.stage || 'New',
        priority: opportunity.priority || 'Medium',
        nextFollowUpDate: opportunity.nextFollowUpDate
          ? new Date(opportunity.nextFollowUpDate).toISOString().split('T')[0]
          : '',
        notes: opportunity.notes || '',
      });
    }
  }, [opportunity]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer or company name is required';
    }
    if (!formData.requirement.trim()) {
      newErrors.requirement = 'Requirement summary is required';
    }
    if (formData.contactEmail && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please provide a valid email format';
    }
    if (formData.estimatedValue !== '' && (isNaN(formData.estimatedValue) || Number(formData.estimatedValue) < 0)) {
      newErrors.estimatedValue = 'Value must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        ...formData,
        estimatedValue: formData.estimatedValue === '' ? 0 : Number(formData.estimatedValue),
      };
      await onSave(payload);
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || 'Failed to save opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {opportunity ? 'Edit Opportunity' : 'New Opportunity'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {submitError && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700 text-sm animate-shake">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-wider text-indigo-650 uppercase">
              Customer Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Company / Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Your Company Name"
                  className={`w-full bg-slate-50 border ${errors.customerName ? 'border-rose-450 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                    } rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                />
                {errors.customerName && (
                  <p className="text-xs text-rose-600 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Name of the Contact Person"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="Your Contact Email"
                  className={`w-full bg-slate-50 border ${errors.contactEmail ? 'border-rose-450 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                    } rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                />
                {errors.contactEmail && (
                  <p className="text-xs text-rose-600 mt-1">{errors.contactEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Your Contact Phone"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Opportunity Deal Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-[11px] font-bold tracking-wider text-indigo-650 uppercase">
              Deal Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Requirement Summary *
              </label>
              <textarea
                name="requirement"
                rows={3}
                value={formData.requirement}
                onChange={handleChange}
                placeholder="Describe user needs and deal scope..."
                className={`w-full bg-slate-50 border ${errors.requirement ? 'border-rose-450 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                  } rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all resize-none`}
              />
              {errors.requirement && (
                <p className="text-xs text-rose-600 mt-1">{errors.requirement}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Estimated Value ($)
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={`w-full bg-slate-50 border ${errors.estimatedValue ? 'border-rose-450 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
                    } rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all`}
                />
                {errors.estimatedValue && (
                  <p className="text-xs text-rose-600 mt-1">{errors.estimatedValue}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Pipeline Stage
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm text-slate-850 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Priority Label
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm text-slate-850 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  name="nextFollowUpDate"
                  value={formData.nextFollowUpDate}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Additional Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Needs approval by end of month"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-slate-200 rounded-xl transition duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Deal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityForm;
