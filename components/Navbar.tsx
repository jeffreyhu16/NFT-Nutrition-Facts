import { useContext, useState } from 'react'
import { NftContext } from '../contexts/NftContext'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image'
import { Network } from 'alchemy-sdk'

const Navbar = () => {

  const nftCtx = useContext(NftContext)!;
  const { network, setNetwork } = nftCtx;

  const [isFocus, setIsFocus] = useState<boolean>(false);

  const handleClick = (network: Network) => {
    setIsFocus((prev: boolean) => !prev);
    setNetwork(network);
  }

  const boxStyles = {
    opacity: isFocus ? '1' : '0',
    top: isFocus ? '3.4rem' : '3rem',
    transition: 'ease 200ms',
  }

  return (
    <nav className={styles.container}>
      <Image src='/logo.svg' priority={true} width={220} height={32} />
      <div className={styles.networkGroup}>
        <button
          className={styles.currentBtn}
          onClick={() => setIsFocus((prev: boolean) => !prev)}
        >
          <Image src={`/${network}.svg`} width={20} height={20} />
          <div className={styles.currentNetwork}>
            {network === 'eth-mainnet' ? 'Ethereum' : 'Polygon'}
          </div>
          <Image src='/arrow-down.svg' width={14} height={14} />
        </button>
        <div className={styles.networkBox} style={boxStyles}>
          <button
            className={styles.networkBtn}
            onClick={() => handleClick(Network.ETH_MAINNET)}
          >
            <div className={styles.networkBtnHead}>
              <Image src='/eth-mainnet.svg' width={20} height={20} />
              <div className={styles.network}>Ethereum</div>
            </div>
            {network === 'eth-mainnet' &&
              <Image src='/green-check.svg' width={20} height={20} />
            }
          </button>
          <button
            className={styles.networkBtn}
            onClick={() => handleClick(Network.MATIC_MAINNET)}
          >
            <div className={styles.networkBtnHead}>
              <Image src='/polygon-mainnet.svg' width={20} height={20} />
              <div className={styles.network}>Polygon</div>
            </div>
            {network === 'polygon-mainnet' &&
              <Image src='/green-check.svg' width={20} height={20} />
            }
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
