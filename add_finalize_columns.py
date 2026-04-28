#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script pour ajouter les colonnes manquantes à la table patient
"""

from app import app, db
from sqlalchemy import text

def add_missing_columns():
    """Ajoute les colonnes finalisé et date_finalisation à la table patient"""
    
    with app.app_context():
        try:
            # Vérifier et ajouter colonne finalisé
            db.session.execute(text('''
                ALTER TABLE patient 
                ADD COLUMN IF NOT EXISTS "finalisé" BOOLEAN DEFAULT FALSE;
            '''))
            print("✅ Colonne 'finalisé' ajoutée")
            
            # Vérifier et ajouter colonne date_finalisation
            db.session.execute(text('''
                ALTER TABLE patient 
                ADD COLUMN IF NOT EXISTS date_finalisation TIMESTAMP;
            '''))
            print("✅ Colonne 'date_finalisation' ajoutée")
            
            # Commit
            db.session.commit()
            
            print("\n✅ BASE DE DONNÉES MISE À JOUR!")
            print("Les colonnes ont été ajoutées avec succès!")
            
        except Exception as e:
            print(f"❌ Erreur: {e}")
            db.session.rollback()

if __name__ == '__main__':
    print("Ajout des colonnes manquantes à la table patient...\n")
    add_missing_columns()