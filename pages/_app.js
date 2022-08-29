import '../styles.scss';
import { createTheme } from '@mui/material/styles';
import {ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        white: {
            main: '#ffffff',
            contrastText: '#343434',
        },
    },
});

const MyApp = ({ Component, pageProps }) => {
    return <ThemeProvider theme={theme}>
        <Component {...pageProps} />
    </ThemeProvider>
}

export default MyApp;
