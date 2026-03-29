# Guide d'Installation Backend & Frontend - FreelanceHub

Salut ! 👋
J'ai connecté notre frontend Angular (Ionic) à une vraie base de données MongoDB Atlas avec un backend Flask (Python).
Voici les instructions exactes pour que tu puisses récupérer mon travail et lancer l'application sur ton PC.

---

## 🚀 Étape 1 : Récupérer le code

Comme j'ai poussé mon code sur la branche `backend-integration`, tu dois la récupérer :

```bash
# Ouvre un terminal dans le dossier racine FreelanceHub/
git fetch origin
git checkout backend-integration
git pull origin backend-integration
```

---

## 🐍 Étape 2 : Lancer le Backend (Flask)

Le backend a maintenant son propre dossier. Il te faut configurer l'environnement Python.

**1.** Ouvre un terminal et va dans le dossier du backend :
```bash
cd FreelanceHub_api
```

**2.** Crée un fichier nommé **exactement** `.env` à la racine de ce dossier `FreelanceHub_api` et colle ceci dedans (le mot de passe de la DB ne doit jamais être sur GitHub) :

```text
FLASK_DEBUG=1
FLASK_SECRET_KEY=dev_secret_key_change_in_prod
MONGO_URI=mongodb+srv://FreelanceHub_db_user:S7AfHqPxvUvHvOQe@cluster0.ojqkglq.mongodb.net/freelancehub_db?retryWrites=true&w=majority&appName=Cluster0
```

**3.** Crée un environnement virtuel Python et active-le :
```bash
python -m venv venv
# Si tu es sur Windows PowerShell :
.\venv\Scripts\Activate.ps1
# Si tu es sur Mac/Linux :
# source venv/bin/activate
```

**4.** Installe les dépendances (Flask, PyMongo, etc.) :
```bash
pip install -r requirements.txt
```

**5.** Lance le serveur !
```bash
python run.py
```
*(Le serveur va tourner sur `http://localhost:5000`. Laisse ce terminal ouvert !)*

---

## 🅰️ Étape 3 : Lancer le Frontend (Angular/Ionic)

Maintenant, on lance l'application qui va aller chercher ses données sur le backend.

**1.** Ouvre un **NOUVEAU** terminal (laisse le backend tourner) et va dans le dossier de l'app :
```bash
cd FreelanceHub_app
```

**2.** Assure-toi que les dépendances Node sont à jour :
```bash
npm install
```

**3.** Lance l'application Ionic :
```bash
ionic serve
# ou ng serve
```

*(L'application va s'ouvrir sur `http://localhost:8100` ou `4200`)*

---

🎉 **C'est tout !**
Tu verras que la page d'accueil et la boutique chargent maintenant les vraies données depuis MongoDB Atlas (et non plus les listes en dur dans le code).

> ⚠️ Note : **Ne lance pas** `python seed.py`. Je l'ai déjà fait pour insérer les données initiales dans notre base de données cloud qui est partagée !
