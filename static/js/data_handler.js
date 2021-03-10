// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            // .then (response => console.log(response.status);
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function

        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)  // data -> dict
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
        // .catch(err => console.log(err));
    },
    init: function () {
    },
    getBoards: function (userId, callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        if (userId === null){
            this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
        } else {
            this._api_get(`/get-boards/${userId}`, (response) => {
            this._data['boards'] = response;
            callback(response);
        });
        }


    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses

        this._api_get('/get-statuses', (response) => {
            this._data['statuses'] = response;
            callback(response);
        });
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        this._api_get(`get_status/${statusId}`, (response) => {
            this._data[`status[${statusId}]`] = response;
            callback(response)
        })
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards

        this._api_get(`/get-cards/${boardId}`, (response) => {
            this._data[`cardsByBoardId[${boardId}]`] = response;
            callback(response);
        });

    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
        this._api_get(`/get-card/${cardId}`, (response) => {
            this._data[`card[${cardId}]`] = response;
            callback(response);
        })
    },

    getColumnsByBoardID: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards

        this._api_get(`/get-columns/${boardId}`, (response) => {
            this._data[`columnsByBoardId[${boardId}]`] = response;
            callback(response);
        })
    },

    createNewBoard: function (boardTitle, userID, callback) {
        // creates new board, saves it and calls the callback function with its data
        let data = {
            "title": boardTitle,
            "user_id": userID
        }
        this._api_post('/add-board', data, (response) => {
            callback(response);
        });
    },

    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        let data = {
            "title": cardTitle,
            "board_id": boardId,
            "status_id": statusId
        }
        this._api_post(`/add-card`, data, (response) => {
            callback(response);
        })
    },

    createNewStatus: function (statusTitle, callback) {
        let data = {
            'title': statusTitle
        }
        this._api_post(`/add-status`, data, (response) => {
            callback(response)
        })
    },

    createNewColumn(currentBoardID, statusTitle, callback) {
        let data = {
            'board_id': currentBoardID,
            'status_title': statusTitle
        }
        this._api_post(`/add-column`, data, (response) => {
            callback(response)
        })
    },


    deleteCard: function (cardId, callback) {
        this._api_get(`/delete-card/${cardId}`, (response) => {
            callback(response);
        })
    },

    renameCard: function (cardId, newTitle, callback) {
        let data = {
            "card_id": cardId,
            "new_title": newTitle,
        }
        this._api_post(`/rename-card`, data, (response) => {
            callback(response);
        })
    },

    renameBoard: function (boardTitle, newValue, callback) {
        let data = {
            'boardTitle': boardTitle,
            'newValue': newValue
        }
        this._api_post(`/rename-board`, data, (response) => {
            callback(response)

        })
    },

    renameStatus: function (statusTitle, newValue, boardID, callback) {
        let data = {
            'oldValue': statusTitle,
            'newValue': newValue,
            'board_id': boardID
        }
        this._api_post(`/rename-status`, data, (response) => {
            callback(response)

        })
    },

    updateCardStatusOrder: function (cardId, newStatusId, newCardOrder, callback) {
        let data = {
            'card_id': cardId,
            'new_status_id': newStatusId,
            'new_order': newCardOrder
        }
        this._api_post(`/update-card-status-order`, data, (response) => {
            callback(response);
        })
    },

    registerUser: function (username, password, callback) {
        let data = {
            'username': username,
            'password': password

        }
        this._api_post('/register', data, (response) => {
            callback(response);
        })
    },

    loginUser: function (username, password, callback) {
        let data = {
            'username': username,
            'password': password

        }
        this._api_post('/login', data, (response) => {
            callback(response);
        })
    },

    logout: function (callback) {

        this._api_get('/logout', (response) =>{
            callback(response)
        });
    }
}


