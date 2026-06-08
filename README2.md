# Accès à l’application mobile DKC (Expo Go)

Prérequis :

Node.js installé sur le PC (https://nodejs.org)

Expo Go installé sur le téléphone (App Store / Play Store)

Connexion internet (PC et téléphone)


Installation et lancement


1. Cloner le dépôt GitHub :

git clone <url-du-depot>

cd DkcMobile


2. Installer les dépendances :

npm install


3. Lancer l’application :

npx expo start -c


4. Scanner le QR code affiché dans le terminal avec Expo Go (Android) ou l’appareil photo puis Expo Go (iPhone).

Si le QR code ne fonctionne pas, relancer avec :

npx expo start --tunnel -c

L’application utilise l’API en production : https://eventdkc.fr

Comptes de test

Un compte est nécessaire pour se connecter.

Role User :

Identifiant	: USER

Mot de passe : 123456

Role Admin :

Identifiant : ADMIN

Mot de passe : ADMIN1
En cas de problème, vérifier la connexion internet ou contacter le développeurlème d’accès, vérifiez la connexion internet ou contactez le développeur.
