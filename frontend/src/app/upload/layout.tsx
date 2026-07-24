import AdminGate from '@/components/AdminGate';

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
