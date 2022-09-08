import React, {useEffect, useMemo, useState} from 'react';
import Item from "./Item";
import { motion } from "framer-motion/dist/framer-motion"
import store from "../store/store";
import {observer} from "mobx-react";
import usePreviews from "../hooks/usePreviews";
import {Skeleton} from "@mui/material";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import InfiniteScroll from "react-infinite-scroll-component";
import useWindowSize from "../hooks/useWindowSize";

const Items = ({ category }) => {
    const [previews, getPreviews] = usePreviews()
    const limit = 6
    const [total, setTotal] = useState(0)
    const [list, setList] = useState([])
    const [currentCount, setCurrentCount] = useState(0)
    const [offset, setOffset] = useState(0)
    const [width, height] = useWindowSize();
    const [columns, setColumns] = useState(3);
    const [loading, setLoading] = useState(true);

    const gap = 20;
    const columnWrapper = {};
    const result = [];

    useEffect(() => {
        if(width < 500) {
            setColumns(1)
        } else if (width < 900) {
            setColumns(2)
        } else {
            setColumns(3)
        }
    }, [width])

    for (let i = 0; i < columns; i++) {
        columnWrapper[`column${i}`] = [];
    }

    for (let i = 0; i < list.length; i++) {
        const columnIndex = i % columns;
        columnWrapper[`column${columnIndex}`].push(
            <div style={{ marginBottom: `${gap}px`}}>
                <motion.div className={'brick'} key={'item-' + i} animate={{
                    display: list[i].type === store.type && list[i].category._id === store.category ? 'block' : 'none',
                    opacity: list[i].type === store.type && list[i].category._id === store.category ? 1 : 0
                }}>
                    <Item item={list[i]} previews={previews}/>
                </motion.div>
            </div>
        );
    }

    for (let i = 0; i < columns; i++) {
        result.push(
            <div
                style={{
                    marginLeft: `${i > 0 ? gap : 0}px`,
                    flex: 1,
                }}>
                {columnWrapper[`column${i}`]}
            </div>
        );
    }

    const loadItems = (_new=false) => {
        if(_new) setOffset(() => 0)
        if(store.category) {
            return store.requestItems({
                offset: _new ? 0 : offset,
                limit,
                type: store.type,
                category: store.category,
            }).then(rs => {
                if(rs.data.ok) {
                    setList((list) => _new ? rs.data.data : [...list, ...rs.data.data])
                    setOffset((value) => {
                        return value + limit
                    })
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
            loader={null}
            style={{display:'flex'}}
            className="items"
            // className="masonry bordered"
        >
            {result.filter(rs => rs.props.children.length).length ? result : [...Array(columns).keys()].map(i => {
                    <div
                        style={{
                            marginLeft: `${i > 0 ? gap : 0}px`,
                            flex: 1,
                        }}>
                        <Skeleton height={350}/>
                    </div>
                }) }
            {/*{list.map((item, i) => (*/}
            {/*    <motion.div className={'brick'} key={'item-' + i} animate={{*/}
            {/*        display: item.type === store.type && item.category._id === store.category ? 'block' : 'none',*/}
            {/*        opacity: item.type === store.type && item.category._id === store.category ? 1 : 0*/}
            {/*    }}>*/}
            {/*        <Item item={item} previews={previews}/>*/}
            {/*    </motion.div>*/}
            {/*))}*/}
        </InfiniteScroll>
    );
};

export default observer(Items);