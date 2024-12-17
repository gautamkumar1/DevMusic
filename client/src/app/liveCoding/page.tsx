import dynamic from 'next/dynamic'

const CollaborativeEditor = dynamic(
  () => import('./components/CollaborativeEditor'),
  { ssr: false }
)

export default function LiveCodingPage() {
  return <CollaborativeEditor />
} 