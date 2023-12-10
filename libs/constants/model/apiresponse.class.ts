export default class ApiResponse {
  public successful: boolean;
  public errorMessage?: string;
  public data: object;
  public metadata?: object;

  constructor(data: object, successful = true, errorMessage?, metadata?) {
    this.successful = successful;
    this.data = data;
    this.errorMessage = errorMessage;
    this.metadata = metadata;
    if (!this.successful) {
      console.log('=??' + this.successful);
      console.log(successful);
      // TODO: Debugger check is also required
      console.log(`An Error Occurred: ${errorMessage}`);
      console.log({ metadata });
    }
  }
}
