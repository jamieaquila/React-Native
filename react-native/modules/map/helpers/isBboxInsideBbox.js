export default function isBboxInsideBbox(bbox, {s, w, n, e}) {
  return bbox.n <= n && bbox.s >= s && bbox.e <= e && bbox.w >= w
}
