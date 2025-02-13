﻿/*
 Highcharts JS v7.0.1 (2018-12-19)
 Data module

 (c) 2012-2018 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (q) {
    "object" === typeof module && module.exports ? module.exports = q : "function" === typeof define && define.amd ? define(function () {
        return q
    }) : q("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (q) {
    (function (h) {
        h.ajax = function (q) {
            var n = h.merge(!0, {
                url: !1,
                type: "GET",
                dataType: "json",
                success: !1,
                error: !1,
                data: !1,
                headers: {}
            }, q);
            q = {
                json: "application/json",
                xml: "application/xml",
                text: "text/plain",
                octet: "application/octet-stream"
            };
            var p = new XMLHttpRequest;
            if (!n.url) return !1;
            p.open(n.type.toUpperCase(),
                n.url, !0);
            p.setRequestHeader("Content-Type", q[n.dataType] || q.text);
            h.objectEach(n.headers, function (h, n) {
                p.setRequestHeader(n, h)
            });
            p.onreadystatechange = function () {
                var h;
                if (4 === p.readyState) {
                    if (200 === p.status) {
                        h = p.responseText;
                        if ("json" === n.dataType) try {
                            h = JSON.parse(h)
                        } catch (C) {
                            n.error && n.error(p, C);
                            return
                        }
                        return n.success && n.success(h)
                    }
                    n.error && n.error(p, p.responseText)
                }
            };
            try {
                n.data = JSON.stringify(n.data)
            } catch (D) {
            }
            p.send(n.data || !0)
        }
    })(q);
    (function (h) {
        var q = h.addEvent, n = h.Chart, p = h.win.document, D =
                h.objectEach, C = h.pick, E = h.isNumber, y = h.merge, G = h.splat, H = h.fireEvent, w,
            z = function (a, b, c) {
                this.init(a, b, c)
            };
        h.extend(z.prototype, {
            init: function (a, b, c) {
                var f = a.decimalPoint, e;
                b && (this.chartOptions = b);
                c && (this.chart = c);
                "." !== f && "," !== f && (f = void 0);
                this.options = a;
                this.columns = a.columns || this.rowsToColumns(a.rows) || [];
                this.firstRowAsNames = C(a.firstRowAsNames, this.firstRowAsNames, !0);
                this.decimalRegex = f && new RegExp("^(-?[0-9]+)" + f + "([0-9]+)$");
                this.rawColumns = [];
                this.columns.length && (this.dataFound(), e =
                    !0);
                e || (e = this.fetchLiveData());
                e || (e = !!this.parseCSV().length);
                e || (e = !!this.parseTable().length);
                e || (e = this.parseGoogleSpreadsheet());
                !e && a.afterComplete && a.afterComplete()
            }, getColumnDistribution: function () {
                var a = this.chartOptions, b = this.options, c = [], f = function (a) {
                        return (h.seriesTypes[a || "line"].prototype.pointArrayMap || [0]).length
                    }, e = a && a.chart && a.chart.type, d = [], k = [], t = 0,
                    b = b && b.seriesMapping || a && a.series && a.series.map(function () {
                        return {x: 0}
                    }) || [], g;
                (a && a.series || []).forEach(function (a) {
                    d.push(f(a.type ||
                        e))
                });
                b.forEach(function (a) {
                    c.push(a.x || 0)
                });
                0 === c.length && c.push(0);
                b.forEach(function (b) {
                    var c = new w, A = d[t] || f(e),
                        m = h.seriesTypes[((a && a.series || [])[t] || {}).type || e || "line"].prototype.pointArrayMap || ["y"];
                    c.addColumnReader(b.x, "x");
                    D(b, function (a, b) {
                        "x" !== b && c.addColumnReader(a, b)
                    });
                    for (g = 0; g < A; g++) c.hasReader(m[g]) || c.addColumnReader(void 0, m[g]);
                    k.push(c);
                    t++
                });
                b = h.seriesTypes[e || "line"].prototype.pointArrayMap;
                void 0 === b && (b = ["y"]);
                this.valueCount = {
                    global: f(e), xColumns: c, individual: d, seriesBuilders: k,
                    globalPointArrayMap: b
                }
            }, dataFound: function () {
                this.options.switchRowsAndColumns && (this.columns = this.rowsToColumns(this.columns));
                this.getColumnDistribution();
                this.parseTypes();
                !1 !== this.parsed() && this.complete()
            }, parseCSV: function (a) {
                function b(a, b, c, d) {
                    function e(b) {
                        l = a[b];
                        r = a[b - 1];
                        A = a[b + 1]
                    }

                    function f(a) {
                        v.length < u + 1 && v.push([a]);
                        v[u][v[u].length - 1] !== a && v[u].push(a)
                    }

                    function g() {
                        h > B || B > n ? (++B, m = "") : (!isNaN(parseFloat(m)) && isFinite(m) ? (m = parseFloat(m), f("number")) : isNaN(Date.parse(m)) ? f("string") :
                            (m = m.replace(/\//g, "-"), f("date")), t.length < u + 1 && t.push([]), c || (t[u][b] = m), m = "", ++u, ++B)
                    }

                    var k = 0, l = "", r = "", A = "", m = "", B = 0, u = 0;
                    if (a.trim().length && "#" !== a.trim()[0]) {
                        for (; k < a.length; k++) {
                            e(k);
                            if ("#" === l) {
                                g();
                                return
                            }
                            if ('"' === l) for (e(++k); k < a.length && ('"' !== l || '"' === r || '"' === A);) {
                                if ('"' !== l || '"' === l && '"' !== r) m += l;
                                e(++k)
                            } else d && d[l] ? d[l](l, m) && g() : l === x ? g() : m += l
                        }
                        g()
                    }
                }

                function c(a) {
                    var b = 0, c = 0, f = !1;
                    a.some(function (a, d) {
                        var e = !1, f, l, g = "";
                        if (13 < d) return !0;
                        for (var k = 0; k < a.length; k++) {
                            d = a[k];
                            f = a[k + 1];
                            l = a[k -
                            1];
                            if ("#" === d) break; else if ('"' === d) if (e) {
                                if ('"' !== l && '"' !== f) {
                                    for (; " " === f && k < a.length;) f = a[++k];
                                    "undefined" !== typeof u[f] && u[f]++;
                                    e = !1
                                }
                            } else e = !0; else "undefined" !== typeof u[d] ? (g = g.trim(), isNaN(Date.parse(g)) ? !isNaN(g) && isFinite(g) || u[d]++ : u[d]++, g = "") : g += d;
                            "," === d && c++;
                            "." === d && b++
                        }
                    });
                    f = u[";"] > u[","] ? ";" : ",";
                    d.decimalPoint || (d.decimalPoint = b > c ? "." : ",", e.decimalRegex = new RegExp("^(-?[0-9]+)" + d.decimalPoint + "([0-9]+)$"));
                    return f
                }

                function f(a, b) {
                    var c, f, g = 0, k = !1, m = [], t = [], l;
                    if (!b || b > a.length) b = a.length;
                    for (; g < b; g++) if ("undefined" !== typeof a[g] && a[g] && a[g].length) for (c = a[g].trim().replace(/\//g, " ").replace(/\-/g, " ").replace(/\./g, " ").split(" "), f = ["", "", ""], l = 0; l < c.length; l++) l < f.length && (c[l] = parseInt(c[l], 10), c[l] && (t[l] = !t[l] || t[l] < c[l] ? c[l] : t[l], "undefined" !== typeof m[l] ? m[l] !== c[l] && (m[l] = !1) : m[l] = c[l], 31 < c[l] ? f[l] = 100 > c[l] ? "YY" : "YYYY" : 12 < c[l] && 31 >= c[l] ? (f[l] = "dd", k = !0) : f[l].length || (f[l] = "mm")));
                    if (k) {
                        for (l = 0; l < m.length; l++) !1 !== m[l] ? 12 < t[l] && "YY" !== f[l] && "YYYY" !== f[l] && (f[l] = "YY") : 12 < t[l] &&
                            "mm" === f[l] && (f[l] = "dd");
                        3 === f.length && "dd" === f[1] && "dd" === f[2] && (f[2] = "YY");
                        a = f.join("/");
                        return (d.dateFormats || e.dateFormats)[a] ? a : (H("deduceDateFailed"), "YYYY/mm/dd")
                    }
                    return "YYYY/mm/dd"
                }

                var e = this, d = a || this.options, k = d.csv, t;
                a = "undefined" !== typeof d.startRow && d.startRow ? d.startRow : 0;
                var g = d.endRow || Number.MAX_VALUE,
                    h = "undefined" !== typeof d.startColumn && d.startColumn ? d.startColumn : 0,
                    n = d.endColumn || Number.MAX_VALUE, x, m = 0, v = [], u = {",": 0, ";": 0, "\t": 0};
                t = this.columns = [];
                k && d.beforeParse && (k = d.beforeParse.call(this,
                    k));
                if (k) {
                    k = k.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split(d.lineDelimiter || "\n");
                    if (!a || 0 > a) a = 0;
                    if (!g || g >= k.length) g = k.length - 1;
                    d.itemDelimiter ? x = d.itemDelimiter : (x = null, x = c(k));
                    for (var F = 0, m = a; m <= g; m++) "#" === k[m][0] ? F++ : b(k[m], m - a - F);
                    d.columnTypes && 0 !== d.columnTypes.length || !v.length || !v[0].length || "date" !== v[0][1] || d.dateFormat || (d.dateFormat = f(t[0]));
                    this.dataFound()
                }
                return t
            }, parseTable: function () {
                var a = this.options, b = a.table, c = this.columns, f = a.startRow || 0,
                    e = a.endRow || Number.MAX_VALUE, d = a.startColumn ||
                    0, k = a.endColumn || Number.MAX_VALUE;
                b && ("string" === typeof b && (b = p.getElementById(b)), [].forEach.call(b.getElementsByTagName("tr"), function (a, b) {
                    b >= f && b <= e && [].forEach.call(a.children, function (a, e) {
                        ("TD" === a.tagName || "TH" === a.tagName) && e >= d && e <= k && (c[e - d] || (c[e - d] = []), c[e - d][b - f] = a.innerHTML)
                    })
                }), this.dataFound());
                return c
            }, fetchLiveData: function () {
                function a(t) {
                    function g(g, k, x) {
                        function m() {
                            e && b.liveDataURL === g && (b.liveDataTimeout = setTimeout(a, d))
                        }

                        if (!g || 0 !== g.indexOf("http")) return g && c.error && c.error("Invalid URL"),
                            !1;
                        t && (clearTimeout(b.liveDataTimeout), b.liveDataURL = g);
                        h.ajax({
                            url: g, dataType: x || "json", success: function (a) {
                                b && b.series && k(a);
                                m()
                            }, error: function (a, b) {
                                3 > ++f && m();
                                return c.error && c.error(b, a)
                            }
                        });
                        return !0
                    }

                    g(k.csvURL, function (a) {
                        b.update({data: {csv: a}})
                    }, "text") || g(k.rowsURL, function (a) {
                        b.update({data: {rows: a}})
                    }) || g(k.columnsURL, function (a) {
                        b.update({data: {columns: a}})
                    })
                }

                var b = this.chart, c = this.options, f = 0, e = c.enablePolling, d = 1E3 * (c.dataRefreshRate || 2),
                    k = y(c);
                if (!c || !c.csvURL && !c.rowsURL && !c.columnsURL) return !1;
                1E3 > d && (d = 1E3);
                delete c.csvURL;
                delete c.rowsURL;
                delete c.columnsURL;
                a(!0);
                return c && (c.csvURL || c.rowsURL || c.columnsURL)
            }, parseGoogleSpreadsheet: function () {
                function a(b) {
                    var e = ["https://spreadsheets.google.com/feeds/cells", f, d, "public/values?alt\x3djson"].join("/");
                    h.ajax({
                        url: e, dataType: "json", success: function (d) {
                            b(d);
                            c.enablePolling && setTimeout(function () {
                                a(b)
                            }, c.dataRefreshRate)
                        }, error: function (a, b) {
                            return c.error && c.error(b, a)
                        }
                    })
                }

                var b = this, c = this.options, f = c.googleSpreadsheetKey, e = this.chart,
                    d = c.googleSpreadsheetWorksheet || 1, k = c.startRow || 0, t = c.endRow || Number.MAX_VALUE,
                    g = c.startColumn || 0, n = c.endColumn || Number.MAX_VALUE, q = 1E3 * (c.dataRefreshRate || 2);
                4E3 > q && (q = 4E3);
                f && (delete c.googleSpreadsheetKey, a(function (a) {
                    var c = [];
                    a = a.feed.entry;
                    var d, f = (a || []).length, h = 0, q, p, r;
                    if (!a || 0 === a.length) return !1;
                    for (r = 0; r < f; r++) d = a[r], h = Math.max(h, d.gs$cell.col);
                    for (r = 0; r < h; r++) r >= g && r <= n && (c[r - g] = []);
                    for (r = 0; r < f; r++) d = a[r], h = d.gs$cell.row - 1, q = d.gs$cell.col - 1, q >= g && q <= n && h >= k && h <= t && (p = d.gs$cell || d.content,
                        d = null, p.numericValue ? d = 0 <= p.$t.indexOf("/") || 0 <= p.$t.indexOf("-") ? p.$t : 0 < p.$t.indexOf("%") ? 100 * parseFloat(p.numericValue) : parseFloat(p.numericValue) : p.$t && p.$t.length && (d = p.$t), c[q - g][h - k] = d);
                    c.forEach(function (a) {
                        for (r = 0; r < a.length; r++) void 0 === a[r] && (a[r] = null)
                    });
                    e && e.series ? e.update({data: {columns: c}}) : (b.columns = c, b.dataFound())
                }));
                return !1
            }, trim: function (a, b) {
                "string" === typeof a && (a = a.replace(/^\s+|\s+$/g, ""), b && /^[0-9\s]+$/.test(a) && (a = a.replace(/\s/g, "")), this.decimalRegex && (a = a.replace(this.decimalRegex,
                    "$1.$2")));
                return a
            }, parseTypes: function () {
                for (var a = this.columns, b = a.length; b--;) this.parseColumn(a[b], b)
            }, parseColumn: function (a, b) {
                var c = this.rawColumns, f = this.columns, e = a.length, d, k, h, g, p = this.firstRowAsNames,
                    n = -1 !== this.valueCount.xColumns.indexOf(b), q, m = [], v = this.chartOptions, u,
                    w = (this.options.columnTypes || [])[b],
                    v = n && (v && v.xAxis && "category" === G(v.xAxis)[0].type || "string" === w);
                for (c[b] || (c[b] = []); e--;) d = m[e] || a[e], h = this.trim(d), g = this.trim(d, !0), k = parseFloat(g), void 0 === c[b][e] && (c[b][e] = h),
                    v || 0 === e && p ? a[e] = "" + h : +g === k ? (a[e] = k, 31536E6 < k && "float" !== w ? a.isDatetime = !0 : a.isNumeric = !0, void 0 !== a[e + 1] && (u = k > a[e + 1])) : (h && h.length && (q = this.parseDate(d)), n && E(q) && "float" !== w ? (m[e] = d, a[e] = q, a.isDatetime = !0, void 0 !== a[e + 1] && (d = q > a[e + 1], d !== u && void 0 !== u && (this.alternativeFormat ? (this.dateFormat = this.alternativeFormat, e = a.length, this.alternativeFormat = this.dateFormats[this.dateFormat].alternative) : a.unsorted = !0), u = d)) : (a[e] = "" === h ? null : h, 0 !== e && (a.isDatetime || a.isNumeric) && (a.mixed = !0)));
                n && a.mixed &&
                (f[b] = c[b]);
                if (n && u && this.options.sort) for (b = 0; b < f.length; b++) f[b].reverse(), p && f[b].unshift(f[b].pop())
            }, dateFormats: {
                "YYYY/mm/dd": {
                    regex: /^([0-9]{4})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{1,2})$/, parser: function (a) {
                        return Date.UTC(+a[1], a[2] - 1, +a[3])
                    }
                }, "dd/mm/YYYY": {
                    regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/, parser: function (a) {
                        return Date.UTC(+a[3], a[2] - 1, +a[1])
                    }, alternative: "mm/dd/YYYY"
                }, "mm/dd/YYYY": {
                    regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/, parser: function (a) {
                        return Date.UTC(+a[3],
                            a[1] - 1, +a[2])
                    }
                }, "dd/mm/YY": {
                    regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/, parser: function (a) {
                        var b = +a[3], b = b > (new Date).getFullYear() - 2E3 ? b + 1900 : b + 2E3;
                        return Date.UTC(b, a[2] - 1, +a[1])
                    }, alternative: "mm/dd/YY"
                }, "mm/dd/YY": {
                    regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/, parser: function (a) {
                        return Date.UTC(+a[3] + 2E3, a[1] - 1, +a[2])
                    }
                }
            }, parseDate: function (a) {
                var b = this.options.parseDate, c, f, e = this.options.dateFormat || this.dateFormat, d;
                if (b) c = b(a); else if ("string" === typeof a) {
                    if (e) (b =
                        this.dateFormats[e]) || (b = this.dateFormats["YYYY/mm/dd"]), (d = a.match(b.regex)) && (c = b.parser(d)); else for (f in this.dateFormats) if (b = this.dateFormats[f], d = a.match(b.regex)) {
                        this.dateFormat = f;
                        this.alternativeFormat = b.alternative;
                        c = b.parser(d);
                        break
                    }
                    d || (d = Date.parse(a), "object" === typeof d && null !== d && d.getTime ? c = d.getTime() - 6E4 * d.getTimezoneOffset() : E(d) && (c = d - 6E4 * (new Date(d)).getTimezoneOffset()))
                }
                return c
            }, rowsToColumns: function (a) {
                var b, c, f, e, d;
                if (a) for (d = [], c = a.length, b = 0; b < c; b++) for (e = a[b].length,
                                                                              f = 0; f < e; f++) d[f] || (d[f] = []), d[f][b] = a[b][f];
                return d
            }, parsed: function () {
                if (this.options.parsed) return this.options.parsed.call(this, this.columns)
            }, getFreeIndexes: function (a, b) {
                var c, f = [], e = [], d;
                for (c = 0; c < a; c += 1) f.push(!0);
                for (a = 0; a < b.length; a += 1) for (d = b[a].getReferencedColumnIndexes(), c = 0; c < d.length; c += 1) f[d[c]] = !1;
                for (c = 0; c < f.length; c += 1) f[c] && e.push(c);
                return e
            }, complete: function () {
                var a = this.columns, b, c = this.options, f, e, d, k, h = [], g;
                if (c.complete || c.afterComplete) {
                    if (this.firstRowAsNames) for (d = 0; d <
                    a.length; d++) a[d].name = a[d].shift();
                    f = [];
                    e = this.getFreeIndexes(a.length, this.valueCount.seriesBuilders);
                    for (d = 0; d < this.valueCount.seriesBuilders.length; d++) g = this.valueCount.seriesBuilders[d], g.populateColumns(e) && h.push(g);
                    for (; 0 < e.length;) {
                        g = new w;
                        g.addColumnReader(0, "x");
                        d = e.indexOf(0);
                        -1 !== d && e.splice(d, 1);
                        for (d = 0; d < this.valueCount.global; d++) g.addColumnReader(void 0, this.valueCount.globalPointArrayMap[d]);
                        g.populateColumns(e) && h.push(g)
                    }
                    0 < h.length && 0 < h[0].readers.length && (g = a[h[0].readers[0].columnIndex],
                    void 0 !== g && (g.isDatetime ? b = "datetime" : g.isNumeric || (b = "category")));
                    if ("category" === b) for (d = 0; d < h.length; d++) for (g = h[d], e = 0; e < g.readers.length; e++) "x" === g.readers[e].configName && (g.readers[e].configName = "name");
                    for (d = 0; d < h.length; d++) {
                        g = h[d];
                        e = [];
                        for (k = 0; k < a[0].length; k++) e[k] = g.read(a, k);
                        f[d] = {data: e};
                        g.name && (f[d].name = g.name);
                        "category" === b && (f[d].turboThreshold = 0)
                    }
                    a = {series: f};
                    b && (a.xAxis = {type: b}, "category" === b && (a.xAxis.uniqueNames = !1));
                    c.complete && c.complete(a);
                    c.afterComplete && c.afterComplete(a)
                }
            },
            update: function (a, b) {
                var c = this.chart;
                a && (a.afterComplete = function (a) {
                    a.xAxis && c.xAxis[0] && a.xAxis.type === c.xAxis[0].options.type && delete a.xAxis;
                    c.update(a, b, !0)
                }, y(!0, this.options, a), this.init(this.options))
            }
        });
        h.Data = z;
        h.data = function (a, b, c) {
            return new z(a, b, c)
        };
        q(n, "init", function (a) {
            var b = this, c = a.args[0], f = a.args[1];
            c && c.data && !b.hasDataDef && (b.hasDataDef = !0, b.data = new z(h.extend(c.data, {
                afterComplete: function (a) {
                    var d, e;
                    if (c.hasOwnProperty("series")) if ("object" === typeof c.series) for (d = Math.max(c.series.length,
                        a && a.series ? a.series.length : 0); d--;) e = c.series[d] || {}, c.series[d] = y(e, a && a.series ? a.series[d] : {}); else delete c.series;
                    c = y(a, c);
                    b.init(c, f)
                }
            }), c, b), a.preventDefault())
        });
        w = function () {
            this.readers = [];
            this.pointIsArray = !0
        };
        w.prototype.populateColumns = function (a) {
            var b = !0;
            this.readers.forEach(function (b) {
                void 0 === b.columnIndex && (b.columnIndex = a.shift())
            });
            this.readers.forEach(function (a) {
                void 0 === a.columnIndex && (b = !1)
            });
            return b
        };
        w.prototype.read = function (a, b) {
            var c = this.pointIsArray, f = c ? [] : {}, e;
            this.readers.forEach(function (d) {
                var e =
                    a[d.columnIndex][b];
                c ? f.push(e) : 0 < d.configName.indexOf(".") ? h.Point.prototype.setNestedProperty(f, e, d.configName) : f[d.configName] = e
            });
            void 0 === this.name && 2 <= this.readers.length && (e = this.getReferencedColumnIndexes(), 2 <= e.length && (e.shift(), e.sort(function (a, b) {
                return a - b
            }), this.name = a[e.shift()].name));
            return f
        };
        w.prototype.addColumnReader = function (a, b) {
            this.readers.push({columnIndex: a, configName: b});
            "x" !== b && "y" !== b && void 0 !== b && (this.pointIsArray = !1)
        };
        w.prototype.getReferencedColumnIndexes = function () {
            var a,
                b = [], c;
            for (a = 0; a < this.readers.length; a += 1) c = this.readers[a], void 0 !== c.columnIndex && b.push(c.columnIndex);
            return b
        };
        w.prototype.hasReader = function (a) {
            var b, c;
            for (b = 0; b < this.readers.length; b += 1) if (c = this.readers[b], c.configName === a) return !0
        }
    })(q)
});
//# sourceMappingURL=data.js.map