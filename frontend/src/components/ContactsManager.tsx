import { useEffect, useState } from 'react'
import { StrKey } from '@stellar/stellar-sdk'
import { getContacts, saveContact, removeContact, type Contact } from '../lib/contacts'

export function ContactsManager() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    setContacts(getContacts())
  }, [])

  const addressValid = address.trim().length === 0 || StrKey.isValidEd25519PublicKey(address.trim())
  const canAdd = name.trim().length > 0 && StrKey.isValidEd25519PublicKey(address.trim())

  const handleAdd = () => {
    if (!canAdd) return
    saveContact({ name: name.trim(), address: address.trim() })
    setContacts(getContacts())
    setName('')
    setAddress('')
  }

  const handleRemove = (addr: string) => {
    removeContact(addr)
    setContacts(getContacts())
  }

  return (
    <div className="card">
      <label>Saved contacts</label>
      <p className="muted" style={{ marginTop: 0, fontSize: '0.85rem' }}>
        Save a friend's address once, then split to their name instead of pasting it every time.
      </p>

      {contacts.map((c) => (
        <div className="recipient-item" key={c.address}>
          <span>
            <strong>{c.name}</strong>{' '}
            <span className="mono muted">
              {c.address.slice(0, 4)}...{c.address.slice(-4)}
            </span>
          </span>
          <button
            className="btn-secondary btn-small"
            onClick={() => handleRemove(c.address)}
            type="button"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="recipient-row" style={{ marginTop: contacts.length > 0 ? 12 : 0 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: '0 1 140px' }}
        />
        <input
          placeholder="Address (G...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="btn-secondary btn-small" onClick={handleAdd} disabled={!canAdd} type="button">
          Add
        </button>
      </div>
      {!addressValid && <p className="error">Invalid Stellar address</p>}
    </div>
  )
}
