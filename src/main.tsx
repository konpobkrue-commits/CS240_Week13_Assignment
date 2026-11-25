// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // ข้อมูลสดใหม่5 นาที
      refetchInterval: 1000 * 60 * 10, // ยิงAPI ใหม่ให้เองทุกๆ10 นาที
      gcTime: 1000 * 60 * 30, // เก็บcache ที ่ไม่มีใครใช้ไว้30 นาที
      retry: 1, // ลองใหม่1 ครั ้งเมื ่อล้มเหลว(ค่าเริ ่มต้นคือ3)
      refetchOnWindowFocus: false, // ไม่ยิงใหม่ทุกครั ้งที ่กลับมาที ่แท็บ
    },
  },
})

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  // </StrictMode>,
)
