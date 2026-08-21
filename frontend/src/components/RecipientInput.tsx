import { useEffect, useRef, useState } from 'react'
import { StrKey } from '@stellar/stellar-sdk'
import { searchContacts, saveContact, findContactByAddress, type Contact } from '../lib/contacts'

type RecipientInputProps = {
  address: string
  onAddressChange: (address: string) => void
}

export function RecipientInput({ address, onAddressChange }: RecipientInputProps) {
  const known = address ? findContactByAddress(address) : undefined
  const [text, setText] = useState(known?.name ?? address)
  const [matches, setMatches] = useState<Contact[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [savingName, setSavingName] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keep the displayed text in sync if the address is set/cleared from outside
  // (e.g. the row is reset) without clobbering what the user is actively typing.
  useEffect(() => {
    if (address === '') setText('')
  }, [address])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleTextChange = (value: string) => {
    setText(value)
    setSavingName(null)

    const trimmed = value.trim()

    if (StrKey.isValidEd25519PublicKey(trimmed)) {
      onAddressChange(trimmed)
      setShowDropdown(false)
      return
    }

    onAddressChange('')

    if (trimmed.length > 0) {
      setMatches(searchContacts(trimmed))
      setShowDropdown(true)
    } else {
      setMatches([])
      setShowDropdown(false)
    }
  }

  const pickContact = (contact: Contact) => {
    setText(contact.name)
    onAddressChange(contact.address)
    setShowDropdown(false)
    setMatches([])
  }

  const isNewAddress =
    StrKey.isValidEd25519PublicKey(text.trim()) && !findContactByAddress(text.trim())

  const handleSaveContact = () => {
    if (!savingName || !savingName.trim()) return
    saveContact({ name: savingName.trim(), address: text.trim() })
    setText(savingName.trim())
    setSavingName(null)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', flex: '1 1 160px', minWidth: 0 }}>
      <input
        placeholder="Name or address (G...)"
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        onFocus={() => {
          if (text.trim() && !StrKey.isValidEd25519PublicKey(text.trim())) {
            setMatches(searchContacts(text.trim()))
            setShowDropdown(true)
          }
        }}
      />

      {showDropdown && matches.length > 0 && (
        <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, padding: 6, marginTop: 4, marginBottom: 0 }}>
          {matches.map((c) => (
            <button
              key={c.address}
              type="button"
              className="btn-secondary btn-small"
              style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 4 }}
              onClick={() => pickContact(c)}
            >
              <strong>{c.name}</strong>{' '}
              <span className="mono muted">
                {c.address.slice(0, 4)}...{c.address.slice(-4)}
              </span>
            </button>
          ))}
        </div>
      )}

      {isNewAddress && savingName === null && (
        <button
          type="button"
          className="btn-secondary btn-small"
          style={{ marginTop: 6 }}
          onClick={() => setSavingName('')}
        >
          + Save as contact
        </button>
      )}

      {isNewAddress && savingName !== null && (
        <div className="recipient-row" style={{ marginTop: 6, marginBottom: 0 }}>
          <input
            placeholder="Name (e.g. Alice)"
            value={savingName}
            onChange={(e) => setSavingName(e.target.value)}
            autoFocus
          />
          <button type="button" className="btn-secondary btn-small" onClick={handleSaveContact}>
            Save
          </button>
        </div>
      )}
    </div>
  )
}
