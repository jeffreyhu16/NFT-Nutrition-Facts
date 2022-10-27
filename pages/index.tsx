import type { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Form from '../components/Form'
import Label from '../components/Label'
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
      <div className={styles.labelContainer}>
        <Form />
        <Label />
      </div>
      <div className={styles.background}></div>
      <div className={styles.gradient}></div>
    </div>
  )
}

export default Home
