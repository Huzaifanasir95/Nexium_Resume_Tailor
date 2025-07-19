'use client'

import { useAuth } from './AuthProvider'

export default function UserProfile() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  if (!user) return null

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center neon-glow">
          <span className="text-white text-sm font-bold">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-gray-300 font-medium">{user.email}</span>
      </div>
      <button
        onClick={handleSignOut}
        className="text-gray-400 hover:text-white transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-white/10"
      >
        Sign out
      </button>
    </div>
  )
}
