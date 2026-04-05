'use client'

import { motion } from 'framer-motion'
import { TopicCard } from './TopicCard'
import type { Topic } from '@/lib/db/schema'

interface TopicGridProps {
  topics: Topic[]
  selectedIds: string[]
  onToggle: (id: string) => void
  maxSelection: number
}

export function TopicGrid({ topics, selectedIds, onToggle, maxSelection }: TopicGridProps) {
  const selectionFull = selectedIds.length >= maxSelection

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.05 },
        },
      }}
    >
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          selected={selectedIds.includes(topic.id)}
          onToggle={onToggle}
          disabled={selectionFull && !selectedIds.includes(topic.id)}
        />
      ))}
    </motion.div>
  )
}
