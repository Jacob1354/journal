# Journal de l'humeur
[*English version below*](#english-version)

## Index
 1. [Description](#desc-fr)
 2. [Objectifs du projet](#obj-fr)
 3. [Notes importantes](#notes-fr)
 4. [Démo](#demo-fr)
 5. [Installation](#install-fr)
 6. [Uilisation](#usage-fr)
 7. [Features](#feat-fr)
 8. [Points faibles](#weak-pts-fr)
 9. [Apprentissages](#learn-fr)
 10. [Améliorations futures](#desc-fr)
 11. [Tech Stack](#stack-fr)

<a name="desc-fr" />
## Description
Ce projet est un mélange entre un journal de l'humeur et un horaire. Cela dit, le réel objectif était de 
répondre à un besoin de journal de l'humeur. En effet, je n'ai pas trouvé de logiciels gratuis et 
répondant à mes exigences. Il est donc possible de noter les activités/tâches à faire durant la journée 
ainsi que de remplir différentes informations pour effectuer un suivi de données telles que le nombre 
d'heures de sommeil ou encore le niveau d'énergie durant la journée.

<a name="obj-fr" />
## Objectifs du projet
Ce projet a été fait avec plusieurs objectifs en tête:
 1. Compléter un projet pour mon portfolio
 2. Toucher à plusieurs technologies que je ne connaissais pas originalement (node, express, jest, etc.)
 3. Tenter de faire une application répondant à un besoin réel
 4. Apprendre à faire une application en js pure plutôt qu'avec des outils tel que react ou le typescrip
    pour mieux comprendre les avantages de ceux-ci et leur fonctionnement 

<a name="note-fr" />
## Note importante
Ce projet n'est pas terminé. Ceci est simplement la v1. L'objectif était de créer une première version de
l'app contenant le principal. Cela dit, des modules essentiels sont à venir :
 - v2: Une page permettant d'avoir des statistiques sur des intervalles de temps. (ex: moyennes des heures de
   sommeil du 24 août 2025 au 14 septembre 2025.
 - v3: Un système de template flexible pour que l'utilisateur puisse accumuler des données sur ce qu'il désire

De plus, le visuel n'était pas le principal de l'application, expliquant son design de piètre qualité

<a name="demo-fr" />
## Démo 

<a name="install-fr" />
## Installation
### Pré-requis:
 - npm

### Étapes
 1. Cloner le repo
 2. Dans un terminal
 3. Aller à la racine du projet
 4. Lancer `npm install`
 5. Pour lancer l'application, ils suffit d'utiliser la commande suivante: `node server/server.js`

<a name="usage-fr" />
## Utilisation
Une fois le lancement effectué, dans le terminal, il sera écrit le lien du serveur. 

Il suffit de l'ouvrir dans un navigateur pour voir l'application. 

Il vous faudra par la suite vous connecter ou créer un compte si vous n'en avez pas déjà un. Il n'y a pas 
d'autres restrictions qu'un minimum d'au moins 1 caractère par champ et l'unicité des usernames.

Une fois votre compte créé, un cookie de session l'est aussi avec une expiration une heure plus tard. Vous serez
donc connecter automatiquement à votre compte par la suite. 

Une fois connecté, vous vous retrouverez à la journée actuelle. Il y aura les mêmes valeurs par défaut que
dans l'image suivante.

Comme vous pouvez le voir, il n'y a pas d'activité par défaut. Il suffit de cliquer sur le bouton d'ajout pour
le faire.

La modification d'un champ d'heure de début d'une activité est la seule qui puisse entra

## Future improvements
========================
 - Add db migration
 - More robust session token creation
 - Prettier UI
 - More complex db error (ex: trying again a few times depending on the sqlite error code)
 - Being able to remove an account
 - Server logs
 - Server commands (rest db, shutdown, etc.)
 - Make tests fully independant
 - Adapt for persons with a visual or auditive handicap

## Key learning points
========================
 - Fully js generated html (ideally with framework (ex: react))
 - Taking in account race conditions if a user has multiple active sessions
 - 

## Limitations
========================
 - Multiple tabs opened simultaneously
