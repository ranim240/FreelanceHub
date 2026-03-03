Nous avons utilisé le design pattern **"Application Factory"** avec des **"Blueprints"**.

Voici comment lire le projet, de l'extérieur vers l'intérieur :

## 1. La Racine du projet (`FreelanceHub_api/`)

- **`run.py`** : C'est le **seul fichier qu'on exécute** (`python run.py`). Son unique rôle est d'importer la fonction `create_app()` depuis le dossier `app/`, de créer le serveur web, et de le démarrer sur le port 5000.
- **`config.py`** : Définit les paramètres de l'application (URL de la base de données MongoDB, clés secrètes). Il utilise le module `os` pour lire le fichier `.env` afin de garder les informations sensibles (comme le mot de passe Atlas) hors du code source.
- **`requirements.txt`** : La liste des packages Python installés (Flask, PyMongo, python-dotenv).
- **`seed.py`** : Un script utilitaire à lancer une seule fois pour remplir la base de données avec des fausses données.

## 2. Le Cœur du backend : Le dossier `app/`

Tout le "vrai" code de l'application est enfermé dans le dossier `app/`. Ce dossier est considéré par Python comme un **module** grâce aux fichiers `__init__.py`.

### A. L'usine à application : `app/__init__.py`
C'est le chef d'orchestre. Il contient la fonction `create_app()`. Quand on appelle cette fonction au lancement (depuis `run.py`), voici ce qu'il fait dans l'ordre :
1. Il initialise Flask (`app = Flask(__name__)`)
2. Il charge la configuration (`app.config.from_object(Config)`)
3. Il active la sécurité CORS (pour dire *"Ok, j'accepte que le port 8100/4200 (Angular) communique avec moi"*)
4. Il connecte la base de données (`init_db(app)`)
5. **Il enregistre les "Blueprints"** (voir la section Routes plus bas). Il attache les URLs aux contrôleurs.

### B. Les Outils Globaux : `app/extensions.py`
C'est ici qu'on initialise les objets globaux comme la variable `db` (notre connexion à MongoDB). 
**Pourquoi ici et pas dans `__init__.py` ?** Pour éviter les "importations circulaires" (un problème où le fichier A importe B, qui importe A...). En mettant `db` ici, n'importe quel fichier de route peut faire `from app.extensions import db` proprement.

## 3. Le découpage logique interne (MVC)

L'intérieur de `app/` est découpé par **responsabilités**, un peu comme un modèle MVC :

### 📂 `app/models/` (Les Modèles de données)
*Fichiers : `product.py`, etc.*
Dans MongoDB (qui est NoSQL), on n'a pas strictement besoin de "schéma" rigide SQL. Mais ce dossier sert à documenter à quoi ressemblent nos données, ou à préparer le terrain si on veut utiliser une librairie comme Marshmallow pour valider que les JSON envoyés par Angular ont bien les bons champs.

### 📂 `app/routes/` (Le Contrôleur / Les Blueprints)
*Fichiers : `products.py`, `home.py`*
C'est le **cœur de l'API**. 
Un **Blueprint**, c'est comme une "mini-application" Flask. Au lieu de mettre tous les endpoints (URLs) de notre site dans un seul énorme fichier, on les découpe par contexte :
- `products.py` regroupe uniquement les requêtes qui concernent la boutique (ex: `GET /api/products`).
- `home.py` regroupe les appels pour alimenter la page d'accueil Angular (les annonces avec `/api/announcements`, les faqs avec `/api/faqs`).

Dans ces fichiers, chaque fonction (exemple : `get_products()`) :
1. Écoute une URL spécifique via un décorateur (ex: `@products_bp.route(...)`).
2. Interroge la base de données via l'extension (`db.products.find()`).
3. Transforme le résultat MongoDB (qui contient des objets complexes comme les ObjectID) en texte simple (`stringify`).
4. Renvoie le JSON final au frontend (`jsonify(...)`).

### 📂 `app/utils/` (Les Helpers)
*Fichiers : `helpers.py`*
Ce dossier contient des petites fonctions utilitaires (comme la fonction `serialize_doc()` qui transforme un `_id` MongoDB en chaîne de caractère standard) qui peuvent être réutilisées partout dans les routes sans avoir à copier-coller le code.

---

## 🔁 Résumé : Le voyage d'une requête HTTP

1. **Angular** : Un utilisateur va sur la page boutique. Le service Angular demande `GET /api/products` (Le Portier).
2. **`run.py`** reçoit la requête car il est branché sur le port 5000.
3. Il passe la requête à l'application créée dans **`app/__init__.py`** (Le Hall d'accueil).
4. L'application lit l'URL demandée, regarde ses Blueprints enregistrés et dit : *"L'URL commence par /api/products, c'est le Blueprint 'products_bp' qui gère ça !"*
5. La demande arrive dans le bon contrôleur : **`app/routes/products.py`** (Le Spécialiste).
6. Le fichier utilise **`app/extensions.py`** (la variable `db`) pour aller chercher les documents JSON dans Atlas (Les Archives).
7. Le fichier passe la réponse dans un helper de **`app/utils/`** pour convertir l'ID, emballe le tout en JSON classique grace à Flask, et **envoie la réponse à Angular**.
