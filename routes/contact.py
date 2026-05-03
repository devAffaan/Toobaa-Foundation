from flask import Blueprint, request, jsonify
from models import Contact
from database import db

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()

    if not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({'message': 'Name, email and message are required!'}), 400

    new_contact = Contact(
        name=data['name'],
        email=data['email'],
        message=data['message'],
        phone=data.get('phone', ''),
        subject=data.get('subject', '')
    )

    db.session.add(new_contact)
    db.session.commit()

    return jsonify({'message': 'Message sent successfully!'})