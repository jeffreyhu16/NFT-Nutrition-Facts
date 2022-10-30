import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'
import { NftContext } from './NftContext'
import { ethers } from 'ethers'

type Source = {
  [key: string]: {
    isSecure: boolean,
    src: string,
  },
}

export interface CheckContextInterface {
  isVerified: boolean | undefined,
  isRenounced: boolean | null | undefined,
  nftSource: Source | undefined,
  isRelevant: boolean | null | undefined,
  checkIsVerified: (status: string) => void,
  checkOwnership: (contract: ethers.Contract | null) => void,
  checkNftSource: (URI: string, type: string) => void,
  checkSpam: (address: string) => void,
}

export const CheckContext = createContext<CheckContextInterface | null>(null);

type CheckProviderProps = {
  children: ReactNode
}

export const CheckProvider = ({ children }: CheckProviderProps) => {

  const nftCtx = useContext(NftContext)!;
  const { network, getAlchemy } = nftCtx;

  const [isVerified, setIsVerified] = useState<boolean>();
  const [isRenounced, setIsRenounced] = useState<boolean | null>();
  const [nftSource, setNftSource] = useState<Source>();
  const [isRelevant, setIsRelevant] = useState<boolean | null>();
  const sources = ['ipfs', 'arweave', 'data:'];

  const checkIsVerified = (status: string) => {
    if (status === '1') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }

  const checkOwnership = async (contract: ethers.Contract | null) => {
    if (contract === null) { setIsRenounced(null); return }
    try {
      const owner = await contract.owner();
      if (owner === ethers.constants.AddressZero) {
        setIsRenounced(true);
      } else {
        setIsRenounced(false);
      }
    } catch (err) {
      setIsRenounced(null);
      console.log(err);
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
    // isSpamContract is only supported on mainnet
    if (network !== 'eth-mainnet') {
      setIsRelevant(null);
      return;
    }
    const alchemy = getAlchemy();
    const isSpam = await alchemy.nft.isSpamContract(address);
    setIsRelevant(!isSpam);
  }

  const providerValue = {
    isVerified,
    isRenounced,
    nftSource,
    isRelevant,
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
