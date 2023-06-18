import React, {useState} from 'react';
import {View, Text, TextInput, Button, Image} from 'react-native';
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {REACT_APP_INFURA_KEY,REACT_APP_WALLET_KEY} from '@env';

const App = () => {
  const [txn, setTxn] = useState();
  const [address, setAddress] = useState('');

  const [status, setStatus] = useState(false);
  const [txnStat, setTxnStat] = useState("Initiate The Txn !!");
  const [Gas, setGasPrice] = useState(0);

  const getProvider = (mainnet = false) => {
    const providerUrl = mainnet
      ? `https://mainnet.infura.io/v3/${REACT_APP_INFURA_KEY}`
      : `https://goerli.infura.io/v3/${REACT_APP_INFURA_KEY}`;

      return new ethers.providers.JsonRpcProvider(providerUrl);
  };

  const getSigner = (mainnet = false) =>{

    const provider = getProvider(mainnet);

    return new ethers.Wallet(
      REACT_APP_WALLET_KEY,
      provider
    );
  }

  const sendTransaction = async () => {
    console.log('Button is pressed !');
    
    const provider = getProvider();

    const gas =  ethers.utils.formatEther(await provider.getGasPrice());

    const goerliSigner = getSigner();

    setGasPrice(gas);

    const sendEth = await goerliSigner.sendTransaction({
      to : address,
      value : ethers.utils.parseEther(txn),
      gasLimit : 50000,
    })

    setTxnStat("The Txn Initiated ! Waiting Completion ");

    await sendEth.wait();

    setStatus(true);
    setTxnStat("The Transaction is Completed !");
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
          source={{
            uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
          }}
          style={{width: 200, height: 200}}
        />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text>Transaction Value : </Text>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 2,
            width: 230,
          }}
          onChangeText={newText => setTxn(newText)}
          defaultValue={txn}
        />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
        <Text>Reciever Wallet : </Text>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 2,
            width: 250,
          }}
          onChangeText={newText => setAddress(newText)}
          defaultValue={address}
        />
      </View>
      <View style={{marginTop: 20}}>
        <Button
          style={{borderRadius: 10}}
          disabled={address.length === 0}
          title="Initiate Txn"
          onPress={sendTransaction}
        />
      </View>
      <View style={{marginTop: 30}}>
        <Text style={{color : `${status ? 'green': 'red'}`,}}>{txnStat}</Text>
      </View>
      <View style={{marginTop: 30}}>
        <Text style={{color : 'green'}}>The Current Gas Price is : {Gas === 0 ? "Initiate TXN to Check":Gas}</Text>
      </View>
    </View>
  );
};

export default App;
