import Image from 'next/image'
import Link from 'next/link'

import rocketseatIcon from '@/assets/rocketseat-icon.svg'
import { PlusCircledIcon } from '@radix-ui/react-icons'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { NavLink } from './nav-link'
import { ThemeSwitcher } from './theme-switcher'
import { Search } from './search'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-8">
        <Image
          src={rocketseatIcon}
          alt="Rocketseat"
          className="h-6 w-6"
          width={24}
          height={24}
        />

        <nav className="ml-6 flex items-center space-x-4 lg:space-x-6">
          <NavLink href="/uploads">Uploads</NavLink>
          <NavLink href="/transcriptions">Transcriptions</NavLink>
          <NavLink href="/ai">Search & AI</NavLink>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <Button asChild>
            <Link href="/upload">
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Upload
            </Link>
          </Button>
          <ThemeSwitcher />
          {/* <UserNav /> */}
        </div>
      </div>
    </div>
  )
}
