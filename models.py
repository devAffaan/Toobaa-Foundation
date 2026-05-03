from database import db

class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(255), nullable = False)
    author = db.Column(db.String(255), nullable = False)
    category = db.Column(db.String(255), nullable = False)
    cover_image = db.Column(db.String(255), nullable = False)
    pdf_path = db.Column(db.String(255), nullable = False)
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            'id' : self.id,
            'title' : self.title,
            'author' : self.author,
            'category' : self.category,
            'cover_image' : self.cover_image,
            'pdf_path' : self.pdf_path,
            'description' : self.description
        }
    

class Contact(db.Model):
    __tablename__ = 'contacts'

    id      = db.Column(db.Integer, primary_key=True)
    name    = db.Column(db.String(100), nullable=False)
    email   = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    phone   = db.Column(db.String(20))
    subject = db.Column(db.String(200))


class Admin(db.Model):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(100), nullable = False)
    password = db.Column(db.String(255), nullable = False)