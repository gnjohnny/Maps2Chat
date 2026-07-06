
interface ContactLinkProps {
  whatsappNumber: string
  businessName: string
  onContactClicked: () => void
}

export function ContactLink({ whatsappNumber, businessName, onContactClicked }: ContactLinkProps) {
  // WhatsApp outreach message templates
  const message = encodeURIComponent(
    `Hello ${businessName}, I found your business on Google Maps and wanted to connect!`
  )
  const href = `https://wa.me/${whatsappNumber}?text=${message}`

  const handleClick = () => {
    // Silently notify parent/trigger mutation to transfer state
    onContactClicked()
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow px-4 py-2 transition-colors cursor-pointer"
    >
      <svg
        className="size-4 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.638 1.986 14.162 1.01 11.536 1.01c-5.437 0-9.863 4.373-9.868 9.803-.001 1.73.461 3.42 1.337 4.937L2.012 21.6l6.002-1.573c1.558.85 3.112 1.127 4.633 1.127zm11.367-7.85c-.328-.163-1.94-.945-2.241-1.054-.301-.11-.52-.163-.739.163-.22.329-.85 1.055-1.042 1.274-.192.219-.384.246-.712.082-1.86-.93-2.909-1.66-4.08-3.67-.312-.536.312-.497.893-.657.271-.074.522-.163.676-.328.154-.164.077-.328-.038-.547-.115-.218-.739-1.802-.999-2.457-.253-.614-.522-.53-.739-.54-.192-.008-.411-.01-.63-.01-.22 0-.575.082-.876.411-.301.328-1.15 1.12-1.15 2.73s1.178 3.167 1.342 3.385c.164.22 2.317 3.538 5.613 4.962 1.96.846 2.756.973 3.731.827.6-.09 1.94-.792 2.213-1.558.274-.765.274-1.42.192-1.557-.083-.137-.301-.219-.63-.383z" />
      </svg>
      Contact via WhatsApp
    </a>
  )
}
