const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  cloneLink: {
    type: String,
    required: true,
    trim: true
  },
  authorizationPass: {
    type: String,
    required: true,
    trim: true
  },
  frontendEnv: {
    type: String,
    default: '',
    trim: true
  },
  backendEnv: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
