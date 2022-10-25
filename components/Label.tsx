import { ChangeEvent, FormEvent, useState } from 'react'
import styles from '../styles/Label.module.css'

const Label = () => {

  const [input, setInput] = useState<string>('');

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isVerified = await verifyContract();
    console.log(isVerified)
  }

  const verifyContract = async () => {
    const res = await fetch(
      'https://api.etherscan.io/api' +
      '?module=contract' +
      '&action=getsourcecode' +
      `&address=${input}` +
      `&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
    );
    const data = await res.json();

    return data.status === '1' ? true : false;
  }

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={(e: FormEvent<HTMLFormElement>) => submitHandler(e)}
      >
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
