from flask import Flask, jsonify, request, redirect, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__, static_folder='frontend-todo/build')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    # table columns for database table todo
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    # string representation of todo instance for debugging
    def __repr__(self):
        return '<Task %r>' % self.id

# API ROUTES
""" 
    Queries the database for all todo items, ordered by creation date. 
    Then returns a JSON response with a list of all tasks.
"""
@app.route('/api/todos', methods=['GET'])
def get_todos():
    tasks = Todo.query.order_by(Todo.date_created).all()
    return jsonify([{'id': task.id, 'content': task.content, 'date_created': task.date_created} for task in tasks])

"""
   Creates a new todo item and adds it to the database 
"""
@app.route('/api/todos', methods=['POST'])
def add_todo():
    task_content = request.json['content']
    new_task = Todo(content=task_content)
    # returns a JSON response with news tasks details if successful, or an error message if not
    try:
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'id': new_task.id, 'content': new_task.content, 'date_created': new_task.date_created}), 201
    except:
        return 'There was an issue adding your task', 500

"""
    Deletes task from database and commits the change
"""
@app.route('/api/todos/<int:id>', methods=['DELETE'])
def delete(id):
    # finds the task by id or returns 404 if not found
    task_to_delete = Todo.query.get_or_404(id)
    # returns a 204 No Content response if successful, or an error message if not.
    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return '', 204
    except:
        return 'There was a problem deleting that task', 500

"""
    Updates task content with the data from the request body
"""
@app.route('/api/todos/<int:id>', methods=['PUT'])
def update(id):
    # finds the task by id or returns 404 if not found
    task_to_update = Todo.query.get_or_404(id)
    task_to_update.content = request.json['content']
    # commits the change to the database and returns a JSON response with the updated task's details if successful, or an error message if not.
    try:
        db.session.commit()
        return jsonify({'id': task_to_update.id, 'content': task_to_update.content, 'date_created': task_to_update.date_created})
    except:
        return 'There was an issue updating your task', 500

"""
    Routes to serve the react app
"""
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    # if a specific path is provided and the file exists, it serves that file.
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # if no specific path is provided or the file doesn't exist, serves the index.html file, allowing the React app to handle the routing.
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    # start flask app in debug mode provding helpful error messages and auto-reloads the server when the code changes
    app.run(debug=True)
    """
        The Flask app provides a REST API to manage to-do items with endpoints for getting, adding, deleting, and updating tasks.
        It uses SQLAlchemy for database interactions.
        It serves the React frontend from the frontend-todo/build directory.
        The React frontend interacts with the Flask backend through these API endpoints.
    """