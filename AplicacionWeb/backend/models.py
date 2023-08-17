from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy.ext.declarative import declarative_base

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "user"
    number = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(50))
    last = db.Column(db.String(50))
    birthdate = db.Column(db.Date)
    age = db.Column(db.Integer)
    occupation = db.Column(db.String(10))
    company = db.Column(db.String(10))