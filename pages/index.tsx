import type { NextPage } from 'next'
import Head from 'next/head'
import Label from '../components/Label'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider
  }
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nutrition Label</title>
      </Head>
      <Navbar />
      <Label />
      <div className={styles.background}></div>
      <div className={styles.gradient}></div>
    </div>
  )
}

export default Home
