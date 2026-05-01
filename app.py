from flask import Flask, render_template
from database import db
from dotenv import load_dotenv
from urllib.parse import quote_plus
import os

load_dotenv()

app = Flask(__name__)

password = quote_plus(os.getenv('MYSQL_PASSWORD'))

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{password}"
    f"@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DB')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db.init_app(app)

from routes.books import books_bp
from routes.contact import contact_bp
from routes.admin import admin_bp

app.register_blueprint(books_bp)
app.register_blueprint(contact_bp)
app.register_blueprint(admin_bp)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/book/<int:book_id>')
def book(book_id):
    return render_template('book.html', book_id=book_id)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/admin/login')
def admin_login_page():
    return render_template('admin/login.html')

@app.route('/admin/dashboard')
def admin_dashboard_page():
    return render_template('admin/dashboard.html')


if __name__ == '__main__':
    app.run(debug=True)