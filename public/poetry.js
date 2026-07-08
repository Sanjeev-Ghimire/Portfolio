// =============================
// POETRY DIARY MANAGEMENT
// =============================

const STORAGE_KEY = 'sanjeev_poems_diary_v1';

// Check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Initialize poetry collection from localStorage
function initializePoems() {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available');
    return;
  }

  let existingPoems = localStorage.getItem(STORAGE_KEY);
  
  if (!existingPoems || existingPoems === 'undefined' || existingPoems === '[]') {
    const defaultPoems = [
      {
        id: Date.now() - 100000,
        title: "Whispers of the Soul",
        content: "In the silence of the night,\nWhen thoughts dance like fireflies,\nI find solace in words unspoken,\nEmotions painted in midnight ink.",
        theme: "Life",
        mood: "Peaceful",
        date: new Date(Date.now() - 86400000 * 7).toLocaleDateString()
      },
      {
        id: Date.now() - 50000,
        title: "Code and Dreams",
        content: "Lines of logic, verses of hope,\nBuilding bridges between reality and imagination,\nEvery function a prayer,\nEvery line a step towards tomorrow.",
        theme: "Dream",
        mood: "Inspired",
        date: new Date(Date.now() - 86400000 * 3).toLocaleDateString()
      }
    ];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPoems));
      console.log('Default poems initialized');
    } catch (e) {
      console.error('Failed to save default poems:', e);
    }
  }
}

// Get all poems
function getAllPoems() {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available');
    return [];
  }

  try {
    const poemsData = localStorage.getItem(STORAGE_KEY);
    
    if (!poemsData || poemsData === 'undefined') {
      return [];
    }
    
    const poems = JSON.parse(poemsData);
    return Array.isArray(poems) ? poems : [];
  } catch (e) {
    console.error('Error reading poems from localStorage:', e);
    return [];
  }
}

// Add new poem
function addPoem(title, content, theme, mood) {
  if (!isLocalStorageAvailable()) {
    alert('Storage not available. Poem could not be saved.');
    return null;
  }

  try {
    const poems = getAllPoems();
    const newPoem = {
      id: Date.now(),
      title: title,
      content: content,
      theme: theme,
      mood: mood,
      date: new Date().toLocaleDateString()
    };
    
    // Add to beginning of array
    poems.unshift(newPoem);
    
    // Save to localStorage
    const jsonString = JSON.stringify(poems);
    localStorage.setItem(STORAGE_KEY, jsonString);
    
    // Verify it was saved
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      throw new Error('Failed to verify save');
    }
    
    console.log('Poem saved successfully:', newPoem);
    return newPoem;
  } catch (e) {
    console.error('Error adding poem:', e);
    alert('Error saving poem. Please try again.');
    return null;
  }
}

// Delete poem
function deletePoem(id) {
  if (!isLocalStorageAvailable()) {
    alert('Storage not available.');
    return false;
  }

  try {
    let poems = getAllPoems();
    const originalLength = poems.length;
    poems = poems.filter(poem => poem.id !== id);
    
    if (poems.length < originalLength) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(poems));
      console.log('Poem deleted successfully');
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error deleting poem:', e);
    alert('Error deleting poem.');
    return false;
  }
}

// Display poems
function displayPoems() {
  const poemsList = document.getElementById('poemsList');
  if (!poemsList) return;

  const poems = getAllPoems();
  console.log('Displaying poems:', poems);

  if (poems.length === 0) {
    poemsList.innerHTML = `
      <div class="no-poems">
        <p>No poems yet. Start writing your first poem! 📝</p>
      </div>
    `;
    return;
  }

  poemsList.innerHTML = '';

  poems.forEach((poem, index) => {
    const poemCard = document.createElement('div');
    poemCard.className = 'poem-card';
    poemCard.style.animationDelay = `${index * 0.1}s`;

    poemCard.innerHTML = `
      <div class="poem-header">
        <h3 class="poem-title">${escapeHtml(poem.title)}</h3>
        <div class="poem-meta">
          <span class="poem-tag">${escapeHtml(poem.theme)}</span>
          <span class="poem-tag">${escapeHtml(poem.mood)}</span>
        </div>
      </div>
      <div class="poem-content">${escapeHtml(poem.content)}</div>
      <div class="poem-footer">
        <span class="poem-date">${poem.date}</span>
        <div class="poem-actions">
          <button class="btn-delete" onclick="handleDeletePoem(${poem.id})">Delete</button>
        </div>
      </div>
    `;

    poemsList.appendChild(poemCard);
  });
}

// Handle delete poem
function handleDeletePoem(id) {
  if (confirm('Are you sure you want to delete this poem?')) {
    if (deletePoem(id)) {
      displayPoems();
      showNotification('Poem deleted successfully');
    }
  }
}

// Escape HTML for security
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Notification function
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    background: #d4af37;
    color: #09090b;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.4s ease-out, slideOut 0.4s ease-out 2.6s forwards;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;

  if (!document.querySelector('style[data-notification]')) {
    style.setAttribute('data-notification', 'true');
    document.head.appendChild(style);
  }
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
  console.log('Poetry page loaded');
  
  // Initialize poems on page load
  initializePoems();
  
  // Wait a moment to ensure initialization is complete
  setTimeout(() => {
    displayPoems();
  }, 100);

  // Form submission handler
  const poemForm = document.getElementById('poemForm');
  if (poemForm) {
    poemForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('poemTitle').value.trim();
      const content = document.getElementById('poemContent').value.trim();
      const theme = document.getElementById('poemTheme').value;
      const mood = document.getElementById('poemMood').value;

      if (title && content) {
        const result = addPoem(title, content, theme, mood);
        
        if (result) {
          poemForm.reset();
          
          // Refresh display after a small delay
          setTimeout(() => {
            displayPoems();
            showNotification('✨ Poem published successfully!');
          }, 100);

          // Scroll to poems
          setTimeout(() => {
            const poetryGallery = document.querySelector('.poetry-gallery');
            if (poetryGallery) {
              poetryGallery.scrollIntoView({ behavior: 'smooth' });
            }
          }, 500);
        }
      } else {
        alert('Please fill in all fields.');
      }
    });
  }
});

// Debug: Log storage on page load
window.addEventListener('load', () => {
  console.log('Page fully loaded');
  console.log('Current poems:', getAllPoems());
  console.log('Storage size:', new Blob([localStorage.getItem(STORAGE_KEY) || '']).size, 'bytes');
});
