from flask import Flask, render_template, url_for, request, session, json, jsonify, make_response
from util import json_response
from os import urandom

import data_handler

app = Flask(__name__)
app.secret_key = urandom(16)


FORM_USERNAME = 'username'
FORM_PASSWORD = 'password'
SESSION_USERNAME = 'username'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    if session.get(SESSION_USERNAME):
        user_id = data_handler.get_user_id_by_username(session[SESSION_USERNAME])
        return render_template('index.html', username=SESSION_USERNAME, user_id=user_id)
    else:
        return render_template('index.html')


@app.route('/get-boards/<int:user_id>')
@app.route("/get-boards")
@json_response
def get_boards(user_id=None):
    """
    All the boards
    """
    if user_id is not None :
        username = data_handler.get_username_by_user_id(user_id)
        if session and session[SESSION_USERNAME] == username:
            return data_handler.get_boards(user_id)
        else:
            return data_handler.get_boards()
    else:
        return data_handler.get_boards()


@app.route("/add-board", methods=['POST'])
@json_response
def add_board():
    if request.method == "POST":
        json_data = request.json

        board = data_handler.add_new_board(json_data)

        return board
    else:
        pass


@app.route("/get-statuses")
@json_response
def get_statuses():
    """
    All the boards
    """
    return data_handler.get_statuses()

@app.route("/add-status", methods=['POST'])
@json_response
def add_status():

    if request.method == "POST":
        json_data = request.json

        status = data_handler.create_new_status(json_data)

        return status
    else:
        pass


@app.route("/add-column", methods=['POST'])
@json_response
def add_column():

    if request.method == "POST":
        json_data = request.json

        column = data_handler.create_new_column(json_data)
        print(column)

        return column
    else:
        pass


@app.route("/rename-status", methods=['POST'])
@json_response
def rename_status():
    if request.method == "POST":
        json_data = request.json

        renamed_status = data_handler.rename_status(json_data)

        return renamed_status
    else:
        pass


@app.route("/rename-board", methods=['POST'])
@json_response
def rename_board():
    if request.method == "POST":
        json_data = request.json
        renamed_board = data_handler.rename_board(json_data)

        return renamed_board
    else:
        pass


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/get-card/<int:card_id>")
@json_response
def get_card_by_id(card_id: int):

    return data_handler.get_card_by_id(card_id)


@app.route("/get-columns/<int:board_id>")
@json_response
def get_columns_by_id(board_id: int):

    return data_handler.get_columns_by_id(board_id)


@app.route("/get-status/<int:status_id>")
@json_response
def get_status(status_id: int):

    return data_handler.get_status(status_id)


@app.route("/add-card", methods=["POST"])
@json_response
def add_card():
    if request.method == "POST":
        json_data = request.json
        card = data_handler.create_new_card(json_data)

        return card
    else:
        pass


@app.route("/delete-card/<int:id>", methods=["GET"])
@json_response
def delete_card(id):

    return data_handler.delete_card(id)


@app.route('/rename-card', methods=["POST"])
@json_response
def rename_card():
    if request.method == "POST":
        data = request.json
        newTitle = data_handler.rename_card(data)
        return newTitle


@app.route('/update-card-status-order', methods=['POST'])
@json_response
def update_card_status_order():
    if request.method == "POST":
        data = request.json
        backend_status = data_handler.update_card_status_order(data)
        return backend_status



@app.route('/register', methods=["POST"])
@json_response
def register():
    if request.method == "POST":
        data = request.json
        result = data_handler.register(data)
        return result


@app.route('/login', methods=["POST"])
@json_response
def login():
    if request.method == "POST":
        data = request.json
        result = data_handler.login(data)
        if result['status'] == "ok":
            session[SESSION_USERNAME] = result['username']
        return result


@app.route('/logout', methods=["GET"])
@json_response
def logout():
    session.pop(SESSION_USERNAME, None)
    return {"status" : "ok"}



def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
