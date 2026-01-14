export const SFNClient = jest.fn(() => ({
  send: jest.fn().mockResolvedValue(true),
}));

export const SendTaskSuccessCommand = jest.fn();
export const SendTaskFailureCommand = jest.fn();
