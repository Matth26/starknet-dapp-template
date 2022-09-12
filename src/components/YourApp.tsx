import { useStarknet } from '@starknet-react/core';
import { useContract } from '@starknet-react/core';
import { hexToAscii } from 'web3-utils';

import Connectors from './Connectors';

import ContractAbi from '../assets/abis/ERC721_Metadata.json';
import { Abi } from 'starknet';
import BN from 'bn.js';
import { Suspense, useEffect, useState } from 'react';
const CONTRACT_ADDRESS =
  '0x04222f5f5d1e03657e505485a20aa12952c1c3b79614551000bd8aa8f4c32f5a';

export function feltToString(felt: BN) {
  const newStrB = Buffer.from(felt.toString(16), 'hex');
  return newStrB.toString();
}

const YourApp = () => {
  const { account } = useStarknet();
  const { contract } = useContract({
    abi: ContractAbi as Abi,
    address: CONTRACT_ADDRESS,
  });
  const [name, setName] = useState('');

  return (
    <div>
      <Connectors></Connectors>
      <div>gm {account}</div>
      {contract ? (
        <button
          onClick={async () => {
            const res = await contract.name();
            //console.log(feltToString(res.name));
            setName(hexToAscii('0x' + res.name.toString(16)));
          }}
        >
          Get View
        </button>
      ) : (
        <div>Not Connected</div>
      )}
      <div>
        <span>Name</span>
        <span>{name !== '' && name}</span>
      </div>
    </div>
  );
};

export default YourApp;
