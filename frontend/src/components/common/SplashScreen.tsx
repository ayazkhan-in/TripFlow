import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  isVisible: boolean;
  progress: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible, progress }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="bookit-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: 'blur(12px)',
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F8FA] select-none"
        >
          {/* Centered Brand Lockup: Logo + App Name Bookit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center text-center"
          >
            <img
              src="/bookit.png"
              alt="Bookit"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xs"
            />
            <h1 className="mt-3.5 text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">
              Bookit
            </h1>
          </motion.div>

          {/* Minimal Loading Bar */}
          <motion.div
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
            className="mt-6 w-36 sm:w-44 h-1 bg-slate-200/90 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-[#004AC6] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
