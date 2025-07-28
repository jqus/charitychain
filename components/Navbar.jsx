// Navbar.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Web3Provider } from '@ethersproject/providers';
import styles from '../styles';
import { navVariants } from '../utils/motion';
import { Spinner } from 'reactstrap';
import Web3 from 'web3';
import { Toast, ToastHeader } from 'reactstrap';

import userRegistryAbi from '../sections/contracts/UserRegistryABI.json';

const Navbar = () => {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState(null);
  const [points, setPoints] = useState(null);
  const web3 = new Web3(window.ethereum);


  const getReferralCode = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      const userRegistryContract = new web3.eth.Contract(userRegistryAbi, '0x813B36eCad39C1078Cd0Cb0fCf0B9baD01a3c262');
      const userReferralCode = await userRegistryContract.methods.getReferralCodeByWalletWeb(userAddress).call();
      const userPoints = await userRegistryContract.methods.getPoints(userAddress).call();

      setReferralCode(userReferralCode);
      setPoints(userPoints);

      userRegistryContract.events.UserRegistered()
        .on('data', (event) => {
        })
        .on('error', (error) => {
          console.error('Error listening to UserRegistered event:', error);
        });
    } catch (error) {
      console.error('Error code:', error.message);
    }
  };
  
  const toggleToast = () => {
    setLoginSuccess(!loginSuccess);

    if (loginSuccess) {
      setTimeout(() => {
        setLoginSuccess(false);
      }, 2000);
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await provider.listAccounts();
      setUserAddress(accounts[0]);

      await getReferralCode();
      toggleToast();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  useEffect(() => {
    const checkIfConnected = async () => {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
  
          await getReferralCode();
        }
      }
    };
  
    const setupEventListeners = async () => {
      const userRegistryContract = new web3.eth.Contract(userRegistryAbi, '0x813B36eCad39C1078Cd0Cb0fCf0B9baD01a3c262');
      let userRegisteredEvent; 
    
      try {
        userRegisteredEvent = userRegistryContract.events.UserRegistered()
          .on('data', (event) => {
          })
          .on('error', (error) => {
          });
      } catch (error) {
      }
    
      return userRegisteredEvent; 
    };
  
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
  
    checkIfConnected();
    setupEventListeners(); 
  
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <Spinner color="primary" style={{ width: '6rem', height: '6rem' }} />
      </div>
    );
  }

  const connectButtonText = userAddress
  ? `Contributor: ${userAddress.slice(0, 4)}...${userAddress.slice(-5)} (Code: ${referralCode || 'No Wallet Register'}, Points: ${points || '0'})`
  : 'Connect';

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className={`${styles.xPaddings} py-8 relative`}
    >
      <div className="absolute w-[50%] inset-0 gradient-01" />
      <div className={`${styles.innerWidth} mx-auto flex justify-between gap-8`}>
        <img
          src="/search.svg"
          alt="search"
          className="w-[182px] h-[24px] object-contain"
        />
        <h2 className="font-extrabold text-[27px] leading-[33.24px] text-white">
          Collaborate for a Better Tomorrow
        </h2>
        <button
          type="button"
          className="bg-cyan-700 text-white px-3 py-2 rounded"
          onClick={userAddress ? null : handleLogin}
        >
          {connectButtonText}
        </button>
        {loginSuccess && (
          <Toast isOpen={true} className="position-absolute top-0 end-0 m-4">
            <ToastHeader toggle={toggleToast} icon="success">
              ¡Successful login!
            </ToastHeader>
          </Toast>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
