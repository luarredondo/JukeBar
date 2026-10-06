// Sélection des éléments HTML
const galleryImages = document.querySelectorAll('.gallery-item img, .gallery-img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const closeBtn = document.getElementById('close-btn');

let currentIndex = 0;

// Met à jour l'affichage de l'image et la visibilité des boutons
function showImage(index) {
  currentIndex = index;
  lightboxImg.src = galleryImages[currentIndex].src;
  updateButtons();
}

// Gère l'affichage des flèches
function updateButtons() {
  // Masque la flèche gauche sur la 1ère photo
  prevBtn.style.display = (currentIndex === 0) ? 'none' : 'flex';

  // Masque la flèche droite sur la dernière photo
  nextBtn.style.display = (currentIndex === galleryImages.length - 1) ? 'none' : 'flex';
}

// Clic sur une image de la galerie
galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    showImage(index);
    lightbox.showModal();
  });
});

// Image suivante (bloque à la dernière)
nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentIndex < galleryImages.length - 1) {
    showImage(currentIndex + 1);
  }
});

// Image précédente (bloque à la première)
prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentIndex > 0) {
    showImage(currentIndex - 1);
  }
});

// Fermer la modale
closeBtn.addEventListener('click', () => lightbox.close());

// Fermer en cliquant sur le fond noir
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.close();
});

// Navigation au clavier (flèches gauche/droite avec blocage aux bornes)
document.addEventListener('keydown', (e) => {
  if (!lightbox.open) return;
  if (e.key === 'ArrowRight' && currentIndex < galleryImages.length - 1) {
    showImage(currentIndex + 1);
  }
  if (e.key === 'ArrowLeft' && currentIndex > 0) {
    showImage(currentIndex - 1);
  }
});