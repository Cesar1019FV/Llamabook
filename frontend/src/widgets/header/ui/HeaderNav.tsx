import { useTranslation } from 'react-i18next'

export function HeaderNav() {
  const { t } = useTranslation()

  const links = [
    { href: '#features', label: t('header.nav.features') },
    { href: '#about', label: t('header.nav.about') },
    { href: '#contact', label: t('header.nav.contact') },
  ]

  return (
    <nav aria-label="Main navigation">
      <ul className="hidden items-center gap-6 text-sm text-llama-muted md:flex">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="hover:text-llama-ink transition-colors">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
