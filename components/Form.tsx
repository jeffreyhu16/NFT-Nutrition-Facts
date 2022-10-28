import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { NftContext } from '../contexts/NftContext'
import { CheckContext } from '../contexts/CheckContext'
import styles from '../styles/Form.module.css'

const Form = () => {

  const nftCtx = useContext(NftContext)!;
  const {
    getNftContract,
    getNftData,
    getNftLogo,
    status,
    contract,
    tokenURI,
    imageURL
  } = nftCtx;

  const checkCtx = useContext(CheckContext)!;
  const {
    checkIsVerified,
    checkOwnership,
    checkNftSource,
    checkSpam
  } = checkCtx;

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
    if (status && contract && tokenURI && imageURL) {
      checkIsVerified(status);
      checkOwnership(contract);
      checkNftSource(tokenURI, 'metadata');
      checkNftSource(imageURL, 'media');
      checkSpam(input);
    }
  }, [status, contract, tokenURI, imageURL]);

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
