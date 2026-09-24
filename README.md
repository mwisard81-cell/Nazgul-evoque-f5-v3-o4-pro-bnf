# Checklist de configuration Betaflight pour drone FPV

Une application front-end légère qui sert de checklist de configuration pour un drone FPV sous Betaflight et fonctionne entièrement dans le navigateur.

## Fonctionnalités

- Checklist Betaflight préremplie avec les étapes essentielles
- Ajout d’étapes personnalisées selon votre montage
- Validation/invalidation des étapes terminées
- Suppression d’une étape
- Sauvegarde locale via `localStorage`
- Restauration automatique au rechargement

## Lancer l’application

Aucun backend n’est nécessaire.

### Option 1 : ouverture directe

Ouvrez `index.html` depuis la racine du dépôt dans votre navigateur.

### Option 2 : serveur statique local

Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000`.

## Utilisation

1. Passez en revue les étapes de base déjà proposées pour Betaflight.
2. Commencez par connecter le drone en USB avec un câble de données compatible.
3. Ajoutez une étape personnalisée si votre build nécessite un réglage supplémentaire.
4. Cochez chaque étape terminée au fur et à mesure de votre configuration.
5. Supprimez une étape si elle n’est pas pertinente pour votre drone.
6. Rechargez la page : la checklist reste sauvegardée via `localStorage` quand le stockage navigateur est disponible.
