# Last Life Bot

Ce bot discord a été développer le 09/11/2023 !

![Discord](https://img.shields.io/discord/800533788421259296?label=discord&logo=discord&style=flat-square)
![Wakatime](https://wakatime.com/badge/user/cd7fd9ea-e1d6-44f3-9e27-2f7f13627930/project/018b7fe5-3ab6-4b99-8e3d-30adced2f061.svg)

## Description

Ce projet est un bot Discord qui offre diverses fonctionnalités pour améliorer l'expérience des utilisateurs sur votre serveur Discord. Le bot est conçu pour être facile à configurer et à utiliser, et il est extensible grâce à une architecture modulaire.

### Fonctionnalités

- Général : Embed Nouveau arrivants, Embed Booste de serveur, Salon vocal Temporaire
- Intégrations : Connexion avec d'autres services comme Twitch.
- Commandes personnalisées : Créez des commandes personnalisées pour répondre aux besoins de votre communauté.

## Prérequis

Avant de pouvoir installer et exécuter le bot, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) v14.0 ou supérieur
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Un compte Discord et un serveur où vous avez des permissions d'administrateur
- Un token de bot Discord. Vous pouvez en créer un sur le [Portail des développeurs Discord](https://discord.com/developers/applications).

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/DakoooM/LastLifeBot.git
   cd LastLifeBot
   ```

2. Installez les dépendances nécessaires :

   ```bash
   npm install
   ```

   ou, si vous utilisez yarn :

   ```bash
   yarn install
   ```

3. Configurez le fichier `.env` :

   Créez un fichier `.env` à la racine du projet et ajoutez-y votre token de bot Discord :

   ```env
   APP_CLIENT_ID=Bot_Client_Id
   APP_GUILD_ID=Server_Discord_Id
   APP_TOKEN=Votre_Token_Ici
   MODE="dev" # dev / production
   ```

4. Démarrez le bot :

   ```bash
   npm start
   ```

   ou, si vous utilisez yarn :

   ```bash
   yarn start
   ```

## Utilisation

Une fois le bot lancé, vous pouvez l'inviter sur votre serveur Discord et utiliser les commandes avec le préfixe `/` !

### Exemples de commandes Slash

- `/ticket` : Ajoute le message pour ouvrir des tickets
- `/streamer add` : Ajoute un streamer dans la liste
- `/embed {channel?}` : Crée un embed personalisée dans le salon que vous souhaitez.
- `/createticket {category}` : Permet de crée un ticket sans passer par le menu de selection

**Commandes d'informations**
- `/info ip` : Voir l'adresse ip du serveur
- `/info wl` : Comment ce faire whitelist
- `/info boutique` : Avoir des informations sur la boutique
- `/info touches` : Voir les touches qu'il y a en jeu depuis un embed
- `/info links` : Lien utiles du serveur
- `/info heberg` : Quel est l'hébergeur du serveur

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez contribuer, veuillez suivre ces étapes :

1. Fork ce dépôt.
2. Créez votre branche de fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`).
3. Commitez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`).
5. Ouvrez une Pull Request.

## Problèmes

Si vous trouvez un bug ou avez une suggestion, veuillez ouvrir une [issue](https://github.com/DakoooM/LastLifeBot/issues).

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.
