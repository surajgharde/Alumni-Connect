import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiUser, FiLogOut } from "react-icons/fi";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-alama-primary">
          ALAMA Connect
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-alama-primary">
              Dashboard
            </Link>
            <Link href="/events" className="text-gray-600 hover:text-alama-primary">
              Events
            </Link>
            <Link href="/forum" className="text-gray-600 hover:text-alama-primary">
              Forum
            </Link>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 text-gray-600 hover:text-alama-primary"
            >
              <FiUser className="w-5 h-5" />
              <span className="hidden md:inline">
                {session?.user?.name || "Profile"}
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}