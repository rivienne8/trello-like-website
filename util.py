from functools import wraps
from flask import jsonify
import bcrypt



def json_response(func):
    """
    Converts the returned dictionary into a JSON response
    :param func:
    :return:
    """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        return jsonify(func(*args, **kwargs))

    return decorated_function


def hash_password_salt(psswd):
    hashed = bcrypt.hashpw(psswd.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')


def verify_psswd(user_psswd, hashed_psswd):
    stored_psswd = hashed_psswd.encode('utf-8')
    return bcrypt.checkpw(user_psswd.encode('utf-8'), stored_psswd)
