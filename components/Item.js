import React, {useEffect, useState} from 'react';
import store from "../store/store";
import {observer} from "mobx-react";
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import RegisterModal from "./RegisterModal";
import {Link} from "./Link";
import axios from "axios";
import {meta} from "ya-disk";
import Image from "next/image";


const Item = ({ item, previews }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [src, setSrc] = useState('')

    const handleBasketClick = () => {
        store.addBasket(item._id).then(() => {
            setIsOpen(false)
        })
    }

    useEffect(() => {
        if(previews[item.uuid]) {

            // (async () => {
            //     try {
            //         const rs = await meta.get(process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN, previews[item.uuid][0], {
            //             fields: 'public_url'
            //         });
            //
            //         setSrc(rs.public_url)
            //     } catch (error) {
            //         console.error(error);
            //     }
            // })();

            // fetch(previews[item.uuid][0], {
            //     method: 'get',
            //     // mode: 'no-cors',
            //     headers: {
            //         // 'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            //         // 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            //         // 'access-control-allow-methods': `GET, OPTIONS`,
            //         // 'access-control-allow-headers': `Authorization`,
            //         // 'access-control-allow-origin': `http://localhost:3004/`,
            //         // 'Authorization': `OAuth ${process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN}`,
            //     }
            // }).then((res) => {
            //     console.log(res.headers.url)
            //
            //     fetch(res.url, {
            //         method: 'get',
            //         // mode: 'no-cors',
            //         headers: {
            //             // 'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            //             // 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            //             // 'access-control-allow-methods': `GET, OPTIONS`,
            //             // 'access-control-allow-headers': `Authorization`,
            //             // 'access-control-allow-origin': `http://localhost:3004/`,
            //             // 'Authorization': `OAuth ${process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN}`,
            //         }
            //     }).then(rs => {
            //         console.log(rs, rs.body)
            //         let data = new Uint8Array(rs.body);
            //         let raw = String.fromCharCode.apply(null, data);
            //         let base64 = btoa(raw);
            //         setSrc("data:image;base64," + base64)
            //         console.log(src)
            //     })
            //
            //
            //     // this.img.src = src;
            // });
            // axios.get(previews[item.uuid][0], {
            //     headers: {
            //         // 'access-control-allow-methods': `GET, OPTIONS`,
            //         // 'access-control-allow-headers': `Authorization`,
            //         'access-control-allow-origin': `http://localhost:3004/`,
            //         'Authorization': `OAuth ${process.env.NEXT_PUBLIC_YANDEX_DISK_OAUTH_TOKEN}`,
            //     }
            // }).then((res) => {
            //     console.log(res)
            //     let data = new Uint8Array(res.data);
            //     let raw = String.fromCharCode.apply(null, data);
            //     let base64 = btoa(raw);
            //     setSrc("data:image;base64," + base64)
            //     console.log(src)
            //     // this.img.src = src;
            // });
        }
    }, [previews])

    return <>
        {previews[item.uuid] ? <Link href={'/items/'+item._id}>
            <div className="item-wrapper">
                <div
                    // onClick={() => setIsOpen(true)}
                    className={"item" + (item.long ? ' long' : '') + (store.activeItem ? (store.activeItem.id === item.id ? ' active' : '') : '')}
                    style={{backgroundImage: src}}
                    // className={'item'}
                >
                    <Image
                        src={previews[item.uuid][0]}
                        alt={item.name}
                        layout='fill'
                        objectFit='contain'
                    />
                </div>
                <div className="item__caption">{item.name} - <span className="item__price">${item.price}</span></div>
            </div>
        </Link> : null}
    </>;
};

export default observer(Item);