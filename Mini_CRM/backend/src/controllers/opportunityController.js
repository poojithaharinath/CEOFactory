const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Private
const getOpportunities = async (req, res, next) => {
  try {
    // Populate the owner's name and email for display
    const opportunities = await Opportunity.find({})
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single opportunity
// @route   GET /api/opportunities/:id
// @access  Private
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('owner', 'name email');
    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private
const createOpportunity = async (req, res, next) => {
  try {
    const {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    } = req.body;

    if (!customerName || !requirement) {
      res.status(400);
      throw new Error('Customer name and requirement summary are required');
    }

    const opportunity = await Opportunity.create({
      owner: req.user._id, // derived from JWT token context
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    });

    const populatedOpportunity = await Opportunity.findById(opportunity._id).populate('owner', 'name email');
    res.status(201).json(populatedOpportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Owner-locked)
const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }

    // Owner authorization validation on the backend
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You are not the owner of this opportunity' });
    }

    // Update fields
    const {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    } = req.body;

    opportunity.customerName = customerName || opportunity.customerName;
    opportunity.contactName = contactName !== undefined ? contactName : opportunity.contactName;
    opportunity.contactEmail = contactEmail !== undefined ? contactEmail : opportunity.contactEmail;
    opportunity.contactPhone = contactPhone !== undefined ? contactPhone : opportunity.contactPhone;
    opportunity.requirement = requirement || opportunity.requirement;
    opportunity.estimatedValue = estimatedValue !== undefined ? estimatedValue : opportunity.estimatedValue;
    opportunity.stage = stage || opportunity.stage;
    opportunity.priority = priority || opportunity.priority;
    opportunity.nextFollowUpDate = nextFollowUpDate !== undefined ? nextFollowUpDate : opportunity.nextFollowUpDate;
    opportunity.notes = notes !== undefined ? notes : opportunity.notes;

    const updatedOpportunity = await opportunity.save();
    const populatedOpportunity = await Opportunity.findById(updatedOpportunity._id).populate('owner', 'name email');
    res.json(populatedOpportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Owner-locked)
const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }

    // Owner authorization validation on the backend
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You are not the owner of this opportunity' });
    }

    await opportunity.deleteOne();
    res.json({ message: 'Opportunity removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
