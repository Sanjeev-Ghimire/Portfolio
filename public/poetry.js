// =============================
// POETRY DIARY MANAGEMENT
// =============================

const API_URL = '/api/poems';

// Get all poems from API
async function getAllPoems() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.error('Failed to fetch poems:', response.status, response.statusText);
      throw new Error(`Failed to fetch poems: ${response.statusText}`);
    }
    const poems = await response.json();
    return Array.isArray(poems) ? poems : [];
  } catch (error) {
    console.error('Error fetching poems:', error);
    showNotification('⚠️ Error loading poems', 'error');
    return [];
  }
}

// Add new poem to API
async function addPoem(title, content, theme, mood) {
  try {
    console.log('Sending poem:', { title, content, theme, mood });
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        theme,
        mood
      })
    });

    console.log('Response status:', response.status);
    const responseData = await response.json();
    console.log('Response data:', responseData);

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to create poem');
    }

    console.log('✅ Poem saved to API:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error adding poem:', error);
    showNotification('❌ Error saving poem: ' + error.message, 'error');
    return null;
  }
}

// Delete poem from API
async function deletePoem(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete poem');
    }

    console.log('✅ Poem deleted from API');
    return true;
  } catch (error) {
    console.error('Error deleting poem:', error);
    showNotification('❌ Error deleting poem: ' + error.message, 'error');
    return false;
  }
}

// Display poems
async function displayPoems() {
  const poemsList = document.getElementById('poemsList');
  if (!poemsList) return;

  const poems = await getAllPoems();
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

    const date = poem.createdAt 
      ? new Date(poem.createdAt).toLocaleDateString() 
      : 'Unknown date';

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
        <span class="poem-date">${date}</span>
        <div class="poem-actions">
          <button class="btn-delete" onclick="handleDeletePoem('${poem._id}')">Delete</button>
        </div>
      </div>
    `;

    poemsList.appendChild(poemCard);
  });
}

// Handle delete poem
async function handleDeletePoem(id) {
  if (confirm('Are you sure you want to delete this poem?')) {
    if (await deletePoem(id)) {
      await displayPoems();
      showNotification('✨ Poem deleted successfully');
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
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.textContent = message;
  
  const bgColor = type === 'error' ? '#ff3b3b' : '#d4af37';
  const textColor = type === 'error' ? '#fafafa' : '#09090b';
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    background: ${bgColor};
    color: ${textColor};
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: 600;
    z-index: 10000;
    max-width: 400px;
    animation: slideIn 0.4s ease-out, slideOut 0.4s ease-out 2.6s forwards;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
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
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎭 Poetry page loaded');
  
  // Load poems on page load
  await displayPoems();

  // Form submission handler
  const poemForm = document.getElementById('poemForm');
  if (poemForm) {
    poemForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('poemTitle').value.trim();
      const content = document.getElementById('poemContent').value.trim();
      const theme = document.getElementById('poemTheme').value;
      const mood = document.getElementById('poemMood').value;

      console.log('Form submitted:', { title, content, theme, mood });

      if (!title) {
        showNotification('❌ Please enter a poem title', 'error');
        return;
      }

      if (!content) {
        showNotification('❌ Please enter poem content', 'error');
        return;
      }

      if (!theme) {
        showNotification('❌ Please select a theme', 'error');
        return;
      }

      if (!mood) {
        showNotification('❌ Please select a mood', 'error');
        return;
      }

      const result = await addPoem(title, content, theme, mood);
      
      if (result) {
        poemForm.reset();
        
        // Refresh display after a small delay
        setTimeout(async () => {
          await displayPoems();
          showNotification('✨ Poem published successfully!');
        }, 200);

        // Scroll to poems
        setTimeout(() => {
          const poetryGallery = document.querySelector('.poetry-gallery');
          if (poetryGallery) {
            poetryGallery.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    });
  } else {
    console.warn('Poem form not found');
  }
});

// Refresh poems periodically (every 30 seconds)
setInterval(async () => {
  console.log('🔄 Auto-refreshing poems...');
  await displayPoems();
}, 30000);
