import { StrKey } from '@stellar/stellar-sdk'

export type Contact = {
  name: string
  address: string
}

const STORAGE_KEY = 'kitty:contacts'

export function getContacts(): Contact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (c): c is Contact =>
        c && typeof c.name === 'string' && typeof c.address === 'string',
    )
  } catch {
    return []
  }
}

export function saveContact(contact: Contact): void {
  if (!StrKey.isValidEd25519PublicKey(contact.address)) return
  const name = contact.name.trim()
  if (!name) return

  try {
    const existing = getContacts().filter((c) => c.address !== contact.address)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, { name, address: contact.address }]))
  } catch {
    // localStorage unavailable — contacts are a nice-to-have, fail silently.
  }
}

export function removeContact(address: string): void {
  try {
    const remaining = getContacts().filter((c) => c.address !== address)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining))
  } catch {
    // ignore
  }
}

export function findContactByAddress(address: string): Contact | undefined {
  return getContacts().find((c) => c.address === address)
}

export function searchContacts(query: string): Contact[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return getContacts().filter(
    (c) => c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q),
  )
}
