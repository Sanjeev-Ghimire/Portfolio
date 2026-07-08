// =============================
// POETRY DIARY MANAGEMENT
// =============================

const API_URL = '/api/poems';

// Get all poems from database
async function getAllPoems() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch poems');
    const poems = await response.json();
    return Array.isArray(poems) ? poems : [];
  } catch (error) {
    console.error('Error fetching poems:', error);
    return [];
  }
}

// Add new poem to database
async function addPoem(title, content, theme, mood) {
  try {
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

    if (!response.ok) throw new Error('Failed to create poem');
    const newPoem = await response.json();
    console.log('Poem saved to database:', newPoem);
    return newPoem;
  } catch (error) {
    console.error('Error adding poem:', error);
    alert('Error saving poem. Please try again.');
    return null;
  }
}

// Delete poem from database
async function deletePoem(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete poem');
    console.log('Poem deleted from database');
    return true;
  } catch (error) {
    console.error('Error deleting poem:', error);
    alert('Error deleting poem.');
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

    const date = new Date(poem.createdAt).toLocaleDateString();

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
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Poetry page loaded');
  
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

      if (title && content) {
        const result = await addPoem(title, content, theme, mood);
        
        if (result) {
          poemForm.reset();
          
          // Refresh display
          await displayPoems();
          showNotification('✨ Poem published successfully!');

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

// Refresh poems periodically (every 30 seconds)
setInterval(async () => {
  console.log('Refreshing poems...');
  await displayPoems();
}, 30000);
