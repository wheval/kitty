#![cfg(test)]

use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::Env;

#[test]
fn test_record_and_read_score() {
    let env = Env::default();
    env.mock_all_auths();

    let split_contract_id = env.register(KittyReputation, ());
    let client = KittyReputationClient::new(&env, &split_contract_id);

    let split_contract = Address::generate(&env);
    let payer = Address::generate(&env);

    client.initialize(&split_contract);

    let score = client.get_score(&payer);
    assert_eq!(score.payments, 0);
    assert_eq!(score.total_paid, 0);

    client.record_payment(&split_contract, &payer, &100_0000000i128);
    client.record_payment(&split_contract, &payer, &50_0000000i128);

    let score = client.get_score(&payer);
    assert_eq!(score.payments, 2);
    assert_eq!(score.total_paid, 150_0000000);
}

#[test]
fn test_record_payment_rejects_unauthorized_caller() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(KittyReputation, ());
    let client = KittyReputationClient::new(&env, &contract_id);

    let split_contract = Address::generate(&env);
    let impostor = Address::generate(&env);
    let payer = Address::generate(&env);

    client.initialize(&split_contract);

    let result = client.try_record_payment(&impostor, &payer, &100_0000000i128);
    assert_eq!(result, Err(Ok(Error::Unauthorized)));
}

#[test]
fn test_double_initialize_fails() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(KittyReputation, ());
    let client = KittyReputationClient::new(&env, &contract_id);

    let split_contract = Address::generate(&env);
    client.initialize(&split_contract);

    let result = client.try_initialize(&split_contract);
    assert_eq!(result, Err(Ok(Error::AlreadyInitialized)));
}
