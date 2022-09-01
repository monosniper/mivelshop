import React from 'react';
import Container from "@mui/material/Container";
import Header from "./Header";
import TypeSwitch from "./TypeSwitch";
import Categories from "./Categories";
import {Link} from "./Link";

const Banner = ({ small=false }) => {
    return (
        <div className={"banner " + (small ? 'banner_small' : '')}>
            <Container className={"container " + (small ? 'container_small' : '')}>
                <div className="banner__container">
                    <Header />
                    <Link href={'/'}>
                        <div className="banner__title">MIVELSHOP</div>
                    </Link>
                    <div className="banner__text">слово. большоеслово. нуслово.</div>
                    {small ? null : <>
                        <TypeSwitch />
                        <Categories />
                    </>}
                </div>

            </Container>
        </div>
    );
};

export default Banner;