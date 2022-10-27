import { useContext } from 'react'
import { NftContext } from '../contexts/NftContext'
import { CheckContext } from '../contexts/CheckContext'
import styles from '../styles/Label.module.css'
import Image from 'next/image'

const Label = () => {

  const nftCtx = useContext(NftContext)!;
  const { collection, logoURL } = nftCtx;

  const checkCtx = useContext(CheckContext)!;
  const { isVerified } = checkCtx;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>NFT Nutrition Facts</h1>
      <div className={styles.subHeaderGroup}>
        <h2 className={styles.subHeaderText}>{collection}</h2>
        {logoURL && <Image src={logoURL} unoptimized width={36} height={36} />}
      </div>
      <div className={styles.content}>
        <div className={styles.contentCheck}>
          <h3>Contract Verification</h3>
          <Image src={isVerified ? '/green-check.svg' : '/red-cross.svg'} width={26} height={26} />
        </div>
        <div className={styles.contentCheck}>
          <h3>Contract Ownership</h3>
          <Image src='/red-cross.svg' width={26} height={26} />
        </div>
        <div className={styles.contentCheck}>
          <h3>Metadata Storage</h3>
          <Image src='/yellow-warning.png' width={26} height={26} />
        </div>
        <div className={styles.contentCheck}>
          <h3>Media Storage</h3>
        </div>
      </div>
    </div>
  );
}

export default Label;
