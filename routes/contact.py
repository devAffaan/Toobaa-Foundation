from flask import Blueprint, request, jsonify

from models import Contact
from database import db

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods = ['POST'])

def submit_contact():
    data = request.get_json()

    new_Contact = Contact(
        name = data['name'],
        email = data['email'],
        message = data['message']
    )

    db.session.add(new_Contact)
    db.session.commit()

    return jsonify({'message' : 'Sent successfully!'})