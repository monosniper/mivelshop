import React from 'react';
import store from "../store/store";
import {observer} from "mobx-react";

const TypeSwitch = () => {
    return (
        <div className="product-type-switcher">
            <div onClick={() => store.setType('products')} className={"product-type-switcher__item " + (store.type === 'products' ? 'product-type-switcher__item_active' : '')}>Товары</div>
            <div onClick={() => store.setType('digital')} className={"product-type-switcher__item " + (store.type === 'digital' ? 'product-type-switcher__item_active' : '')}>Digital</div>
        </div>
    );
};

export default observer(TypeSwitch);