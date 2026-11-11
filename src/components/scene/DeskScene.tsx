import { useEffect, useRef } from 'react'
import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  Group,
  InstancedMesh,
  Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NoBlending,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Raycaster,
  SRGBColorSpace,
  Scene,
  SpotLight,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import type { Theme } from '../../types'
import { projects } from '../../data'
import { markReady } from '../../utils/loadGate'
import { DETECTOR_H, DETECTOR_W, createDetector, paintCodeFrame, paintPortrait, paintQrNote } from './deskScreens'

type Hotspot = 'monitor' | 'laptop' | 'books' | 'frame' | 'portrait' | 'clock' | 'phone' | 'lamp' | 'qr' | 'code'
/** hotspots that open a section of the portfolio (the rest act in place) */
type NavHotspot = Exclude<Hotspot, 'monitor' | 'laptop' | 'lamp' | 'qr' | 'code'>

const GITHUB = 'https://github.com/Hugolelis'
const LEETCODES = 'https://github.com/Hugolelis/leetcodes-study'
// the laptop runs the Person Detector: it opens that project's repo (link lives in data/projects.ts)
const PERSON_DETECTOR = projects.find(p => p.id === 6)?.link ?? GITHUB

interface Props {
  theme: Theme
  labels: Record<Hotspot, string>
  /** called after the camera zooms in on a hotspot */
  onSelect: (id: NavHotspot) => void
  /** clicking the monitor: the portfolio on its screen opens full size */
  onOpenFull: () => void
}

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  draw(ctx)
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  return { tex, ctx, canvas }
}

const mat = (color: number, rough = 0.6, metal = 0) =>
  new MeshStandardMaterial({ color, roughness: rough, metalness: metal })

