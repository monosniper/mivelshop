import React from 'react';
import store from "../store/store";
import {observer} from "mobx-react";

const Item = ({ item }) => {
    const handleClick = () => {
        console.log(item.id)
        store.setActiveItem(item.id)
        console.log(store.activeItem)
    }

    return (
        <div className="item-wrapper">
            <div
                onClick={handleClick}
                className={"item" + (item.long ? ' long' : '') + (store.activeItem ? (store.activeItem.id === item.id ? ' active' : '') : '')}
                style={{backgroundImage: 'url("/assets/img/product.jpg")'}}
                // className={'item'}
            >

            </div>
            <div className="item__caption">{item.name} - <span className="item__price">${item.price}</span></div>
        </div>
    );
};

export default observer(Item);