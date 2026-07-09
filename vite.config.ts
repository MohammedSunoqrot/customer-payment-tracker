import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const repoBase = '/customer-payment-tracker/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? repoBase : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'favicon.svg'],
      manifest: {
        name: 'متابعة الدفعات - Customer Payment Tracker',
        short_name: 'متابعة الدفعات',
        description: 'تطبيق متابعة اتصالات ومدفوعات العملاء (نسخة تجريبية محلية) — Customer follow-up & payment tracker (local demo)',
        lang: 'ar',
        dir: 'rtl',
        theme_color: '#0f766e',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: command === 'build' ? repoBase : '/',
        scope: command === 'build' ? repoBase : '/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
      },
    }),
  ],
}))
