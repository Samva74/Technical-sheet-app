# Technical Sheet App V4

## Modifications principales
- `Client & Projet` avec P majuscule
- Référence Source demandée pour chaque nouvelle fiche
- Disposition en trois colonnes pour Client & Projet, Composants et Marquages
- Précisions sous les deux premières colonnes de Client & Projet
- Sélection de fichiers depuis Client & Projet et Marquages avec miniatures locales
- Centralisation automatique de tous les fichiers dans `07 Documents`
- `Volumes` renommé en `Quantités`, unités `pces` visibles et tranche indicative automatique
- Produit avec image, descriptif et unités visibles dans les champs
- Composants selon l'ordre métier demandé, avec Notes sur toute la hauteur de la troisième colonne
- Marquages avec positions et décalages renommés, fichiers et Notes sur la troisième colonne
- Contre-boîte en trois colonnes avec Notes pleine hauteur

## Attention
Les miniatures utilisent des URL temporaires du navigateur. Les métadonnées restent dans le brouillon local, mais le stockage persistant des fichiers nécessitera la connexion Supabase Storage prévue dans `supabase-schema.sql`.

## Déploiement
Déposer les fichiers à la racine du dépôt GitHub. Vercel peut être utilisé avec le preset `Other`.
