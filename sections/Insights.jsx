'use client';

import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

import styles from '../styles';
import { insights } from '../constants';
import { staggerContainer } from '../utils/motion';
import { InsightCard, TitleText, TypingText } from '../components';
import Chart from 'chart.js/auto';

const Insights = () => {

  useEffect(() => {

    const chartData3 = {

      values: [72, 40, 30, 16, 24, 14, 15, 16],
    };
    // Obtén el contexto del lienzo
    const ctx = document.getElementById('PieChartNe2').getContext('2d');
  
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
        labels: chartData3.labels,
        datasets: [
          {
            data: chartData3.values,
            backgroundColor: [
              'rgba(255, 99, 112, 0.6)',
              'rgba(54, 142, 225, 0.6)',
              'rgba(23, 206, 86, 0.6)',
              'rgba(163,207, 196, 0.6)',
              'rgba(38, 83, 114, 0.6)',
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
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <TypingText title="| Distribution" textStyles="text-center" />
        <TitleText title={<>Distribution Weekly Charity Chain</>} textStyles="text-center" />
        <center><canvas className="w-[100%] h-[100%] max-w-[350px] max-h-[350px]" id="PieChartNe2"></canvas></center>

        <div className="mt-[60px] flex flex-col gap-[10px]">
          {insights.map((item, index) => (
            <InsightCard key={`insight-${index}`} {...item} index={index + 1} />
          ))}
        </div>
<br /><br /><br /><br /><br />
      </motion.div>
      <img
          src="/cover.webp"
          alt="hero_cover"
          className="w-full sm:h-[700px] h-[350px] object-cover rounded-tl-[25px] rounded-tr-[25px] rounded-bl-[25px] rounded-br-[25px] z-10 relative"
        />
    </section>
);
      };
export default Insights;
