import React, {useEffect, useMemo, useState} from 'react';
import Item from "./Item";
import { motion } from "framer-motion/dist/framer-motion"
import store from "../store/store";
import {observer} from "mobx-react";
import usePreviews from "../hooks/usePreviews";
import {Skeleton} from "@mui/material";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import InfiniteScroll from "react-infinite-scroll-component";

const Items = ({ category }) => {
    const [previews, getPreviews] = usePreviews()
    const limit = 6
    const [total, setTotal] = useState(0)
    const [list, setList] = useState([])
    const [currentCount, setCurrentCount] = useState(0)
    const [offset, setOffset] = useState(0)

    function loadItems(_new=false) {
        if(store.category) {
            return store.requestItems({
                offset: _new ? 0 : offset,
                limit,
                type: store.type,
                category: store.category,
            }).then(rs => {
                if(rs.data.ok) {
                    setList((list) => _new ? rs.data.data : [...list, ...rs.data.data])
                    setOffset((offset) => offset + limit)
                    setCurrentCount((currentCount) => currentCount + rs.data.data.length)
                }

                return rs.data
            })
        }
    }

    useEffect(() => {
        getPreviews()
    }, [])

    useEffect(() => {
        if(store.category) {
            store.requestItemsCount().then(rs => {
                if(rs.ok) setTotal(rs.data)
                loadItems(true)
            })
        }
    }, [store.category])

    return (
        <InfiniteScroll
            dataLength={list.length}
            next={loadItems}
            hasMore={currentCount !== total}
            loader={<h4>Loading...</h4>}
            className="items"
        >
            {list.map((item, i) => (
                <motion.div key={'item-' + i} animate={{
                    display: item.type === store.type && item.category._id === store.category ? 'block' : 'none',
                    opacity: item.type === store.type && item.category._id === store.category ? 1 : 0
                }}>
                    <Item item={item} previews={previews}/>
                </motion.div>
            ))}
        </InfiniteScroll>
    );
};

export default observer(Items);