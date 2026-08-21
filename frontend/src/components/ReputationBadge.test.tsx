import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReputationBadge } from './ReputationBadge'

describe('ReputationBadge', () => {
  it('shows a loading skeleton while loading', () => {
    const { container } = render(<ReputationBadge score={null} loading={true} />)
    expect(container.querySelector('.skeleton')).toBeInTheDocument()
  })

  it('shows a no-history message for an address with zero payments', () => {
    render(<ReputationBadge score={{ payments: 0, total_paid: 0n }} loading={false} />)
    expect(screen.getByText(/no on-chain payment history yet/i)).toBeInTheDocument()
  })

  it('formats the payment count and total XLM paid', () => {
    render(<ReputationBadge score={{ payments: 3, total_paid: 1500000000n }} loading={false} />)
    expect(screen.getByText(/3 shares paid on time/i)).toBeInTheDocument()
    expect(screen.getByText(/150 XLM/i)).toBeInTheDocument()
  })

  it('uses singular "share" for exactly one payment', () => {
    render(<ReputationBadge score={{ payments: 1, total_paid: 500000000n }} loading={false} />)
    expect(screen.getByText(/1 share paid on time/i)).toBeInTheDocument()
  })
})
