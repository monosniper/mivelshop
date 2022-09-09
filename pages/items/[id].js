import React, {useEffect, useState} from 'react';
import Head from "next/head";
import Container from "@mui/material/Container";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import store from "../../store/store";
import {useRouter} from "next/router";
import Banner from "../../components/Banner";
import {observer} from "mobx-react";
import {Button, IconButton, Stack} from "@mui/material";
import 'pure-react-carousel/dist/react-carousel.es.css';
import Image from "next/image";
import usePreviews from "../../hooks/usePreviews";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";
import Footer from "../../components/Footer";
import QiwiBillPaymentsAPI from "@qiwi/bill-payments-node-js-sdk";
import OrderModal from "../../components/OrderModal";

const Item = () => {
    const router = useRouter()
    const [item, setItem] = useState(null)
    const [previews, getPreviews] = usePreviews()
    const [images, setImages] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const qiwi = new QiwiBillPaymentsAPI(process.env.NEXT_PUBLIC_QIWI_SECRET_KEY);

    const handleSubmit = (data) => {
        store.createOrder({
            ...data,
            billId: qiwi.generateId(),
            items: [item._id]
        }, true).then(rs => {
            if(rs.ok) {
                setIsOpen(false)
                const params = {
                    public_key: process.env.NEXT_PUBLIC_QIWI_PUBLIC_KEY,
                    'customFields[themeCode]': process.env.NEXT_PUBLIC_QIWI_THEME_CODE,
                    // successUrl: 'http://localhost:3004/success',
                    successUrl: 'https://mivelshop.vercel.app/success',
                    comment: 'Оплата товара в MivelShop - ' + item.name,
                    account : '79643210393',
                    billId: rs.data.billId,
                    amount: item.price,
                }

                let url = 'https://oplata.qiwi.com/create?' + new URLSearchParams(params).toString();

                window.location.replace(url)
            }
        })
    }

    useEffect(() => {
        getPreviews()
    }, [])

    useEffect(() => {
        if(router.query.id) {
            store.requestItem(router.query.id).then(rs => {
                if(rs.ok) {
                    setItem(rs.data)
                }
            })
        }
    }, [router.query])

    const handleBasketClick = () => {
        store.addBasket(item._id)
    }

    const handleBuyClick = () => {
        setIsOpen(true)
    }

    useEffect(() => {
        if(item && previews[item.uuid]) setImages(previews[item.uuid])
    }, [previews, item])

    return (
        <div>
            <Head>
                <title>{item ? item.name : ''}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Banner small />

            <Container>
                {item ? <>
                    <div className="item-block item-header">
                        <span className="item-header__name">{item.name}</span>
                        <span className="item-header__price">- {item.price}₽</span>
                    </div>
                    <div className="item-block item-body">
                        <div className="item-slider">
                            {images.length ? <CarouselProvider
                                naturalSlideWidth={100}
                                naturalSlideHeight={125}
                                totalSlides={images.length}
                            >
                                {images.length > 1 ? <div className="item-slider__buttons">
                                    <ButtonBack className={'item-slider__button'}>
                                        <IconButton size={'large'} aria-label="delete">
                                            <AiOutlineLeft/>
                                        </IconButton>
                                    </ButtonBack>
                                    <ButtonNext className={'item-slider__button'}>
                                        <IconButton size={'large'} aria-label="delete">
                                            <AiOutlineRight/>
                                        </IconButton>
                                    </ButtonNext>
                                </div> : null}
                                <Slider>
                                    {images.map((src, i) =>
                                    {
                                        return <Slide key={'src-' + i} index={i}>
                                            <Image
                                                src={src}
                                                alt={item.name}
                                                layout='fill'
                                                objectFit='contain'
                                            />
                                        </Slide>

                                    })}
                                </Slider>
                            </CarouselProvider> : null}
                        </div>
                        <div className="item-description">
                            <p>{item.description}</p>
                            <div className="item-footer">
                                <Button onClick={handleBuyClick} variant={'contained'} size={'large'} color={'primary'}>Купить</Button>
                                {store.loggedIn ?
                                    <Button onClick={handleBasketClick} variant={'contained'} size={'large'} color={'primary'}>Добавить в корзину</Button>
                                    : null}
                            </div>
                        </div>
                    </div>
                </> : <p>Загрузка</p>}
            </Container>

            <OrderModal isOpen={isOpen} setIsOpen={setIsOpen} handleSubmit={handleSubmit} />

            <div className="bg" style={{backgroundImage: 'url("/assets/img/bg.png")'}}></div>
            <Footer />
        </div>
    );
};

export default observer(Item);