function box(w: number, h: number, d: number, m: Material, x = 0, y = 0, z = 0) {
  const mesh = new Mesh(new BoxGeometry(w, h, d), m)
  mesh.position.set(x, y, z)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

export default function DeskScene({ theme, labels, onSelect, onOpenFull }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<{ setTheme: (t: Theme) => void } | null>(null)
  const labelsRef = useRef(labels)
  const selectRef = useRef(onSelect)
  const openFullRef = useRef(onOpenFull)

  useEffect(() => {
    labelsRef.current = labels
    selectRef.current = onSelect
    openFullRef.current = onOpenFull
  })

  useEffect(() => {
    const host = hostRef.current!
    const tip = tipRef.current!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return // useDeskMode already probed WebGL; context can still be lost
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFShadowMap
    // the monitor shows the real site: a CSS3D iframe sits *behind* the (transparent) WebGL canvas,
    // and the screen mesh punches a hole in the canvas so it shows through
    const cssRenderer = new CSS3DRenderer()
    Object.assign(cssRenderer.domElement.style, { position: 'absolute', inset: '0', pointerEvents: 'none' })
    host.appendChild(cssRenderer.domElement)
    host.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(38, 1, 0.1, 50)

    // ── lights ──
    const ambient = new AmbientLight(0xffffff, 0.6)
    const key = new DirectionalLight(0xffffff, 1.1)
    key.position.set(-3, 6, 5)
    key.castShadow = true
    key.shadow.mapSize.set(512, 512)
    Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -3 })
    // monitor light bar: a spot from the top of the screen down onto the desk
    const LAMP_ON = 26
    const lampLight = new SpotLight(0xffe0b0, LAMP_ON, 7, 0.95, 0.7, 1.4)
    lampLight.position.set(0, 2.2, -0.4)
    lampLight.target.position.set(0, 0, 0.5)
    const screenGlow = new PointLight(0x7aa2ff, 2.2, 5, 1.8)
    screenGlow.position.set(0, 1.4, 0.4)
    scene.add(ambient, key, lampLight, lampLight.target, screenGlow)

    // ── room ──
    const wallMat = mat(0x1b1b1f, 0.95)
    const floorMat = mat(0x141416, 0.9)
    const deskMat = mat(0x6b4a32, 0.55)
    const wall = new Mesh(new PlaneGeometry(30, 9), wallMat)
    wall.position.set(0, 1.5, -1.7)
    wall.receiveShadow = true
    const floor = new Mesh(new PlaneGeometry(30, 12), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, -2.1, 1)
    floor.receiveShadow = true
    scene.add(wall, floor)

    const desk = box(6.4, 0.14, 2.6, deskMat, 0, -0.07, 0)
    scene.add(desk)
    for (const x of [-3, 3]) scene.add(box(0.14, 2.0, 2.3, mat(0x222226, 0.4, 0.6), x, -1.1, 0))

    // interactive groups
    const groups: Record<Hotspot, Group> = {
      monitor: new Group(), laptop: new Group(), books: new Group(),
      frame: new Group(), portrait: new Group(), clock: new Group(),
      phone: new Group(), lamp: new Group(), qr: new Group(), code: new Group(),
    }
    for (const [id, g] of Object.entries(groups)) {
      g.userData.id = id
      scene.add(g)
    }
    const baseScale = new Map<Group, Vector3>()

    // ── monitor (ultrawide, shows the live portfolio) ──
    const m = groups.monitor
    m.position.set(0, 0, -0.6)
    const black = mat(0x0c0c0e, 0.4, 0.5)
    m.add(box(3.4, 1.45, 0.07, black, 0, 1.35, 0))
    m.add(box(0.14, 0.75, 0.1, black, 0, 0.45, -0.05))
    m.add(box(0.9, 0.04, 0.5, black, 0, 0.02, 0.05))
    const hole = new Mesh(
      new PlaneGeometry(3.28, 1.34),
      new MeshBasicMaterial({ transparent: true, opacity: 0, blending: NoBlending }),
    )
    hole.position.set(0, 1.35, 0.04)
    m.add(hole)
    const FRAME_W = 1280, FRAME_H = Math.round(FRAME_W * (1.34 / 3.28))
    const frame = document.createElement('iframe')
    frame.src = '/portfolio?embed=1'
    frame.title = 'Portfolio'
    frame.tabIndex = -1
    // the monitor shows a loader until the site inside has loaded, then crossfades to it
    const screenEl = document.createElement('div')
    Object.assign(screenEl.style, { position: 'relative', width: `${FRAME_W}px`, height: `${FRAME_H}px`, background: '#0a0a0a', pointerEvents: 'none' })
    Object.assign(frame.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%', border: '0', background: '#0a0a0a',
      opacity: '0', transition: 'opacity 0.7s ease', pointerEvents: 'none',
    })
    const loader = document.createElement('div')
    Object.assign(loader.style, {
      position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    })
    const spinner = document.createElement('div')
    Object.assign(spinner.style, { width: '72px', height: '72px', borderRadius: '50%', border: '6px solid #1e1e1e', borderTopColor: '#e0e0e0' })
    const spin = spinner.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 900, iterations: Infinity })
    loader.append(spinner)
    screenEl.append(loader, frame)
    frame.addEventListener('load', () => {
      markReady('screen')
      frame.style.opacity = '1'
      window.setTimeout(() => { loader.remove(); spin.cancel() }, 750)
    }, { once: true })
    const cssObj = new CSS3DObject(screenEl)
    screenEl.style.pointerEvents = 'none' // CSS3DObject sets 'auto'
    cssObj.position.set(0, 1.35, 0.042)
    cssObj.scale.setScalar(3.28 / FRAME_W)
    m.add(cssObj)

    // ── laptop (runs the person detector → projects) ──
    const l = groups.laptop
    l.position.set(-2.45, 0, 0.55)
    l.rotation.y = 0.25
    const alu = mat(0x9a9aa2, 0.35, 0.8)
    l.add(box(1.5, 0.05, 1.0, alu, 0, 0.025, 0))
    const lid = new Group()
    lid.position.set(0, 0.05, -0.5)
    lid.rotation.x = -0.28
    lid.add(box(1.5, 0.95, 0.04, alu, 0, 0.475, 0))
    const det = canvasTex(DETECTOR_W, DETECTOR_H, () => {})
    const paintDetector = createDetector()
    let detAcc = 1
    const lscreen = new Mesh(new PlaneGeometry(1.4, 0.86), new MeshBasicMaterial({ map: det.tex, toneMapped: false }))
    lscreen.position.set(0, 0.475, 0.025)
    lid.add(lscreen)
    l.add(lid)

    // ── keyboard (black, decor) ──
    const KEYS = 14 * 4
    const keys = new InstancedMesh(new BoxGeometry(0.09, 0.04, 0.09), new MeshStandardMaterial({ color: 0x2c2c32, roughness: 0.5 }), KEYS)
    const dummy = new Object3D()
    for (let i = 0; i < KEYS; i++) {
      dummy.position.set(-0.65 + (i % 14) * 0.1, 0.075, 0.2 + Math.floor(i / 14) * 0.1)
      dummy.updateMatrix()
      keys.setMatrixAt(i, dummy.matrix)
    }
    keys.castShadow = true
    scene.add(box(1.5, 0.05, 0.5, mat(0x1a1a1e, 0.5), 0, 0.025, 0.4), keys)

    // mouse follows pointer a bit
    scene.add(box(0.7, 0.012, 0.58, mat(0x2a2f45, 0.9), 1.2, 0.006, 0.55)) // mousepad
    const mouse = box(0.14, 0.05, 0.22, mat(0x1a1a1e, 0.4), 1.25, 0.037, 0.55)
    scene.add(mouse)

    // ── books (stack) ──
    const b = groups.books
    b.position.set(2.35, 0, -0.35)
    ;[[0xe5484d, 0.7, 0.16], [0x3b82f6, 0.62, 0.14], [0x22c55e, 0.66, 0.15], [0xf5a524, 0.56, 0.13]].forEach(([c, w, h], i, a) => {
      const y = a.slice(0, i).reduce((s, r) => s + r[2], 0) + h / 2
      const bk = box(w, h, 0.5, mat(c, 0.7), (i % 2) * 0.05 - 0.02, y, 0)
      bk.rotation.y = (i - 1.5) * 0.08
      b.add(bk)
    })
    // mug (decor)
    const mug = new Mesh(new CylinderGeometry(0.13, 0.11, 0.26, 24), mat(0xf4f4f5, 0.3))
    mug.position.set(1.8, 0.13, 0.95)
    mug.castShadow = true
    scene.add(mug)

    // ── monitor light bar (toggles light) ──
    const lp = groups.lamp
    lp.position.set(0, 2.075, -0.58) // top edge of the monitor
    const steel = mat(0x15151a, 0.35, 0.6)
    lp.add(box(0.1, 0.12, 0.1, steel, 0, 0.04, -0.03)) // clamp over the back of the panel
    lp.add(box(0.95, 0.07, 0.11, steel, 0, 0.13, 0.07)) // the bar
    const strip = new Mesh(new BoxGeometry(0.9, 0.012, 0.07), new MeshBasicMaterial({ color: 0xffe9c2 }))
    strip.position.set(0, 0.092, 0.07)
    lp.add(strip)
    // generous invisible hit box: the bar itself is thin
    lp.add(new Mesh(new BoxGeometry(1.1, 0.35, 0.4), new MeshBasicMaterial({ visible: false })))
    let lampOn = true

    // ── wall: certificate frame ──
    const f = groups.frame
    f.position.set(-2.4, 2.55, -1.66)
    f.add(box(1.5, 1.05, 0.06, mat(0x2b2118, 0.5), 0, 0, 0))
    const ft = canvasTex(600, 420, (c) => {
      c.fillStyle = '#faf6ec'
      c.fillRect(0, 0, 600, 420)
      c.strokeStyle = '#b8922e'
      c.lineWidth = 8
      c.strokeRect(20, 20, 560, 380)
      c.fillStyle = '#3a3220'
      c.textAlign = 'center'
      c.font = '56px serif'
      c.fillText('Certificate', 300, 150)
      c.fillRect(150, 190, 300, 4)
      c.fillRect(190, 230, 220, 4)
      c.fillRect(220, 270, 160, 4)
      c.fillStyle = '#b8922e'
      c.beginPath()
      c.arc(300, 340, 26, 0, Math.PI * 2)
      c.fill()
    })
    const fplane = new Mesh(new PlaneGeometry(1.36, 0.95), new MeshBasicMaterial({ map: ft.tex, toneMapped: false }))
    fplane.position.z = 0.035
    f.add(fplane)

    // ── wall: clock (timeline, real time) ──
    const c0 = groups.clock
    c0.position.set(2.5, 2.55, -1.66)
    const face = new Mesh(new CylinderGeometry(0.5, 0.5, 0.06, 40), mat(0xf4f4f5, 0.4))
    face.rotation.x = Math.PI / 2
    c0.add(face)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const tick = box(0.025, i % 3 ? 0.06 : 0.11, 0.01, mat(0x18181b), Math.sin(a) * 0.4, Math.cos(a) * 0.4, 0.04)
      tick.rotation.z = -a
      c0.add(tick)
    }
    const hand = (len: number, w: number, color: number) => {
      const pivot = new Group()
      pivot.position.z = 0.05
      const mesh = box(w, len, 0.01, mat(color), 0, len / 2 - 0.04, 0)
      pivot.add(mesh)
      c0.add(pivot)
      return pivot
    }
    const hHour = hand(0.22, 0.04, 0x18181b)
    const hMin = hand(0.33, 0.03, 0x18181b)
    const hSec = hand(0.38, 0.012, 0xe5484d)

    // ── phone (contact) ──
    const p = groups.phone
    p.position.set(-0.95, 0, 1.0)
    p.rotation.y = 0.35
    p.add(box(0.34, 0.03, 0.66, mat(0x0c0c0e, 0.3, 0.6), 0, 0.015, 0))
    const pscreen = new Mesh(new PlaneGeometry(0.3, 0.6), new MeshBasicMaterial({ color: 0x3b82f6 }))
    pscreen.rotation.x = -Math.PI / 2
    pscreen.position.y = 0.032
    p.add(pscreen)

    // LED strip behind the monitor
    const led = new Mesh(new BoxGeometry(3.4, 0.03, 0.02), new MeshBasicMaterial({ color: 0x7c5cff }))
    led.position.set(0, 0.62, -1.62)
    scene.add(led)

    // portrait frame (ASCII portrait from About → about)
    const pt = groups.portrait
    pt.position.set(-3.95, 2.35, -1.66)
    pt.add(box(1.0, 1.35, 0.06, mat(0x2b2118, 0.5), 0, 0, 0))
    const portraitTex = canvasTex(640, 900, c => paintPortrait(c, 640, 900))
    const portraitPlane = new Mesh(new PlaneGeometry(0.88, 1.23), new MeshBasicMaterial({ map: portraitTex.tex, toneMapped: false }))
    portraitPlane.position.z = 0.035
    pt.add(portraitPlane)

    // framed code (→ opens the leetcodes-study repo)
    const code = groups.code
    code.position.set(3.95, 2.3, -1.66)
    code.add(box(1.5, 1.14, 0.06, mat(0x2b2118, 0.5), 0, 0, 0))
    const codeTex = canvasTex(760, 560, c => paintCodeFrame(c, 760, 560))
    const codePlane = new Mesh(new PlaneGeometry(1.36, 1.0), new MeshBasicMaterial({ map: codeTex.tex, toneMapped: false }))
    codePlane.position.z = 0.035
    code.add(codePlane)

    // sticky note with a QR that encodes my GitHub (→ opens it)
    const qrg = groups.qr
    qrg.position.set(-2.2, 1.55, -1.64)
    qrg.rotation.z = 0.05
    const qrTex = canvasTex(256, 300, c => paintQrNote(c, 256, 300, GITHUB, 'github'))
    qrg.add(new Mesh(new PlaneGeometry(0.62, 0.727), new MeshBasicMaterial({ map: qrTex.tex, toneMapped: false })))

    // ── interaction ──
    const interactive = Object.values(groups)
    Object.entries(groups).forEach(([, g]) => baseScale.set(g, g.scale.clone()))
    const FOCUS: Record<Exclude<Hotspot, 'laptop' | 'lamp' | 'qr' | 'code'>, { pos: [number, number, number]; look: [number, number, number] }> = {
      monitor: { pos: [0, 1.4, 5.6], look: [0, 1.35, -0.6] },
      books: { pos: [2.0, 1.3, 5.4], look: [2.35, 0.3, -0.35] },
      frame: { pos: [-1.8, 2.4, 5.9], look: [-2.4, 2.55, -1.66] },
      portrait: { pos: [-3.2, 2.3, 5.9], look: [-3.95, 2.35, -1.66] },
      clock: { pos: [2.0, 2.4, 5.9], look: [2.5, 2.55, -1.66] },
      phone: { pos: [-0.6, 1.6, 5.3], look: [-0.95, 0.05, 1.0] },
    }
    const home = { pos: new Vector3(0, 1.6, 8.4), look: new Vector3(0, 0.9, 0) }
    const goal = { pos: home.pos.clone(), look: home.look.clone() }
    // keep every item in frame whatever the aspect: the wall objects span x ≈ -4.5..4.7 (+margin), so pull the camera
    // back until that fits horizontally, and never closer than the original framing (distance 10.2 ≈ z 8.5): the whole desk
    // and a bit of the floor stay visible
    const TAN = Math.tan((38 / 2) * Math.PI / 180)
    const fitRoom = (aspect: number) => {
      const z = Math.max(6.0 / (TAN * aspect), 10.2) - 1.66 // distance to the wall plane (z = -1.66)
      home.pos.z = z
      if (!busy) goal.pos.z = z
    }
    const camLook = home.look.clone()
    camera.position.copy(home.pos)
    // arriving back from the portfolio: start inside the object we dove into and ease out
    try {
      const from = sessionStorage.getItem('desk-from') as keyof typeof FOCUS | null
      sessionStorage.removeItem('desk-from')
      if (from && FOCUS[from] && !reduced) {
        camera.position.set(...FOCUS[from].pos)
        camLook.set(...FOCUS[from].look)
      }
    } catch { /* ignore */ }
    const pointer = new Vector2(0, 0)
    const ray = new Raycaster()
    let hovered: Group | null = null
    let busy = false
    const timers: number[] = []

    const pick = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect()
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1))
      ray.setFromCamera(pointer, camera)
      const hit = ray.intersectObjects(interactive, true)[0]
      let o: Object3D | null = hit?.object ?? null
      while (o && !o.userData.id) o = o.parent
      return { group: (o as Group | null) ?? null, x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const flyHome = () => { goal.pos.copy(home.pos); goal.look.copy(home.look) }
    const flyTo = (id: keyof typeof FOCUS) => { goal.pos.set(...FOCUS[id].pos); goal.look.set(...FOCUS[id].look) }

    // monitor: the portfolio on the screen opens full size
    const openMonitor = () => {
      busy = true
      tip.style.opacity = '0'
      flyTo('monitor')
      timers.push(
        window.setTimeout(() => openFullRef.current(), reduced ? 0 : 800),
        window.setTimeout(() => { flyHome(); busy = false }, reduced ? 100 : 2200),
      )
    }

    const onMove = (e: PointerEvent) => {
      if (busy) return
      const { group, x, y } = pick(e)
      hovered = group
      renderer.domElement.style.cursor = group ? 'pointer' : 'default'
      tip.style.opacity = group ? '1' : '0'
      if (group) {
        tip.textContent = labelsRef.current[group.userData.id as Hotspot]
        tip.style.transform = `translate(${x + 14}px, ${y + 14}px)`
      }
    }
    const onLeave = () => {
      hovered = null
      tip.style.opacity = '0'
      pointer.set(0, 0)
    }
    const onClick = (e: MouseEvent) => {
      if (busy) return
      const { group } = pick(e as PointerEvent)
      if (!group) return
      const id = group.userData.id as Hotspot
      if (id === 'lamp') { lampOn = !lampOn; return }
      if (id === 'qr') { window.open(GITHUB, '_blank', 'noopener'); return }
      if (id === 'code') { window.open(LEETCODES, '_blank', 'noopener'); return }
      if (id === 'laptop') { window.open(PERSON_DETECTOR, '_blank', 'noopener'); return }
      if (id === 'monitor') { openMonitor(); return }
      busy = true
      tip.style.opacity = '0'
      flyTo(id)
      timers.push(window.setTimeout(() => selectRef.current(id), reduced ? 0 : 800))
      // the phone opens a modal over the room: stay zoomed in until it closes
      if (id === 'phone') awaitingContact = true
      else timers.push(window.setTimeout(() => { flyHome(); busy = false }, reduced ? 100 : 2200))
    }
    let awaitingContact = false
    const onContactClosed = () => {
      if (!awaitingContact) return
      awaitingContact = false
      flyHome()
      busy = false
    }
    window.addEventListener('contact-closed', onContactClosed)
    renderer.domElement.addEventListener('pointermove', onMove)
    renderer.domElement.addEventListener('pointerleave', onLeave)
    renderer.domElement.addEventListener('click', onClick)

    // ── sizing / visibility ──
    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      renderer.setSize(w, h)
      fitRoom(w / h)
      cssRenderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()
    let visible = true
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
    io.observe(host)

    // ── theme ──
    const themes = {
      dark: { wall: 0x1b1b1f, floor: 0x141416, amb: 0.45, key: 0.9 },
      light: { wall: 0xe4e1da, floor: 0xcfc9bd, amb: 0.85, key: 1.1 },
    }
    apiRef.current = {
      setTheme: (t) => {
        const c = themes[t]
        wallMat.color.setHex(c.wall)
        floorMat.color.setHex(c.floor)
        ambient.intensity = c.amb
        key.intensity = c.key
      },
    }

    // ── loop ──
    const clock = new Timer()
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      clock.update()
      const dt = Math.min(clock.getDelta(), 0.1)

      // camera: parallax around home, or damped move to focus
      const k = 1 - Math.exp(-dt * 4)
      const still = busy
      const px = still || reduced ? 0 : pointer.x
      const py = still || reduced ? 0 : pointer.y
      const target = still ? goal.pos : tmpPos.set(goal.pos.x + px * 0.8, goal.pos.y + py * 0.35, goal.pos.z)
      camera.position.lerp(target, k)
      camLook.lerp(goal.look, k)
      camera.lookAt(camLook)

      // hover scale
      for (const g of interactive) {
        const s = baseScale.get(g)!.x * (g === hovered && !busy ? 1.04 : 1)
        g.scale.setScalar(MathUtils.lerp(g.scale.x, s, k))
      }

      // lamp
      lampLight.intensity = MathUtils.lerp(lampLight.intensity, lampOn ? LAMP_ON : 0, k)
      ;(strip.material as MeshBasicMaterial).color.setHex(lampOn ? 0xffe9c2 : 0x2a2a30)

      // laptop: person-detector loop at ~15 fps
      detAcc += dt
      if (detAcc > 1 / 15) {
        paintDetector(det.ctx, detAcc)
        detAcc = 0
        det.tex.needsUpdate = true
      }

      mouse.position.x = 1.25 + pointer.x * 0.12
      mouse.position.z = 0.55 - pointer.y * 0.08

      // real-time clock
      const d = new Date()
      const s = d.getSeconds() + d.getMilliseconds() / 1000
      hSec.rotation.z = -(s / 60) * Math.PI * 2
      hMin.rotation.z = -((d.getMinutes() + s / 60) / 60) * Math.PI * 2
      hHour.rotation.z = -(((d.getHours() % 12) + d.getMinutes() / 60) / 12) * Math.PI * 2

      renderer.render(scene, camera)
      cssRenderer.render(scene, camera)
      markReady('scene') // first frame is on screen (textures uploaded)
    }
    const tmpPos = new Vector3()
    tick()

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      ro.disconnect()
      io.disconnect()
      renderer.domElement.removeEventListener('pointermove', onMove)
      renderer.domElement.removeEventListener('pointerleave', onLeave)
      renderer.domElement.removeEventListener('click', onClick)
      window.removeEventListener('contact-closed', onContactClosed)
      frame.src = 'about:blank'
      cssRenderer.domElement.remove()
      scene.traverse((o) => {
        const mesh = o as Mesh
        mesh.geometry?.dispose()
        const mm = mesh.material as Material | Material[] | undefined
        ;[mm].flat().forEach((x) => {
          if (!x) return
          ;(x as MeshBasicMaterial).map?.dispose()
          x.dispose()
        })
      })
      renderer.dispose()
      renderer.domElement.remove()
      apiRef.current = null
    }
  }, [])

  useEffect(() => {
    apiRef.current?.setTheme(theme)
  }, [theme])

  return (
    <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
      <div
        ref={tipRef}
        style={{
          position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0,
          transition: 'opacity .15s', padding: '4px 10px', borderRadius: 6, zIndex: 2,
          background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', whiteSpace: 'nowrap',
        }}
      />
    </div>
  )
}
