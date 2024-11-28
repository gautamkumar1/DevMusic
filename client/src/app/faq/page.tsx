"use client"
import { motion, Variants } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

interface AccordionItemProps {
  title: string
  content: string
  isExpanded: boolean
  onToggle: () => void
}

interface AccordionProps {
  items: Array<{
    title: string
    content: string
  }>
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  isExpanded,
  onToggle,
}) => {
  const cardVariants: Variants = {
    collapsed: {
      height: '60px',
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
    expanded: {
      height: 'auto',
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
  }

  const contentVariants: Variants = {
    collapsed: { opacity: 0 },
    expanded: {
      opacity: 1,
      transition: { delay: 0.1 },
    },
  }

  const chevronVariants: Variants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 },
  }

  return (
    <motion.div
      className={`w-90 dark:bg-gray-800' my-4 h-full cursor-pointer select-none overflow-hidden rounded-lg border  dark:border-gray-700`}
      variants={cardVariants}
      initial="collapsed"
      animate={isExpanded ? 'expanded' : 'collapsed'}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
        <h2 className="m-0 text-sm font-semibold text-orange-500">{title}</h2>
        <motion.div variants={chevronVariants}>
          <ChevronDown size={18} />
        </motion.div>
      </div>
      <motion.div
        className="text-md select-none px-4 py-4"
        variants={contentVariants}
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
      >
        <p className="m-0 text-sm text-gray-900 dark:text-gray-100">
          {content}
        </p>
      </motion.div>
    </motion.div>
  )
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isExpanded={expandedIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  )
}

const accordionItems = [
    {
      title: 'How Does Live Code and Debug Sharing Work?',
      content:
        'Our platform allows you to share code snippets and debug collaboratively in real time, making pair programming and code reviews seamless.',
    },
    {
      title: 'Can I Chat with Other Developers in Real Time?',
      content:
        'Yes! Connect with developers worldwide through our integrated real-time chat system, designed to keep communication clear and fast.',
    },
    {
      title: 'What Are Mood-Based Playlists?',
      content:
        'Mood-based playlists are specially curated music collections that adapt to your coding mood—whether you need deep focus, relaxation, or high-energy tracks.',
    },
    {
      title: 'How Can I Create Rooms and Invite Friends?',
      content:
        'Easily create virtual coding rooms where you can invite friends or teammates to collaborate, share ideas, and jam to developer-centric playlists.',
    },
    {
      title: 'Are There Any Ads?',
      content:
        'No ads, no interruptions—just you, your code, and your music. We believe in providing a distraction-free environment for developers.',
    },
    {
      title: 'What Is "Find Your Coding Buddy"?',
      content:
        'Our "Find Your Coding Buddy" feature connects you with like-minded developers to collaborate on projects, exchange ideas, or just code together.',
    },
  ];
  
const AccordionExample: React.FC = () => {
  return (
    <div>
      <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-12">
      Code, Collaborate, and Groove: FAQs for Devs
      </h1>
        <Accordion items={accordionItems} />
      </div>
    </div>
  )
}

export default AccordionExample