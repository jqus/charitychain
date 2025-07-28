'use client';

import { motion } from 'framer-motion'; 
import React, { useEffect } from 'react';  

import styles from '../styles';
import { newFeatures } from '../constants';
import { NewFeatures, TitleText, TypingText } from '../components';
import { planetVariants, staggerContainer, fadeIn } from '../utils/motion';
import Chart from 'chart.js/auto';

const WhatsNew = () => {

  const chartData5 = {
    labels: ['Team', 'Treasury', 'Staking', 'Liquidity', 'Airdrop', 'Public Sale', 'Private Sale', 'Advisor', 'Partners', 'Marketing'],
    values: [17, 2, 25, 24, 6, 11, 5, 3, 3, 4],
  };

  useEffect(() => {
    // Obtén el contexto del lienzo
    const ctx = document.getElementById('PieChart5').getContext('2d');
  
    // Check if there's an existing chart on the canvas
    const existingChart = Chart.getChart(ctx);
  
    // If there's an existing chart, destroy it
    if (existingChart) {
      existingChart.destroy();
    }
  
    // Crea el gráfico circular
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartData5.labels,
        datasets: [
          {
            data: chartData5.values,
            backgroundColor: [
              'rgba(255, 99, 112, 0.6)',
              'rgba(54, 142, 225, 0.6)',
              'rgba(23, 99, 3, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 172, 132, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(33, 71, 255, 0.6)',
              'rgba(98, 90, 180, 0.6)',
              'rgba(2, 187, 27, 0.6)',
              'rgba(202, 4, 7, 0.6)',
            ],
          },
        ],
      },
    });
  }, []);
  

  return (

    <section className={`${styles.paddings} relative z-10`}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-8`}
      >          
      
        
        <motion.div
          variants={fadeIn('right', 'tween', 0.2, 1)}
          className="flex-[0.95] flex justify-center flex-col"
        >
          <TypingText title="| Tokenomicks?" />
          <TitleText title={<>Each transaction to where and how it is distributed?</>} />
          <div className="mt-[48px] flex flex-wrap justify-between gap-[4px]">
            {newFeatures.map((feature) => (
              <NewFeatures key={feature.title} {...feature} />
            ))}
          </div>
        </motion.div>

        {/* Agrega el lienzo para el gráfico circular con tamaño de 160px */}
        <motion.div
          variants={planetVariants('right')}
          className={`flex-1 ${styles.flexCenter}`}
        >
          <canvas className="w-[100%] h-[100%] max-w-[600px] max-h-[600px]" id="PieChart5"></canvas>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhatsNew;
