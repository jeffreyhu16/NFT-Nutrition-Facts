import { ChangeEvent, useState } from 'react';
import styles from '../styles/Label.module.css'

const Label = () => {

  const [input, setInput] = useState<string>();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <input
          type='text'
          className={styles.input}
          placeholder='Contract Address'
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeHandler(e)}
        />
      </form>
      <div className={styles.label}>
        <h1 className={styles.header}>NFT Nutrition</h1>
      </div>
    </div>
  );
}

export default Label;
