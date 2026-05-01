from flask import Blueprint, request , jsonify, session
from functools import wraps

from models import Book, Admin
from database import db


admin_bp = Blueprint('admin', __name__)

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('admin'):
            return jsonify({'message': 'Please Login '}), 401
        
        return f(*args, **kwargs)
    return decorated    


@admin_bp.route('/api/admin/login', methods=['POST'])

def admin_login():
    data = request.get_json()
    admin = Admin.query.filter_by(username = data['username']).first()

    if admin and admin.password == data['password']:
        session['admin'] = admin.username
        return jsonify({'message': 'Login successful'})
    
    else:
        return jsonify({'message': 'Invalid username or password'}), 401
    

@admin_bp.route('/api/admin/books', methods = ['POST'])
@login_required

def add_book():
    data = request.get_json()

    new_book = Book(
        title=data['title'],
        author=data['author'],
        category=data['category'],
        cover_image=data.get('cover_image', ''),
        pdf_path=data.get('pdf_path', ''),
        description=data.get('description', '')
    )

    db.session.add(new_book)
    db.session.commit()

    return jsonify({'message' : 'Book added succesfully'})

@admin_bp.route('/api/admin/books/<int:book_id>', methods = ['DELETE'])

@login_required

def delete_book(book_id):
    book = Book.query.get_or_404(book_id)

    db.session.delete(book)
    db.session.commit()

    return jsonify({'message': 'Book deleted successfully'})

@admin_bp.route('/api/admin/logout', methods = ['POST'])

def logout():
    session.pop('admin', None)
    return jsonify({'message': 'Logged out!'})
