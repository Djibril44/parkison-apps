#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Test Connection Script - Vérifier la connexion à Neon PostgreSQL
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

print("\n" + "="*60)
print("🔍 TEST DE CONNEXION À NEON POSTGRESQL")
print("="*60)

db_url = os.getenv('DATABASE_URL')

if not db_url:
    print("\n❌ DATABASE_URL non trouvée dans .env")
    print("\nCréez un fichier .env avec:")
    print("  DATABASE_URL=postgresql+psycopg2://...")
    exit(1)

print(f"\n📊 Connection: {db_url[:60]}...")

try:
    print("\n⏳ Tentative de connexion...")
    
    engine = create_engine(db_url)
    
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("✅ Connexion réussie!")
        
        print("\n📋 Tables dans la base de données:")
        result = connection.execute(text("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema='public'
            ORDER BY table_name
        """))
        
        tables = result.fetchall()
        if tables:
            for table in tables:
                print(f"  ├─ {table[0]}")
            print(f"  └─ Total: {len(tables)} tables")
        else:
            print("  └─ Aucune table trouvée (exécutez: python setup.py)")
    
    print("\n" + "="*60)
    print("✨ CONNEXION OPÉRATIONNELLE!")
    print("="*60)
    print("\nProchaine étape:")
    print("  $ python setup.py")
    print("\n")
    
except Exception as e:
    print(f"\n❌ ERREUR DE CONNEXION:")
    print(f"  {type(e).__name__}: {str(e)}")
    
    print("\n🔧 Solutions:")
    print("  1. Vérifiez le fichier .env existe")
    print("  2. Vérifiez la DATABASE_URL")
    print("  3. Vérifiez votre connexion internet")
    print("  4. Vérifiez les credentials Neon")
    print("\n")
    exit(1)
