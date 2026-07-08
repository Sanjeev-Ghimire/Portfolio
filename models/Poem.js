const mongoose = require('mongoose');

const poemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  theme: {
    type: String,
    enum: ['Love', 'Pain', 'Hope', 'Nature', 'Life', 'Dream', 'Other'],
    required: true
  },
  mood: {
    type: String,
    enum: ['Melancholic', 'Joyful', 'Thoughtful', 'Angry', 'Peaceful', 'Inspired'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Poem', poemSchema);
