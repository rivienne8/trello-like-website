import {dataHandler} from "./data_handler.js";
import {cardsMode} from "./cards.js";
import {sortable} from "./sortable.js";


export let statusMode = {

    createStatus: function (evt) {

        let currentBoardID = evt.target.getAttribute('data-board_id');
        let statusTitle = document.getElementById('new-column-input').value
        dataHandler.createNewColumn(currentBoardID, statusTitle, function(column) {
            dataHandler.createNewStatus(statusTitle, function (status) {
                statusMode.addStatus(status, currentBoardID)
            })
        })
    },


    addStatus: function (status, currentBoardID) {
        let statusHTML = `
            <div class="board-column" id="column${status.id}">
            <div class="board-header" id="${status.title}-header">
            <div class="board-column-title" id="${status.title}">${status.title}</div>
            <input id="${status.title}-input" class="status-title-input" placeholder="${status.title}" style="display: none">
            <button class="status-save-button"  id="${status.title}-button" style="display: none"
            data-board_id="${currentBoardID}"
            data-status-title="${status.title}">SAVE</button>
            </div>
            <div class="board-column-content">
            <button class="newCardButtonBoard${currentBoardID}" 
                data-board_id="${currentBoardID}" 
                data-status_id="${status.id}">New Card</button>
            </div>
        </div>`;

        let columnsContainer = document.querySelector('.board-columns');
        columnsContainer.insertAdjacentHTML("beforeend", statusHTML);

        statusMode.showNewColumnButton()

        let newColumn = document.getElementById(`column${status.id}`)
        let newCardButton = newColumn.querySelector(`.newCardButtonBoard${currentBoardID}`);
        newCardButton.addEventListener('click', cardsMode.OnClickNewCardButton);

        let newColumnContent = newColumn.querySelector(".board-column-content");
        new Sortable(newColumnContent, {
            group: 'shared', // set both lists to same group
            animation: 150,
            onEnd: sortable.dragEnd,
            draggable: ".card"
        });
        debugger
        let statusTitle = document.getElementById(`${status.title}`)
        let statusSaveButton = document.getElementById(`${status.title}-button`)
        let boardHeader = document.getElementById(`${status.title}-header`)
        let statusTitleInput = document.getElementById(`${status.title}-input`)

        statusTitle.addEventListener('click', statusMode.showRenameMenu)
        statusSaveButton.addEventListener('click', statusMode.renameStatus)
        boardHeader.addEventListener('focusout', statusMode.OnFocusOut)
        statusTitleInput.addEventListener('keyup', statusMode.OnpressKey)
    },


    addNewColumnButton: function (currentBoardID) {
        let newColumnButton = document.getElementById("new-column-button")
        newColumnButton.addEventListener("click", function () {
            if (document.getElementById('new-column-input') === null) {
                let newHTML = `
                <input type="text" id="new-column-input">
                <button id="new-column-save-button"
                data-board_id="${currentBoardID}">SAVE</button>`
                newColumnButton.insertAdjacentHTML("beforebegin", newHTML);
            }
            newColumnButton.style.display = 'none'


            let newColumnInput = document.getElementById('new-column-input')
            newColumnInput.style.display = 'inline'
            newColumnInput.focus()
            newColumnInput.addEventListener("focusout", statusMode.focusOutNewColumn)

            let newColumnSaveButton = document.getElementById("new-column-save-button")
            newColumnSaveButton.style.display = 'inline'
            newColumnSaveButton.addEventListener("click", statusMode.createStatus)

        })
    },

    showNewColumnButton: function () {
        let newColumnInput = document.getElementById('new-column-input')
        let newColumnSaveButton = document.getElementById('new-column-save-button')
        let newColumnButton = document.getElementById("new-column-button")

        newColumnInput.style.display = 'none'
        newColumnSaveButton.style.display = 'none'
        newColumnButton.style.display = 'inline'
    },


    showRenameMenu: function (evt) {
        let pressedStatusID = evt.target.id
        let statusTitle = document.getElementById(pressedStatusID)
        let renameInput = document.getElementById(`${pressedStatusID}-input`)
        let renameButton = document.getElementById(`${pressedStatusID}-button`)

        statusTitle.style.display = 'none'
        renameInput.style.display = 'block'
        renameInput.focus()
        renameButton.style.display = 'block'
    },


    renameStatus: function (evt) {
        let statusTitle = evt.target.getAttribute('data-status-title');
        let boardID = evt.target.getAttribute('data-board_id');
        let statusContainer = document.getElementById(statusTitle)
        let renameInput = document.getElementById(`${statusTitle}-input`)
        let renameButton = document.getElementById(`${statusTitle}-button`)

        let inputValue = renameInput.value

        dataHandler.renameStatus(statusTitle, inputValue, boardID, function (response) {
            renameButton.style.display = 'none'
            renameInput.style.display = 'none'
            statusContainer.innerText = inputValue
            statusContainer.style.display = 'block'
        })
    },


    OnpressKey: function (evt) {
        let input = evt.target.parentNode.querySelector('.status-title-input');
        let button = evt.target.parentNode.querySelector('.status-save-button')

        if (evt.keyCode === 13) {
            evt.preventDefault();
            let newTitle = evt.target.parentNode.querySelector('.status-title-input').value;
            if (newTitle === "") {
                evt.target.innerText = input.placeholder;
                statusMode.HideInputShowTitle(evt.target);

            } else {
                button.click();
            }

        } else if (evt.keyCode === 27) {
            evt.preventDefault();
            evt.target.innerText = input.placeholder;
            statusMode.HideInputShowTitle(evt.target)
        }
    },


    HideInputShowTitle: function (elem) {
        elem.style.display = 'none';
        elem.parentNode.querySelector('.board-column-title').style.display = 'block';
        elem.parentNode.querySelector('.status-save-button').style.display = 'none';
    },


    OnFocusOut: function (evt){
        if (evt.relatedTarget == null || evt.relatedTarget.parentNode != evt.target.parentNode){
            evt.target.parentNode.querySelector('.board-column-title').style.display = 'block';
            evt.target.parentNode.querySelector('.status-title-input').style.display = 'none'
            evt.target.parentNode.querySelector('.status-save-button').style.display = 'none';

        }
    },

    focusOutNewColumn: function (evt) {
        if (evt.relatedTarget == null || evt.relatedTarget.parentNode != evt.target.parentNode) {
            evt.target.parentNode.querySelector('#new-column-input').style.display = 'none'
            evt.target.parentNode.querySelector('#new-column-save-button').style.display = 'none';
            evt.target.parentNode.querySelector('#new-column-button').style.display = 'inline';
        }
    },

}