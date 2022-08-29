import React, {useEffect, useMemo} from 'react';
import store from "../store/store";
import { motion } from "framer-motion/dist/framer-motion"
import {observer} from "mobx-react";

const Categories = () => {
    const data = useMemo(() => store.categories, [store.categories, store.type])

    useEffect(() => {
        store.requestCategories()
    }, [])

    const handleClick = (id) => {
        store.setCategory(id)
    }

    return (
        <div className="categories">
            {data.map(category =>
                <motion.div className={"category " + (category.id === store.category ? 'category_active' : '')} key={'category-'+category.id} animate={{ display: category.type === store.type ? 'block' : 'none', opacity: category.type === store.type ? 1 : 0 }}>
                    <div
                        data-id={category.id}
                        onClick={() => handleClick(category.id)}
                    >
                        {category.name}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default observer(Categories);