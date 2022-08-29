import React, {useEffect, useMemo, useState} from 'react';
import Item from "./Item";
import { motion } from "framer-motion/dist/framer-motion"
import store from "../store/store";
import {observer} from "mobx-react";

const Items = () => {
    const data = useMemo(() => store.items, [store.items])

    useEffect(() => {
        store.requestItems()
    }, [])

    return (
        <div className="items">
            {data.map((item,i) => <motion.div key={'item-'+i} animate={{
                display: item.type === store.type && item.category_id === store.category ? 'block' : 'none',
                opacity: item.type === store.type && item.category_id === store.category ? 1 : 0
            }}>
                <Item item={item} />
            </motion.div>)}
        </div>
    );
};

export default observer(Items);