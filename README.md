
# PropertyStake - Fractional Property Ownership System

Ce projet est un prototype de plateforme de financement immobilier fractionné. Il permet:
- Aux **agents** d'ajouter et de gérer des propriétés.
- Aux **investisseurs** de s'inscrire, disposer d'un wallet, investir dans les propriétés, recevoir des revenus locatifs, etc.
- D'utiliser **Stripe** pour les paiements et **Nodemailer/Mailtrap** pour les emails.

## 1. **Prérequis**

1. **Node.js** (version 14+ ou 16+ recommandé) et **npm** ou **yarn**.
2. **MongoDB** installé et en cours d'exécution en local (ou accessible via un serveur).
3. **Clés Stripe** (test mode) pour la passerelle de paiement.
4. **Compte Mailtrap** (ou tout autre SMTP) pour l'envoi d'email de test.

## 2. **Installation**

1. **Cloner** ce dépôt :
   ```bash
   git clone https://github.com/tonUser/property-stake.git
   ```
2. **Se placer** dans le dossier du projet :
   ```bash
   cd property-stake
   ```
3. **Installer les dépendances** :
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn
   ```

## 3. **Configuration**

1. **Créer un fichier `.env`** à la racine du projet, avec le contenu suivant :

   ```env
   MONGO_URI=mongodb://localhost:27017/propertyStake
   JWT_SECRET=tonSecretJWT
   STRIPE_SECRET_KEY=sk_test_51Qn3mKQoPHAPgKuqYZd8mTiiYLU7cIJimkb8IqrXhaFFtGRTagh0GehxwwZsp0ka6EXQ17ttaKD3UcMJBYkhT7VO00fxcvQTF8
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=75209b6af84bd2
   EMAIL_PASS=ed8daf2258a51e
   ```
   - **MONGO_URI** : L’URL de connexion à MongoDB.
   - **JWT_SECRET** : La clé secrète pour signer les tokens JWT.
   - **STRIPE_SECRET_KEY** : Clé Stripe pour les paiements test.
   - **EMAIL_HOST/PORT/USER/PASS** : Identifiants SMTP (ex: Mailtrap).

2. **Vérifier que MongoDB** tourne en local ou que tu as un cluster MongoDB accessible.

## 4. **Lancement du projet**

1. **Démarrer** l'application :
   ```bash
   npm start
   ```
   ou
   ```bash
   node src/app.js
   ```
2. **Vérifier dans la console** :
   ```
   Serveur en écoute sur le port 5001
   MongoDB connecté
   ```
3. **Tester l’API** via Postman ou un autre client HTTP.

## 5. **Points d’Entrée (Endpoints)**

Le serveur écoute par défaut sur `http://localhost:5001`. Voici les principaux endpoints (exemples de routes, non exhaustifs) :

- **Investors**  
  - `POST /investors/register` : Inscription investisseur  
  - `POST /investors/login` : Connexion investisseur  
- **Agents**  
  - `POST /agents/register` : Inscription agent  
  - `POST /agents/login` : Connexion agent  
- **Properties**  
  - `POST /properties` : Créer une propriété (protégé agent)  
  - `GET /properties` : Lister toutes les propriétés  
- **Investments**  
  - `POST /investments` : Investir dans une propriété (protégé investisseur)  
- **Wallets**  
  - `POST /wallets` : Créer un wallet pour un investisseur  
  - `PUT /wallets/fund/:walletId` : Alimenter un wallet (ex: via Stripe)  
- **Payment**  
  - `POST /payment/pay` : Déclencher un paiement Stripe  
- **Email**  
  - `POST /email/send-email` : Envoi d’un email test via Mailtrap  
- etc.

## 6. **Postman Project**

Pour faciliter les tests, un fichier **`PropertyStake_API.postman_collection.json`** (exporté depuis Postman) peut être inclus. Il contient toutes les requêtes prêtes à l’emploi. Il suffit de :

1. **Ouvrir Postman**  
2. **Cliquer sur `Import`**  
3. Sélectionner le fichier `.json`  
4. Les requêtes apparaissent dans la collection **PropertyStake**.

