const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Use file-based storage
const poemsFile = path.join(__dirname, '../data/poems.json');
const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize poems file if it doesn't exist
if (!fs.existsSync(poemsFile)) {
  fs.writeFileSync(poemsFile, JSON.stringify([], null, 2), { encoding: 'utf8' });
}

// Helper functions for file operations with UTF-8 support
function readPoems() {
  try {
    const data = fs.readFileSync(poemsFile, { encoding: 'utf8' });
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading poems file:', error);
    return [];
  }
}

function writePoems(poems) {
  try {
    // Ensure UTF-8 encoding and proper formatting
    const jsonString = JSON.stringify(poems, null, 2);
    fs.writeFileSync(poemsFile, jsonString, { encoding: 'utf8' });
    console.log('✅ Poems saved successfully with UTF-8 encoding');
    return true;
  } catch (error) {
    console.error('Error writing poems file:', error);
    return false;
  }
}

// Get all poems
router.get('/poems', (req, res) => {
  try {
    const poems = readPoems();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(poems);
  } catch (error) {
    console.error('Error fetching poems:', error);
    res.status(500).json({ error: 'Failed to fetch poems' });
  }
});

// Create new poem
router.post('/poems', (req, res) => {
  try {
    let { title, content, theme, mood } = req.body;

    console.log('📥 Raw received data:', { 
      title: typeof title, 
      content: typeof content, 
      theme: typeof theme, 
      mood: typeof mood 
    });
    console.log('📥 Received values:', { title, content, theme, mood });

    // Convert to strings and trim
    title = String(title || '').trim();
    content = String(content || '').trim();
    theme = String(theme || '').trim();
    mood = String(mood || '').trim();

    console.log('📥 After processing:', { title, content, theme, mood });

    // Simple validation - just check if empty
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (!theme) {
      return res.status(400).json({ error: 'Theme is required' });
    }

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // Check length
    if (title.length > 500) {
      return res.status(400).json({ error: 'Title too long (max 500 characters)' });
    }

    if (content.length > 10000) {
      return res.status(400).json({ error: 'Content too long (max 10000 characters)' });
    }

    // Create new poem object
    const newPoem = {
      _id: Date.now().toString(),
      title: title,
      content: content,
      theme: theme,
      mood: mood,
      createdAt: new Date().toISOString()
    };

    console.log('✏️ Creating poem:', JSON.stringify(newPoem, null, 2));

    // Read existing poems
    const poems = readPoems();

    // Add new poem to beginning
    poems.unshift(newPoem);

    // Write back to file
    if (writePoems(poems)) {
      console.log('✅ Poem saved successfully:', newPoem._id);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.status(201).json(newPoem);
    } else {
      res.status(500).json({ error: 'Failed to save poem to storage' });
    }
  } catch (error) {
    console.error('❌ Error creating poem:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create poem',
      message: error.message,
      stack: error.stack
    });
  }
});

// Delete poem
router.delete('/poems/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting poem:', id);

    let poems = readPoems();
    const initialLength = poems.length;

    // Filter out the poem with matching id
    poems = poems.filter(poem => poem._id !== id);

    // Check if a poem was actually deleted
    if (poems.length === initialLength) {
      return res.status(404).json({ error: 'Poem not found' });
    }

    // Write updated poems
    if (writePoems(poems)) {
      console.log('✅ Poem deleted:', id);
      res.json({ message: 'Poem deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete poem' });
    }
  } catch (error) {
    console.error('❌ Error deleting poem:', error);
    res.status(500).json({ error: 'Failed to delete poem: ' + error.message });
  }
});

module.exports = router;
