'use client';
// Importa los módulos necesarios
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../utils/motion';
import styles from '../styles';
import styleseferer from './referrer.css';
import { TitleText, TypingText } from '../components';
import Web3 from 'web3';


import UserRegistryABI from './contracts/UserRegistryABI.json';
// import BuyTokenPrivateSaleABI from './contracts/BuyTokenPrivateSale.json';

const World = () => {
  const [tokenAmount, setTokenAmount] = useState(0);
  const web3 = new Web3(window.ethereum);
  // const contractAddressPresale = '0x9Ff9784ED549604bA69371aEDe4064e6dEc6ee2b';
  const contractAddressRegistry = '0x813B36eCad39C1078Cd0Cb0fCf0B9baD01a3c262';
  const userRegistryContract = new web3.eth.Contract(UserRegistryABI, contractAddressRegistry);
  // const presaleTokenBuyPrivate = new web3.eth.Contract(BuyTokenPrivateSaleABI, contractAddressPresale);
  const [showUsernameInput, setShowUsernameInput] = useState(false);

  useEffect(() => {

    const signUpButton = document.getElementById('signUpButton');
    const container = document.getElementById('container');

    if (signUpButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
      });
    }
    
    // Escuchar eventos del contrato
    // presaleTokenBuyPrivate.events.InvalidBnbAmount({ fromBlock: 'latest' })
    //   .on('data', function (event) {
    //     alert(`Error: ${event.returnValues.message}`);
    //   });

    // presaleTokenBuyPrivate.events.InsufficientTokenAmount({ fromBlock: 'latest' })
    //   .on('data', function (event) {
    //     alert(`Error: ${event.returnValues.message}`);
    //   });

    // presaleTokenBuyPrivate.events.TokensLeftExceeded({ fromBlock: 'latest' })
    //   .on('data', function (event) {
    //     alert(`Error: ${event.returnValues.message}`);
    //   });

    

  }, []); // Ejecutar solo una vez al cargar el componente
  
  const switchToBSCMainnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],  // Binance Smart Chain Mainnet
      });
    } catch (error) {
      // console.error('Error switching network:', error);
    }
  };

  const connectWallet = async () => {
    try {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            const walletAddress = accounts[0];

            if (walletAddress !== undefined && walletAddress !== "") {
                document.getElementById('walletAddress').value = walletAddress;
            } else {
                alert('Wallet address is not available. Please make sure the wallet is connected.');
            }
        } else {
            alert('Please install a wallet like MetaMask and connect to it.');
        }
    } catch (error) {
        console.error('Error connecting to wallet:', error);
    }
    setShowUsernameInput(true);

    // Verificar la red al conectar la billetera
    checkNetwork();
};



  const checkNetwork = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      if (networkId !== 56) {
        // alert('Please switch to Binance Smart Chain Mainnet.');
        switchToBSCMainnet();  // Cambiar automáticamente a BSC Mainnet
      }
    } catch (error) {
      // console.error('Error checking network:', error);
    }
  };

  // const buyTokens = async () => {
  //   try {
  //     if (!window.ethereum) {
  //       alert('Please install a wallet like MetaMask and connect to it.');
  //       return;
  //     }
  
  //     await window.ethereum.enable();
  //     const accounts = await web3.eth.getAccounts();
  //     const buyer = accounts[0];
  
  //     if (!buyer) {
  //       alert('Wallet address is not available. Please make sure the wallet is connected.');
  //       return;
  //     }
  
  //     if (!tokenAmount || isNaN(tokenAmount) || tokenAmount <= 0) {
  //       alert('Please enter a valid amount of tokens to buy.');
  //       return;
  //     }
  
  
  //     const gasEstimation = await presaleTokenBuyPrivate.methods.purchaseTokens(buyer).estimateGas({
  //       from: buyer,
  //       value: web3.utils.toWei(tokenAmount.toString(), 'ether')
  //     });
  
  //     const gasPrice = await web3.eth.getGasPrice();
  //     const result = await presaleTokenBuyPrivate.methods.purchaseTokens(buyer).send({
  //       from: buyer,
  //       value: web3.utils.toWei(tokenAmount.toString(), 'ether'),
  //       gas: gasEstimation,
  //       gasPrice: gasPrice
  //     });
  
  //     alert(`Tokens purchased successfully! Transaction hash: ${result.transactionHash}`);
  //   } catch (error) {
  //     // console.error('Error buying tokens:', error);
  //     alert('Error buying tokens: ' + error.message);

  //   }
  // };
  
    

  const registerUser = async () => {
    const username = document.getElementById('username').value;
    const walletAddress = document.getElementById('walletAddress').value;
    const referralCode = document.getElementById('referralCode').value || "CHARITYCHAIN";
    const referralPrefix = "";
  
    if (walletAddress.trim() === '') {
      alert('Please connect your wallet before registering.');
      return;
    }
    if (username.trim() === '') {
      alert('Please insert your user Telegram before registering.');
      return;
    }
  
    if (!web3.utils.isAddress(walletAddress)) {
      alert('Invalid wallet address. Please make sure the wallet is connected.');
      return;
    }
  
    try {
      const isUserRegistered = await userRegistryContract.methods.isUserRegistered(walletAddress).call();
  
      if (isUserRegistered) {
        alert('User with this wallet address already exists.');
        return;
      }
  
      const gasEstimation = await userRegistryContract.methods
        .registerUser(username, walletAddress, referralCode, referralPrefix)
        .estimateGas({ from: walletAddress });
  
      // Obtener la tarifa de gas actual de la red
      const gasPrice = await web3.eth.getGasPrice();
  
      const result = await userRegistryContract.methods
        .registerUser(username, walletAddress, referralCode, referralPrefix)
        .send({
          from: walletAddress,
          gas: gasEstimation,
          gasPrice: gasPrice,  // Incluir la tarifa de gas obtenida
        });
  
      alert('User registered successfully!');
      // console.log('Transaction hash:', result.transactionHash);
    } catch (error) {
      alert('Error registering user: ' + error.message);
    }
  };

  
  const handleClick = () => {
    // Lógica de manejo del clic
  };
  
  
  
  
  return (
    <section className={`${styles.paddings} relative z-10`}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        {/* Título principal */}
        <TypingText title="| People on the World" textStyles="text-center" id="#register" />
        <TitleText
          title={
            <>
              Make a Difference: <br /> Be Part of Charity Chain World
            </>
          }
          textStyles="text-center"
        />

        {/* Contenido principal */}
        <motion.div
          variants={fadeIn('up', 'tween', 0.3, 1)}
          className="relative mt-[38px] flex w-full h-[400px]"
        >

<div className={` container ${styleseferer.container}`}>
        <div className={`top ${styleseferer.top}`}></div>
      <div className={`bottom ${styleseferer.bottom}`}></div>
      <div className={`center ${styleseferer.center}`}>
        <br /><br />
        <form className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-5 mb-4">
              {/* Campo Nombre de usuario de Telegram */}
              {showUsernameInput && (
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="username"
                    >
                      Name User Telegram
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      placeholder="Telegram User Name (include @)"
                      required
                    />
                  </div>
                )}

              {/* Campo Dirección de la wallet conectada */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="walletAddress"
                >
                  Register Wallet Address
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="walletAddress"
                  type="text"
                  placeholder="Wallet Address"
                  readOnly
                  required
                />
              </div>

              {/* Campo Código de referido */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="referralCode"
                >
                  Reference code
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="referralCode"
                  type="text"
                  placeholder="Referral code (optional)"
                  
                />
              </div>

              {/* Botón de registro */}
              {showUsernameInput && (<center><button
                  className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
                  type="button"
                  onClick={() => registerUser()} 
                >
                  
                  Register User
                </button></center>
              )}

            </form>
                <button
                  className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-2 rounded-full"
                  onClick={() => connectWallet()}
                >
                  Connect Wallet
                </button>          
                <h2>&nbsp;</h2>
      </div>
    </div>
              {/* Formulario y botones */}
          <div className="flex flex-col items-center mt-8">
            {/* Tu formulario aquí */}
            

            {/* Botones adicionales */}
            <div className="flex space-x-4">
              {/* Botón de conectar a wallet con web3 */}


              <div className="mb-6">
                          
                {/* <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="tokenAmount"
                >
                  Token Amount
                </label>               */}

                {/* <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tokenAmount"
                  type="text"
                  placeholder="Enter token amount"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  required
                /> */}
                
              </div>
                {/* <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
              type="button"
              onClick={buyTokens}
            >
              Buy Tokens
            </button> */}

            </div>
          </div>

          
        </motion.div>
      </motion.div>
    </section>
  );
};

export default World;
