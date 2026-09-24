# Configuration drone

Configuration Betaflight pour un drone FPV 5 pouces équipé d’un châssis
ImpulseRC Apex.

## Important

Le châssis ne détermine pas les réglages électroniques. Le contrôleur de vol,
les moteurs, le protocole radio, le récepteur vidéo et la batterie doivent être
confirmés avant d’appliquer une configuration. Les valeurs PID, filtres,
puissance radio et réglages du récepteur ne doivent donc pas être inventés ou
copiés depuis un autre drone.

## Procédure de configuration

1. Installer la version de Betaflight Configurator compatible avec la version
   de Betaflight du contrôleur de vol.
2. Connecter le drone en USB, sauvegarder la configuration actuelle avec
   **CLI > `diff all`**, puis conserver la sortie dans ce dépôt.
3. Renseigner l’onglet **Configuration** d’après les composants réellement
   installés (type de récepteur, protocole ESC, orientation de la carte et
   gyro).
4. Vérifier l’ordre des moteurs et leur sens **sans hélices**, puis calibrer
   l’accéléromètre si le mode Angle est utilisé.
5. Configurer le récepteur et les modes, puis vérifier dans l’onglet **Receiver**
   que les voies sont centrées et que les commandes correspondent.
6. Tester les failsafe et les moteurs sans hélices avant tout vol. Faire un
   premier vol stationnaire avec une batterie adaptée et vérifier la température
   des moteurs.

## Informations nécessaires pour une configuration complète

Pour produire un diff Betaflight adapté, fournir :

- la référence et la version du contrôleur de vol ;
- les moteurs, les hélices et le protocole ESC ;
- le récepteur et le protocole radio ;
- le système vidéo et la batterie (nombre de cellules) ;
- la sortie `diff all` après suppression des identifiants et autres secrets.

Les configurations exportées peuvent être placées dans `configs/`. Ne jamais
committer de clé, de mot de passe, d’identifiant radio ou d’autre donnée
personnelle.

## Application de suivi

Ce dépôt contient également une petite application de liste de tâches
fonctionnant entièrement dans le navigateur.

### Fonctionnalités

- Ajouter une tâche ;
- marquer une tâche comme terminée ou non terminée ;
- supprimer une tâche ;
- conserver les tâches dans `localStorage`.

### Lancer l’application

Aucun serveur applicatif n’est nécessaire.

#### Option 1 : ouvrir directement

Ouvrir `index.html` à la racine du dépôt dans un navigateur.

#### Option 2 : utiliser un serveur local

Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

### Utilisation

1. Saisir une tâche et cliquer sur **Add**.
2. Utiliser la case à cocher pour modifier son état.
3. Cliquer sur **Delete** pour la supprimer.
4. Actualiser la page : les tâches sont restaurées si le stockage du navigateur
   est disponible.
