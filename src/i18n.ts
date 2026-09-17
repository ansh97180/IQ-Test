import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi' | 'zh' | 'hinglish';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  welcome_title: {
    en: 'Cognitive Assessment',
    hi: 'संज्ञानात्मक मूल्यांकन',
    zh: '认知评估',
    hinglish: 'Cognitive Assessment'
  },
  welcome_subtitle: {
    en: 'A comprehensive, browser-based evaluation designed to measure observable reasoning performance.',
    hi: 'अवलोकन योग्य तर्क प्रदर्शन को मापने के लिए डिज़ाइन किया गया एक व्यापक, ब्राउज़र-आधारित मूल्यांकन।',
    zh: '旨在衡量可观察推理表现的全面基于浏览器的评估。',
    hinglish: 'Ek comprehensive browser-based test aapki reasoning performance measure karne ke liye.'
  },
  start_button: {
    en: 'Begin Assessment',
    hi: 'मूल्यांकन शुरू करें',
    zh: '开始评估',
    hinglish: 'Test Shuru Karein'
  },
  select_language: {
    en: 'Select Language',
    hi: 'भाषा चुनें',
    zh: '选择语言',
    hinglish: 'Language Select Karein'
  },
  instructions_title: {
    en: 'Instructions',
    hi: 'निर्देश',
    zh: '说明',
    hinglish: 'Instructions'
  },
  instructions_text: {
    en: 'During the test, focus on the questions. Do not refresh the page. You will have a limited time for each section.',
    hi: 'परीक्षण के दौरान, प्रश्नों पर ध्यान दें। पृष्ठ को ताज़ा न करें। प्रत्येक अनुभाग के लिए आपके पास सीमित समय होगा।',
    zh: '在测试期间，请集中注意力回答问题。不要刷新页面。每个部分的时间有限。',
    hinglish: 'Test ke dauran, questions par focus rakhein. Page refresh mat karein. Har section ke liye limited time hoga.'
  },
  practice_button: {
    en: 'Try Practice Question',
    hi: 'अभ्यास प्रश्न का प्रयास करें',
    zh: '尝试练习题',
    hinglish: 'Practice Question Try Karein'
  },
  skip_practice: {
    en: 'Skip Practice & Start',
    hi: 'अभ्यास छोड़ें और शुरू करें',
    zh: '跳过练习并开始',
    hinglish: 'Practice Skip Karein aur Start Karein'
  },
  important_limitations: {
    en: 'Important Limitations',
    hi: 'महत्वपूर्ण सीमाएँ',
    zh: '重要限制',
    hinglish: 'Zaroori Limitations'
  },
  limitations_text: {
    en: 'This is NOT a clinically validated IQ test.',
    hi: 'यह चिकित्सकीय रूप से मान्य IQ परीक्षण नहीं है।',
    zh: '这不是经过临床验证的智商测试。',
    hinglish: 'Yeh clinically validated IQ test NAHI hai.'
  }
};

export const useTranslation = (lang: Language) => {
  return (key: keyof typeof translations) => {
    return translations[key]?.[lang] || translations[key]?.['en'] || key;
  };
};
