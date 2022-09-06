import React from 'react';
import Head from "next/head";
import Banner from "../components/Banner";
import Container from "@mui/material/Container";
import Items from "../components/Items";
import store from "../store/store";
import Footer from "../components/Footer";
import {Typography} from "@mui/material";

const Success = () => {
    return (
        <div>
            <Head>
                <title>Оплата прошла успешно - MivelShop</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Banner />

            <Container>
                <div className="item-block">
                    <Typography variant={'h3'} sx={{textAlign: 'center', marginBottom: '1rem'}}>
                        Оплата прошла успешно!
                    </Typography>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium, animi cumque dolore ea eligendi eos exercitationem explicabo fugit in magnam nam neque officiis omnis saepe sed similique ut vero?</p>
                </div>
            </Container>

            <Footer />

            <div className="bg" style={{backgroundImage: 'url("/assets/img/bg.png")'}}></div>
        </div>
    );
};

export default Success;