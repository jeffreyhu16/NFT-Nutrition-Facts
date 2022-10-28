import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { Alchemy, Network } from 'alchemy-sdk'
import { ethers } from 'ethers'

type Source = {
  [key: string]: {
    isSecure: boolean,
    src: string,
  },
}

export interface CheckContextInterface {
  isVerified: boolean | undefined,
  isRenounced: boolean | undefined,
  nftSource: Source | undefined,
  isRelevant: boolean | undefined,
  setIsVerified: Dispatch<SetStateAction<boolean | undefined>>,
  checkIsVerified: (status: string) => void,
  checkOwnership: (contract: ethers.Contract) => void,
  checkNftSource: (URI: string, type: string) => void,
  checkSpam: (address: string) => void,
}

export const CheckContext = createContext<CheckContextInterface | null>(null);

type CheckProviderProps = {
  children: ReactNode
}

export const CheckProvider = ({ children }: CheckProviderProps) => {

  const [isVerified, setIsVerified] = useState<boolean>();
  const [isRenounced, setIsRenounced] = useState<boolean>();
  const [nftSource, setNftSource] = useState<Source>();
  const [isRelevant, setIsRelevant] = useState<boolean>();
  const sources = ['ipfs', 'arweave', 'data:'];

  const checkIsVerified = (status: string) => {
    if (status === '1') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }

  const checkOwnership = async (contract: ethers.Contract) => {
    const owner = await contract.owner();
    if (owner === ethers.constants.AddressZero) {
      setIsRenounced(true);
    } else {
      setIsRenounced(false);
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

  const checkSpam = async (address: string) => {
    const settings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY,
      network: Network.ETH_MAINNET
    }
    const alchemy = new Alchemy(settings);
    const isSpam = await alchemy.nft.isSpamContract(address);
    setIsRelevant(!isSpam);
  }

  const providerValue = {
    isVerified,
    isRenounced,
    nftSource,
    isRelevant,
    setIsVerified,
    checkOwnership,
    checkIsVerified,
    checkNftSource,
    checkSpam,
  }

  return (
    <CheckContext.Provider value={providerValue}>
      {children}
    </CheckContext.Provider>
  );
}
