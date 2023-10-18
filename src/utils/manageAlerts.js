const manageAlerts = (setAlertFn, message, timeout = 5000) => {
  setAlertFn(message);
  window.scrollTo({top: 0, behavior: 'smooth'});
  setTimeout(() => {
    setAlertFn(null);
  }, timeout);
};

export default manageAlerts;
