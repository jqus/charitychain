'use client';

import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';

const InsightCard = ({ title, subtitle, index, color }) => (
  <motion.div
    variants={fadeIn('up', 'spring', index * 0.5, 1)}
    className="flex md:flex-row flex-col gap-4"
  >
    <div className="w-full flex justify-between items-center">
      <div className="flex-1 md:ml-[150px] flex flex-col max-w-[900px]">
        <h4 className="font-normal lg:text-[35px] text-[26px]" style={{ color: color.title }}>
          {title}
        </h4>
        <p className="mt-[16px] font-normal lg:text-[20px] text-[14px]" style={{ color: color.subtitle }}>
          {subtitle}
        </p>
      </div>

      <div className="lg:flex hidden items-center justify-center w-[100px] h-[100px] rounded-full bg-transparent border-[1px] border-white">
        <img
          src="/infor.svg"
          alt="arrow"
          className="w-[50%] h-[50%] object-contain"
        />
      </div>
    </div>
  </motion.div>
);

export default InsightCard;
