const express = require('express');
const router = express.Router();
const Poem = require('../models/Poem');

// Get all poems
router.get('/api/poems', async (req, res) => {
  try {
    const poems = await Poem.find().sort({ createdAt: -1 });
    res.json(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
    res.status(500).json({ error: 'Failed to fetch poems' });
  }
});

// Create new poem
router.post('/api/poems', async (req, res) => {
  try {
    const { title, content, theme, mood } = req.body;

    if (!title || !content || !theme || !mood) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const poem = new Poem({
      title,
      content,
      theme,
      mood
    });

    const savedPoem = await poem.save();
    res.status(201).json(savedPoem);
  } catch (error) {
    console.error('Error creating poem:', error);
    res.status(500).json({ error: 'Failed to create poem' });
  }
});

// Delete poem
router.delete('/api/poems/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPoem = await Poem.findByIdAndDelete(id);
    
    if (!deletedPoem) {
      return res.status(404).json({ error: 'Poem not found' });
    }

    res.json({ message: 'Poem deleted successfully' });
  } catch (error) {
    console.error('Error deleting poem:', error);
    res.status(500).json({ error: 'Failed to delete poem' });
  }
});

module.exports = router;
