class EmailValidator {
  private static readonly tester: RegExp = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  static vaildate(email: string): boolean {
    if (
      email.length === 0 ||
      email.length > 256 ||
      this.tester.test(email) === false
    ) {
      return false;
    }
    // Further checking of some things regex can't handle
    const [account, address] = email.split("@");
    if (account.length > 64) return false;

    const domainParts = address.split(".");
    if (
      domainParts.some((part: string): boolean => {
        return part.length > 63;
      })
    ) {
      return false;
    }

    return true;
  }
}

export default EmailValidator;
