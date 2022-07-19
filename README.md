
# Projet 3 Alyra - Dapp Voting

Dapp de voting pour le projet 3 d'Alyra.

Utilisation de Truffle UnBox React dernière version.

## Installer les modules nécessaires au deploy ( en + du truffle unbox )
Pour truffle
- npm install @truffle/hdwallet-provider dotenv

## Lancer le projet (après avoir installé les dépendances)
### En local avec Ganache :
- $ganache
- dans le dossier truffle: $truffle migrate --reset
- dans le dossier client: npm start

### Testnet / mainnet
- création du .env / .gitignore dans le dossier truffle
- installation et config de hdwallet provider & fichier truffle config
- $truffle migrate --network [nomdutestnet]
- npm start dans le client

## Vidéo démonstration
- Code review : https://www.loom.com/share/353b56d453f34f89b396dd2dc5aa47db
- Front End review : https://www.loom.com/share/ebced512209e4a1c8ea7208d14685453
- Live website (Ropsten Network) : https://fastidious-kringle-b27c92.netlify.app/