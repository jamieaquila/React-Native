export default function isInsideBbox({lat, lon}, {s, w, n, e}) {
  return lat <= n && lat >= s && lon <= e && lon >= w
}
