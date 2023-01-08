import React, { useState } from 'react';
import Web3Modal from 'web3modal';
import WalletConnect from "@walletconnect/web3-provider";
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers';

const App = () => {

    const [provider, setProvider] = useState(null)
    const [address, setAddress] = useState(null)

    const web3Modal = new Web3Modal({
        cacheProvider: true,
        disableInjectedProvider: true,
        providerOptions: {
            walletconnect: {
                package: WalletConnect, // required
                options: {
                    infuraId: "", // Required
                    network: "mainnet",
                    qrcodeModalOptions: {
                        mobileLinks: ["rainbow", "metamask", "argent", "trust", "imtoken", "pillar"]
                    }
                }
            },
            'custom-xdc': {
                display: {
                    name: 'XDC Pay',
                    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2634.png',
                    description: 'Connect with XDC Pay'
                },
                package: detectEthereumProvider,
                connector: async (_detectEthereumProvider) => {
                    const provider = await _detectEthereumProvider();
                    console.log("provider", provider)
                    await provider.enable();
                    return provider;
                }
            },
        },
    });

    const onConnect = async () => {
        try {
            const instance = await web3Modal.connect();
            const providerConnect = new ethers.providers.Web3Provider(instance);
            setProvider(providerConnect)

        } catch (err) {
            console.log("err", err)
        }
    }

    const sendXdc = async () => {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address)
        console.log("Address", address)
        // Acccounts now exposed
        const params = [{
            from: address,
            to: "0x117c691d76c1d9c68e3709a87f7d496097f2b56f",
            value: ethers.utils.parseUnits('1', 'ether').toHexString()
        }];

        const transactionHash = await provider.send('eth_sendTransaction', params)
        console.log('transactionHash is ' + transactionHash);
    }
    return (
        <div align="center">
            <h2>Connect Warranty-Fi with <br></br>XDC Pay Wallet(Chrome Extension)</h2>



            {!provider && <button type='button'  onClick={onConnect}>Connect</button>}
            {provider && <button type='button' class="button1" onClick={sendXdc}>Send XDC</button>}

        </div>
    );
    }
    
export default App;