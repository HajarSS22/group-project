"use client";

import { motion } from "framer-motion";
import { CheckCircle2, History, MapPin, Search } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-slate-950">
      {/* Header Section */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-6 text-indigo-600 dark:text-indigo-400"
          >
            <MapPin className="h-8 w-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            قصة نقطة رُكن
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            نحن هنا لنغير الطريقة التي توقف بها سيارتك، لجعل كل رحلة أكثر سلاسة وأقل توتراً.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Search className="h-8 w-8 text-indigo-500" />
                المشكلة
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                في المدن المزدحمة، يقضي السائقون وقتاً طويلاً يومياً في البحث عن موقف لسياراتهم. هذا لا يؤدي فقط إلى إهدار الوقت الثمين، بل يزيد من التوتر والانبعاثات الكربونية في البيئة.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row-reverse gap-8 items-center"
          >
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                الحل
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                "نقطة رُكن" يوفر منصة متكاملة تتيح لك رؤية المواقف المتاحة في وجهتك وحجزها مسبقاً قبل الانطلاق، والدفع بطريقة إلكترونية آمنة. مع ضمان أن الموقف في انتظارك.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-indigo-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-indigo-100 dark:border-slate-800 text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">رؤيتنا</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg max-w-2xl mx-auto">
              أن نصبح المنصة الأولى والأكثر موثوقية في المنطقة لتنظيم وتسهيل عملية اصطفاف السيارات، مساهمين في بناء مدن ذكية وخضراء وخالية من الازدحامات.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
