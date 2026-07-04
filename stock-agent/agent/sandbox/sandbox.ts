import { defineSandbox } from "eve/sandbox";

export default defineSandbox({
  async bootstrap({ use }) {
    const sandbox = await use();
    await sandbox.run({ command: "pip install numpy scipy matplotlib pandas 2>&1 || (apt-get update && apt-get install -y python3-numpy python3-scipy python3-matplotlib python3-pandas 2>&1)" });
  },
});
