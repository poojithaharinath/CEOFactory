const mongoose = require('mongoose');

const opportunitySchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    customerName: {
      type: String,
      required: [true, 'Please add a customer or company name'],
    },
    contactName: {
      type: String,
    },
    contactEmail: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid contact email',
      ],
    },
    contactPhone: {
      type: String,
    },
    requirement: {
      type: String,
      required: [true, 'Please add a requirement / need summary'],
    },
    estimatedValue: {
      type: Number,
      min: [0, 'Estimated value must be non-negative'],
      default: 0,
    },
    stage: {
      type: String,
      required: true,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
      default: 'New',
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    nextFollowUpDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
