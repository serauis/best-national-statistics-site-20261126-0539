// NusaStat charts: hand-rolled SVG line, bar and donut charts.
// No library, no canvas, no network — every chart is a string of SVG
// built from the numbers in data.js / provinces.js.

window.NUSA_CHARTS = (function () {
  var NS = 'http://www.w3.org/2000/svg';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function svgOpen(w, h, label) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + esc(label) + '" xmlns="' + NS + '">';
  }

  // Line chart: points = [{y, v}], with value labels and a zero line.
  function lineChart(points, opts) {
    opts = opts || {};
    var w = opts.w || 640, h = opts.h || 260, padL = 46, padR = 14, padT = 18, padB = 30;
    var vals = points.map(function (p) { return p.v; });
    var min = Math.min.apply(null, vals.concat([0]));
    var max = Math.max.apply(null, vals);
    if (max === min) max = min + 1;
    var iw = w - padL - padR, ih = h - padT - padB;
    function X(i) { return padL + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw); }
    function Y(v) { return padT + ih - ((v - min) / (max - min)) * ih; }
    var s = svgOpen(w, h, opts.label || 'Grafik garis');
    s += '<line x1="' + padL + '" y1="' + Y(0) + '" x2="' + (w - padR) + '" y2="' + Y(0) + '" stroke="#94a3b8" stroke-width="1"/>';
    // gridlines at min / mid / max
    [min, (min + max) / 2, max].forEach(function (g) {
      s += '<line x1="' + padL + '" y1="' + Y(g) + '" x2="' + (w - padR) + '" y2="' + Y(g) + '" stroke="#e2e8f0" stroke-width="1"/>';
      s += '<text x="' + (padL - 6) + '" y="' + (Y(g) + 4) + '" text-anchor="end" font-size="11" fill="#64748b">' + fmtAxis(g) + '</text>';
    });
    var d = points.map(function (p, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' ');
    s += '<path d="' + d + '" fill="none" stroke="' + (opts.color || '#0f766e') + '" stroke-width="2.5" stroke-linejoin="round"/>';
    points.forEach(function (p, i) {
      s += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="3.5" fill="#fff" stroke="' + (opts.color || '#0f766e') + '" stroke-width="2"/>';
      s += '<text x="' + X(i).toFixed(1) + '" y="' + (Y(p.v) - 9).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">' + fmtAxis(p.v) + '</text>';
      s += '<text x="' + X(i).toFixed(1) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="11" fill="#64748b">' + p.y + '</text>';
    });
    return s + '</svg>';
  }
  function fmtAxis(v) {
    return (Math.abs(v) < 10 ? v.toFixed(2) : v.toFixed(0)).replace('.', ',');
  }

  // Horizontal bar chart: rows = [{name, v, suffix}].
  function barChart(rows, opts) {
    opts = opts || {};
    var w = opts.w || 640, rowH = opts.rowH || 34, padL = 150, padR = 56, padT = 8;
    var h = padT + rows.length * rowH + 8;
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; }));
    var s = svgOpen(w, h, opts.label || 'Grafik batang');
    rows.forEach(function (r, i) {
      var y = padT + i * rowH;
      var bw = Math.max(2, ((w - padL - padR) * r.v) / max);
      s += '<text x="' + (padL - 10) + '" y="' + (y + 17) + '" text-anchor="end" font-size="12" fill="#334155">' + esc(r.name) + '</text>';
      s += '<rect x="' + padL + '" y="' + (y + 4) + '" width="' + bw.toFixed(1) + '" height="18" rx="4" fill="' + (r.color || '#0f766e') + '"/>';
      s += '<text x="' + (padL + bw + 8).toFixed(1) + '" y="' + (y + 18) + '" font-size="12" font-weight="700" fill="#0f172a">' + esc(r.label) + '</text>';
    });
    return s + '</svg>';
  }

  // Vertical bar chart for a short series (e.g. age structure).
  function columnChart(rows, opts) {
    opts = opts || {};
    var w = opts.w || 640, h = opts.h || 240, padB = 44, padT = 26;
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; }));
    var bw = Math.min(64, (w / rows.length) * 0.55);
    var s = svgOpen(w, h, opts.label || 'Grafik kolom');
    rows.forEach(function (r, i) {
      var cx = (w / rows.length) * (i + 0.5);
      var bh = ((h - padB - padT) * r.v) / max;
      s += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + (h - padB - bh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="4" fill="' + (r.color || '#0f766e') + '"/>';
      s += '<text x="' + cx.toFixed(1) + '" y="' + (h - padB - bh - 8).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#0f172a">' + esc(r.label) + '</text>';
      s += '<text x="' + cx.toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="#64748b">' + esc(r.name) + '</text>';
    });
    return s + '</svg>';
  }

  // Donut: parts = [{name, pct, color}]; legend printed beside it by caller.
  function donut(parts, opts) {
    opts = opts || {};
    var size = opts.size || 200, r = 78, cx = size / 2, cy = size / 2;
    var total = parts.reduce(function (a, p) { return a + p.pct; }, 0);
    var s = svgOpen(size, size, opts.label || 'Grafik donat');
    var start = -Math.PI / 2;
    parts.forEach(function (p) {
      var frac = p.pct / total;
      var a0 = start, a1 = start + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      s += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '" fill="none" stroke="' + p.color + '" stroke-width="26"/>';
      start = a1;
    });
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="62" fill="#fff"/>';
    s += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="26" font-weight="800" fill="#0f172a">' + esc(opts.center || '') + '</text>';
    s += '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="12" fill="#64748b">' + esc(opts.centerSub || '') + '</text>';
    return s + '</svg>';
  }

  return { lineChart: lineChart, barChart: barChart, columnChart: columnChart, donut: donut, esc: esc };
})();
