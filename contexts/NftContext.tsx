import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { Network, Alchemy } from 'alchemy-sdk'
import getConfig from 'next/config'
import { ethers } from 'ethers'

export interface NftContextInterface {
  network: Network,
  contract: ethers.Contract | null | undefined,
  status: string,
  collection: string | undefined,
  logoURL: string | undefined,
  imageURL: string | undefined,
  tokenURI: string | undefined,
  setNetwork: Dispatch<SetStateAction<Network>>,
  setCollection: Dispatch<SetStateAction<string | undefined>>,
  setLogoURL: Dispatch<SetStateAction<string | undefined>>,
  setImageURL: Dispatch<SetStateAction<string | undefined>>,
  setTokenURI: Dispatch<SetStateAction<string | undefined>>,
  getNftContract: (address: string) => void,
  getNftData: (address: string) => void,
  getNftLogo: (address: string) => void,
  getAlchemy: () => Alchemy,
}

export const NftContext = createContext<NftContextInterface | null>(null);

type NftProviderProps = {
  children: ReactNode
}

export const NftProvider = ({ children }: NftProviderProps) => {

  const [network, setNetwork] = useState<Network>(Network.ETH_MAINNET);
  const [contract, setContract] = useState<ethers.Contract | null>();
  const [status, setStatus] = useState<string>('');

  const [collection, setCollection] = useState<string>();
  const [logoURL, setLogoURL] = useState<string>();
  const [imageURL, setImageURL] = useState<string>();
  const [tokenURI, setTokenURI] = useState<string>();

  const getAlchemy = () => {
    let key;
    if (network === 'eth-mainnet') {
      key = 'alchemyEthApiKey';
    } else {
      key = 'alchemyPolygonApiKey';
    }
    const settings = {
      network,
      apiKey: getConfig().publicRuntimeConfig[key],
    }
    return new Alchemy(settings);
  }

  const getNftContract = async (address: string) => {
    try {
      // get verified contract abi
      let baseURL, key;
      if (network === 'eth-mainnet') {
        baseURL = 'https://api.etherscan.io';
        key = 'etherscanApiKey';
      } else {
        baseURL = 'https://api.polygonscan.com';
        key = 'polygonscanApiKey';
      }
      const res = await fetch(
        `${baseURL}/api` +
        '?module=contract' +
        '&action=getabi' +
        `&address=${address}` +
        `&apikey=${getConfig().publicRuntimeConfig[key]}`
      );
      const data = await res.json();
      // console.log(data)
      if (data.status === '1') {
        const alchemy = getAlchemy();
        const provider = await alchemy.config.getProvider()
        const contract = new ethers.Contract(address, data.result, provider);
        setContract(contract);
      } else {
        setContract(null);
      }
      setStatus(data.status);

    } catch (err) {
      console.log(err);
    }
  }

  const getNftData = async (address: string) => {
    try {
      const alchemy = getAlchemy();
      const res = await alchemy.nft.getNftsForContract(address);
      const nft = res.nfts[1];
      // choosing the second token for checks
      // console.log(nft)
      const { contract, rawMetadata, tokenUri } = nft;
      if (contract.name) {
        setCollection(`${contract.name} (${contract.symbol})`);
      } else {
        setCollection('Unknown Collection')
      }
      setImageURL(rawMetadata?.image);
      setTokenURI(tokenUri?.raw);

    } catch (err) {
      console.log(err); // must add additional error handling
    }
  }

  const getNftLogo = async (address: string) => {
    if (network === 'polygon-mainnet') return;
    try {
      // get NFT collection
      const baseURL = 'https://svc.blockdaemon.com/nft/v1';
      const apiKey = getConfig().publicRuntimeConfig.blockdaemonApiKey;
      const res = await fetch(
        `${baseURL}/ethereum/mainnet/collection` +
        `?contract_address=${address}` +
        `&apiKey=${apiKey}`
      );
      const data = await res.json();

      // get NFT logo & set image source
      const logoURL = `${baseURL}/ethereum/mainnet/media/${data.collection.logo}`;
      const logo = await fetch(logoURL, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${apiKey}`
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
    network,
    contract,
    status,
    collection,
    logoURL,
    imageURL,
    tokenURI,
    setNetwork,
    setCollection,
    setLogoURL,
    setImageURL,
    setTokenURI,
    getNftContract,
    getNftData,
    getNftLogo,
    getAlchemy,
  }

  return (
    <NftContext.Provider value={providerValue}>
      {children}
    </NftContext.Provider>
  );
}
