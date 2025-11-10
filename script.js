// Custom cursor
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Clock
function startClock() {
  function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent =
      now.toLocaleTimeString('en-GB', { hour12: false });
  }
  updateClock();
  setInterval(updateClock, 1000);
}
startClock();

// Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const caseCards = document.querySelectorAll('.case-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    caseCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      card.style.display = (filter === 'all' || categories.includes(filter)) ? 'block' : 'none';
    });
  });
});

// Case Study Detail View
const caseDetail = document.getElementById('case-detail');
const backHome = document.getElementById('back-home');
const detailImage = document.getElementById('detail-image');
const detailTitle = document.getElementById('detail-title');
const detailTags = document.getElementById('detail-tags');
const detailDesc = document.getElementById('detail-desc');
const cardsContainer = document.querySelector('.cards');
const filtersContainer = document.querySelector('.filters');

// Handle "View Case Study" button click
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.target.closest('.case-card');
    detailImage.src = card.querySelector('img').src;
    detailTitle.textContent = card.querySelector('h3').textContent;
    detailTags.textContent = card.querySelector('.tags').textContent;
    detailDesc.textContent = card.querySelector('.desc').textContent;

    // Hide main view
    cardsContainer.style.display = 'none';
    filtersContainer.style.display = 'none';

    // Show detail view
    caseDetail.classList.remove('hidden');

    // Update breadcrumb
    backHome.innerHTML = `← home / ${card.querySelector('h3').textContent}`;
  });
});

// Handle "back home"
backHome.addEventListener('click', e => {
  e.preventDefault();
  caseDetail.classList.add('hidden');
  cardsContainer.style.display = 'flex';
  filtersContainer.style.display = 'flex';
});
