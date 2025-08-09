import React, { memo } from 'react';
import { motion } from 'framer-motion';

const OptimizedFeatureCard = memo(({ feature, index, delay = 0 }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: delay + index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="text-4xl mb-4" role="img" aria-label={feature.title}>
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  );
});

OptimizedFeatureCard.displayName = 'OptimizedFeatureCard';

export default OptimizedFeatureCard;