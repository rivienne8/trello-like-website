import {dataHandler} from "./data_handler.js";
import {currentUser} from "./dom.js";
import {userMode} from "./users.js";


export let addListenersMode = {


    addListenerToOpenedBoard: function (){


    },

    addRegisterListener: function (elem){
        elem.addEventListener('click', addListenersMode.OnClickRegister);
    },

    OnClickRegister: function (evt){
        addListenersMode.clearUsernamePassword();

        addListenersMode.hideShowRegisterLoginButtons();


        let form = document.getElementById('register-form');
        form.style.visibility = 'visible';
        if (evt.target.id == 'register'){
            addListenersMode.hideShowRegisterLoginButtons();
            document.getElementById('save-new-user').style.display = "block";
        } else if (evt.target.id == 'login') {
            addListenersMode.hideShowRegisterLoginButtons(true);
            document.getElementById('login-user').style.display = "block";
        }
    },

    hideRegisterLoginButtons: function (){
        document.getElementById('save-new-user').style.display = "none";
        document.getElementById('login-user').style.display = "none";
    },

    hideShowRegisterLoginButtons: function (log){
        if (log) {
            document.getElementById('save-new-user').style.display = "none";
            document.getElementById('login-user').style.display = "block";
        } else {
            document.getElementById('save-new-user').style.display = "block";
            document.getElementById('login-user').style.display = "none";
        }
    },

    addRegisterSaveListener: function (elem){
        elem.addEventListener('click', addListenersMode.OnClickRegisterNewUser)
    },

    clearUsernamePassword: function () {
        document.getElementById('username-input').value = "";
        document.getElementById('password-input').value = "";
        document.getElementById('register-status').innerText = "";
    },

    OnClickRegisterNewUser: function (evt) {
        let username = document.getElementById('username-input').value;
        let password = document.getElementById('password-input').value;
        let statusMessage = document.getElementById('register-status');

        dataHandler.registerUser(username,password, function (status) {
            addListenersMode.clearUsernamePassword()
            if (status.status === "ok"){
                statusMessage.innerText = 'Registration successful, please log in';
                addListenersMode.hideShowRegisterLoginButtons(true);

            } else if (status.status === "wrong") {
                statusMessage.innerText = 'Something went wrong... Try again, please';
            }

        } )

    },

    addLoginListener: function (elem) {
        elem.addEventListener('click', addListenersMode.OnClickLoginUser)
    },

    OnClickLoginUser: function (evt){

        let username = document.getElementById('username-input').value;
        let password = document.getElementById('password-input').value;
        let statusMessage = document.getElementById('register-status');

        dataHandler.loginUser(username,password, function (status){
            addListenersMode.clearUsernamePassword()
            if (status.status === "ok"){

                evt.target.closest('.popup').querySelector('.fa-times').click();
                let usernameName = document.getElementById('username-name');

                currentUser.username = status.username;
                currentUser.id = status.user_id;
                usernameName.innerText =currentUser.username;
                userMode.loadPrivatePublicBoards()
                document.querySelector('.add-board-button').innerHTML = "Create new private board"

            } else if (status.status === "wrong") {
                statusMessage.innerText = 'Something went wrong... Try again, please';

            }
        })

    },

    addLogoutListener: function (elem) {
        elem.addEventListener('click', addListenersMode.OnClickLogoutLink);
    },

    OnClickLogoutLink: function (evt) {
        dataHandler.logout(function (data){
            if (data['status'] == "ok") {
                currentUser.id = null;
                currentUser.username = "";
                let usernameName = document.getElementById('username-name');
                usernameName.innerText = "";
                usernameName.setAttribute('data-username', "");
                usernameName.setAttribute('data-user_id',"");
                userMode.loadPublicBoards();
                document.querySelector('.add-board-button').innerHTML = "Create new board";
                addListenersMode.switchLoginLogoutLinks();
            }
        });



    },

    switchLoginLogoutLinks: function (log){
        let registerLink = document.getElementById('register');
        let loginLink = document.getElementById('login');
        let logoutLink = document.getElementById('logout');
        if (log){

            logoutLink.style.display = 'block';
            registerLink.style.display = 'none'
            loginLink.style.display = 'none'
        }
        else {
            logoutLink.style.display = 'none';
            registerLink.style.display = 'block'
            loginLink.style.display = 'block';
        }
    },


    addCloseCrossListener: function (elems) {
        for (let elem of elems){
           elem.addEventListener('click', addListenersMode.OnClickCloseCross)
        }
    },

    OnClickCloseCross: function (evt) {
        if (evt.target.matches('.fa-times') && evt.target.closest('.popup')) {
            evt.target.closest('.popup').style.visibility = 'hidden';
        }
    },

    addShowBoardRenameListener: function () {
        let boardName = document.getElementsByClassName('board-name')
        for (let board of boardName) {
            board.addEventListener("click", addListenersMode.showBoardRenameMenu)
        }
    },

    showBoardRenameMenu: function (evt) {
    let boardTitle = evt.target.id
    let boardRenameContainer = document.getElementById(`${boardTitle}-container`)
    let renameInput = document.getElementById(`${boardTitle}-input`)

    boardRenameContainer.style.display = 'block'
    renameInput.focus()

    },

    addFocusOutRenameListener: function () {
        let renameContainer = document.getElementsByClassName("board-rename-container")
        for (let container of renameContainer) {

            container.addEventListener("focusout", addListenersMode.focusOutBoardRename)
        }
    },

    focusOutBoardRename: function (evt) {
        if (evt.relatedTarget == null || evt.relatedTarget.parentNode != evt.target.parentNode) {
            evt.target.parentNode.style.display = 'none'

        }
    },

    addOnpressRenameListener: function () {
        let boardRenameInputs = document.getElementsByClassName('board-rename-input')
        for (let input of boardRenameInputs) {
            input.addEventListener('keyup', addListenersMode.onPressRenameBoard)
        }

    },

    onPressRenameBoard: function (evt) {
        let input = evt.target.parentNode.querySelector('.board-rename-input');
        let button = evt.target.parentNode.querySelector('.board-rename-button')

        if (evt.keyCode === 13) {
            evt.preventDefault();
            let newTitle = evt.target.parentNode.querySelector('.board-rename-input').value;
            if (newTitle === "") {
                evt.target.innerText = input.placeholder;
                addListenersMode.hideBoardRenameInput(evt.target);

            } else {
                button.click();
            }

        } else if (evt.keyCode === 27) {
            evt.preventDefault();
            evt.target.innerText = input.placeholder;
            addListenersMode.hideBoardRenameInput(evt.target)
        }
    },

    hideBoardRenameInput: function (elem) {
        let boardTitle = elem.placeholder
        document.getElementById(`${boardTitle}-container`).style.display = 'none'
    },

    addPreventDefoultKeyPresse: function (elem) {
        elem.addEventListener('keydown', (evt) => {
            if (evt.keyCode === 13) {
                evt.preventDefault()
            }
        })
    }
}

