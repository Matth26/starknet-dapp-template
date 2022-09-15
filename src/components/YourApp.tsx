import { useStarknet, useStarknetInvoke } from '@starknet-react/core';
import { useContract } from '@starknet-react/core';
import { hexToAscii } from 'web3-utils';

import Connectors from './Connectors';

import { useStarknetExecute } from '@starknet-react/core';

import ContractAbi from '../assets/abis/ERC721.json';
import { Abi } from 'starknet';
import { BigNumberish, toFelt } from 'starknet/dist/utils/number';
import BN from 'bn.js';
import { useState } from 'react';
import { Group, NumberInput } from '@mantine/core';
const CONTRACT_ADDRESS =
  '0x058c546adb10ef6b7827b02e45ecac33a54cc0c87e80f245090d0aaae5cbe2d9';

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
  const [sex, setSex] = useState(0);
  const [legs, setLegs] = useState(0);
  const [wings, setWings] = useState(0);

  const {
    data,
    loading,
    error,
    reset,
    invoke: invokeDeclareAnimal,
  } = useStarknetInvoke({
    contract,
    method: 'declare_animal',
  });

  return (
    <div>
      <Connectors />
      <div>gm {account}</div>

      {account && (
        <>
          <Group position="center">
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
            <span>Name</span>
            <span>{name !== '' && name}</span>
          </Group>

          <Group>
            <NumberInput
              placeholder="1"
              label="Sex"
              withAsterisk
              value={sex}
              onChange={(val) => val && setSex(val)}
            />
            <NumberInput
              placeholder="1"
              label="Legs"
              withAsterisk
              value={legs}
              onChange={(val) => val && setLegs(val)}
            />
            <NumberInput
              placeholder="1"
              label="Wings"
              withAsterisk
              value={wings}
              onChange={(val) => val && setWings(val)}
            />
            {contract && (
              <button
                onClick={async () => {
                  invokeDeclareAnimal({
                    args: [toFelt(sex), toFelt(legs), toFelt(wings)],
                    overrides: { maxFee: 100000 },
                  });
                }}
              >
                Declare Animal
              </button>
            )}
            <Group>{loading ? <div>loading...</div> : <div>{data}</div>}</Group>
          </Group>
        </>
      )}
    </div>
  );
};

export default YourApp;
