# Configuration-drone

Configuration Betaflight pour un drone FPV 5 pouces équipé d’un châssis
ImpulseRC Apex.

## Connexion USB et capture d’écran

Pour enregistrer un réglage Betaflight :

1. Retirer les hélices et ne pas brancher la batterie LiPo.
2. Relier le contrôleur de vol à l’ordinateur avec un câble USB de données
   (un câble uniquement prévu pour la recharge ne fonctionnera pas).
3. Ouvrir Betaflight Configurator, sélectionner le port série du contrôleur,
   puis cliquer sur **Connect**.
4. Démarrer l’enregistrement de l’écran après la connexion et arrêter
   l’enregistrement avant de débrancher le câble USB.

Les captures d’écran et les enregistrements servent à documenter un réglage ou
un problème ; ils ne remplacent pas la configuration texte dans ce dépôt.
Joindre le fichier directement à l’issue GitHub avec un nom simple et une
taille raisonnable. Masquer les identifiants, numéros de série et autres
informations personnelles avant le partage.

Si le téléversement échoue, joindre un fichier texte nommé `analyse.log`
contenant au minimum :

```text
fichier: <nom du fichier>
date: <date et heure avec fuseau>
appareil: <ordinateur, contrôleur ou goggles utilisés>
erreur: <message exact affiché>
```

Sans la capture ou le message d’erreur exact, il est impossible de déduire de
manière fiable le réglage Betaflight à appliquer.
