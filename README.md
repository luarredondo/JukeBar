# Le JukeBar — Guide pour ajouter une soirée

Ce guide explique comment ajouter les photos d'une nouvelle soirée sur le site, étape par étape.

## Étape 1 — Mettre les photos dans un dossier

1. Va dans le dossier `photo/` à la racine du projet.
2. Crée un nouveau dossier avec un nom simple, **sans espaces ni accents** (ex : `noel2026`, `halloween`, `concert-live`).
3. Dépose toutes les photos de la soirée dans ce dossier.

```
photo/
  ricard/
  2ans/
  noel2026/        ← ton nouveau dossier
    photo1.jpg
    photo2.jpg
    ...
```

## Étape 2 — Générer les photos pour le site

Ouvre un terminal dans le dossier du projet et lance :

```bash
npm run images
```

Ça peut prendre une minute ou deux selon le nombre de photos. Ce script crée automatiquement deux versions de chaque photo (une petite pour la liste, une grande pour le zoom) — tu n'as rien d'autre à faire.

## Étape 3 — Déclarer la soirée

Ouvre le fichier `src/data/events.json` avec un éditeur de texte (Notepad, VS Code...).

Tu vas voir une liste de blocs comme celui-ci :

```json
{
  "identifiant": "ricard",
  "titre": "Soirée Ricard",
  "date": "2026-09-26",
  "dossierPhotos": "ricard",
  "photographe": null,
  "lienPhotographe": null,
  "description": "Retour en images sur la soirée Ricard au JukeBar.",
  "afficheMessageAlcool": true
}
```

**Copie un bloc entier, colle-le à la suite (avec une virgule avant), et modifie les valeurs :**

| Champ | Ce que c'est | Exemple |
|---|---|---|
| `identifiant` | Le nom qui apparaît dans l'adresse du site (sans espaces, sans accents) | `"noel2026"` |
| `titre` | Le nom de la soirée affiché sur le site | `"Soirée de Noël"` |
| `date` | La date de la soirée, au format `AAAA-MM-JJ` | `"2026-12-24"` |
| `dossierPhotos` | **Doit être identique** au nom du dossier créé à l'étape 1 | `"noel2026"` |
| `photographe` | Le nom du photographe, ou `null` si pas de photographe | `"Thelull"` ou `null` |
| `lienPhotographe` | Le lien Instagram (ou autre) du photographe, ou `null` | `"https://www.instagram.com/..."` ou `null` |
| `description` | Une courte phrase de présentation | `"La magie de Noël au JukeBar."` |
| `afficheMessageAlcool` | `true` si la soirée met en avant une marque d'alcool (obligation légale), sinon `false` | `true` ou `false` |

⚠️ Points importants :
- Chaque bloc est séparé par une virgule `,` (sauf le tout dernier).
- Les guillemets `"..."` sont obligatoires autour du texte.
- `true`, `false` et `null` ne prennent **jamais** de guillemets.
- Si tu casses accidentellement le fichier, compare avec un bloc existant pour repérer l'erreur (virgule manquante ou en trop, guillemet oublié...).

## Étape 4 — Vérifier que tout fonctionne

Toujours dans le terminal :

```bash
npm run dev
```

Ouvre `http://localhost:4321` dans ton navigateur. La nouvelle soirée doit apparaître sur la page d'accueil (triée automatiquement par date, la plus récente en premier).

Arrête la vérification avec `Ctrl+C` dans le terminal une fois que tu as vu que tout est bon.

---

### Résumé express

1. Photos dans `photo/<nom-du-dossier>/`
2. `npm run images`
3. Nouveau bloc dans `src/data/events.json`
4. `npm run dev` pour vérifier
5. Publier
