import '../styles.scss';
import { createTheme } from '@mui/material/styles';
import {ThemeProvider} from "@mui/material";
import {useEffect} from "react";
import store from "../store/store";

const theme = createTheme({
    palette: {
        white: {
            main: '#ffffff',
            contrastText: '#343434',
        },
    },
});

const MyApp = ({ Component, pageProps }) => {
    useEffect(() => {
        store.requestCategories()
    }, [])

    return <ThemeProvider theme={theme}>
        <Component {...pageProps} />
    </ThemeProvider>
}

export default MyApp;
