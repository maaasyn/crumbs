export const globalHashDictionary = new Map<string, string>();
export const hashMediator = {
  getHash: async (hash: string): Promise<string | null> => {
    return globalHashDictionary.get(hash) ?? null;
  },
  setHash: async (hash: string, value: string) => {
    globalHashDictionary.set(hash, value);
  },
};
