from flask import Flask, jsonify, request, redirect, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__, static_folder='frontend-todo/build')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id

@app.route('/api/todos', methods=['GET'])
def get_todos():
    tasks = Todo.query.order_by(Todo.date_created).all()
    return jsonify([{'id': task.id, 'content': task.content, 'date_created': task.date_created} for task in tasks])

@app.route('/api/todos', methods=['POST'])
def add_todo():
    task_content = request.json['content']
    new_task = Todo(content=task_content)

    try:
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'id': new_task.id, 'content': new_task.content, 'date_created': new_task.date_created}), 201
    except:
        return 'There was an issue adding your task', 500

@app.route('/api/todos/<int:id>', methods=['DELETE'])
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)

    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return '', 204
    except:
        return 'There was a problem deleting that task', 500

@app.route('/api/todos/<int:id>', methods=['PUT'])
def update(id):
    task = Todo.query.get_or_404(id)
    task.content = request.json['content']

    try:
        db.session.commit()
        return jsonify({'id': task.id, 'content': task.content, 'date_created': task.date_created})
    except:
        return 'There was an issue updating your task', 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(debug=True)
