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

const World = () => {
  const web3 = new Web3(window.ethereum);
  const contractAddressRegistry = '0x813B36eCad39C1078Cd0Cb0fCf0B9baD01a3c262';
  const userRegistryContract = new web3.eth.Contract(UserRegistryABI, contractAddressRegistry);
  const [showUsernameInput, setShowUsernameInput] = useState(false);

  useEffect(() => {

    const signUpButton = document.getElementById('signUpButton');
    const container = document.getElementById('container');

    if (signUpButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
      });
    }

  }, []);
  
  const switchToBSCMainnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }], 
      });
    } catch (error) {
      console.error('Error switching network:', error);
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

    checkNetwork();
};



  const checkNetwork = async () => {
    try {
      const networkId = await web3.eth.net.getId();
      if (networkId !== 56) {
        switchToBSCMainnet();  
      }
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

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
  
      const gasPrice = await web3.eth.getGasPrice();
  
      const result = await userRegistryContract.methods
        .registerUser(username, walletAddress, referralCode, referralPrefix)
        .send({
          from: walletAddress,
          gas: gasEstimation,
          gasPrice: gasPrice,  
        });
  
      alert('User registered successfully!');
    } catch (error) {
      alert('Error registering user: ' + error.message);
    }
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
          <div className="flex flex-col items-center mt-8">
            

            <div className="flex space-x-4">


              <div className="mb-6">

                
              </div>


            </div>
          </div>

          
        </motion.div>
      </motion.div>
    </section>
  );
};

export default World;
