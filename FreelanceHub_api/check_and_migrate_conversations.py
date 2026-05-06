"""
check_and_migrate_conversations.py
───────────────────────────────────
Lance depuis le dossier FreelanceHub_api/ :
    python check_and_migrate_conversations.py

Ce script fait deux choses :
  1. Affiche l'état actuel de ta collection conversations
  2. Ajoute le champ `participants` là où il manque
"""

import sys
import os

# ── Ajouter le dossier parent au path pour importer create_app ──────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

app = create_app()

with app.app_context():
    from app.extensions import db   # ← import DANS le contexte app, pas avant

    # ── 1. INSPECTION ────────────────────────────────────────────────────────
    convs = list(db.conversations.find({}))
    print(f"\n{'='*50}")
    print(f"  Total conversations trouvées : {len(convs)}")
    print(f"{'='*50}\n")

    if not convs:
        print("⚠️  Collection 'conversations' vide ou inexistante.")
        print("   → Les conversations seront créées automatiquement quand")
        print("     un client contacte un freelancer via /api/client/messages/start\n")
        sys.exit(0)

    needs_migration = []

    for c in convs:
        participants = c.get('participants')
        print(f"  _id         : {c['_id']}")
        print(f"  participants: {participants if participants else '⚠️  MANQUANT'}")
        print(f"  lastMessage : {c.get('lastMessage', '(vide)')}")
        print(f"  client_id   : {c.get('client_id', '(absent)')}")
        print(f"  freelancer_id: {c.get('freelancer_id', '(absent)')}")
        print(f"  {'─'*40}")

        if not participants:
            needs_migration.append(c)

    # ── 2. MIGRATION ─────────────────────────────────────────────────────────
    if not needs_migration:
        print("\n✅ Toutes les conversations ont déjà le champ 'participants'. Rien à faire.\n")
        sys.exit(0)

    print(f"\n⚙️  {len(needs_migration)} conversation(s) sans 'participants' → migration en cours...\n")

    ok    = 0
    failed = 0

    for c in needs_migration:
        participants = []

        # Chercher les IDs selon les noms de champs possibles dans ton schéma
        for field in ['client_id', 'clientId', 'sender_id', 'senderId']:
            val = c.get(field)
            if val:
                participants.append(str(val))

        for field in ['freelancer_id', 'freelancerId', 'receiver_id', 'receiverId']:
            val = c.get(field)
            if val:
                participants.append(str(val))

        # Dédupliquer
        participants = list(dict.fromkeys(participants))

        if len(participants) >= 2:
            db.conversations.update_one(
                {'_id': c['_id']},
                {'$set': {'participants': participants}}
            )
            print(f"  ✅ {c['_id']} → participants: {participants}")
            ok += 1
        else:
            print(f"  ❌ {c['_id']} → impossible de reconstituer participants")
            print(f"     Champs trouvés : { {k: c[k] for k in c if k not in ['_id']} }")
            failed += 1

    print(f"\n{'='*50}")
    print(f"  Migration terminée : {ok} OK  |  {failed} échec(s)")
    print(f"{'='*50}\n")

    if failed > 0:
        print("  Pour les échecs, montre-moi un document exemple et")
        print("  j'adapterai le script à tes noms de champs exacts.\n")