import '../styles/globals.css';
import type {AppProps} from 'next/app';
import GlobalContextProvider from '../src/contexts/global-context/GlobalContextProvider';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <GlobalContextProvider>
    <Component {...pageProps} />
  </GlobalContextProvider>;
}

export default MyApp;
