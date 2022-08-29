import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import Image from "next/image";
import {useState} from "react";
import Item from "../components/Item";
import Items from "../components/Items";
import {observer} from "mobx-react";
import store from "../store/store";
import Container from '@mui/material/Container';
import Categories from "../components/Categories";
import TypeSwitch from "../components/TypeSwitch";
import Header from "../components/Header";

function Home() {
  return (
    <div>
      <Head>
        <title>Artist shop</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

        <div className="banner">
          <Container className="container">
            <div className="banner__container">
              <Header />
              <div className="banner__title">MIVELSHOP</div>
              <div className="banner__text">слово. большоеслово. нуслово.</div>
              <TypeSwitch />
              <Categories />
            </div>

          </Container>
        </div>

      <Container>
        <Items />

      </Container>
        {/*<div className="container">*/}
        {/*  <Items />*/}
        {/*</div>*/}

      <div className="bg" style={{backgroundImage: 'url("/assets/img/bg.png")'}}></div>
      <div className={"overlay" + (store.activeItem ? ' active' : '')}></div>
    </div>
  );
}

export default observer(Home);
