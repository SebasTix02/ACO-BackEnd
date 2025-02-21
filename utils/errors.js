class OpenRouteServiceError extends Error {
    constructor(message, originalError = null) {
      super(message);
      this.name = 'OpenRouteServiceError';
      this.originalError = originalError;
    }
  }
  
  module.exports = {
    OpenRouteServiceError
  };