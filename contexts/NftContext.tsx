import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { ethers } from 'ethers';

export interface NftContextInterface {
  contract: ethers.Contract | undefined,
  standard: string,
  status: string,
  getNftContract: (address: string) => void,
  collection: string,
  logoURL: string,
  setCollection: Dispatch<SetStateAction<string>>,
  setLogoURL: Dispatch<SetStateAction<string>>,
  getNftLogo: (address: string) => void,
}

export const NftContext = createContext<NftContextInterface | null>(null);

type NftProviderProps = {
  children: ReactNode
}

export const NftProvider = ({ children }: NftProviderProps) => {

  const [contract, setContract] = useState<ethers.Contract>();
  const [standard, setStandard] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const [collection, setCollection] = useState<string>('');
  const [logoURL, setLogoURL] = useState<string>('');

  const getNftContract = async (address: string) => {
    const ERC721_INTERFACE_ID = '0x80ac58cd';
    const ERC1155_INTERFACE_ID = '0xd9b67a26';
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
      const is721 = await contract.supportsInterface(ERC721_INTERFACE_ID);
      const is1155 = await contract.supportsInterface(ERC1155_INTERFACE_ID);

      setContract(contract);
      
      if (is721) {
        setStandard('ERC721');
        const name = await contract.name();
        const symbol = await contract.symbol();
        setCollection(`${name} (${symbol})`);
      } else if (is1155) {
        setStandard('ERC1155');
      }
      setStatus(data.status);

    } catch (err) {
      console.log(err); // must add additional error handling
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
    standard,
    status,
    getNftContract,
    collection,
    logoURL,
    setCollection,
    setLogoURL,
    getNftLogo,
  }

  return (
    <NftContext.Provider value={providerValue}>
      {children}
    </NftContext.Provider>
  );
}
