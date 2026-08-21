#![no_std]

use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone)]
pub struct Score {
    pub payments: u32,
    pub total_paid: i128,
}

#[contracttype]
pub enum DataKey {
    SplitContract,
    Score(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
}

#[contract]
pub struct KittyReputation;

#[contractimpl]
impl KittyReputation {
    /// Set the one contract allowed to report payments (the KittySplit
    /// contract). Can only be called once.
    pub fn initialize(env: Env, split_contract: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::SplitContract) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage()
            .instance()
            .set(&DataKey::SplitContract, &split_contract);
        Ok(())
    }

    /// Record that `payer` settled a share of `amount`. Only callable by the
    /// authorized split contract, which must authorize itself for this call.
    pub fn record_payment(env: Env, split_contract: Address, payer: Address, amount: i128) -> Result<(), Error> {
        split_contract.require_auth();

        let authorized: Address = env
            .storage()
            .instance()
            .get(&DataKey::SplitContract)
            .ok_or(Error::NotInitialized)?;

        if authorized != split_contract {
            return Err(Error::Unauthorized);
        }

        let key = DataKey::Score(payer);
        let mut score = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or(Score { payments: 0, total_paid: 0 });

        score.payments += 1;
        score.total_paid += amount;

        env.storage().persistent().set(&key, &score);

        Ok(())
    }

    /// Read an address's payment reputation.
    pub fn get_score(env: Env, address: Address) -> Score {
        env.storage()
            .persistent()
            .get(&DataKey::Score(address))
            .unwrap_or(Score { payments: 0, total_paid: 0 })
    }
}

mod test;
