import React, { useRef, useState, useEffect } from 'react'

const REPULSION = 1000
const SPRING_LENGTH = 200
const DAMPING = 0.5

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

const applyForces = (currentNodes, currentLinks, currentWidth, currentHeight) => {
  // 1. Repulsion
  for (let i = 0; i < currentNodes.length; i++) {
    for (let j = i + 1; j < currentNodes.length; j++) {
      const a = currentNodes[i]
      const b = currentNodes[j]
      const d = distance(a, b) || 0.1
      const force = REPULSION / (d * d)
      const dx = (b.x - a.x) / d
      const dy = (b.y - a.y) / d

      a.vx -= dx * force
      a.vy -= dy * force
      b.vx += dx * force
      b.vy += dy * force
    }
  }

  // 2. Attraction (springs)
  currentLinks.forEach(link => {
    const d = distance(link.source, link.target) || 0.1
    const force = (d - SPRING_LENGTH) * 0.05
    const dx = (link.target.x - link.source.x) / d
    const dy = (link.target.y - link.source.y) / d

    link.source.vx += dx * force
    link.source.vy += dy * force
    link.target.vx -= dx * force
    link.target.vy -= dy * force
  })

  // 3. Update positions + gravity + soft bounds
  currentNodes.forEach(node => {
    if (node.fixed) {
      node.vx = 0
      node.vy = 0
      return
    }

    const dx = currentWidth / 2 - node.x
    const dy = currentHeight / 2 - node.y
    node.vx += dx * 0.003
    node.vy += dy * 0.003

    node.x += node.vx
    node.y += node.vy
    node.vx *= DAMPING
    node.vy *= DAMPING

    const padding = 40
    if (node.x < padding) node.vx += 0.5
    if (node.x > currentWidth - padding) node.vx -= 0.5
    if (node.y < padding) node.vy += 0.5
    if (node.y > currentHeight - padding) node.vy -= 0.5
  })
}

export const ForceGraph = ({ nodes, links, width, height }) => {
  const svgRef = useRef(null)
  const [simulation, setSimulation] = useState({ nodes: [], links: [] })
  const [hoveredNode, setHoveredNode] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const nodesRef = useRef([])
  const linksRef = useRef([])
  const draggedNodeRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!nodes.length || !width) return

    nodesRef.current = nodes.map(n => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * 300,
      y: height / 2 + (Math.random() - 0.5) * 300,
      vx: 0,
      vy: 0,
      fixed: false,
    }))

    linksRef.current = links
      .map(l => {
        const sourceNode = nodesRef.current.find(n => n.id === l.source)
        const targetNode = nodesRef.current.find(n => n.id === l.target)
        return { ...l, source: sourceNode, target: targetNode }
      })
      .filter(l => l.source && l.target)

    for (let i = 0; i < 150; i++) {
      applyForces(nodesRef.current, linksRef.current, width, height)
    }

    const tick = () => {
      if (!draggedNodeRef.current) {
        applyForces(nodesRef.current, linksRef.current, width, height)
      } else {
        nodesRef.current.forEach(n => {
          n.vx = 0
          n.vy = 0
        })
      }

      setSimulation({
        nodes: [...nodesRef.current],
        links: [...linksRef.current],
      })

      animationRef.current = requestAnimationFrame(tick)
    }

    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    tick()

    return () => cancelAnimationFrame(animationRef.current)
  }, [nodes, links, width, height])

  useEffect(() => {
    const handleWindowMouseMove = e => {
      if (!draggedNodeRef.current || !svgRef.current) return
      e.preventDefault()

      const CTM = svgRef.current.getScreenCTM()
      if (!CTM) return

      const mouseX = (e.clientX - CTM.e) / CTM.a
      const mouseY = (e.clientY - CTM.f) / CTM.d

      draggedNodeRef.current.x = mouseX
      draggedNodeRef.current.y = mouseY
    }

    const handleWindowMouseUp = () => {
      if (draggedNodeRef.current) {
        draggedNodeRef.current.fixed = true  
        draggedNodeRef.current = null
        setIsDragging(false)
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMouseMove)
      window.addEventListener('mouseup', handleWindowMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mouseup', handleWindowMouseUp)
    }
  }, [isDragging])

  const onNodeMouseDown = (e, node) => {
    e.stopPropagation()
    draggedNodeRef.current = node
    setIsDragging(true)
  }

  if (!simulation.nodes.length) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Physics Engine Starting...
      </div>
    )
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      }`}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="28"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
        </marker>
      </defs>

      {simulation.links.map((link, i) => (
        <g key={`link-${i}`}>
          <line
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            stroke="#475569"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
            opacity="0.6"
          />
          <text
            x={(link.source.x + link.target.x) / 2}
            y={(link.source.y + link.target.y) / 2}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
            className="bg-slate-900 select-none pointer-events-none"
          >
            {link.label}
          </text>
        </g>
      ))}

      {simulation.nodes.map(node => {
        let color = '#3b82f6'
        if (node.type === 'person') color = '#ec4899'
        if (node.type === 'object') color = '#3b82f6'
        if (node.type === 'location') color = '#10b981'
        if (node.type === 'animal') color = '#f59e0b'

        const isHovered = hoveredNode?.id === node.id

        return (
          <g
            key={`node-${node.id}`}
            transform={`translate(${node.x}, ${node.y})`}
            onMouseDown={e => onNodeMouseDown(e, node)}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-grab active:cursor-grabbing transition-opacity duration-75"
            style={{
              zIndex: isHovered ? 100 : 1,
              opacity: hoveredNode && hoveredNode.id !== node.id ? 0.6 : 1,
            }}
          >
            {node.fixed && (
              <circle
                r={isHovered ? 28 : 24}
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeDasharray="4 2"
                opacity="0.5"
              />
            )}
            <circle
              r={isHovered ? 24 : 20}
              fill="#1e293b"
              stroke={color}
              strokeWidth={node.fixed ? 4 : 3}
            />
            <text
              dy=".3em"
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="600"
              pointerEvents="none"
            >
              {node.label.substring(0, 2).toUpperCase()}
            </text>
            <text
              dy="35"
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="11"
              fontWeight="bold"
              className="select-none shadow-black drop-shadow-md pointer-events-none"
            >
              {node.label}
            </text>
            <text
              dy="-28"
              textAnchor="middle"
              fill={color}
              fontSize="9"
              className="uppercase tracking-wider select-none pointer-events-none"
            >
              {node.type}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
