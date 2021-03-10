import persistence
import util


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def add_new_board(board):
    board['id'] = persistence.get_new_board_id('id')
    persistence.append_board(board)
    return board


def get_boards(user_id=None):
    """
    Gather all boards
    :return:
    """
    all_boards = persistence.get_boards(force=True)
    boards_for_user = []
    public_boards = []
    if user_id is not None:
        for board in all_boards:
            if board['user_id'] == str(user_id) or board['user_id'] == "":
                boards_for_user.append(board)
        return boards_for_user
    else:
        for board in all_boards:
            if board['user_id'] == "":
                public_boards.append(board)
        return public_boards


def get_statuses():
    """
    Gather all boards
    :return:
    """
    return persistence.get_statuses(force=True)


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            matching_cards.append(card)

    ordered_matching_cards = sorted(matching_cards, key=lambda card: (int(card['status_id']), int(card['order'])))
    for card in ordered_matching_cards:
        print(card)
    return ordered_matching_cards


def get_card_by_id(card_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards(force=True)
    for card in all_cards:
        if card['id'] == str(card_id):
            return card


def get_columns_by_id(board_id):
    persistence.clear_cache()
    all_columns = persistence.get_columns(force=True)
    matching_columns = []
    for column in all_columns:
        if column['board_id'] == str(board_id):
            matching_columns.append(column)
    return matching_columns

def get_status(status_id):
    all_statuses = get_statuses()
    for status in all_statuses:
        if status['id'] == str(status_id):
            return status['title']


def create_new_status(status):
    status['id'] = persistence.get_new_status_attribute('id')
    persistence.append_status(status)
    return status


def create_new_column(data):
    column = persistence.append_column(data)
    return column


def rename_status(status_data):
    statuses = persistence.get_statuses(force=True)
    old_value = status_data['oldValue']
    new_value = status_data['newValue']
    board_id = status_data['board_id']
    columns = persistence.get_columns()

    renamed_status = persistence.rename_status(statuses, old_value, new_value)
    for column in columns:
        if column['board_id'] == board_id and column['status_title'] == old_value:
            column['status_title'] = new_value
    persistence._write_csv(persistence.COLUMNS_FILE, columns, persistence.COLUMNS_HEADERS)
    return renamed_status

def rename_board(status_data):
    boards = persistence.get_boards(force=True)
    old_value = status_data['boardTitle']
    new_value = status_data['newValue']
    renamed_board = persistence.rename_board(boards, old_value, new_value)
    return renamed_board


def create_new_card(card):
    # if validate_card_data(card):
    card[persistence.CARDS_HEADERS[persistence.CARD_ID_INDEX]] = persistence.get_new_card_attribute('id')
    card[persistence.CARDS_HEADERS[persistence.CARD_ORDER_INDEX]] = persistence.get_new_card_attribute('order')
    persistence.append_card(card)
    return card


def validate_card_data(card):
    for item in persistence.CARDS_HEADERS[1:]:
        if item not in card:
            return False
        if item in [persistence.CARDS_HEADERS[persistence.CARD_BOARD_ID_INDEX],
                    persistence.CARDS_HEADERS[persistence.CARD_STATUS_ID_INDEX],
                    persistence.CARDS_HEADERS[persistence.CARD_ORDER_INDEX]
                    ] and not item.isnumeric():
            return False

    return False


def delete_card(card_id):
    all_cards = persistence.get_cards()
    # print("all")
    for card in all_cards:
        if card[persistence.CARDS_HEADERS[persistence.CARD_ID_INDEX]] == str(card_id):
            deleted_card = card
            all_cards.remove(card)
            reorder_cards(all_cards, deleted_card)

    persistence.write_cards(all_cards)
    return {"status": "ok"}


def reorder_cards(all_cards, edge_card):
    for card in all_cards:
        if card['board_id'] == edge_card['board_id'] and \
                card['status_id'] == edge_card['status_id'] and \
                int(card['order']) > int(edge_card['order']):
            card['order'] = int(card['order']) - 1



def reorder_cards_old_version(deleted_card, remaining_cards):
    status_id = deleted_card['status_id']
    # cards_for_board_id = get_cards_for_board(deleted_card['board_id'])
    cards_to_reorder = sorted(cards_for_status(remaining_cards, status_id), key=lambda card_n: int(card_n['order']))
    for card in cards_to_reorder:
        if card['board_id'] == deleted_card['board_id'] and int(card['order']) > int(card[deleted_card['order']]):
            card['order'] = int(card['order']) - 1


def cards_for_status(cards, status_id):
    matching_cards = []
    for card in cards:
        if int(card['status_id']) == int(status_id):
            matching_cards.append(card)
    return matching_cards


def rename_card(data):
    all_cards = persistence.get_cards()
    for card in all_cards:
        if card[persistence.CARDS_HEADERS[persistence.CARD_ID_INDEX]] == str(data['card_id']):
            card[persistence.CARDS_HEADERS[persistence.CARD_TITLE_INDEX]] = data['new_title']
            persistence.write_cards(all_cards)
            return {"new_title": card[persistence.CARDS_HEADERS[persistence.CARD_TITLE_INDEX]]}


def update_card_status_order(data):
    card_id = data['card_id']
    new_status_id = data['new_status_id']
    new_order = data['new_order']
    all_cards=persistence.get_cards()
    for card in all_cards:
        if card[persistence.CARDS_HEADERS[persistence.CARD_ID_INDEX]] == str(card_id):
            old_card = card.copy()
            card[persistence.CARDS_HEADERS[persistence.CARD_STATUS_ID_INDEX]] = new_status_id
            card[persistence.CARDS_HEADERS[persistence.CARD_ORDER_INDEX]] = str(new_order)
            reorder_cards(all_cards, old_card)  # update order in old status
            reorder_cards_in_new_status(all_cards, card)

    persistence.write_cards(all_cards)
    return {"status": "ok"}


def reorder_cards_in_new_status(all_cards, new_card):
    for card in all_cards:
        if card['board_id'] == new_card['board_id'] and \
                card['status_id'] == new_card['status_id'] and \
                ( card['id'] != new_card['id'] and int(card['order']) >= int(new_card['order'])):
            card['order'] = int(card['order']) + 1


def register(data):
    all_users = persistence.get_users()
    new_user = {}
    username = data['username']
    if username not in [user['username'] for user in all_users]:
        # print([username for username in all_users ])
        hashed_password = util.hash_password_salt(data['password'])
        new_user['id'] = persistence.get_new_user_id('id')
        new_user['username'] = username
        new_user['password'] = hashed_password
        all_users.append(new_user)
        # print(all_users)
        persistence.write_users(all_users)
        return {"status": "ok"}
    else:
        return {"status": "wrong"}


def login(data):
    all_users = persistence.get_users()
    username = data['username']
    password = data['password']
    if username != "" and password != "" and \
       username in [user['username'] for user in all_users]:
        for user in all_users:
            if user['username'] == username:
                if util.verify_psswd(password, user['password']):
                    return {"status": "ok",
                            "user_id" : user['id'],
                            "username": username }
                else:
                    return {"status": "wrong"}
    else:
        return {"status": "wrong"}


def get_user_by_id(id):
    all_users = persistence.get_users()
    for user in all_users:
        if user['id'] == str(id):
            return user


def get_username_by_user_id(id):
    user = get_user_by_id(id)
    return user['username']


def get_user_id_by_username(username):
    all_users = persistence.get_users()
    for user in all_users:
        if user['username'] == username:
            return user['id']