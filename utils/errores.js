class ErroresServicioOpenRoute extends Error {
    constructor(message, originalError = null) {
      super(message);
      this.name = 'ErroresServicioOpenRoute';
      this.originalError = originalError;
    }
  }
  
  module.exports = {
    ErroresServicioOpenRoute
  };