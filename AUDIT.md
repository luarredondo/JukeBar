# Audit du site JukeBar (jukebar.netlify.app) — octobre 2026

Contexte : site statique (HTML/CSS/JS vanilla) d'un bar à Orléans, hébergé sur Netlify.
Il sert aujourd'hui uniquement de galerie photo des soirées. Objectif : refonte complète.

Pages actuelles :
- `/` : logo + 2 cartes de soirée (Ricard 26/09/26, Anniversaire 2 ans 03/10/2026) + footer
- `/ricard` : 10 photos (`photo/ricard/1.png` → `10.png`)
- `/anniversaire` : 107 photos (`photo/2ans/a1.jpg` → `a107.jpg`), photographe : Thelull
- Fichiers partagés : `style.css`, `script.js`, `asset/logo.png`, `asset/insta.png`

---

## 1. Critique : poids des images

| Page | Contenu chargé | Poids |
|---|---|---|
| Accueil | `photo_accueil/ricard.png` en 4096×2731, affiché en 400×300 | ~16,5 Mo |
| `/ricard` | 10 PNG de 14 à 17 Mo chacun | ~157 Mo |
| `/anniversaire` | 107 JPG 2048×1536 (~450–550 Ko), tous chargés d'un coup | ~50 Mo |

À faire :
- Générer pour chaque photo une miniature (~600 px, WebP, 30–60 Ko) et une HD (~2000 px, WebP/JPEG q80, 300–500 Ko).
- `loading="lazy"`, `width`/`height` explicites, `srcset`/`sizes`.
- La lightbox charge la HD, la grille charge la miniature.
- Ne jamais servir de PNG pour des photos.

## 2. Bugs

- **JS** : `script.js` est chargé sur toutes les pages mais l'accueil n'a ni `#lightbox`, ni `#prev-btn`/`#next-btn`/`#close-btn`, ni `#backToTop`
  → `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')` à `script.js:36`.
  Le sélecteur `.gallery-item img` attache aussi un clic de lightbox aux vignettes de l'accueil.
- `<title>` de `/anniversaire` = « JukeBar Soirée Ricard » (copier-coller).
- Sur l'accueil, l'`alt` de la vignette anniversaire = « Soirée du 26/09/26 » (mauvaise date).
- Formats de date incohérents : « 26/09/26 » vs « 03/10/2026 ».
- `<img id="lightbox-img" src="">` : `src` vide dans le HTML.
- Crédit photographe présent seulement sur `/anniversaire`.
- Badge « Powered by Netlify » et bouton `#backToTop` tous deux en bas à droite (`bottom:20px; right:20px`) → superposition.

## 3. Lightbox

Fonctionne : ouverture, flèches clavier, Échap (`<dialog>` natif), focus initial sur la croix.

Manque :
- swipe tactile sur mobile ;
- compteur « n / total » ;
- préchargement de l'image suivante ;
- `aria-label` sur ×, ❮, ❯ et ↑ ;
- bouton de téléchargement (code présent mais commenté — fonctionnalité souhaitée).

Piste : PhotoSwipe (swipe, zoom, accessible).

## 4. Design / UX

- Hiérarchie inversée sur les cartes : date en 1,4rem gras, nom de soirée en 0,85rem gris → le nom doit primer.
- Survol : `filter: brightness(1.8) contrast(0.8)` délave les photos, transition de 3 s trop lente, `transform: scale(1.03)` non inclus dans la transition (saute). L'effet reste « collé » après un tap sur mobile → utiliser `@media (hover: hover)`.
- Barre de défilement masquée globalement (`scrollbar-width: none`, `::-webkit-scrollbar { display:none }`) → à supprimer, la page anniversaire fait ~32 000 px de haut sur mobile.
- `main { margin-top: 5% }` relatif à la largeur → espacement incohérent selon l'écran.
- Responsive sans débordement horizontal à 375 px, mais 1 seule colonne de 107 photos plein écran → prévoir 2–3 colonnes de miniatures sur mobile.
- Événements listés du plus ancien au plus récent → mettre le plus récent en premier.
- Nom incohérent : « JukeBar », « Le JukeBar », « lejukebar » ; footer « Made In lejukebar » maladroit.

## 5. Accessibilité

- Pas de `<h1>` (logo image seulement).
- `alt` identiques sur toutes les photos d'une page → `alt` descriptif ou numéroté (« Photo 12 sur 107, soirée anniversaire »).
- Boutons de la lightbox sans libellé accessible.

## 6. SEO / partage

- Titre accueil peu descriptif (« JukeBar Photo Accueil ») → ex. « Le JukeBar – Bar à Orléans | Photos des soirées ».
- Aucune meta description, aucune balise Open Graph / Twitter (pas d'aperçu au partage WhatsApp/Insta).
- Pas de données structurées schema.org `BarOrPub` (adresse, horaires, Instagram).
- Sous-domaine Netlify, pas de nom de domaine propre.
- Favicon = logo PNG 203×203 de 75 Ko → générer favicon/apple-touch-icon dédiés.

## 7. Contenu manquant

Horaires, téléphone/contact, carte ou lien Google Maps, agenda des prochaines soirées, présentation du lieu, carte des boissons. Adresse sans code postal (« 258 rue de Bourgogne Orléans »). La soirée « anniversaire » est en fait les 2 ans du bar (dossier `2ans`) : le dire.

## 8. Légal (France) — à vérifier, pas un avis juridique

- Mentions légales absentes (éditeur, hébergeur Netlify, responsable de publication) : obligatoires.
- Droit à l'image : >100 photos de clients identifiables → mention + moyen simple de demander le retrait d'une photo.
- Loi Évin : la page « Soirée Ricard » avec visuels de marque peut relever de la publicité pour l'alcool (message sanitaire obligatoire, contenu encadré).

## 9. Qualité du code

- HTML dupliqué à la main par soirée (source des bugs de copier-coller).
- CSS : règles en double (`dialog` et `#lightbox`), préfixes IE inutiles, blocs commentés morts, classe `.href-footer` inutilisée.
- JS : aucune garde contre les éléments absents, responsabilités mélangées (galerie, lightbox, retour en haut).

---

## Recommandations pour la refonte

1. **Pipeline d'images** : script (sharp) qui génère miniatures + HD WebP depuis les photos sources, avec dimensions connues.
2. **Générateur statique** (Astro recommandé) : un fichier de données par soirée (slug, titre, date ISO, photographe, liste de photos) + un template unique de galerie + une page d'accueil générée depuis ces données (tri par date décroissante).
3. **Lightbox** accessible avec swipe, compteur et téléchargement (PhotoSwipe).
4. **Pages de contenu** : accueil avec infos pratiques (horaires, adresse complète, carte, Instagram), agenda, mentions légales.
5. **SEO** : titres et descriptions par page, Open Graph avec une image de couverture par soirée, schema.org `BarOrPub`, nom de domaine.
6. **Accessibilité** : `<h1>`, `alt` pertinents, boutons libellés, scrollbar visible, `prefers-reduced-motion`.