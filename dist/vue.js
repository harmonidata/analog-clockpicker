import { a as e, c as t, f as n, g as r, h as i, i as a, m as o, n as s, o as c, p as l, r as ee, s as u } from "./render-DNAofE3w.js";
import { Fragment as d, Teleport as f, computed as p, createBlock as m, createCommentVNode as h, createElementBlock as g, createElementVNode as _, nextTick as v, normalizeClass as y, normalizeStyle as b, onBeforeUnmount as x, onMounted as S, openBlock as C, ref as w, renderList as te, toDisplayString as T, withModifiers as ne } from "vue";
//#region src/vue/ClockPicker.vue
var re = { class: "tw-clockpicker-vue relative inline-block" }, ie = {
	key: 0,
	class: "relative"
}, ae = ["value", "placeholder"], oe = {
	key: 0,
	class: "absolute -top-1.5 left-7 w-3 h-3 bg-indigo-50/80 dark:bg-slate-800 border-t border-l border-slate-200 dark:border-slate-700 rotate-45 z-10"
}, se = { class: "p-4 bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-800/70 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between" }, ce = { class: "flex items-center gap-1.5 font-mono-num font-bold select-none" }, le = {
	key: 0,
	class: "flex flex-col gap-1 ml-2"
}, ue = { class: "p-4 flex flex-col items-center justify-center" }, de = ["viewBox"], fe = ["transform"], pe = [
	"x1",
	"y1",
	"x2",
	"y2"
], me = ["cx", "cy"], he = ["cx", "cy"], ge = { class: "mt-2 text-[11px] text-slate-400 dark:text-slate-500 text-center select-none" }, _e = {
	key: 1,
	class: "px-4 pb-3 grid grid-cols-2 gap-1.5"
}, ve = ["onClick"], ye = { class: "block font-medium text-slate-700 dark:text-slate-200 text-[11px]" }, be = { class: "block text-[10px] text-slate-400 font-mono-num" }, xe = {
	key: 2,
	class: "px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
}, E = {
	__name: "ClockPicker",
	props: {
		modelValue: {
			type: String,
			default: "10:30 AM"
		},
		mode: {
			type: String,
			default: "dropdown"
		},
		format24: {
			type: Boolean,
			default: !1
		},
		sound: {
			type: Boolean,
			default: !0
		},
		autoAdvance: {
			type: Boolean,
			default: !0
		},
		dialSize: {
			type: Number,
			default: 240
		},
		placeholder: {
			type: String,
			default: "Pilih waktu..."
		},
		presets: {
			type: Array,
			default: () => [
				{
					label: "🌅 Pagi Hari",
					hours: 7,
					minutes: 0,
					period: "AM"
				},
				{
					label: "☀️ Siang / Istirahat",
					hours: 12,
					minutes: 30,
					period: "PM"
				},
				{
					label: "🌇 Sore Pulang Kerja",
					hours: 5,
					minutes: 15,
					period: "PM"
				},
				{
					label: "🌙 Malam Hari",
					hours: 9,
					minutes: 45,
					period: "PM"
				}
			]
		}
	},
	emits: [
		"update:modelValue",
		"change",
		"apply",
		"open",
		"close"
	],
	setup(E, { emit: D }) {
		let O = E, k = D, A = c(O.modelValue), j = w(A.hours), M = w(A.minutes), N = w(A.period), P = w(O.format24), F = w("hours"), I = w(O.mode === "inline"), L = w(null), R = w(null), z = w(null), B = w(null), V = w(null), H = w(null), Se = w(null), U = null, W = null, G = null, K = p(() => P.value ? a(j.value, M.value, N.value, !0) : ee(j.value, M.value, N.value)), Ce = p(() => O.mode === "inline" ? "relative inline-block" : O.mode === "modal" ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm" : "absolute left-0 top-full mt-2 z-50"), we = p(() => {
			let e = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden";
			return O.mode === "inline" ? `${e} w-full max-w-sm p-4` : O.mode === "modal" ? `${e} w-full max-w-sm` : `${e} w-full sm:w-[320px]`;
		});
		function Te() {
			R.value && z.value && (U = new u({
				handGroup: R.value,
				handLine: z.value,
				handBubble: B.value,
				handDot: V.value
			}, { sound: O.sound }), U.center = O.dialSize / 2, q(), J());
		}
		function q() {
			if (!H.value) return;
			let e = F.value === "hours" ? j.value : M.value;
			s(H.value, F.value, P.value, e, O.dialSize);
		}
		function J() {
			if (U) {
				if (F.value === "hours") {
					let { angle: e, length: t } = o(j.value, P.value, O.dialSize);
					U.snapTo(e, t), V.value && V.value.classList.add("hidden");
				} else {
					let { angle: e, length: t, isBetween5: n } = r(M.value, O.dialSize);
					U.snapTo(e, t), V.value && (n ? V.value.classList.remove("hidden") : V.value.classList.add("hidden"));
				}
			}
		}
		function Y(e) {
			if (F.value !== e) {
				if (U?.cancel(), F.value = e, q(), e === "minutes") {
					let { angle: e, length: t } = r(M.value, O.dialSize);
					U?.animateTo({
						targetAngle: e,
						targetLength: t,
						duration: 280,
						clockwiseOnly: !0
					});
				} else {
					let { angle: e, length: t } = o(j.value, P.value, O.dialSize);
					U?.animateTo({
						targetAngle: e,
						targetLength: t,
						duration: 280,
						clockwiseOnly: !0
					});
				}
			}
		}
		function Ee(e, t, n) {
			U?.cancel(), clearTimeout(G), !P.value && n && (N.value = n);
			let i = o(e, P.value, O.dialSize), a = r(t, O.dialSize);
			F.value = "hours", q(), U?.animateTo({
				targetAngle: i.angle,
				targetLength: i.length,
				duration: 360,
				clockwiseOnly: !0,
				onComplete: () => {
					j.value = e, Q(), G = setTimeout(() => {
						F.value = "minutes", q(), U?.animateTo({
							targetAngle: a.angle,
							targetLength: a.length,
							duration: 360,
							clockwiseOnly: !0,
							onComplete: () => {
								M.value = t, Q();
							}
						});
					}, 140);
				}
			});
		}
		function De() {
			let e = /* @__PURE__ */ new Date(), t = e.getHours(), n = e.getMinutes(), r, i;
			P.value ? (r = t, i = t >= 12 ? "PM" : "AM") : (i = t >= 12 ? "PM" : "AM", r = t % 12 == 0 ? 12 : t % 12), Ee(r, n, i);
		}
		function Oe(e) {
			N.value = e, Q();
		}
		function ke() {
			P.value = !P.value, q(), J(), Q();
		}
		let X = !1, Z = !1, Ae = 0, je = 0;
		function Me(e) {
			X = !0, Z = !1, Ae = e.clientX, je = e.clientY, U?.cancel(), clearTimeout(W), L.value?.setPointerCapture(e.pointerId);
		}
		function Ne(e) {
			if (!X) return;
			let r = Math.hypot(e.clientX - Ae, e.clientY - je);
			if (!Z && r > 6 && (Z = !0), Z) {
				let r = L.value.getBoundingClientRect(), { angleDeg: a, dist: o } = n(e.clientX, e.clientY, r, O.dialSize);
				if (o < 15) return;
				if (F.value === "hours") {
					let e = P.value && o < O.dialSize / 2 * .6, n = l(a, P.value, e);
					n !== j.value && (j.value = n, O.sound && t({ sound: !0 }), J(), q(), Q());
				} else {
					let e = i(a);
					e !== M.value && (M.value = e, O.sound && t({ sound: !0 }), J(), q(), Q());
				}
			}
		}
		function Pe(e) {
			if (X) {
				X = !1;
				try {
					L.value?.releasePointerCapture(e.pointerId);
				} catch {}
				if (Z) F.value === "hours" && O.autoAdvance && (clearTimeout(W), W = setTimeout(() => {
					Y("minutes");
				}, 300));
				else {
					let t = L.value.getBoundingClientRect(), { angleDeg: a, dist: s } = n(e.clientX, e.clientY, t, O.dialSize);
					if (s < 15) return;
					if (F.value === "hours") {
						let e = P.value && s < O.dialSize / 2 * .6, t = l(a, P.value, e), { angle: n, length: r } = o(t, P.value, O.dialSize);
						U?.animateTo({
							targetAngle: n,
							targetLength: r,
							duration: 240,
							clockwiseOnly: !1,
							onComplete: () => {
								j.value = t, q(), Q(), O.autoAdvance && (clearTimeout(W), W = setTimeout(() => Y("minutes"), 280));
							}
						});
					} else {
						let e = i(a), { angle: t, length: n } = r(e, O.dialSize);
						U?.animateTo({
							targetAngle: t,
							targetLength: n,
							duration: 220,
							clockwiseOnly: !1,
							onComplete: () => {
								M.value = e, q(), Q();
							}
						});
					}
				}
			}
		}
		function Q() {
			let t = K.value;
			k("update:modelValue", t), k("change", {
				hours: j.value,
				minutes: M.value,
				period: N.value,
				format24: P.value,
				value: t,
				indo: e(j.value, M.value, N.value, P.value)
			});
		}
		function Fe() {
			I.value = !0, v(() => {
				Te();
			}), k("open");
		}
		function $() {
			O.mode !== "inline" && (I.value = !1, k("close"));
		}
		function Ie() {
			I.value ? $() : Fe();
		}
		function Le() {
			k("apply", K.value), $();
		}
		function Re() {
			$();
		}
		return S(() => {
			O.mode === "inline" && v(Te);
		}), x(() => {
			U?.cancel(), clearTimeout(W), clearTimeout(G);
		}), (e, t) => (C(), g("div", re, [E.mode === "inline" ? h("", !0) : (C(), g("div", ie, [_("input", {
			type: "text",
			readonly: "",
			value: K.value,
			class: "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono-num text-sm rounded-2xl px-4 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:border-indigo-400 transition",
			placeholder: E.placeholder,
			onClick: Ie
		}, null, 8, ae), t[5] ||= _("div", { class: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400" }, [_("svg", {
			class: "w-4 h-4",
			fill: "none",
			viewBox: "0 0 24 24",
			stroke: "currentColor",
			"stroke-width": "2"
		}, [_("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}), _("polyline", { points: "12 6 12 12 16 14" })])], -1)])), (C(), m(f, {
			to: "body",
			disabled: E.mode === "inline" || E.mode === "dropdown"
		}, [I.value || E.mode === "inline" ? (C(), g("div", {
			key: 0,
			class: y(Ce.value),
			onClick: ne(Re, ["self"])
		}, [_("div", {
			ref_key: "cardRef",
			ref: Se,
			class: y(we.value),
			onClick: t[4] ||= ne(() => {}, ["stop"])
		}, [
			E.mode === "dropdown" ? (C(), g("div", oe)) : h("", !0),
			_("div", se, [_("div", ce, [
				_("button", {
					type: "button",
					class: y(F.value === "hours" ? "text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer" : "text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"),
					onClick: t[0] ||= (e) => Y("hours")
				}, T(j.value.toString().padStart(2, "0")), 3),
				t[6] ||= _("span", { class: "text-slate-400 text-2xl" }, ":", -1),
				_("button", {
					type: "button",
					class: y(F.value === "minutes" ? "text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer" : "text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"),
					onClick: t[1] ||= (e) => Y("minutes")
				}, T(M.value.toString().padStart(2, "0")), 3),
				P.value ? h("", !0) : (C(), g("div", le, [_("button", {
					type: "button",
					class: y(N.value === "AM" ? "text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer" : "text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"),
					onClick: t[2] ||= (e) => Oe("AM")
				}, " AM ", 2), _("button", {
					type: "button",
					class: y(N.value === "PM" ? "text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer" : "text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"),
					onClick: t[3] ||= (e) => Oe("PM")
				}, " PM ", 2)]))
			]), _("button", {
				type: "button",
				class: "text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 cursor-pointer transition",
				onClick: ke
			}, T(P.value ? "24H" : "12H"), 1)]),
			_("div", ue, [_("div", {
				ref_key: "dialRef",
				ref: L,
				class: "relative rounded-full bg-slate-50 dark:bg-slate-800/80 border-4 border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center no-select cursor-pointer touch-none select-none",
				style: b({
					width: `${E.dialSize}px`,
					height: `${E.dialSize}px`
				}),
				onPointerdown: Me,
				onPointermove: Ne,
				onPointerup: Pe,
				onPointercancel: Pe
			}, [
				t[7] ||= _("div", { class: "absolute z-30 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900 pointer-events-none" }, null, -1),
				(C(), g("svg", {
					class: "absolute inset-0 w-full h-full pointer-events-none z-10",
					viewBox: `0 0 ${E.dialSize} ${E.dialSize}`
				}, [_("g", {
					ref_key: "handGroupRef",
					ref: R,
					transform: `rotate(300, ${E.dialSize / 2}, ${E.dialSize / 2})`
				}, [
					_("line", {
						ref_key: "handLineRef",
						ref: z,
						x1: E.dialSize / 2,
						y1: E.dialSize / 2,
						x2: E.dialSize / 2,
						y2: E.dialSize / 2 - 98,
						stroke: "currentColor",
						"stroke-width": "2",
						class: "text-indigo-600 dark:text-indigo-500"
					}, null, 8, pe),
					_("circle", {
						ref_key: "handBubbleRef",
						ref: B,
						cx: E.dialSize / 2,
						cy: E.dialSize / 2 - 98,
						r: "16",
						class: "fill-indigo-600 dark:fill-indigo-500 shadow-md"
					}, null, 8, me),
					_("circle", {
						ref_key: "handDotRef",
						ref: V,
						cx: E.dialSize / 2,
						cy: E.dialSize / 2 - 98,
						r: "2.5",
						class: "fill-white hidden"
					}, null, 8, he)
				], 8, fe)], 8, de)),
				_("div", {
					ref_key: "numbersRef",
					ref: H,
					class: "absolute inset-0 z-20 pointer-events-none dial-fade-enter"
				}, null, 512)
			], 36), _("p", ge, T(F.value === "hours" ? P.value ? "Klik atau geser angka jam (00-23)" : "Klik atau geser angka jam (1-12)" : "Klik atau geser angka menit (00-59)"), 1)]),
			E.presets && E.presets.length ? (C(), g("div", _e, [(C(!0), g(d, null, te(E.presets, (e, t) => (C(), g("button", {
				key: t,
				type: "button",
				class: "text-left px-2.5 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 text-xs transition cursor-pointer",
				onClick: (t) => Ee(e.hours, e.minutes, e.period)
			}, [_("span", ye, T(e.label), 1), _("span", be, T(e.hours.toString().padStart(2, "0")) + ":" + T(e.minutes.toString().padStart(2, "0")) + " " + T(e.period), 1)], 8, ve))), 128))])) : h("", !0),
			E.mode === "inline" ? h("", !0) : (C(), g("div", xe, [_("button", {
				type: "button",
				class: "font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer",
				onClick: De
			}, " Sekarang "), _("div", { class: "flex items-center gap-1.5" }, [_("button", {
				type: "button",
				class: "px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer",
				onClick: $
			}, " Batal "), _("button", {
				type: "button",
				class: "px-3.5 py-1 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer",
				onClick: Le
			}, " Terapkan ")])]))
		], 2)], 2)) : h("", !0)], 8, ["disabled"]))]));
	}
};
//#endregion
//#region src/vue/useClockPicker.js
function D(t = {}) {
	let n = c(t.initialTime || "10:30 AM"), r = w(n.hours), i = w(n.minutes), o = w(n.period), s = w(t.format24 ?? !1), l = w("hours"), u = w(!1), d = p(() => ee(r.value, i.value, o.value)), f = p(() => a(r.value, i.value, o.value, s.value)), m = p(() => e(r.value, i.value, o.value, s.value)), h = p(() => s.value ? f.value : d.value);
	function g(e, t, n = null) {
		r.value = e, i.value = t, n && (o.value = n);
	}
	function _() {
		let e = /* @__PURE__ */ new Date(), t = e.getHours();
		i.value = e.getMinutes(), s.value ? r.value = t : (o.value = t >= 12 ? "PM" : "AM", r.value = t % 12 == 0 ? 12 : t % 12);
	}
	function v(e = "10:30 AM") {
		let t = c(e);
		r.value = t.hours, i.value = t.minutes, o.value = t.period, l.value = "hours";
	}
	function y() {
		u.value = !0;
	}
	function b() {
		u.value = !1;
	}
	function x() {
		u.value = !u.value;
	}
	function S(e) {
		(e === "hours" || e === "minutes") && (l.value = e);
	}
	function C() {
		o.value = o.value === "AM" ? "PM" : "AM";
	}
	function te() {
		s.value = !s.value;
	}
	return {
		hours: r,
		minutes: i,
		period: o,
		format24: s,
		mode: l,
		isOpen: u,
		time12: d,
		time24: f,
		timeIndo: m,
		formattedTime: h,
		setTime: g,
		setNow: _,
		reset: v,
		open: y,
		close: b,
		toggle: x,
		setMode: S,
		togglePeriod: C,
		toggleFormat: te
	};
}
//#endregion
//#region src/vue/index.js
var O = { install(e) {
	e.component("ClockPicker", E);
} };
//#endregion
export { E as ClockPicker, O as default, D as useClockPicker };
