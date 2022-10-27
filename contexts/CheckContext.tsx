import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export interface CheckContextInterface {
  isVerified: boolean,
  setIsVerified: Dispatch<SetStateAction<boolean>>,
  checkIsVerified: (status: string) => void,
}

export const CheckContext = createContext<CheckContextInterface | null>(null);

type CheckProviderProps = {
  children: ReactNode
}

export const CheckProvider = ({ children }: CheckProviderProps) => {

  const [isVerified, setIsVerified] = useState<boolean>(false);

  const checkIsVerified = (status: string) => {
    console.log(status)
    if (status === '1') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }

  const providerValue = {
    isVerified,
    setIsVerified,
    checkIsVerified,
  }

  return (
    <CheckContext.Provider value={providerValue}>
      {children}
    </CheckContext.Provider>
  );
}
