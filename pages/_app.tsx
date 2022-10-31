import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NftProvider } from '../contexts/NftContext'
import { CheckProvider } from '../contexts/CheckContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NftProvider>
      <CheckProvider>
        <Component {...pageProps} />
      </CheckProvider>
    </NftProvider>
  );
}

export default MyApp
