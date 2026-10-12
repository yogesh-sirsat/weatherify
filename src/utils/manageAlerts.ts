export default function manageAlerts(
  setAlert: (message: string) => void,
  message: string,
  timeout: number = 5000
): void {
  setAlert(message);
  setTimeout(() => {
    setAlert("");
  }, timeout);
}
