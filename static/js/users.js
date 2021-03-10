import {currentUser, dom} from "./dom.js";
import {addListenersMode} from "./addListenersMode.js";


export var userMode = {

    loadPrivatePublicBoards: function (){
        addListenersMode.hideRegisterLoginButtons()

        addListenersMode.switchLoginLogoutLinks(true)
        document.getElementById('boards').innerText = "";
        dom.init()
        },

    loadPublicBoards: function () {
        addListenersMode.switchLoginLogoutLinks();
        document.getElementById('boards').innerText = "";
        dom.init()

    },

    checkUserLoggedIn: function () {
        let userName = document.getElementById('username-name');
        let user_id = userName.getAttribute('data-user_id');
        let username = userName.getAttribute('data-username');
        if (user_id != null && user_id != "") {
            currentUser.id = user_id;

            addListenersMode.switchLoginLogoutLinks(true)
        }
    },

}