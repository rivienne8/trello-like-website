// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
import {cardsMode} from "./cards.js";
import {statusMode} from "./statuses.js";
import {userMode} from "./users.js";
import {addListenersMode} from "./addListenersMode.js";
import {sortable} from "./sortable.js";


var addNewBoardContainer = document.getElementById('add-new-board-container')

var addBoardButton = document.getElementById('add-board-button')
var addBoardInput = document.getElementById('add-board-input')
var saveNewBoardButton = document.getElementById('save-new-board-button')

const registerLink = document.getElementById('register');
const registerSaveButton = document.getElementById('save-new-user');
const loginLink = document.getElementById('login');
const loginButton = document.getElementById('login-user');
const logoutLink = document.getElementById('logout');



var currentBoard = new CurrentBoardLoaded("","");

export var currentUser = new CurrentUserLogged(null, "");


function CurrentBoardLoaded(id, statuses) {
    this.id = id;
    this.statuses = statuses;
}

function CurrentUserLogged(id,username) {
    this.id = id;
    this.username = username;
}

export let dom = {
    init: function () {
        userMode.checkUserLoggedIn()
        // This function should run once, when the page is loaded.
        dom.loadBoards(currentUser.id);
        dom.addBoardButtonListeners();
    },



    loadBoards: function (userId) {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(userId, function (boards) {
            dom.showBoards(boards)

        });

    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for (let board of boards) {
            boardList += `
                <li class="board-name" id="${board.title}">${board.title}</li>
                <div class="board-rename-container" id="${board.title}-container" style="display:none;">
                <input class="board-rename-input" id="${board.title}-input" placeholder="${board.title}">
                <button class="board-rename-button" data-board-title="${board.title}">SAVE</button>
                </div>
                <button id="${board.id}" style="display: block">SHOW BOARD</button>
                <button id="hide-board${board.id}" style="display: none">HIDE BOARD</button>
            `;
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;


        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);


        addListenersMode.addShowBoardRenameListener()
        addListenersMode.addFocusOutRenameListener()
        addListenersMode.addOnpressRenameListener()


        let renameButton = document.getElementsByClassName('board-rename-button')
        for (let button of renameButton) {
            button.addEventListener("click", renameBoard)
        }

        for (let board of boards) {
            let buttonID = document.getElementById(board.id)
            buttonID.addEventListener("click", openBoard)

            let hideBoardButton = document.getElementById(`hide-board${board.id}`)
            hideBoardButton.addEventListener("click", closeBoard)
            }
        },


    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId,function (cards){
            dom.showCards(cards);
        })

        dom.addCardsListeners();
    },

    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        dom.clearCards()
        let boardContainer = document.getElementById(`board${currentBoard.id}`);

        for (let card of cards) {

            let cardToAdd = cardsMode.prepareNewCard(card);
            let columnContent = boardContainer.querySelector(`#column${card.status_id} > .board-column-content`);
            columnContent.insertAdjacentHTML("beforeend", cardToAdd);
        }

    },


    clearCards: function () {
        let boardContainer = document.getElementById(`board${currentBoard.id}`);
        let cardsToRemove = boardContainer.getElementsByClassName("card")
        let cardsToRemoveArray = Array.from(cardsToRemove)
        for (let card of cardsToRemoveArray){
            card.parentNode.removeChild(card);
        }
    },

    addCardsListeners: function (){
        let columnsContainer = document.getElementById(`board${currentBoard.id}`).querySelector('.board-columns');
        columnsContainer.addEventListener('click', cardsMode.OnClickTrashIcon);
        columnsContainer.addEventListener('click', cardsMode.showCardRenameMenu);
        columnsContainer.addEventListener('click', cardsMode.OnClickRenameCard);
        columnsContainer.addEventListener('keyup', cardsMode.OnPressKey);
        columnsContainer.addEventListener('focusout', cardsMode.OnFocusOut);
    },


    loadStatuses: function () {
        dataHandler.getStatuses(function (statuses) {
            currentBoard.statuses = statuses;

        })
    },


    addBoardButtonListeners: function () {
        addBoardButton.addEventListener("click", function () {
        addNewBoardContainer.style.display = 'block'
        });

        saveNewBoardButton.addEventListener('click', dom.createNewBoard)

        addListenersMode.addRegisterListener(registerLink);
        addListenersMode.addRegisterSaveListener(registerSaveButton);
        addListenersMode.addRegisterListener(loginLink);
        addListenersMode.addLoginListener(loginButton);
        addListenersMode.addCloseCrossListener(document.getElementsByClassName("fa-times"));
        addListenersMode.addLogoutListener(logoutLink);
        addListenersMode.addPreventDefoultKeyPresse(document.querySelector('form'))

    },

    createNewBoard: function () {
            let boardTitle = addBoardInput.value
            let userID = currentUser.id

            dataHandler.createNewBoard(boardTitle, userID, function (board) {
                dom.addBoard(board)
            })
        },

    addBoard: function (board) {
        let boardList = '';

        boardList += `
                <li class="board-name" id="${board.title}">${board.title}</li>
                <div class="board-rename-container" id="${board.title}-container" style="display:none;">
                <input class="board-rename-input" id="${board.title}-input" placeholder="${board.title}">
                <button class="board-rename-button" data-board-title="${board.title}">SAVE</button>
                </div>
                <button id="${board.id}" style="display: block">SHOW BOARD</button>
                <button id="hide-board${board.id}" style="display: none">HIDE BOARD</button>
            `;

            let boardsContainer = document.querySelector('.board-container');
            boardsContainer.insertAdjacentHTML("beforeend", boardList);

            addNewBoardContainer.style.display = 'none'

            let buttonID = document.getElementById(board.id)
            buttonID.addEventListener("click", openBoard)

            let hideBoardButton = document.getElementById(`hide-board${board.id}`)
            hideBoardButton.addEventListener("click", closeBoard)
    }
}


