"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Activity, List, Sparkles, TrendingUp, Users, Award } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      title: "Add Activity",
      description: "Log your daily workout and track progress",
      icon: <Activity className="w-10 h-10" />,
      route: "/home/addActivity",
      color: "from-red-500 to-red-600",
      hoverColor: "from-red-400 to-red-500",
      bgColor: "bg-red-500/20",
      stats: "Today's Goal"
    },
    {
      title: "All Activities", 
      description: "Review your complete fitness history",
      icon: <List className="w-10 h-10" />,
      route: "/home/allActivity",
      color: "from-orange-500 to-red-500",
      hoverColor: "from-orange-400 to-red-400",
      bgColor: "bg-orange-500/20",
      stats: "View Progress"
    },
    {
      title: "AI Recommendations",
      description: "Get personalized workout suggestions",
      icon: <Sparkles className="w-10 h-10" />,
      route: "/home/recommendations",
      color: "from-red-600 to-pink-500",
      hoverColor: "from-red-500 to-pink-400",
      bgColor: "bg-pink-500/20",
      stats: "Smart Tips"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleCardClick = (route) => {
    router.push(route);
  };

  return (
    <div className="h-full flex flex-col px-4 sm:px-6 py-6 sm:py-8 relative">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 rounded-2xl backdrop-blur-sm" />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-red-400/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mb-6 shadow-xl"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl"
            whileHover={{ scale: 1.02 }}
          >
            Fitness Dashboard
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-white/80 font-light max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Your personal fitness command center
          </motion.p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center gap-4 sm:gap-8 mb-8 sm:mb-12"
        >
          
        </motion.div>

        {/* Main Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 h-full min-h-[400px]">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`
                  group relative overflow-hidden rounded-2xl cursor-pointer
                  bg-gradient-to-br ${card.color} p-[1px] 
                  hover:shadow-2xl hover:shadow-red-500/25
                  transition-all duration-300
                `}
                onClick={() => handleCardClick(card.route)}
              >
                {/* Card Content */}
                <div className="h-full bg-black/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[280px] sm:min-h-[320px] relative overflow-hidden">
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/10 rounded-full" />
                  </div>

                  {/* Icon Container */}
                  <motion.div 
                    className={`
                      mb-6 p-4 sm:p-6 rounded-2xl shadow-xl relative
                      bg-gradient-to-br ${hoveredCard === index ? card.hoverColor : card.color}
                      transition-all duration-300
                    `}
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-white relative z-10">
                      {card.icon}
                    </div>
                    {/* Icon glow effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <motion.h2 
                      className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      {card.title}
                    </motion.h2>
                    
                    <motion.p 
                      className="text-white/80 text-sm sm:text-base leading-relaxed mb-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      {card.description}
                    </motion.p>

                    {/* Stats Badge */}
                    <motion.div
                      className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white/90"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                    >
                      {card.stats}
                    </motion.div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ borderRadius: 'inherit' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-3 text-white/70 text-sm sm:text-base backdrop-blur-lg bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/20 hover:bg-white/15 transition-all duration-300">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ⚡
            </motion.span>
            <span className="font-medium">Ready to crush your fitness goals?</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💪
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
