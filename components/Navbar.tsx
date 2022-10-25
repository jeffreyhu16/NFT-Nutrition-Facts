import styles from '../styles/Navbar.module.css'
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className={styles.container}>
      <Image src='/logo.svg' width={220} height={32} />
      <button className={styles.btn}>Choose Network</button>
    </nav>
  );
}
 
export default Navbar;
