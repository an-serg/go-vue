import FingerprintJS from '@fingerprintjs/fingerprintjs'

export async function getFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load()
  const { visitorId } = await fp.get()
  localStorage.setItem('fingerprint', visitorId)
  return visitorId
}
