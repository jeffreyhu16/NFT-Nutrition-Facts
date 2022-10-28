import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { NftContext } from '../contexts/NftContext'
import { CheckContext } from '../contexts/CheckContext'
import styles from '../styles/Form.module.css'

const Form = () => {

  const nftCtx = useContext(NftContext)!;
  const { getNftContract, getNftData, getNftLogo, status, tokenURI, imageURL } = nftCtx;

  const checkCtx = useContext(CheckContext)!;
  const { checkIsVerified, checkNftSource } = checkCtx;

  const [input, setInput] = useState<string>('');

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    getNftContract(input);
    getNftData(input);
    getNftLogo(input);
  }

  useEffect(() => { 
    if (status && tokenURI && imageURL) {
      checkIsVerified(status);
      checkNftSource(tokenURI, 'metadata');
      checkNftSource(imageURL, 'media');
    }
  }, [status, tokenURI, imageURL]); 

  return (
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
  );
}

export default Form;
