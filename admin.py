from app import app, db, User
with app.app_context():
    admin = User(nom='Administrator', email='admin@hospital.com', role='admin')
    admin.set_password('Admin123!')
    db.session.add(admin)
    db.session.commit()
    print("✅ Admin créé!")

# Quitter:
exit()