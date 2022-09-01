import React from 'react';
import store from "../store/store";
import {observer} from "mobx-react";
import {toJS} from "mobx";

const TypeSwitch = () => {
    const handleSwitch = (type) => {
        store.setType(type)
        store.setCategory(toJS(store.categories.filter(cat => cat.type === type))[0]._id)
    }

    return (
        <div className="product-type-switcher">
            <div onClick={() => handleSwitch('products')} className={"product-type-switcher__item " + (store.type === 'products' ? 'product-type-switcher__item_active' : '')}>Товары</div>
            <div onClick={() => handleSwitch('digital')} className={"product-type-switcher__item " + (store.type === 'digital' ? 'product-type-switcher__item_active' : '')}>Digital</div>
        </div>
    );
};

export default observer(TypeSwitch);