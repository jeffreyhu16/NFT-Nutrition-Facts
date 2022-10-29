import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { Network, Alchemy } from 'alchemy-sdk'
import { ethers } from 'ethers'

export interface NftContextInterface {
  contract: ethers.Contract | undefined,
  status: string,
  collection: string | undefined,
  logoURL: string | undefined,
  imageURL: string | undefined,
  tokenURI: string | undefined,
  setCollection: Dispatch<SetStateAction<string | undefined>>,
  setLogoURL: Dispatch<SetStateAction<string | undefined>>,
  setImageURL: Dispatch<SetStateAction<string | undefined>>,
  setTokenURI: Dispatch<SetStateAction<string | undefined>>,
  getNftContract: (address: string) => void,
  getNftData: (address: string) => void,
  getNftLogo: (address: string) => void,
}

export const NftContext = createContext<NftContextInterface | null>(null);

type NftProviderProps = {
  children: ReactNode
}

export const NftProvider = ({ children }: NftProviderProps) => {

  const [contract, setContract] = useState<ethers.Contract>();
  const [status, setStatus] = useState<string>('');

  const [collection, setCollection] = useState<string>();
  const [logoURL, setLogoURL] = useState<string>();
  const [imageURL, setImageURL] = useState<string>();
  const [tokenURI, setTokenURI] = useState<string>();

  const getNftContract = async (address: string) => {
    try {
      // get verified contract abi
      const res = await fetch(
        'https://api.etherscan.io/api' +
        '?module=contract' +
        '&action=getabi' +
        `&address=${address}` +
        `&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
      const data = await res.json();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(address, data.result, provider);

      setContract(contract);
      setStatus(data.status);

    } catch (err) {
      console.log(err); // must add additional error handling
    }
  }

  const getNftData = async (address: string) => {
    try {
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY,
        network: Network.ETH_MAINNET
      }
      const alchemy = new Alchemy(settings);
      const nft = await alchemy.nft.getNftMetadata(address, '1');
      const { contract, rawMetadata, tokenUri } = nft;

      setCollection(`${contract.name} (${contract.symbol})`);
      setImageURL(rawMetadata?.image)
      setTokenURI(tokenUri?.raw);
      
    } catch (err) {
      console.log(err);
    }
  }

  const getNftLogo = async (address: string) => {
    const baseURL = 'https://svc.blockdaemon.com/nft/v1';
    try {
      // get NFT collection
      const res = await fetch(
        `${baseURL}/ethereum/mainnet/collection` +
        `?contract_address=${address}` +
        `&apiKey=${process.env.NEXT_PUBLIC_BLOCKDAEMON_API_KEY}`
      );
      const data = await res.json();

      // get NFT logo & set image source
      const logoURL = `${baseURL}/ethereum/mainnet/media/${data.collection.logo}`;
      const logo = await fetch(logoURL, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BLOCKDAEMON_API_KEY}`
        }
      });
      const blob = await logo.blob();
      const imgURL = URL.createObjectURL(blob);
      setLogoURL(imgURL);

    } catch (err) {
      console.log(err);
    }
  }

  const providerValue = {
    contract,
    status,
    collection,
    logoURL,
    imageURL,
    tokenURI,
    setCollection,
    setLogoURL,
    setImageURL,
    setTokenURI,
    getNftContract,
    getNftData,
    getNftLogo,
  }

  return (
    <NftContext.Provider value={providerValue}>
      {children}
    </NftContext.Provider>
  );
}
