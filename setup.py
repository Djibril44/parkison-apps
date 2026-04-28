#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Setup Script - Initialise la base de données PostgreSQL Neon
"""

import os
import sys
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

try:
    from app import app, db
    print("✅ App importée avec succès")
except ImportError as e:
    print(f"❌ Erreur d'import: {e}")
    print("Assurez-vous que app.py est dans le même dossier")
    sys.exit(1)

def create_database():
    """Crée les tables dans la base de données PostgreSQL Neon"""
    
    print("\n" + "="*60)
    print("🔧 INITIALISATION DE LA BASE DE DONNÉES")
    print("="*60)
    
    db_url = os.environ.get('DATABASE_URL', app.config.get('SQLALCHEMY_DATABASE_URI'))
    print(f"\n📊 Connection: {db_url[:60]}...")
    
    try:
        with app.app_context():
            print("\n⏳ Création des tables...")
            
            # Créer toutes les tables
            db.create_all()
            
            print("✅ Tables créées avec succès!")
            
            print("\n📋 Tables créées dans Neon:")
            print("  ├─ user              (Utilisateurs)")
            print("  ├─ patient           (Patients)")
            print("  ├─ questionnaire     (Questionnaires)")
            print("  └─ resultat          (Résultats)")
            
            print("\n" + "="*60)
            print("✨ BASE DE DONNÉES INITIALISÉE!")
            print("="*60)
            print("\nPour lancer l'application:")
            print("  $ python app.py")
            print("\nPuis accédez à:")
            print("  http://localhost:5000")
            print("\n")
            
            return True
            
    except Exception as e:
        print(f"\n❌ Erreur lors de l'initialisation: {e}")
        print("\n🔍 Vérifiez:")
        print("  ✓ Fichier .env existe")
        print("  ✓ DATABASE_URL est correcte")
        print("  ✓ Credentials Neon sont valides")
        print("  ✓ Connexion internet fonctionne")
        print("\n")
        return False

def drop_database():
    """Supprime les tables (réinitialisation)"""
    
    print("\n" + "="*60)
    print("⚠️  SUPPRESSION DE LA BASE DE DONNÉES")
    print("="*60)
    
    confirm = input("\n⚠️  Êtes-vous sûr? (oui/non): ").lower().strip()
    
    if confirm in ['oui', 'yes', 'o', 'y']:
        try:
            with app.app_context():
                print("\n🗑️  Suppression des tables...")
                db.drop_all()
                print("✅ Tables supprimées!")
                return True
        except Exception as e:
            print(f"❌ Erreur: {e}")
            return False
    else:
        print("Annulé.")
        return False

if __name__ == '__main__':
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'drop':
            success = drop_database()
        elif command == 'reset':
            drop_database()
            create_database()
        else:
            print(f"❌ Commande inconnue: {command}")
            print("\nCommandes disponibles:")
            print("  $ python setup.py          (créer les tables)")
            print("  $ python setup.py drop     (supprimer les tables)")
            print("  $ python setup.py reset    (réinitialiser tout)")
    else:
        success = create_database()
    
    sys.exit(0 if success else 1)
