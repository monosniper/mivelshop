import Head from 'next/head';
import Items from "../components/Items";
import {observer} from "mobx-react";
import Container from '@mui/material/Container';
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import store from "../store/store";

function Home() {
  return (
    <div>
      <Head>
        <title>MivelShop</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

        <Banner />

      <Container>
        <Items category={store.category} />

      </Container>
        <Footer />
        <div className="bg" style={{backgroundImage: 'url("/assets/img/bg.png")'}}></div>
    </div>
  );
}

export default observer(Home);
