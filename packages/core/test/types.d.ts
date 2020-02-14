declare global {
  namespace jest {
    interface Matchers<R> {
      toThrowOneChainError(code: number): R,
      toBeOneChainError(code: number): R,
    }
  }
}
