export function getDeviceId() {
  if (typeof window === "undefined") {
    return "";
  }

  let deviceId = localStorage.getItem("xi-tkj-2-device-id");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("xi-tkj-2-device-id", deviceId);
  }

  return deviceId;
}