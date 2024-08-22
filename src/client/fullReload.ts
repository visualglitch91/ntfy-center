export default function fullReload() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      Promise.all(
        registrations.map((registration) => registration.unregister())
      ).finally(() => window.location.reload());
    });
  } else {
    console.warn("Service workers are not supported in this browser.");
    window.location.reload();
  }
}
