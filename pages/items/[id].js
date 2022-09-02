import React, {useEffect, useState} from 'react';
import Head from "next/head";
import Container from "@mui/material/Container";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import store from "../../store/store";
import {useRouter} from "next/router";
import Banner from "../../components/Banner";
import {observer} from "mobx-react";
import {Button, IconButton} from "@mui/material";
import 'pure-react-carousel/dist/react-carousel.es.css';
import Image from "next/image";
import usePreviews from "../../hooks/usePreviews";
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";
import Footer from "../../components/Footer";

const Item = () => {
    const router = useRouter()
    const [item, setItem] = useState(null)
    const [previews, getPreviews] = usePreviews()
    const [images, setImages] = useState([])

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

    useEffect(() => {
        console.log(item, previews)
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
                        <span className="item-header__price">- {item.price}$</span>
                    </div>
                    <div className="item-block item-body">
                        <div className="item-slider">
                            {images.length ? <CarouselProvider
                                naturalSlideWidth={100}
                                naturalSlideHeight={125}
                                totalSlides={3}
                            >
                                <div className="item-slider__buttons">
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
                                </div>
                                <Slider>
                                    {images.map((src, i) =>
                                    {
                                        return <Slide key={'src-' + i} index={i}>
                                            <img src={src} alt={item.name}/>
                                        </Slide>

                                    })}
                                </Slider>
                            </CarouselProvider> : null}
                        </div>
                        <div className="item-description">
                            <p>{item.description}</p>
                            {store.loggedIn ? <div className="item-footer">
                                <Button onClick={handleBasketClick} variant={'contained'} size={'large'} color={'primary'}>Добавить в корзину</Button>
                            </div> : null}
                        </div>
                    </div>
                </> : <p>Загрузка</p>}
            </Container>

            <div className="bg" style={{backgroundImage: 'url("/assets/img/bg.png")'}}></div>
            <Footer />
        </div>
    );
};

export default observer(Item);