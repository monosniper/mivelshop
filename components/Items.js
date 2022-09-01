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
    const data = useMemo(() => store.items, [store.items])
    const [previews, getPreviews] = usePreviews()
    const limit = 6
    const [total, setTotal] = useState(0)
    const [list, setList] = useState([])
    const [currentCount, setCurrentCount] = useState(0)
    const [offset, setOffset] = useState(0)
    const [isFetching, setIsFetching] = useState(false)


    // const infiniteScrollRef = useInfiniteScroll(loadMore);

    function loadItems(_new=false) {
        if(store.category) {
            setIsFetching(() => true)

            return store.requestItems({
                offset: _new ? 0 : offset,
                limit,
                type: store.type,
                category: store.category,
            }).then(rs => {
                if(rs.data.ok) {
                    setIsFetching(() => false)
                    setList((list) => _new ? rs.data.data : [...list, ...rs.data.data])
                    setOffset((offset) => offset + limit)
                    setCurrentCount((currentCount) => currentCount + rs.data.data.length)
                }

                return rs.data
            })
        }
    }

    function loadOnScroll() {

        //If all the content loaded
        return store.requestItemsCount().then(rs => {
            if(currentCount === rs.data) return;

            //Get div at the bottom of the content
            let el = document.getElementById('content-end');

            let rect = el.getBoundingClientRect();
            let isAtEnd = (
                // rect.top >= 0 &&
                // rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
            );

            //User at the end of content. load more content
            if(isAtEnd){
                //If content list is still loading do not request for another content list.
                if(isFetching) return

                loadItems()
            }
        })

    }

    useEffect(() => {
        getPreviews()

        // window.addEventListener('scroll', loadOnScroll);
        //
        // return () => {
        //     window.removeEventListener('scroll', loadOnScroll);
        // }
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
        // <div className="items">
        //     {previews !== {} ? <>
        //         {list.map((item, i) => (
        //             <motion.div key={'item-' + i} animate={{
        //                 display: item.type === store.type && item.category._id === store.category ? 'block' : 'none',
        //                 opacity: item.type === store.type && item.category._id === store.category ? 1 : 0
        //             }}>
        //                 <Item item={item} previews={previews}/>
        //             </motion.div>
        //         ))}
        //         { /* Start load more content when this div is visible*/
        //             (currentCount !== total)?
        //                 <div id="content-end" >
        //                     Please wait. Loading...
        //                 </div>: null
        //         }
        //     </> : <>
        //         <Skeleton sx={{ bgcolor: '#d1d1d1a3' }} animation="wave" variant="rectangular" width={350} height={260} />
        //         <Skeleton sx={{ bgcolor: '#d1d1d1a3' }} animation="wave" variant="rectangular" width={350} height={260} />
        //         <Skeleton sx={{ bgcolor: '#d1d1d1a3' }} animation="wave" variant="rectangular" width={350} height={260} />
        //     </>}
        // </div>
    );
};

export default observer(Items);