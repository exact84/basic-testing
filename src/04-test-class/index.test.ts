import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  let account: BankAccount;
  beforeEach(() => {
    account = getBankAccount(100);
  });

  test('should create account with initial balance', () => {
    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account2 = getBankAccount(0);
    expect(() => account.transfer(200, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(200, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    expect(account.deposit(200)).toBe(account);
    expect(account.getBalance()).toBe(300);
  });

  test('should withdraw money', () => {
    expect(account.withdraw(20)).toBe(account);
    expect(account.getBalance()).toBe(80);
  });

  test('should transfer money', () => {
    const account2 = getBankAccount(0);
    expect(account.transfer(20, account2)).toBe(account);
    expect(account.getBalance()).toBe(80);
    expect(account2.getBalance()).toBe(20);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(55);
    const result = await account.fetchBalance();
    expect(result).toBe(55);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(77);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(77);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      new SynchronizationFailedError(),
    );
  });
});
