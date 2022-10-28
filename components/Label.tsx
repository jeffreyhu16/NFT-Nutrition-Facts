import { useContext } from 'react'
import { NftContext } from '../contexts/NftContext'
import { CheckContext } from '../contexts/CheckContext'
import styles from '../styles/Label.module.css'
import Image from 'next/image'

const Label = () => {

  const nftCtx = useContext(NftContext)!;
  const { collection, logoURL } = nftCtx;

  const checkCtx = useContext(CheckContext)!;
  const { isVerified, isRenounced, nftSource, isRelevant } = checkCtx;

  const matchCondition = (condition: boolean | undefined) => {
    switch (condition) {
      case true:
        return '/green-check.svg';
      case false:
        return '/red-cross.svg';
      case undefined:
        return '/white-check.svg';
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>NFT Nutrition Facts</h1>
      <div className={styles.subHeaderGroup}>
        <h2 className={styles.subHeaderText}>{collection}</h2>
        {logoURL && <Image src={logoURL} unoptimized width={36} height={36} />}
      </div>
      <div className={styles.content}>
        <div className={styles.contentCheck}>
          <div className={styles.checkHeadGroup}>
            <h3 className={styles.checkHead}>Contract Verification</h3>
            <Image src='/info.png' width={18} height={18} />
          </div>
          <Image
            src={matchCondition(isVerified)}
            width={26}
            height={26}
          />
        </div>
        <div className={styles.contentCheck}>
          <div className={styles.checkHeadGroup}>
            <h3 className={styles.checkHead}>Contract Ownership</h3>
            <Image src='/info.png' width={18} height={18} />
          </div>
          <Image
            src={matchCondition(isRenounced)}
            width={26}
            height={26}
          />

        </div>
        <div className={styles.contentCheck}>
          <div className={styles.checkHeadGroup}>
            <h3 className={styles.checkHead}>Metadata Storage</h3>
            <Image src='/info.png' width={18} height={18} />
          </div>
          <Image
            src={matchCondition(nftSource?.metadata.isSecure)}
            width={26}
            height={26}
          />
        </div>
        <div className={styles.contentCheck}>
          <div className={styles.checkHeadGroup}>
            <h3 className={styles.checkHead}>Media Storage</h3>
            <Image src='/info.png' width={18} height={18} />
          </div>
          <Image
            src={matchCondition(nftSource?.media.isSecure)}
            width={26}
            height={26}
          />
        </div>
        <div className={styles.contentCheck}>
          <div className={styles.checkHeadGroup}>
            <h3 className={styles.checkHead}>Relevance</h3>
            <Image src='/info.png' width={18} height={18} />
          </div>
          <Image
            src={matchCondition(isRelevant)}
            width={26}
            height={26}
          />
        </div>
      </div>
    </div>
  );
}

export default Label;
