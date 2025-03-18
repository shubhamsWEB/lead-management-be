const Lead = require('../models/leads');
const APIFeatures = require('../utils/apiFeatures');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

/**
 * @desc    Get all leads with filtering, sorting, and pagination
 * @route   GET /api/leads
 * @access  Public
 */
exports.getLeads = async (req, res, next) => {
  try {
    // Build features with filters and search
    const features = new APIFeatures(Lead.find(), req.query)
      .filter()
      .search();
    
    // Create a copy of the filtered query to get total count
    const countQuery = Lead.find(features.query.getFilter());
    
    // Continue with sorting, field limiting, and pagination
    features.sort().limitFields().paginate();
    
    // Execute query
    const leads = await features.query;
    
    // Get total count for pagination (now with filters applied)
    const total = await Lead.countDocuments(countQuery.getFilter());
    
    // Pagination info
    const { page, limit } = features.paginationInfo;
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        total,
        page,
        limit,
        totalPages
      },
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single lead by ID
 * @route   GET /api/leads/:id
 * @access  Public
 */
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new lead
 * @route   POST /api/leads
 * @access  Public
 */
exports.createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    
    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update lead
 * @route   PUT /api/leads/:id
 * @access  Public
 */
exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete lead
 * @route   DELETE /api/leads/:id
 * @access  Public
 */
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export leads as CSV
 * @route   GET /api/leads/export
 * @access  Public
 */
exports.exportLeads = async (req, res, next) => {
  try {
    // Get all leads without pagination
    const leads = await Lead.find();
    
    if (!leads || leads.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No leads found to export'
      });
    }
    
    // Configure CSV columns
    const csvStringifier = createCsvStringifier({
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'company', title: 'Company' },
        { id: 'stage', title: 'Stage' },
        { id: 'engaged', title: 'Engaged' },
        { id: 'lastContacted', title: 'Last Contacted' },
        { id: 'createdAt', title: 'Created At' }
      ]
    });
    
    // Format the data for CSV
    const records = leads.map(lead => ({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      stage: lead.stage,
      engaged: lead.engaged ? 'Yes' : 'No',
      lastContacted: lead.lastContacted ? lead.lastContacted.toISOString().split('T')[0] : 'Not contacted',
      createdAt: lead.createdAt.toISOString().split('T')[0]
    }));
    
    // Create CSV string
    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    
    // Send CSV data
    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};