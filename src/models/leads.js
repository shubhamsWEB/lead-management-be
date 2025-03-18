const mongoose = require('mongoose');

// Define Lead Schema based on the UI mockup
const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true
    },
    stage: {
      type: String,
      enum: ['I', 'II', 'III', 'IIII'],
      default: 'I'
    },
    engaged: {
      type: Boolean,
      default: false
    },
    lastContacted: {
      type: Date,
      default: null
    },
    // Adding initials field for the avatar display in the UI
    initials: {
      type: String,
      maxlength: 2
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for search capability
LeadSchema.index({ name: 'text', email: 'text', company: 'text' });

// Pre-save middleware to generate initials
LeadSchema.pre('save', function(next) {
  if (this.name) {
    const nameParts = this.name.split(' ');
    if (nameParts.length >= 2) {
      this.initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      this.initials = nameParts[0].substring(0, 2).toUpperCase();
    }
  }
  next();
});

module.exports = mongoose.model('Lead', LeadSchema);