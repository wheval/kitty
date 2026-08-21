import { describe, expect, it, beforeEach } from 'vitest'
import { getContacts, saveContact, removeContact, findContactByAddress, searchContacts } from './contacts'

const ALICE = 'GADD25NYDSJQGLESOAE6ID2EURIRYZQJJDR2OZ3L4EDDIUP4F262BCZA'
const BOB = 'GB4USHWJJM7DJHCVJADMA5OKQPYHNJL2QM7DPNAT43AAODB75KFQRZEO'

describe('contacts', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts empty', () => {
    expect(getContacts()).toEqual([])
  })

  it('saves and finds a contact by address', () => {
    saveContact({ name: 'Alice', address: ALICE })
    expect(findContactByAddress(ALICE)).toEqual({ name: 'Alice', address: ALICE })
    expect(findContactByAddress(BOB)).toBeUndefined()
  })

  it('refuses to save a contact with an invalid address', () => {
    saveContact({ name: 'Bad', address: 'not-a-real-address' })
    expect(getContacts()).toEqual([])
  })

  it('overwrites the name when saving an address that already has a contact', () => {
    saveContact({ name: 'Alice', address: ALICE })
    saveContact({ name: 'Alice Smith', address: ALICE })
    expect(getContacts()).toEqual([{ name: 'Alice Smith', address: ALICE }])
  })

  it('removes a contact by address', () => {
    saveContact({ name: 'Alice', address: ALICE })
    saveContact({ name: 'Bob', address: BOB })
    removeContact(ALICE)
    expect(getContacts()).toEqual([{ name: 'Bob', address: BOB }])
  })

  it('searches contacts by name or address, case-insensitively', () => {
    saveContact({ name: 'Alice', address: ALICE })
    saveContact({ name: 'Bob', address: BOB })

    expect(searchContacts('ali')).toEqual([{ name: 'Alice', address: ALICE }])
    expect(searchContacts('BOB')).toEqual([{ name: 'Bob', address: BOB }])
    expect(searchContacts(ALICE.slice(0, 6))).toEqual([{ name: 'Alice', address: ALICE }])
    expect(searchContacts('nobody')).toEqual([])
  })
})
