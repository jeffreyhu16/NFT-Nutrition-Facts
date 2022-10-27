import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { ethers } from 'ethers'


export interface CheckContextInterface {
  isVerified: boolean,
  setIsVerified: Dispatch<SetStateAction<boolean>>,
  checkIsVerified: (status: string) => void,
  checkMetaSource: (address: string) => void,
  checkImageSource: (address: string) => void,
}

export const CheckContext = createContext<CheckContextInterface | null>(null);

type CheckProviderProps = {
  children: ReactNode
}

export const CheckProvider = ({ children }: CheckProviderProps) => {

  const [isVerified, setIsVerified] = useState<boolean>(false);

  const checkIsVerified = (status: string) => {
    if (status === '1') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }

  const checkMetaSource = async (tokenURI: string) => {
    
    console.log(tokenURI);
  }

  const checkImageSource = async (imageURL: string) => {
    
    console.log(imageURL);
  }

  const providerValue = {
    isVerified,
    setIsVerified,
    checkIsVerified,
    checkMetaSource,
    checkImageSource,
  }

  return (
    <CheckContext.Provider value={providerValue}>
      {children}
    </CheckContext.Provider>
  );
}
