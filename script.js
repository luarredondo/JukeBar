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



// //bouton pour enregister les photos
// const downloadBtn = document.getElementById('downloadBtn');

// downloadBtn.addEventListener('click', (event) => {
//   // Empêche le comportement par défaut de l'ouverture du lien
//   event.preventDefault();

//   const imageUrl = downloadBtn.href;
//   const fileName = imageUrl.split('/').pop() || 'photo.jpg';

//   // Récupère l'image et force le téléchargement via un Blob
//   fetch(imageUrl)
//     .then(response => response.blob())
//     .then(blob => {
//       const blobUrl = window.URL.createObjectURL(blob);
//       const tempLink = document.createElement('a');
//       tempLink.href = blobUrl;
//       tempLink.download = fileName;
      
//       document.body.appendChild(tempLink);
//       tempLink.click();
//       document.body.removeChild(tempLink);
      
//       // Libère la mémoire
//       window.URL.revokeObjectURL(blobUrl);
//     })
//     .catch(() => {
//       // Si le fetch échoue (ex: problème de sécurité local), ouvre dans un nouvel onglet
//       window.open(imageUrl, '_blank');
//     });
// });


//bouton pour revenir en haut de la page
const backToTopButton = document.getElementById("backToTop");

// Détecte le défilement de la page
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) { // S'affiche après 300px de défilement
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

// Action au clic sur le bouton
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // Défilement fluide
  });
});




