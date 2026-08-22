# Technical Sheet App V5

## Fonctionnalités V5
- Référence Source obligatoire. Sans référence, Enregistrer, PDF et ZIP sont bloqués.
- Nouvelle fiche en haut de la barre latérale, bouton gris foncé.
- JSON et Importer déplacés dans Administration.
- Quantités avec prix pour Prototype, BAT, Présérie et Série.
- Ventilation prix Série en quatre tranches configurables.
- Produit avec image et descriptif en hauteurs harmonisées.
- Une première carte Composant affichée automatiquement.
- Composants et Marquages organisés sur trois colonnes.
- Documents centralisés avec filtres, nombre, poids et dernière modification.
- Export PDF autonome.
- Export ZIP autonome contenant le PDF et tous les documents joints.

## Important
Les fichiers sont encodés dans le brouillon local en base64. Le stockage local du navigateur peut être limité pour les fichiers volumineux. Pour l'utilisation multi-utilisateur et les gros fichiers, connecter Supabase Storage.

## Déploiement
Déposer tous les fichiers à la racine du dépôt GitHub, puis importer dans Vercel avec le preset `Other`.
