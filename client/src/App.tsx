import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { Login } from "@/pages/Login"
import { Dashboard } from "@/pages/Dashboard"
import { LeadDetails } from "@/pages/LeadDetails"
import { Privacy } from "@/pages/Privacy"
import { Terms } from "@/pages/Terms"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Decodes standard JWT tokens client-side
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Failed to parse JWT token", error)
    return null
  }
}

function AppRoutes() {
  const navigate = useNavigate()

  // Extract and save token synchronously during render initialization to avoid race conditions with queries
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    if (token) {
      localStorage.setItem("maps2chat_token", token)
      const payload = parseJwt(token)
      if (payload) {
        const profile = {
          name: payload.name || "Nairobi Operator",
          email: payload.email || "operator@maps2chat.co.ke",
        }
        localStorage.setItem("user_profile", JSON.stringify(profile))
      }
      return true
    }
    return !!localStorage.getItem("maps2chat_token")
  })
  
  const [user] = useState<{ name: string; email: string }>(() => {
    const saved = localStorage.getItem("user_profile")
    return saved ? JSON.parse(saved) : { name: "Nairobi Operator", email: "operator@maps2chat.co.ke" }
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    if (token) {
      // Clean query parameters from address bar
      navigate("/", { replace: true })
    }
  }, [navigate])

  const handleLogin = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
    window.location.href = `${apiBase}/auth/google`
  }

  const handleLogout = () => {
    localStorage.removeItem("maps2chat_token")
    localStorage.removeItem("user_profile")
    setIsAuthenticated(false)
    navigate("/login")
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/leads/:id"
        element={
          isAuthenticated ? (
            <LeadDetails />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="maps2chat-theme">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
