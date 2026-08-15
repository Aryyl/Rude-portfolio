"use client"

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    type CSSProperties,
} from "react"

interface VideoSlide {
    src: string
    title: string
}

const VIDEOS: VideoSlide[] = [
    { src: "/gallery/If i can u can too..POST IT.mp4",                        title: "If I Can, U Can Too" },
    { src: "/gallery/Pitai is important.Flame Kaiser being my fav one..mp4",  title: "Pitai Is Important"  },
    { src: "/gallery/The break is over..mp4",                                  title: "The Break Is Over"   },
    { src: "/gallery/Totally random..mp4",                                     title: "Totally Random"      },
]

const PERSPECTIVE = 1600
const SCALE_STEP  = 0.16
const MAX_VISIBLE = 2
const DEPTH       = 240

function cssTransition(t: any): { dur: number; ease: string } {
    const dur = t && typeof t.duration === "number" ? t.duration : 0.6
    const e   = t?.ease
    let ease = "cubic-bezier(0.22, 1, 0.36, 1)"
    if (Array.isArray(e) && e.length === 4) ease = `cubic-bezier(${e[0]},${e[1]},${e[2]},${e[3]})`
    return { dur, ease }
}

export default function CoverflowGallery() {
    const cardWidth  = 800
    const cardHeight = 450
    const tilt       = 12
    const sideTilt   = 8
    const gap        = 12
    const dim        = 0.55   // (1 - opacity/100) pre-computed
    const dur        = 0.6
    const ease       = "cubic-bezier(0.22, 1, 0.36, 1)"
    const effectiveRadius = 24

    const list = VIDEOS
    const n    = list.length

    const [active,         setActive        ] = useState(0)
    const [modalActiveIdx, setModalActiveIdx] = useState<number | null>(null)

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
    const lockRef   = useRef(false)

    const lock = useCallback(() => {
        lockRef.current = true
        window.setTimeout(() => { lockRef.current = false }, Math.max(50, dur * 1000))
    }, [])

    const step = useCallback((dir: number) => {
        if (lockRef.current) return
        lock()
        setActive(a => (((a + dir) % n) + n) % n)
    }, [n, lock])

    const handleCardClick = useCallback((i: number) => {
        if (lockRef.current) return
        if (i === active) {
            setModalActiveIdx(i)
        } else {
            lock()
            setActive(i)
        }
    }, [active, lock])

    const onKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight") { e.preventDefault(); step(1)  }
        if (e.key === "ArrowLeft")  { e.preventDefault(); step(-1) }
    }, [step])

    // Only play the active video — pause everything else
    useEffect(() => {
        videoRefs.current.forEach((v, i) => {
            if (!v) return
            if (i === active) {
                v.play().catch(() => {})
            } else {
                v.pause()
            }
        })
    }, [active])

    const closeModal = useCallback(() => setModalActiveIdx(null), [])
    useEffect(() => {
        if (modalActiveIdx === null) return
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [modalActiveIdx, closeModal])

    const transitionCss = `transform ${dur}s ${ease}, opacity ${dur}s ${ease}`

    return (
        <>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    minWidth: 320,
                    minHeight: 360,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    perspective: `${PERSPECTIVE}px`,
                    overflow: "hidden",
                    outline: "none",
                    contain: "layout style",
                }}
                tabIndex={0}
                role="group"
                aria-roledescription="carousel"
                onKeyDown={onKeyDown}
            >
                <div style={{ position: "relative", width: cardWidth, height: cardHeight, transformStyle: "preserve-3d" }}>
                    {list.map((slide, i) => {
                        let rel = i - active
                        if (rel >  n / 2) rel -= n
                        if (rel < -n / 2) rel += n
                        const ax       = Math.abs(rel)
                        const visible  = ax <= MAX_VISIBLE
                        const isActive = rel === 0
                        const sc = Math.max(0.4, 1 - ax * SCALE_STEP)
                        const tx = rel * (gap * 30)
                        const tz = -ax * DEPTH
                        const ry = -rel * tilt
                        const rz =  rel * sideTilt

                        return (
                            <div
                                key={i}
                                aria-label={slide.title}
                                aria-hidden={!visible}
                                onClick={() => handleCardClick(i)}
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    width: cardWidth,
                                    height: cardHeight,
                                    borderRadius: effectiveRadius,
                                    overflow: "hidden",
                                    transformStyle: "preserve-3d",
                                    transformOrigin: "center center",
                                    transform: `translate(-50%,-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
                                    transition: transitionCss,
                                    opacity: visible ? 1 : 0,
                                    cursor: "pointer",
                                    pointerEvents: visible ? "auto" : "none",
                                    backgroundColor: "#111",
                                    boxShadow: isActive ? "0 20px 60px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.4)",
                                    willChange: "transform, opacity",
                                }}
                            >
                                <video
                                    ref={el => { videoRefs.current[i] = el }}
                                    src={`${slide.src}#t=0.1`}
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />

                                {/* Dim overlay */}
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "#000",
                                    opacity: isActive ? 0 : dim,
                                    transition: `opacity ${dur}s ${ease}`,
                                    pointerEvents: "none",
                                }} />

                                {/* Active play-hint ring */}
                                {isActive && (
                                    <div style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%,-50%)",
                                        width: 64,
                                        height: 64,
                                        borderRadius: "50%",
                                        background: "rgba(0,0,0,0.2)",
                                        border: "1px solid rgba(255,255,255,0.4)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backdropFilter: "blur(8px)",
                                        pointerEvents: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 16 16" fill="white" style={{ marginLeft: "4px" }}>
                                            <path d="M4 3l9 5-9 5V3z"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Active Title Display */}
                <div style={{
                    position: "absolute",
                    bottom: "6%",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    pointerEvents: "none",
                    zIndex: 10,
                }}>
                    <h3 style={{
                        color: "#fff",
                        fontFamily: "monospace",
                        fontSize: 13,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                        margin: 0,
                        opacity: 0.9,
                    }}>
                        {list[active]?.title}
                    </h3>
                </div>
            </div>

            {/* Full-screen modal */}
            {modalActiveIdx !== null && (
                <div
                    onClick={closeModal}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "rgba(0,0,0,0.92)",
                        backdropFilter: "blur(16px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{ position: "relative", maxWidth: "92vw", maxHeight: "82vh" }}
                    >
                        <video
                            key={modalActiveIdx}
                            src={list[modalActiveIdx].src}
                            controls
                            autoPlay
                            playsInline
                            style={{
                                display: "block",
                                maxWidth: "92vw",
                                maxHeight: "82vh",
                                width: "auto",
                                height: "auto",
                                borderRadius: 10,
                                boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
                                background: "#000",
                            }}
                        />
                    </div>
                    <p style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "monospace",
                        fontSize: 11,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                    }}>{list[modalActiveIdx].title}</p>
                    <button
                        onClick={closeModal}
                        aria-label="Close"
                        style={{
                            position: "fixed",
                            top: 24,
                            right: 28,
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "50%",
                            width: 42,
                            height: 42,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                            <path d="M3 3l10 10M13 3L3 13"/>
                        </svg>
                    </button>
                </div>
            )}
        </>
    )
}