'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useGetSubscriptionPlansQuery } from '@/redux/services/subscriptionApi';
import { useCustomSnackbar } from '@/providers/SnackbarProvider';
import AddMoneyModal from '@/components/modals/AddMoneyModal';

const SubscriptionPage = () => {
  const { data: plansData, isLoading } = useGetSubscriptionPlansQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const { showSnackbar } = useCustomSnackbar();

  const getSelectedPlanAmount = () => {
    if (!plansData?.subscriptionPlans || !selectedPlanId) return '';
    const plan = plansData.subscriptionPlans.find(p => p._id === selectedPlanId);
    return plan?.planSchedule[0]?.planPrice.toString() || '';
  };

  const handleComingSoon = () => {
    showSnackbar('This payment method is coming soon!', 'info');
  };

  const getDurationText = (months: number) => {
    if (months === 1) return '1 Month';
    if (months === 12) return '12 Month';
    return `${months} Month`;
  };

  const getOriginalPrice = (price: number, discount: number) => {
    if (!discount) return null;
    return (price / (1 - discount / 100)).toFixed(2);
  };

  // Default selection once data loads
  React.useEffect(() => {
    if (plansData?.subscriptionPlans?.length && !selectedPlanId) {
      const bestPlan =
        plansData.subscriptionPlans.find(p => p.planSchedule[0].planValidity === 12) ||
        plansData.subscriptionPlans[0];
      setSelectedPlanId(bestPlan._id);
    }
  }, [plansData, selectedPlanId]);

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative pt-16 pb-10 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-black to-black -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-[radial-gradient(circle_at_center,rgba(59,185,255,0.15)_0%,transparent_70%)] -z-10" />

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-3 tracking-tight"
        >
          Join the Plan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed"
        >
          Get started with confidence and full control over your plan.
        </motion.p>

        {/* Character Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 relative h-64 w-full max-w-sm mx-auto flex justify-center"
        >
          <div className="relative w-full h-full">
            <Image
              src="/assets/daily_love.png" // Fallback to logo if specific hero image isn't available
              alt="Premium Characters"
              fill
              className="object-contain"
              priority
            />
            {/* Gradient Overlay for image transition */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent h-full w-full" />
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-wider mb-2">
            CHOOSE A SUBSCRIPTION
          </h2>
          <p className="text-cyan-400 font-bold text-sm md:text-lg">
            Grab the Discount Before It's Gone!
          </p>
        </div>

        {/* Timer UI */}
        <div className="flex justify-center md:justify-center gap-2 mb-8">
          {['00', '00', '00'].map((val, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-background-elevated border border-white-1a rounded-md px-3 py-2 font-mono font-bold text-xl md:text-2xl min-w-[50px] md:min-w-[60px] text-center">
                {val}
              </div>
              {i < 2 && <span className="font-bold text-xl md:text-2xl">:</span>}
            </div>
          ))}
        </div>

        {/* Plans List - Grid on desktop, stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {isLoading
            ? [1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-32 md:h-48 bg-background-elevated rounded-2xl animate-pulse border border-white-1a"
                />
              ))
            : plansData?.subscriptionPlans.map(plan => {
                const schedule = plan.planSchedule[0];
                const isSelected = selectedPlanId === plan._id;
                const isBestSeller = schedule.planValidity === 12;
                const originalPrice = getOriginalPrice(schedule.planPrice, schedule.discount);

                return (
                  <motion.div
                    key={plan._id}
                    onClick={() => setSelectedPlanId(plan._id)}
                    className={`relative cursor-pointer transition-all duration-300 flex flex-col justify-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-500/10 via-background-elevated to-purple-500/10 border-cyan-500 md:scale-105 z-10'
                        : 'bg-background-elevated border-white-1a hover:border-white-1a/30'
                    } border-2 rounded-2xl p-6 overflow-hidden min-h-[140px] md:min-h-[180px]`}
                  >
                    {isBestSeller && (
                      <div className="absolute top-0 left-0 bg-cyan-500 text-black text-[10px] font-black px-4 py-1 rounded-br-xl uppercase">
                        Best Seller
                      </div>
                    )}

                    <div className="flex flex-col md:items-center text-center">
                      <div className="mb-2">
                        <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                          {getDurationText(schedule.planValidity)}
                        </h3>
                        {schedule.discount > 0 && (
                          <p className="text-cyan-400 font-black text-sm uppercase">
                            {schedule.discount}% OFF
                          </p>
                        )}
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center justify-start md:justify-center gap-2">
                          {originalPrice && (
                            <span className="text-gray-500 line-through text-sm">
                              ${originalPrice}
                            </span>
                          )}
                          <div className="flex items-baseline text-white">
                            <span className="text-2xl md:text-3xl font-black">
                              ${schedule.perMonthPlanPrice}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">
                          per month
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
        </div>

        {/* Info Rows and Action Buttons Side by Side on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">
          <div className="space-y-6">
            <div className="space-y-4 px-1">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.908-3.333 9.277-8 10.127-4.667-.85-8-5.22-8-10.127 0-.68.056-1.35.166-2.001zm9.496 3.852a1 1 0 00-1.415-1.414L8 9.586 6.753 8.337a1 1 0 00-1.415 1.414l2 2a1 1 0 001.415 0l3.5-3.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm font-medium">
                  Transparent Pricing. Cancel Anytime.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-cyan-500/20 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.908-3.333 9.277-8 10.127-4.667-.85-8-5.22-8-10.127 0-.68.056-1.35.166-2.001zm9.496 3.852a1 1 0 00-1.415-1.414L8 9.586 6.753 8.337a1 1 0 00-1.415 1.414l2 2a1 1 0 001.415 0l3.5-3.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm font-medium leading-relaxed">
                  All transactions are safe, secure, and clearly labeled on your bank statement.
                </p>
              </div>
            </div>

            {/* Security Badges Integrated Here for Desktop */}
            <div className="flex items-center gap-8 py-6 border-y border-white-1a">
              <div className="text-center">
                <p className="text-gray-500 text-[8px] font-black uppercase mb-1">Verified By</p>
                <div className="text-white font-black text-sm italic tracking-tighter">VISA</div>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div className="text-left leading-none">
                  <p className="text-cyan-500 text-[10px] font-black uppercase">SECURE</p>
                  <p className="text-gray-500 text-[7px] font-bold uppercase">SSL ENCRYPTION</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-[8px] mb-0.5">MasterCard.</div>
                <div className="text-gray-500 font-bold text-[8px] uppercase tracking-tighter leading-none">
                  SecureCode.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowAddMoney(true)}
              className="w-full h-16 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(34,211,238,0.3)] hover:opacity-90 transition-all active:scale-[0.98]"
            >
              <span className="text-black font-black text-xl">Continue</span>
              <div className="bg-white/20 h-8 w-[1px] mx-1" />
              <div className="flex items-center gap-2">
                <span className="text-black font-black text-2xl tracking-tighter">⭐ Stars</span>
              </div>
            </button>

            <button
              onClick={handleComingSoon}
              className="w-full h-14 bg-background-elevated border border-white-1a rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
            >
              <span className="text-white font-bold text-sm">Continue with</span>
              <div className="flex items-center gap-1">
                <span className="text-white italic font-black text-xl tracking-tighter">UPI</span>
                <div className="w-4 h-4 bg-orange-500 rounded-sm rotate-45 flex items-center justify-center -ml-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleComingSoon}
                className="flex-[2] h-14 bg-background-elevated border border-white-1a rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
              >
                <span className="text-white font-bold text-sm">Continue with</span>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-blue-800 font-black text-[10px]">VISA</span>
                  </div>
                  <div className="w-10 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="flex -space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full" />
                      <div className="w-4 h-4 bg-orange-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={handleComingSoon}
                className="flex-1 h-14 bg-background-elevated border border-white-1a rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
              >
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-[12px] font-bold">
                    ₿
                  </div>
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-[12px] font-bold">
                    ₮
                  </div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[12px] font-bold">
                    Ξ
                  </div>
                </div>
              </button>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-[11px] font-bold tracking-tight uppercase mt-2">
                Billed every period. Cancel anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Privileges Section - 2 columns on desktop */}
        <div className="mt-16 mb-20 bg-background-elevated/30 p-8 md:p-12 rounded-[2rem] border border-white-1a">
          <h3 className="text-2xl md:text-3xl font-black text-center uppercase tracking-[0.2em] mb-12">
            PREMIUM PRIVILEGES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-accent-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                ),
                title: 'Build Your One-of-a-Kind AI Companion',
                desc: 'Create unique personalities and appearances tailored just for you.',
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-accent-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: 'Immersive Role-Play Adventure',
                desc: 'Dive into deep, meaningful conversations and scenarios without limits.',
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-accent-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: 'Unlock Stunning, AI-Crafted Images',
                desc: 'Receive and generate high-quality images of your AI companion.',
              },
              {
                icon: (
                  <svg
                    className="w-7 h-7 text-accent-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-6.364l-.707-.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 13V12m0 0a3 3 0 100-6 3 3 0 000 6zm0 0v1m0 0a3 3 0 100 6 3 3 0 000-6z"
                    />
                  </svg>
                ),
                title: 'Powered by Advanced AI Engine',
                desc: 'Experience the most responsive and intelligent AI dating engine available.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-6">
                <div className="bg-background-elevated p-4 rounded-2xl border border-white-1a flex-shrink-0 shadow-lg">
                  {item.icon}
                </div>
                <div>
                  <p className="text-lg font-black leading-tight mb-2">{item.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AddMoneyModal
        isOpen={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        initialAmount={getSelectedPlanAmount()}
      />
    </div>
  );
};

export default SubscriptionPage;
