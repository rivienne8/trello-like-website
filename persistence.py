import csv

STATUSES_FILE = './data/statuses.csv'
BOARDS_FILE = './data/boards.csv'
CARDS_FILE = './data/cards.csv'
USERS_FILE = './data/users.csv'
COLUMNS_FILE = './data/columns.csv'
COLUMNS_HEADERS = ["board_id", "status_title"]
COLUMNS_BOARD_ID_INDEX = 0
COLUMNS_STATUS_TITLE_INDEX = 1
STATUSES_HEADERS = ["id", "title"]
STATUS_ID_INDEX = 0
STATUS_TITLE_INDEX = 1
BOARDS_HEADERS = ["id", "title", "user_id"]
CARDS_HEADERS = ["id", "board_id", "title", "status_id", "order"]
USERS_HEADERS = ["id", "username", "password"]
CARD_ID_INDEX = 0
CARD_BOARD_ID_INDEX = 1
CARD_TITLE_INDEX = 2
CARD_STATUS_ID_INDEX = 3
CARD_ORDER_INDEX = 4
USER_ID = "id"



_cache = {}  # We store cached data in this dict to avoid multiple file readings


def _read_csv(file_name):
    """
    Reads content of a .csv file
    :param file_name: relative path to data file
    :return: OrderedDict
    """
    with open(file_name) as boards:
        rows = csv.DictReader(boards, delimiter=',', quotechar='"')
        formatted_data = []
        for row in rows:
            formatted_data.append(dict(row))
        # print (formatted_data)
        return formatted_data


def _get_data(data_type, file, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param file: relative path to data file
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or data_type not in _cache:
        _cache[data_type] = _read_csv(file)
    return _cache[data_type]


def add_board(value):
    boards = get_boards()
    index = len(boards) + 1
    with open(BOARDS_FILE, 'a', newline="") as file:
        writer = csv.writer(file, delimiter=',')
        writer.writerow([index, value])

def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data('statuses', STATUSES_FILE, force);


def get_boards(force=False):
    return _get_data('boards', BOARDS_FILE, force)


def get_cards(force=True):
    return _get_data('cards', CARDS_FILE, force)

def get_columns(force=False):
    return _get_data('columns', COLUMNS_FILE, force)


def _append_to_csv(file_name, dictionary, headers):

    with open(file_name, mode="a", newline='', encoding='utf-8') as csv_file:
        dict_writer = csv.DictWriter(csv_file, fieldnames=headers, quotechar='"', quoting=csv.QUOTE_MINIMAL)
        dict_writer.writerow(dictionary)


def _write_csv(file_name, dictionaries, headers):

    with open(file_name, mode="w", newline='', encoding='utf-8') as csv_file:

        dict_writer = csv.DictWriter(csv_file, fieldnames=headers, quotechar='"', quoting=csv.QUOTE_MINIMAL)
        dict_writer.writeheader()
        for dictionary in dictionaries:
            dict_writer.writerow(dictionary)


def _update_value_csv(file_name, dictionaries, headers, old_value, new_value):

    with open(file_name, mode="w", newline='', encoding='utf-8') as csv_file:

        dict_writer = csv.DictWriter(csv_file, fieldnames=headers, quotechar='"', quoting=csv.QUOTE_MINIMAL)
        dict_writer.writeheader()
        for dictionary in dictionaries:
            for key,value in dictionary.items():
                if value == old_value:
                    dictionary[key] = new_value
            dict_writer.writerow(dictionary)



'''cards = a list of dictionaries'''
def write_cards(cards):
    _write_csv(CARDS_FILE, cards, CARDS_HEADERS)


'''card = a dictionary'''
def append_card(card):
    _append_to_csv(CARDS_FILE, card, CARDS_HEADERS)


'''function that creates new id or new order '''
def _get_new_attribute(data_type, file_name, var, force=True):
    items = _get_data(data_type, file_name, force)
    max_attr = max(int(item[f'{var}']) for item in items)
    new_attr = max_attr + 1
    return new_attr


def get_new_card_attribute(var):
    return _get_new_attribute('cards', CARDS_FILE, var)

def get_new_board_id(var):
    return _get_new_attribute('boards', BOARDS_FILE, var)

def get_new_status_attribute(var):
    return _get_new_attribute('statuses', STATUSES_FILE, var)

def append_status(status):
    _append_to_csv(STATUSES_FILE, status, STATUSES_HEADERS)

def append_column(column):
    _append_to_csv(COLUMNS_FILE, column, COLUMNS_HEADERS)
    return column

def append_board(board):
    _append_to_csv(BOARDS_FILE, board, BOARDS_HEADERS)
    return board

def rename_status(statuses, old_value, new_value):
    _update_value_csv(STATUSES_FILE, statuses, STATUSES_HEADERS, old_value, new_value)
    return new_value


def rename_board(boards, old_value, new_value):
    _update_value_csv(BOARDS_FILE, boards, BOARDS_HEADERS, old_value, new_value)
    return new_value

def get_users():
    return _get_data('users', USERS_FILE, force=True)

def write_users(users):
    _write_csv(USERS_FILE, users, USERS_HEADERS)

def get_new_user_id(var):
    return _get_new_attribute('users',USERS_FILE, var)