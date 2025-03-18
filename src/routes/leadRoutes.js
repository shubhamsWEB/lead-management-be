const express = require('express');
const { 
  getLeads, 
  getLead, 
  createLead, 
  updateLead, 
  deleteLead,
  exportLeads
} = require('../controllers/leadController');
const { validateLeadInput,validateUpdateLeadInput } = require('../middleware/validator');

const router = express.Router();

router.route('/')
  .get(getLeads)
  .post(validateLeadInput, createLead);

router.route('/export')
  .get(exportLeads);

router.route('/:id')
  .get(getLead)
  .put(validateUpdateLeadInput, updateLead)
  .delete(deleteLead);

module.exports = router;