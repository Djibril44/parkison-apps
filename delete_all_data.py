#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
⚠️ SCRIPT DE SUPPRESSION TOTALE DES DONNÉES
Efface TOUTES les données de la base de données
"""

from app import app, db
from sqlalchemy import text

def delete_all_data():
    """Supprime TOUTES les données des tables"""
    
    with app.app_context():
        try:
            print("⚠️  SUPPRESSION DE TOUTES LES DONNÉES...\n")
            
            # Confirmation
            confirm = input("ÊTES-VOUS SÛR? (tapez 'OUI' en majuscules): ")
            if confirm != "OUI":
                print("\n❌ Annulé. Aucune donnée n'a été supprimée.")
                return
            
            # Deuxième confirmation
            confirm2 = input("VRAIMENT SÛR? (tapez 'SUPPRIMER TOUT'): ")
            if confirm2 != "SUPPRIMER TOUT":
                print("\n❌ Annulé. Aucune donnée n'a été supprimée.")
                return
            
            print("\n🗑️  Suppression en cours...\n")
            
            # Supprimer les données (pas les tables)
            db.session.execute(text('DELETE FROM resultat;'))
            print("✅ Résultats supprimés")
            
            db.session.execute(text('DELETE FROM questionnaire;'))
            print("✅ Questionnaires supprimés")
            
            db.session.execute(text('DELETE FROM patient;'))
            print("✅ Patients supprimés")
            
            db.session.execute(text('DELETE FROM "user";'))
            print("✅ Utilisateurs supprimés")
            
            # Commit
            db.session.commit()
            
            print("\n" + "="*50)
            print("✅ TOUTES LES DONNÉES ONT ÉTÉ SUPPRIMÉES!")
            print("="*50)
            print("\n⚠️  Les tables sont vides mais existent toujours.")
            print("Vous pouvez créer de nouvelles données.\n")
            
        except Exception as e:
            print(f"\n❌ Erreur: {e}")
            db.session.rollback()

if __name__ == '__main__':
    print("="*50)
    print("⚠️  SUPPRESSION TOTALE DES DONNÉES")
    print("="*50)
    print("\nCette action est IRRÉVERSIBLE!\n")
    
    delete_all_data()