# Journal de l'humeur
[*English version below*](#english-version)

## Index
 1. [Description](#desc-fr)
 2. [Objectifs du projet](#obj-fr)
 3. [Notes importantes](#notes-fr)
 4. [Installation](#install-fr)
 5. [Features](#feat-fr)
 6. [Uilisation](#usage-fr)
 7. [Points faibles](#weak-pts-fr)
 8. [Améliorations futures](#improvements-fr)
 9. [Tech Stack](#stack-fr)


## Description <a name="desc-fr" />
Ce projet est un mélange entre un journal de l'humeur et un horaire. Cela dit, le réel objectif était de 
répondre à un besoin de journal de l'humeur. En effet, je n'ai pas trouvé de logiciels gratuis et 
répondant à mes exigences. Il est donc possible de noter les activités/tâches à faire durant la journée 
ainsi que de remplir différentes informations pour effectuer un suivi de données telles que le nombre 
d'heures de sommeil ou encore le niveau d'énergie durant la journée.
L'utilisation typique serait donc d'ouvrir l'application pour voir le plan de la journée actuelle, potentiellement ajouter des tâches aux prochains jours et, en fin de journée, noté les données liées au suivi de l'humeur.


## Objectifs du projet <a name="obj-fr" />
Ce projet a été fait avec plusieurs objectifs en tête:
 1. Compléter un projet pour mon portfolio
 2. Toucher à plusieurs technologies que je ne connaissais pas originalement (node, express, jest, etc.)
 3. Tenter de faire une application répondant à un besoin réel
 4. Apprendre à faire une application en js pure plutôt qu'avec des outils tel que react ou le typescrip
    pour mieux comprendre les avantages de ceux-ci et leur fonctionnement 


## Note importante <a name="note-fr" />
Ce projet n'est pas terminé. Ceci est simplement la v1. L'objectif était de créer une première version de
l'app contenant le principal. Cela dit, des modules essentiels sont à venir :
 - v2: Une page permettant d'avoir des statistiques sur des intervalles de temps. (ex: moyennes des heures de
   sommeil du 24 août 2025 au 14 septembre 2025.
 - v3: Un système de template flexible pour que l'utilisateur puisse accumuler des données sur ce qu'il désire

De plus, le visuel n'était pas le principal de l'application, expliquant son design de piètre qualité

## Installation <a name="install-fr" />
### Pré-requis:
 - npm

### Étapes
 1. Cloner le repo
 2. Dans un terminal
 3. Aller à la racine du projet
 4. Lancer `npm install`
 5. Pour lancer l'application, ils suffit d'utiliser la commande suivante: `node server/server.js`


## Features <a name="feat-fr" />
 - Système de compte
 - Suivi du nombre d'heures de sommeil, du niveau d'énergie et du niveau de bohneur quotidien
 - Horaire quotidien permettant d'inscrire une liste d'activité à faire


## Utilisation <a name="usage-fr" />
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

Modifier un champ d'heure de début entraînera un tri des activités afin qu'elles soient toujours en ordre croissant.

Afin de supprimer une activité, vous n'avez qu'à cliquer sur le bouton de suppression à droite de celle-ci.

Pour changer journée, il est possible d'utiliser les boutons avec des flèches aux côtés de la date.

Finalement, si vous désirez vous déconnecter, appuyer sur le bouton 'sign out'

## Point faibles <a name="weak-pts-fr" />
Ce projet a de nombreux points faibles. Certains sont liés aux objectifs et à sa conception.
D'autres sont proviennent de certains de mes points faibles personnels. Voici une liste des principaux:

### Manque d'utilisation de technologies adaptées
Comme mentionné dans les objectifs, je voulais faire cet application en js vanilla afin d'avoir une meilleure expérience du langage pure. C'est d'ailleurs pourquoi de nombreuses fonctions de vérification sont utilisées. Non seulement ralentisse le programme, mais elle pourrait être facilement évité en utilisant du Typescript. De plus, pour ce qui est du front-end, je me retrouve avec du code difficilement testable qui n'est pas totalement indépendant du html. Cela pourrait être éviter en vanilla, mais serait plus compliqué que de passer à un framework moderne tel que React, surtout surtout pour la maintenance au long-terme.

### Style
Pas plus à dire, c'est moche, mais surtout, pas moderne. Cela est aussi lié aux objectifs.

### Conception
Même si j'ai fait une certaine conception, prendre le temps de mieux réfléchir et de créer des modèles de représentation aurait permis d'éviter des erreurs importantes faites en cours de route. De plus, les cas d'utilisation sont plus durs à comprendre à partir du code. C'est pour cette raison que les erreurs ne sont pas particulièrement bien gérer, principalement au niveau de l'expérience utilisateur.

### Test
Ce projet m'a prouvé qu'il fallait que je m'améliore au niveau des tests. Ceux implémentés sont seulement unitaire et clairement pas codés de la meilleure manière. Cela dit, ce n'était pas l'objectif du projet.

### Conlusion
En conclusion, je dirais que le problème essentiel du projet fût la conception. Je crois que ce problème peut être scinder en deux. D'un côté, les problèmes liés aux objectifs du projet. Je ne visais pas à faire un projet moderne, mais plutôt un projet d'apprentissage ciblé. Cela a affecté la qualtié du projet. De l'autre côté, celui qui montre ce que je dois améliorer, c'est la conception du projet avec ses contraintes. Mieux établir les cas d'utilisations et la manière dont les modules intéragissent aurait pris plus de temps, mais aurait faciliter l'implémentation et la compréhension du code. De plus, le nombre d'erreur en cours de route aurait été limité.   

## Améliorations future <a name="improvements-fr" />
 - Ajouter une page d'analyse des données pour une intervalle donnée
 - Ajouter un système de personnalisation des données suivies selon les besoin clients
 - Passer à du TS
 - Remplacer le front-end par React
 - Et plus: adapter aux personnes en situation de handicap, adjouter de la db migration, rendre l'app plus sécuritaire, mieux gérer les erreurs liées à la bd(ex: réesseyer quelques fois), ajouter des logs du serveur, mieux gérer les conditions de concurence
À noter: Malgré que les deux derniers points seraient important, je compte redévelopper l'application sous une version mobile. Pour passer à la v2, ce ne devrait être trop compliqué sans changer énormément la conception. Donc, les changements, peu importe la direction choisie ne risque d'arriver que rendu la (y compris une reconception).

## Tech Stack <a name="stack-fr">
 - [Nodejs](https://nodejs.org/)
 - [Jest](https://jestjs.io/)
 - [Expressjs](https://expressjs.com/)
 - [argon2](https://www.npmjs.com/package//argon2)
 - [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
 - [SQLite](https://www.sqlite.org/)
 - [cookie-parser](https://www.npmjs.com/package/cookie-parser)
