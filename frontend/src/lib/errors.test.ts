import { describe, expect, it } from 'vitest'
import { classifyError } from './errors'

describe('classifyError', () => {
  it('classifies a wallet-not-installed error', () => {
    const result = classifyError(new Error('Freighter is not installed'))
    expect(result.type).toBe('wallet_not_found')
  })

  it('classifies a user-rejected error', () => {
    const result = classifyError(new Error('User rejected the request'))
    expect(result.type).toBe('rejected')
  })

  it('classifies a modal-closed error as rejected', () => {
    const result = classifyError(new Error('User closed the modal'))
    expect(result.type).toBe('rejected')
  })

  it('classifies an insufficient-balance error', () => {
    const result = classifyError(new Error('tx_insufficient_balance'))
    expect(result.type).toBe('insufficient_balance')
  })

  it('extracts a message from a plain object error shape (not an Error instance)', () => {
    const result = classifyError({ code: -4, message: 'User declined access' })
    expect(result.type).toBe('rejected')
    expect(result.message).not.toBe('[object Object]')
  })

  it('falls back to unknown for unrecognized errors', () => {
    const result = classifyError(new Error('some totally unexpected failure'))
    expect(result.type).toBe('unknown')
    expect(result.message).toContain('unexpected failure')
  })

  it('never returns "[object Object]" for a bare object with no message', () => {
    const result = classifyError({ foo: 'bar' })
    expect(result.message).not.toBe('[object Object]')
  })
})
