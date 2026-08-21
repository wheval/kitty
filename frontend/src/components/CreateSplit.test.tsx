import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateSplit } from './CreateSplit'

const VALID_ADDRESS_1 = 'GADD25NYDSJQGLESOAE6ID2EURIRYZQJJDR2OZ3L4EDDIUP4F262BCZA'
const VALID_ADDRESS_2 = 'GB4USHWJJM7DJHCVJADMA5OKQPYHNJL2QM7DPNAT43AAODB75KFQRZEO'

describe('CreateSplit', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('disables the submit button until all recipients have a valid address and amount', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(<CreateSplit disabled={false} pending={false} onCreate={onCreate} />)

    const submit = screen.getByRole('button', { name: /create split/i })
    expect(submit).toBeDisabled()

    const addressInputs = screen.getAllByPlaceholderText(/name or address/i)
    const amountInputs = screen.getAllByPlaceholderText('XLM')

    await user.type(addressInputs[0], VALID_ADDRESS_1)
    await user.type(amountInputs[0], '50')
    expect(submit).toBeDisabled() // second recipient still empty

    await user.type(addressInputs[1], VALID_ADDRESS_2)
    await user.type(amountInputs[1], '50')
    expect(submit).toBeEnabled()
  })

  it('does not resolve an address for text that matches no saved contact', async () => {
    const user = userEvent.setup()
    render(<CreateSplit disabled={false} pending={false} onCreate={vi.fn()} />)

    const addressInputs = screen.getAllByPlaceholderText(/name or address/i)
    await user.type(addressInputs[0], 'not-a-real-address-or-contact')

    // Unresolved text shouldn't let the form submit even with an amount.
    const amountInputs = screen.getAllByPlaceholderText('XLM')
    await user.type(amountInputs[0], '50')
    expect(screen.getByRole('button', { name: /create split/i })).toBeDisabled()
  })

  it('calls onCreate with the entered recipients and stroop amounts', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(<CreateSplit disabled={false} pending={false} onCreate={onCreate} />)

    const addressInputs = screen.getAllByPlaceholderText(/name or address/i)
    const amountInputs = screen.getAllByPlaceholderText('XLM')

    await user.type(addressInputs[0], VALID_ADDRESS_1)
    await user.type(amountInputs[0], '50')
    await user.type(addressInputs[1], VALID_ADDRESS_2)
    await user.type(amountInputs[1], '25')

    await user.click(screen.getByRole('button', { name: /create split/i }))

    expect(onCreate).toHaveBeenCalledWith(
      [VALID_ADDRESS_1, VALID_ADDRESS_2],
      [500000000n, 250000000n],
    )
  })

  it('disables submission entirely when the wallet is not connected', () => {
    render(<CreateSplit disabled={true} pending={false} onCreate={vi.fn()} />)
    expect(screen.getByText(/connect your wallet to create a split/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create split/i })).toBeDisabled()
  })
})
