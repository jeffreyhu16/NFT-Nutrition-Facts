import { useState } from 'react'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image'

const Navbar = () => {

  const [isFocus, setIsFocus] = useState<boolean>(false);

  const boxStyles = {
    opacity: isFocus ? '1' : '0',
    top: isFocus ? '3.4rem' : '3rem',
    transition: 'ease 200ms',
  }

  return (
    <nav className={styles.container}>
      <Image src='/logo.svg' priority={true} width={220} height={32} />
      <div className={styles.networkGroup} onClick={() => setIsFocus((prev: boolean) => !prev)}>
        <button className={styles.currentBtn}>
          <Image src='/eth.svg' width={20} height={20} />
          <div className={styles.currentNetwork}>Ethereum</div>
          <Image src='/arrow-down.svg' width={14} height={14} />
        </button>
        <div className={styles.networkBox} style={boxStyles}>
          <button className={styles.networkBtn}>
            <div className={styles.networkBtnHead}>
              <Image src='/eth.svg' width={20} height={20} />
              <div className={styles.network}>Ethereum</div>
            </div>
            <Image src='/green-check.svg' width={20} height={20} />
          </button>
          <button className={styles.networkBtn}>
            <div className={styles.networkBtnHead}>
              <Image src='/matic.svg' width={20} height={20} />
              <div className={styles.network}>Polygon</div>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
