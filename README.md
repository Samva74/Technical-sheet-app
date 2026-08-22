# Technical Sheet App

Application web responsive pour créer et gérer des fiches techniques produit, sur le modèle visuel du Manufacturing Tools Hub.

## Inclus
- Navigation par sections
- Sauvegarde automatique locale
- Import/export JSON pour reprendre une fiche sur un autre poste
- Export CSV compatible Excel
- PDF via l'impression du navigateur
- Composants dynamiques
- Plusieurs marquages par composant
- Documents et photos (métadonnées en mode local)
- Interface FR / EN / PT
- Responsive ordinateur, tablette et mobile

## Déploiement GitHub + Vercel
1. Décompresser le ZIP.
2. Créer un dépôt GitHub et déposer les fichiers à la racine.
3. Dans Vercel, importer le dépôt.
4. Framework Preset : `Other`.
5. Build command : laisser vide.
6. Output directory : laisser vide.

## Important
Cette première version fonctionne immédiatement sans backend grâce à `localStorage`.
Les fichiers sélectionnés ne sont pas téléversés : seules leurs métadonnées sont conservées dans le brouillon. Pour une utilisation multi-utilisateur, connecter ensuite Supabase avec le schéma fourni dans `supabase-schema.sql`.

## Sécurité et traçabilité
Pour la version Supabase :
- activer Supabase Auth ;
- activer RLS ;
- remplir `created_by_user_id`, `created_by_email`, `updated_by_user_id` et `updated_by_email` côté application ;
- utiliser un bucket privé et des URL signées pour les documents.
