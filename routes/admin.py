from flask import Blueprint, request, jsonify, session
from models import Book, Admin
from database import db
from functools import wraps
from flask_bcrypt import Bcrypt
import os
from werkzeug.utils import secure_filename

admin_bp = Blueprint('admin', __name__)
bcrypt = Bcrypt()

ALLOWED_IMAGES = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
ALLOWED_PDFS = {'pdf'}

def allowed_image(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGES

def allowed_pdf(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_PDFS

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('admin'):
            return jsonify({'message': 'Please login first!'}), 401
        return f(*args, **kwargs)
    return decorated

@admin_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    admin = Admin.query.filter_by(username=data['username']).first()

    if admin and bcrypt.check_password_hash(admin.password, data['password']):
        session['admin'] = True
        return jsonify({'message': 'Login successful!'})

    return jsonify({'message': 'Wrong username or password!'}), 401

@admin_bp.route('/api/admin/books', methods=['POST'])
@login_required
def add_book():
    title       = request.form.get('title')
    author      = request.form.get('author')
    category    = request.form.get('category')
    description = request.form.get('description', '')
    cover_file  = request.files.get('cover_image')
    pdf_file    = request.files.get('pdf_path')

    if not title or not author or not category:
        return jsonify({'message': 'Title, author and category required!'}), 400

    cover_path = ''
    if cover_file and allowed_image(cover_file.filename):
        filename = secure_filename(cover_file.filename)
        cover_file.save(os.path.join('static', 'images', filename))
        cover_path = f'images/{filename}'

    pdf_path = ''
    if pdf_file and allowed_pdf(pdf_file.filename):
        filename = secure_filename(pdf_file.filename)
        pdf_file.save(os.path.join('static', 'pdfs', filename))
        pdf_path = f'pdfs/{filename}'

    new_book = Book(
        title=title,
        author=author,
        category=category,
        cover_image=cover_path,
        pdf_path=pdf_path,
        description=description
    )
    db.session.add(new_book)
    db.session.commit()

    return jsonify({'message': 'Book added successfully!'})

@admin_bp.route('/api/admin/books/<int:book_id>', methods=['DELETE'])
@login_required
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted!'})

@admin_bp.route('/api/admin/logout', methods=['POST'])
def logout():
    session.pop('admin', None)
    return jsonify({'message': 'Logged out!'})