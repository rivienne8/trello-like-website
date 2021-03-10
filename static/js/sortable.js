import {dataHandler} from "./data_handler.js";

export let sortable = {
    dragEnd: function (evt) {
        let card = evt.item // dragged HTMLElement
        let cardId = card.id.slice(4,);
        let newColumnContent = evt.to; // target list
        let newStatusId = newColumnContent.parentNode.id.slice(6,);
        let oldColumnContent = evt.from; // previous list

        let oldOrderSortable = evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
        let newOrderSortable = evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
        let newCardOrder = newOrderSortable;



        dataHandler.updateCardStatusOrder(cardId, newStatusId, newCardOrder, function (response) {
        })
    }
}