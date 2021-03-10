import {dataHandler} from "./data_handler.js";

export let cardsMode = {

    OnClickNewCardButton: function (evt) {
        let board_id = evt.target.getAttribute('data-board_id');
        let status_id = evt.target.getAttribute('data-status_id');
        cardsMode.showInputForm(board_id,status_id);

    },

    showInputForm: function (board_id,status_id) {
        let newCardForm = document.getElementById('new-card-form');
        newCardForm.querySelector("#card-board-id").value = board_id;
        newCardForm.querySelector("#card-status-id").value = status_id;

        newCardForm.style.visibility = "visible";

        cardsMode.addSaveNewCardListener()

        let closeCross = newCardForm.querySelector(".fa-times");
        closeCross.addEventListener('click',cardsMode.OnClickCloseCross)
    },

    OnClickCloseCross: function (evt){
        evt.target.closest(".popup").style.visibility = "hidden";
    },

    OnPressKey: function (evt){

        if (evt.target.classList.contains('card-title-input')) {
            let input = evt.target.parentNode.querySelector('.card-title-input');
            let button = evt.target.parentNode.querySelector('.status-save-button')
            if (evt.keyCode === 13 ) {
                evt.preventDefault();
                let newTitle = evt.target.parentNode.querySelector('.card-title-input').value;
                if (newTitle === ""){
                    evt.target.innerText = input.placeholder;
                    cardsMode.HideInputShowTitle(evt.target);

                } else {
                    button.click();
                }

            }
            else if (evt.keyCode === 27){
                evt.preventDefault();
                evt.target.innerText = input.placeholder;
                cardsMode.HideInputShowTitle(evt.target)
            }
        }
    },

    HideInputShowTitle: function (elem) {
        elem.style.display = 'none';
        elem.parentNode.querySelector('.card-title').style.display = 'block';
        elem.parentNode.querySelector('.status-save-button').style.display = 'none';
    },

    OnFocusOut: function (evt){

        if (evt.target.classList.contains('card-title-input')) {
            if (evt.relatedTarget == null || evt.relatedTarget.parentNode != evt.target.parentNode){
                evt.target.style.display = 'none';
                evt.target.parentNode.querySelector('.card-title').style.display = 'block';
                evt.target.parentNode.querySelector('.status-save-button').style.display = 'none';
            }
        } else {

        }
    },

    prepareNewCard: function (card) {

        let cardDataHtml =`
            <div id="card${card.id}" class="card" draggable="true" >
                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title">${card.title}</div>
                <input id="card${card.id}-title-input" class="card-title-input" placeholder="${card.title}" style="display: none">
                <button class="status-save-button" id="card${card.id}-title-button" 
                    style="display: none" data-card_id="${card.id}" 
                    data-card_old_title="${card.title}">SAVE</button>
            </div>`

        return cardDataHtml
    },

    appendNewCardToBoard: function (card) {
        let newCard = cardsMode.prepareNewCard(card)

        let boardContainer = document.getElementById(`board${card.board_id}`);
        let columnContainer = boardContainer.querySelector(`#column${card.status_id}`);
        let columnContent = columnContainer.querySelector(".board-column-content");
        columnContent.insertAdjacentHTML("beforeend", newCard);

    },

    OnClickTrashIcon: function (evt){

    if (evt.target.classList.contains('fa-trash-alt')){
        let cardDiv = evt.target.closest(".card");
        let divId = cardDiv.id

        let cardToDeleteId = divId.slice(divId.indexOf("d")+1,);
        dataHandler.deleteCard(cardToDeleteId, function (response){
//             console.log(response.status);
            cardDiv.parentNode.removeChild(cardDiv);
        })
    }

    },



    addSaveNewCardListener: function (){
        let saveButton = document.getElementById("save-new-card");
        saveButton.addEventListener('click', cardsMode.OnClickSaveNewCardButton);
    },

    OnClickSaveNewCardButton: function (evt){
        let newCardForm = document.getElementById("new-card-form");
        let statusId = newCardForm.querySelector("#card-status-id").value;
        let boardId = newCardForm.querySelector("#card-board-id").value;
        let cardTitle = newCardForm.querySelector("#card-title").value;

        dataHandler.createNewCard(cardTitle,boardId,statusId, function (card){
            cardsMode.appendNewCardToBoard(card)

        })
        newCardForm.style.visibility = "hidden";
    },
    showCardRenameMenu: function (evt) {
        if (evt.target.classList.contains('card-title')) {
            let input = evt.target.parentNode.querySelector('.card-title-input');

            evt.target.style.display = 'none';
            input.style.display = 'block';
            input.focus();
            evt.target.parentNode.querySelector('.status-save-button').style.display = 'block';
        }



    },

    OnClickRenameCard: function (evt) {

        if (evt.target.parentNode.classList.contains("card") && evt.target.classList.contains("status-save-button")) {
            let cardId = evt.target.getAttribute('data-card_id');
            let oldTitle = evt.target.getAttribute('data-card_old_title');
            let newTitle = evt.target.parentNode.querySelector('.card-title-input').value;
            if (newTitle === ""){
                newTitle = oldTitle;
            } else {
                dataHandler.renameCard(cardId,newTitle, function (updatedTitle) {
                evt.target.parentNode.querySelector('.card-title').innerText = updatedTitle.new_title;
                })
            }
            

            evt.target.style.display = 'none';
            evt.target.parentNode.querySelector('.card-title-input').style.display = 'none';
            evt.target.parentNode.querySelector('.card-title').style.display = 'block';
        }

    },
}