function openBoard(e) {


            currentBoard.id = e.target.id;
            dom.loadStatuses()
            dataHandler.getBoards(currentUser.id, function (boards) {
                dataHandler.getStatuses(function (statuses) {

                    dataHandler.getColumnsByBoardID(currentBoard.id, function (columns) {
                        // dataHandler.getCardsByBoardId(e.target.id, function (cards) {



                        let headersList = '';
                        let boardTitle = '';
                        let newColumnButton = '';

                        for (let board of boards) {
                            if (board.id === e.target.id) {
                                boardTitle = board.title
                            }
                        }

                        for (let column of columns) {
                            for (let status of statuses) {
                                if (column.status_title == status.title) {
                                    headersList += `
                                    <div class="board-column" id="column${status.id}">
                                    <div class="board-header">
                                    <div class="board-column-title" id="${status.title}">${status.title}</div>
                                    <input id="${status.title}-input" class="status-title-input" placeholder="${status.title}" style="display: none">
                                    <button class="status-save-button"  id="${status.title}-button" style="display: none"
                                    data-board_id="${currentBoard.id}"
                                    data-status-title="${status.title}">SAVE</button>
                                    </div>
                                    <div class="board-column-content">
                                    <button class="newCardButtonBoard${currentBoard.id}" 
                                    data-board_id="${currentBoard.id}" 
                                    data-status_id="${status.id}">New Card</button>
                                    </div>
                                    </div>`;

                                    }
                                }
                            }

                        newColumnButton += `
                        <button class="new-column-button" id="new-column-button">ADD COLUMN</button>`

                        const outerHtml = `
                    <section id="board${currentBoard.id}" class="board">
                        <div class="board-container">
                            <span class="board-title">${boardTitle}</span>
                            ${newColumnButton}
                            <div class="board-columns">                                
                                ${headersList}
                            </div>
                            
                        </div>
                    </section>`;


                        toggleBoardButtons(boards)

                        let boardsContainer = document.getElementById(`hide-board${currentBoard.id}`);
                        boardsContainer.insertAdjacentHTML("afterend", outerHtml);

                        let currentColumns = document.getElementById(`board${currentBoard.id}`).getElementsByClassName('board-column-content');
                        for (let column of currentColumns) {
                            new Sortable(column, {
                                group: 'shared', // set both lists to same group
                                animation: 150,
                                onEnd: sortable.dragEnd,
                                draggable: ".card"
                            });
                        }

                        statusMode.addNewColumnButton(currentBoard.id)

                        addCurrentBoardListeners()

                        dom.loadCards(currentBoard.id)

                    })

                })
            })
}


export function closeBoard() {

    let boardContainer = document.getElementById(`board${currentBoard.id}`)
    let boardButton = document.getElementById(`${currentBoard.id}`)
    let hideBoardButton = document.getElementById(`hide-board${currentBoard.id}`)

    boardContainer.parentNode.removeChild(boardContainer)
    boardButton.style.display = 'block'
    hideBoardButton.style.display = 'none'

    dataHandler.getBoards(currentUser.id, function (boards) {

        for (let board of boards) {
            if (board.id !== currentBoard.id) {
                let boardButton = document.getElementById(board.id)
                boardButton.style.display = 'block'
            }
        }
    })
}

function  addCurrentBoardListeners() {
    let statusTitle = document.getElementsByClassName("board-column-title")
    for (let title of statusTitle) {
        title.addEventListener('click', statusMode.showRenameMenu)
    }

    let statusSaveButton = document.getElementsByClassName("status-save-button")
    for (let button of statusSaveButton) {
        button.addEventListener('click', statusMode.renameStatus)
    }

    let boardHeader = document.getElementsByClassName("board-header")
    for (let header of boardHeader) {
        header.addEventListener('focusout', statusMode.OnFocusOut)
    }

    let statusTitleInput = document.getElementsByClassName("status-title-input")
    for (let input of statusTitleInput) {
        input.addEventListener('keyup', statusMode.OnpressKey)
    }


    let newCardButtons = document.getElementsByClassName(`newCardButtonBoard${currentBoard.id}`);
    for (let button of newCardButtons) {
        button.addEventListener('click', cardsMode.OnClickNewCardButton)
    }
}


function toggleBoardButtons(boards) {

    let boardButton = document.getElementById(`${currentBoard.id}`)
    let hideBoardButton = document.getElementById(`hide-board${currentBoard.id}`)

    boardButton.style.display = 'none'
    hideBoardButton.style.display = 'block'

    for (let board of boards) {
        if (board.id !== currentBoard.id) {
            let boardButton = document.getElementById(board.id)
            boardButton.style.display = 'none'
        }
    }
}


function renameBoard(evt) {
    let boardTitle = evt.target.getAttribute('data-board-title');
    let newValue = evt.target.parentNode.querySelector('.board-rename-input').value
    let renameContainer = evt.target.parentNode

    dataHandler.renameBoard(boardTitle, newValue, function (response) {
        let boardName = document.getElementById(boardTitle)
        boardName.innerText = response
        renameContainer.style.display = 'none'
    })
}



