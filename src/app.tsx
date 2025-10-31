import { useState, useEffect } from 'preact/hooks'
import { decodeAndVerifyJWT } from './utils/jwt'
import { QRCodePanel } from './components/QRCodePanel'
import { Avatar } from './components/Avatar'

// Initialize Eruda mobile debugger in development mode
if (import.meta.env.DEV) {
  import('eruda').then((eruda) => {
    eruda.default.init()
    eruda.default.position({ x: 20, y: 20 })
    console.log('🔧 Eruda debugger initialized - tap the floating button to open DevTools')
  })
}

// TypeScript declarations for IRL Browser API
declare global {
  interface Window {
    irlBrowser?: {
      getProfileDetails(): Promise<string>;
      getAvatar(): Promise<string | null>;
      getBrowserDetails(): {
        name: string;
        version: string;
        platform: 'ios' | 'android';
        supportedPermissions: string[];
      };
      requestPermission(permission: string): Promise<boolean>;
      close(): void;
    };
  }
}

interface UserProfile {
  did: string;
  name: string;
  socials?: Array<{
    platform: string;
    handle: string;
  }>;
}

interface AvatarPayload {
  did: string;
  avatar: string;
}

export function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [isIRLBrowser, setIsIRLBrowser] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if running in an IRL Browser
    setIsIRLBrowser(!!window.irlBrowser)

    // Get profile details immediately
    loadProfile()

    // Load avatar
    loadAvatar()
  }, [])

  const loadProfile = async () => {
    try {
      if (!window.irlBrowser) {
        console.log('IRL Browser not found')
        return
      }
      // Get profile details JWT
      const jwt = await window.irlBrowser.getProfileDetails()

      // Verify and decode JWT
      const payload = await decodeAndVerifyJWT(jwt)

      // Extract profile data from payload
      const profileData = payload.data as UserProfile
      setProfile(profileData)

    } catch (err) {
      console.error('Error loading profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    }
  }

  const loadAvatar = async () => {
    try {
      if (!window.irlBrowser) {
        return
      }
      // Get avatar separately (returns a signed JWT)
      const avatarJWT = await window.irlBrowser.getAvatar()
      if (!avatarJWT) { return }

      // Decode and verify the avatar JWT
      const avatarPayload = await decodeAndVerifyJWT(avatarJWT)
      
      // Extract the base64 avatar data from the payload
      const avatarData = avatarPayload.data as AvatarPayload
      setAvatar(avatarData.avatar)
      
    } catch (err) {
      console.error('Error loading avatar:', err)
      // Don't set error state for avatar failures, just log them
    }
  }

  // Show fallback message if not in IRL Browser
  if (!isIRLBrowser) {
    return (
      <div class="min-h-screen bg-white">
        <div class="grid md:grid-cols-2 min-h-screen">
          <QRCodePanel />
          <div class="flex items-center justify-center px-4 py-12">
            <div class="text-center max-w-2xl">
              <div class="flex justify-center mb-8">
                <div class="max-w-[150px] md:max-w-[200px]">
                  <img
                    src="https://ax0.taddy.org/antler/antler-icon.webp"
                    alt="Antler"
                    class="w-full h-auto rounded-3xl shadow-lg"
                  />
                </div>
              </div>

              {/* Hero Title */}
              <h2 class="text-3xl md:text-4xl font-bold text-[#403B51] mb-8 leading-tight">
                Scan with Antler!
              </h2>

              {/* Download Buttons */}
              <div class="flex flex-wrap justify-center gap-4 mt-8">
                <a
                  href="https://apps.apple.com/app/id6753969350"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block transition-transform hover:-translate-y-1 active:scale-95"
                >
                  <img
                    src="https://ax0.taddy.org/general/apple-app-store-badge.png"
                    alt="Download on the App Store"
                    class="h-12 md:h-14 w-auto"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.antlerbrowser"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block transition-transform hover:-translate-y-1 active:scale-95"
                >
                  <img
                    src="https://ax0.taddy.org/general/google-play-badge.png"
                    alt="Download on Google Play"
                    class="h-12 md:h-14 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div class="grid md:grid-cols-2 min-h-screen">
          <QRCodePanel />
          <div class="flex items-center justify-center px-4">
            <div class="text-center max-w-md">
              <div class="text-6xl mb-6">⚠️</div>
              <h1 class="text-3xl font-bold mb-4 text-gray-800">Error</h1>
              <p class="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while waiting for profile
  if (!profile) {
    return (
      <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div class="grid md:grid-cols-2 min-h-screen">
          <QRCodePanel />
          <div class="flex items-center justify-center px-4"></div>
        </div>
      </div>
    )
  }

  // Show profile
  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div class="grid md:grid-cols-2 min-h-screen">
        <QRCodePanel />
        <div class="flex items-center justify-center px-4">
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-6 text-gray-800">
              Hey, {profile.name}!
            </h1>
            <Avatar avatar={avatar} name={profile.name} />
            <p class="text-gray-600 text-lg mt-4">
              Yay! You've successfully setup your profile!<br /><br />Look for other QR codes with antlers for websites that allow instant login!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
