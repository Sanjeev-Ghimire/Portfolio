// =============================
// POETRY DIARY MANAGEMENT
// =============================

const STORAGE_KEY = 'poems_diary';

// Initialize poetry collection from localStorage
function initializePoems() {
  const existingPoems = localStorage.getItem(STORAGE_KEY);
  if (!existingPoems) {
    const defaultPoems = [
      {
        id: 1,
        title: "Whispers of the Soul",
        content: "In the silence of the night,\nWhen thoughts dance like fireflies,\nI find solace in words unspoken,\nEmotions painted in midnight ink.",
        theme: "Life",
        mood: "Peaceful",
        date: new Date('2026-07-01').toLocaleDateString()
      },
      {
        id: 2,
        title: "Code and Dreams",
        content: "Lines of logic, verses of hope,\nBuilding bridges between reality and imagination,\nEvery function a prayer,\nEvery line a step towards tomorrow.",
        theme: "Dream",
        mood: "Inspired",
        date: new Date('2026-06-28').toLocaleDateString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPoems));
  }
}

// Get all poems
function getAllPoems() {
  const poems = localStorage.getItem(STORAGE_KEY);
  return poems ? JSON.parse(poems) : [];
}

// Add new poem
function addPoem(title, content, theme, mood) {
  const poems = getAllPoems();
  const newPoem = {
    id: Date.now(),
    title,
    content,
    theme,
    mood,
    date: new Date().toLocaleDateString()
  };
  poems.unshift(newPoem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(poems));
  return newPoem;
}

// Delete poem
function deletePoem(id) {
  let poems = getAllPoems();
  poems = poems.filter(poem => poem.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(poems));
}

// Display poems
function displayPoems() {
  const poemsList = document.getElementById('poemsList');
  const poems = getAllPoems();

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
          <span class="poem-tag">${poem.theme}</span>
          <span class="poem-tag">${poem.mood}</span>
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
    deletePoem(id);
    displayPoems();
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
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
  // Initialize poems on page load
  initializePoems();
  displayPoems();

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
        addPoem(title, content, theme, mood);
        poemForm.reset();
        displayPoems();

        // Show success message
        showNotification('Poem published successfully! ✨');

        // Scroll to poems
        setTimeout(() => {
          document.querySelector('.poetry-gallery').scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    });
  }
});

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

  document.head.appendChild(style);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
