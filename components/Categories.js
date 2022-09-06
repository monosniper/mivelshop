import React, {useEffect, useMemo} from 'react';
import store from "../store/store";
import { motion } from "framer-motion/dist/framer-motion"
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {useRouter} from "next/router";

const Categories = () => {
    const data = useMemo(() => store.categories, [store.categories, store.type])
    const router = useRouter()

    useEffect(() => {
        if(store.categories.length) {
            store.setCategory(toJS(store.categories.filter(cat => cat.type === 'products'))[0]._id)
        }
    }, [store.categories])

    const handleClick = (id) => {
        if(router.pathname !== '/') router.push('/')
        store.setCategory(id)
    }

    return (
        <div className="categories">
            {data.map(category => {
                return <motion.div
                    className={"category " + (category._id === store.category ? 'category_active' : '')}
                    key={'category-'+category._id}
                    animate={{
                        display: category.type === store.type ? 'block' : 'none',
                        opacity: category.type === store.type ? 1 : 0
                    }}
                >
                    <div
                        data-id={category._id}
                        onClick={() => handleClick(category._id)}
                    >
                        {category.name}
                    </div>
                </motion.div>
            }
            )}
        </div>
    );
};

export default observer(Categories);