import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { ethers } from 'ethers'

type Source = {
  [key: string]: {
    isSecure: boolean,
    src: string,
  },
}

export interface CheckContextInterface {
  isVerified: boolean | undefined,
  nftSource: Source | undefined,
  setIsVerified: Dispatch<SetStateAction<boolean | undefined>>,
  checkIsVerified: (status: string) => void,
  checkNftSource: (URI: string, type: string) => void,
}

export const CheckContext = createContext<CheckContextInterface | null>(null);

type CheckProviderProps = {
  children: ReactNode
}

export const CheckProvider = ({ children }: CheckProviderProps) => {

  const [isVerified, setIsVerified] = useState<boolean>();
  const [nftSource, setNftSource] = useState<Source>();
  const sources = ['ipfs', 'arweave', 'data:'];

  const checkIsVerified = (status: string) => {
    if (status === '1') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }

  const checkNftSource = async (URI: string, type: string) => {
    const results = sources.map((src: string) => URI.includes(src));
    const result = results.indexOf(true);

    switch (result) {
      case 0:
        setNftSource((prev: Source | undefined) => ({
          ...prev,
          [type]: { isSecure: true, src: 'IPFS' }
        }));
        break;
      case 1:
        setNftSource((prev: Source | undefined) => ({
          ...prev,
          [type]: { isSecure: true, src: 'Arweave' }
        }));
        break;
      case 2:
        setNftSource((prev: Source | undefined) => ({
          ...prev,
          [type]: { isSecure: true, src: 'on chain' }
        }));
        break;
      case -1:
        setNftSource((prev: Source | undefined) => ({
          ...prev,
          [type]: { isSecure: false, src: 'a centralized server' }
        }));
        break;
    }
  }

  const providerValue = {
    isVerified,
    nftSource,
    setIsVerified,
    checkIsVerified,
    checkNftSource,
  }

  return (
    <CheckContext.Provider value={providerValue}>
      {children}
    </CheckContext.Provider>
  );
}
