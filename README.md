# FreelanceHub

Plateforme de mise en relation entre freelances et clients, développée sous forme d’application mobile web avec Ionic/Angular côté front et Flask côté API.

Le projet inclut une authentification basique, un parcours d’inscription multi‑étapes, et une architecture pensée pour évoluer vers un système complet de recherche, gestion de profils et missions.

## Documentation

- [Documentation PDF du projet](./FreelanceHub_Documentation_Ranim_Nour_GRP_B_2026.pdf)

## Aperçu du projet

FreelanceHub a pour objectif de faciliter la mise en relation entre :

- des freelances proposant des services (développement, design, marketing, rédaction, vidéo, data, etc.)
- des clients recherchant des profils adaptés à leurs besoins

L’application actuelle propose la base d’un système d’authentification et d’inscription, avec une interface moderne et un parcours utilisateur pensé pour être extensible.

## Fonctionnalités actuelles

### Frontend

- Interface mobile avec Ionic + Angular
- Écran de connexion
- Écran d’inscription en 3 étapes
- Sélection du rôle : Freelance ou Client
- Champs spécifiques selon le rôle
- Formulaire multi‑étapes avec validation visuelle
- Navigation entre les pages via Angular Router

### Backend

- API Flask
- Route `POST /login`
- Route `POST /register`
- Gestion des utilisateurs en mémoire
- CORS activé pour les appels depuis le frontend

## Stack technique

### Frontend

- Angular
- Ionic Framework
- TypeScript
- HTML / SCSS
- RxJS

### Backend

- Python
- Flask
- Flask-CORS

## Structure du projet

```text
FreelanceHub/
├── FreelanceHub_app/            # Application frontend Ionic/Angular
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   ├── ionic.config.json
│   └── ...
├── FreelanceHub_api/             # Backend API Flask
│   ├── app.py
│   ├── requirements.txt
│   └── ...
├── README.md
├── LICENSE
├── FreelanceHub_Documentation_Ranim_Nour_GRP_B_2026.pdf
└── .gitignore
```

## Prérequis

Avant de lancer le projet, vérifie que tu as installé :

- Python 3.10+
- pip
- Node.js 18+
- npm
- Git

## Lancer le backend

Dans un terminal :

```bash
cd FreelanceHub_api
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# ou .venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

Le backend démarre généralement sur :

- http://localhost:5000

## Lancer le frontend

Dans un autre terminal :

```bash
cd FreelanceHub_app
npm install
npm start
```

Le frontend Angular/Ionic démarre habituellement sur :

- http://localhost:4200

## Endpoints API

### POST /login

Permet de connecter un utilisateur avec ses identifiants.

Exemple de payload :

```json
{
  "email": "test@test.com",
  "password": "123"
}
```

Réponse réussie :

```json
{
  "message": "Connexion réussie !",
  "user": "Admin"
}
```

### POST /register

Permet d’inscrire un nouvel utilisateur.

Exemple de payload :

```json
{
  "role": "freelance",
  "domain": "dev",
  "firstName": "Jean",
  "lastName": "Dupont",
  "username": "jean.dupont",
  "email": "jean@example.com",
  "password": "123456",
  "bio": "Développeur full stack",
  "tjm": 450,
  "location": "Paris, France"
}
```

Réponse :

```json
{
  "message": "Félicitations Jean, votre compte a été créé avec succès !"
}
```

## Screenshots / écrans principaux

Les écrans actuellement visibles dans le code comprennent :

- page de connexion
- page d’inscription étape 1 : identité
- page d’inscription étape 2 : compte
- page d’inscription étape 3 : profil

Le projet est encore en phase de développement, et l’écran d’accueil par défaut de Ionic est présent dans le template initial et n’est pas encore personnalisé comme une page produit finale.

## État actuel du projet

Le projet est un prototype fonctionnel de base, avec :

- design interface moderne
- parcours de connexion/inscription
- communication frontend/backend
- logique d’authentification et d’enregistrement

Les améliorations futures peuvent inclure :

- stockage des données en base de données (SQLite, PostgreSQL, MongoDB, etc.)
- gestion des profils freelances et clients
- recherche de freelances par compétences / localisation
- système de missions et de propositions
- dashboard utilisateur
- gestion des candidatures et paiements
- sécurité renforcée (hash de mots de passe, JWT, etc.)

## Contribution

Les contributions sont les bienvenues.

Pour proposer une amélioration :

1. Fork le dépôt
2. Crée une branche
3. Applique tes modifications
4. Ouvre une pull request

## Licence

Ce projet est distribué sous la licence présente dans le dépôt : `LICENSE`.

## Contact

Pour toute question sur le projet, tu peux te référer à la documentation du dépôt.

---

Projet : FreelanceHub

Développé avec Angular / Ionic / Flask.
