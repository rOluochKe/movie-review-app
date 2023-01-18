import React from 'react'
import ThemeProvider from './ThemeProvider'
import NotificationProvider from './NotificationProvider'
import AuthProvider from './AuthProvider'

export default function ContextProviders({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}
