// Lightweight inline SVG charts for the TechyFuel OS kit (data viz, not icons).

function AreaLine({
  data,
  width = 520,
  height = 160,
  color = 'var(--blue-600)',
  fill = 'rgba(37,99,235,0.10)',
  id = 'al'
}) {
  const max = Math.max(...data) * 1.15,
    min = Math.min(...data) * 0.85;
  const pad = 6;
  const x = i => pad + i * (width - pad * 2) / (data.length - 1);
  const y = v => height - pad - (v - min) / (max - min) * (height - pad * 2);
  const pts = data.map((v, i) => [x(i), y(v)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1)} ${height - pad} L${x(0)} ${height - pad} Z`;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: id,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.18"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), [0.25, 0.5, 0.75, 1].map(g => /*#__PURE__*/React.createElement("line", {
    key: g,
    x1: "0",
    x2: width,
    y1: height * g,
    y2: height * g,
    stroke: "var(--slate-150)",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: `url(#${id})`
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.map((p, i) => i === pts.length - 1 ? /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p[0],
    cy: p[1],
    r: "4",
    fill: color,
    stroke: "#fff",
    strokeWidth: "2"
  }) : null));
}
function Bars({
  data,
  labels,
  width = 520,
  height = 160,
  color = 'var(--blue-500)',
  highlight = 'var(--blue-600)'
}) {
  const max = Math.max(...data) * 1.1 || 1,
    pad = 6,
    gap = 10;
  const bw = (width - pad * 2 - gap * (data.length - 1)) / data.length;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    style: {
      display: 'block'
    }
  }, [0.33, 0.66, 1].map(g => /*#__PURE__*/React.createElement("line", {
    key: g,
    x1: "0",
    x2: width,
    y1: height - 20 - (height - 30) * g,
    y2: height - 20 - (height - 30) * g,
    stroke: "var(--slate-150)"
  })), data.map((v, i) => {
    const h = v / max * (height - 30);
    const x = pad + i * (bw + gap);
    const last = i === data.length - 1;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: x,
      y: height - 20 - h,
      width: bw,
      height: h,
      rx: "4",
      fill: last ? highlight : color,
      opacity: last ? 1 : 0.5
    }), labels && /*#__PURE__*/React.createElement("text", {
      x: x + bw / 2,
      y: height - 5,
      textAnchor: "middle",
      fontSize: "10",
      fill: "var(--text-subtle)",
      fontFamily: "var(--font-sans)"
    }, labels[i]));
  }));
}
function Donut({
  segments,
  size = 150,
  thickness = 22
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2,
    c = 2 * Math.PI * r;
  let offset = 0;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--slate-100)",
    strokeWidth: thickness
  }), segments.map((s, i) => {
    const len = s.value / total * c;
    const el = /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: size / 2,
      cy: size / 2,
      r: r,
      fill: "none",
      stroke: s.color,
      strokeWidth: thickness,
      strokeDasharray: `${len} ${c - len}`,
      strokeDashoffset: -offset,
      strokeLinecap: "round",
      transform: `rotate(-90 ${size / 2} ${size / 2})`
    });
    offset += len;
    return el;
  }), /*#__PURE__*/React.createElement("text", {
    x: size / 2,
    y: size / 2 - 4,
    textAnchor: "middle",
    fontSize: "26",
    fontWeight: "800",
    fill: "var(--text-strong)",
    fontFamily: "var(--font-display)"
  }, total), /*#__PURE__*/React.createElement("text", {
    x: size / 2,
    y: size / 2 + 16,
    textAnchor: "middle",
    fontSize: "11",
    fill: "var(--text-muted)",
    fontFamily: "var(--font-sans)"
  }, "projects"));
}
function Spark({
  data,
  width = 100,
  height = 32,
  color = 'var(--green-500)'
}) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const x = i => i * width / (data.length - 1);
  const y = v => height - (v - min) / (max - min || 1) * height;
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    height: height,
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
Object.assign(window, {
  AreaLine,
  Bars,
  Donut,
  Spark
});