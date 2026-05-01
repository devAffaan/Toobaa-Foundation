from flask import Blueprint, request, jsonify, send_from_directory
import os

from models import Book
books_bp = Blueprint('books', __name__)

@books_bp.route('/api/books')

def get_books():
    
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])

@books_bp.route('/api/books/<int:book_id>')
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict())


@books_bp.route('/api/books/search')

def search_books():
    query = request.args.get('q', '')
    books = Book.query.filter(Book.title.contains(query)).all()
    return jsonify([book.to_dict() for book in books])


@books_bp.route('/api/books/view/<int:book_id>')

def view_book(book_id):
    book = Book.query.get_or_404(book_id)
    pdf_folder = os.path.join(os.getcwd(),'static', 'pdfs')
    filename = os.path.basename(book.pdf_path)
    return send_from_directory(pdf_folder, filename, as_attachment = False)

@books_bp.route('/api/books/download/<int:book_id>')

def books_download(book_id):
    book = Book.query.get_or_404(book_id)
    pdf_folder = os.path.join(os.getcwd(), 'static', 'pdfs')
    filename = os.path.basename(book.pdf_path)
    return send_from_directory(pdf_folder, filename, as_attachment = True)

