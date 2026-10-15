import { _ as e, a as t, c as n, d as r, f as i, g as a, h as o, i as s, l as c, m as l, n as u, o as d, p as f, r as p, s as m, t as h, u as g } from "./render-DNAofE3w.js";
//#region src/vanilla/ClockPicker.js
var _ = [
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
], v = class {
	constructor(e, t = {}) {
		this.target = typeof e == "string" ? document.querySelector(e) : e, this.options = {
			mode: "dropdown",
			format24: !1,
			sound: !0,
			autoAdvance: !0,
			dialSize: 240,
			presets: _,
			initialTime: null,
			onChange: null,
			onApply: null,
			...t
		};
		let n = d(this.options.initialTime || this.target && this.target.value || "10:30 AM");
		this.state = {
			hours: n.hours,
			minutes: n.minutes,
			period: n.period,
			mode: "hours",
			isOpen: !1,
			isDragging: !1,
			format24: this.options.format24
		}, this.listeners = {}, this.animator = null, this.elements = {}, this.autoAdvanceTimer = null, this.presetTimer = null, this.init();
	}
	init() {
		this.buildUI(), this.bindEvents(), this.updateUI(!1), this.syncTargetValue();
	}
	buildUI() {
		let e = this.options.mode === "inline", t = this.options.mode === "modal", n = document.createElement("div");
		if (n.className = e ? "tw-clockpicker-card w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg" : t ? "tw-clockpicker-card w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden" : "tw-clockpicker-card absolute left-0 top-full mt-2 z-50 w-full sm:w-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden hidden", this.elements.card = n, this.options.mode === "dropdown") {
			let e = document.createElement("div");
			e.className = "absolute -top-1.5 left-7 w-3 h-3 bg-indigo-50/80 dark:bg-slate-800 border-t border-l border-slate-200 dark:border-slate-700 rotate-45 z-10", n.appendChild(e);
		}
		let r = document.createElement("div");
		r.className = "p-4 bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-800/70 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between";
		let i = document.createElement("div");
		i.className = "flex items-center gap-1.5 font-mono-num font-bold select-none";
		let a = document.createElement("button");
		a.type = "button", a.className = "text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer transition", a.textContent = "10";
		let o = document.createElement("span");
		o.className = "text-slate-400 text-2xl", o.textContent = ":";
		let s = document.createElement("button");
		s.type = "button", s.className = "text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer transition", s.textContent = "30";
		let c = document.createElement("div");
		c.className = "flex flex-col gap-1 ml-2";
		let l = document.createElement("button");
		l.type = "button", l.className = "text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer", l.textContent = "AM";
		let u = document.createElement("button");
		u.type = "button", u.className = "text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer", u.textContent = "PM", c.appendChild(l), c.appendChild(u), i.appendChild(a), i.appendChild(o), i.appendChild(s), i.appendChild(c);
		let d = document.createElement("button");
		d.type = "button", d.className = "text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 cursor-pointer", d.textContent = this.state.format24 ? "24H" : "12H", r.appendChild(i), r.appendChild(d), n.appendChild(r);
		let f = document.createElement("div");
		f.className = "p-4 flex flex-col items-center justify-center";
		let p = this.options.dialSize || 240, { dialWrapper: g, handGroup: _, handLine: v, handBubble: y, handDot: b, numbersContainer: x } = h(p);
		f.appendChild(g);
		let S = document.createElement("p");
		if (S.className = "mt-2 text-[11px] text-slate-400 dark:text-slate-500 text-center select-none", S.textContent = "Klik atau geser angka jam", f.appendChild(S), n.appendChild(f), this.options.presets && this.options.presets.length > 0) {
			let e = document.createElement("div");
			e.className = "px-4 pb-3 grid grid-cols-2 gap-1.5", this.options.presets.forEach((t) => {
				let n = document.createElement("button");
				n.type = "button", n.className = "text-left px-2.5 py-1.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 text-xs transition cursor-pointer", n.innerHTML = `
          <span class="block font-medium text-slate-700 dark:text-slate-200 text-[11px]">${t.label}</span>
          <span class="block text-[10px] text-slate-400 font-mono-num">${t.hours.toString().padStart(2, "0")}:${t.minutes.toString().padStart(2, "0")} ${t.period}</span>
        `, n.addEventListener("click", () => {
					this.animatePreset(t.hours, t.minutes, t.period);
				}), e.appendChild(n);
			}), n.appendChild(e);
		}
		let C = document.createElement("div");
		C.className = "px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs";
		let w = document.createElement("button");
		w.type = "button", w.className = "font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer", w.textContent = "Sekarang";
		let T = document.createElement("div");
		T.className = "flex items-center gap-1.5";
		let E = document.createElement("button");
		E.type = "button", E.className = "px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer", E.textContent = "Batal";
		let D = document.createElement("button");
		if (D.type = "button", D.className = "px-3.5 py-1 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer", D.textContent = "Terapkan", T.appendChild(E), T.appendChild(D), C.appendChild(w), C.appendChild(T), n.appendChild(C), this.elements = {
			...this.elements,
			hourBtn: a,
			minuteBtn: s,
			ampmGroup: c,
			btnAM: l,
			btnPM: u,
			formatBtn: d,
			dialWrapper: g,
			handGroup: _,
			handLine: v,
			handBubble: y,
			handDot: b,
			numbersContainer: x,
			modeText: S,
			nowBtn: w,
			closeBtn: E,
			applyBtn: D
		}, this.animator = new m({
			handGroup: _,
			handLine: v,
			handBubble: y,
			handDot: b
		}, { sound: this.options.sound }), this.animator.center = p / 2, e) this.target.appendChild(n);
		else if (t) {
			let e = document.createElement("div");
			e.className = "tw-clockpicker-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-200", e.appendChild(n), document.body.appendChild(e), this.elements.backdrop = e;
		} else this.target && this.target.parentNode ? (getComputedStyle(this.target.parentNode).position === "static" && (this.target.parentNode.style.position = "relative"), this.target.parentNode.appendChild(n)) : document.body.appendChild(n);
	}
	bindEvents() {
		let { hourBtn: e, minuteBtn: t, btnAM: n, btnPM: r, formatBtn: i, dialWrapper: a, nowBtn: o, closeBtn: s, applyBtn: c } = this.elements;
		e.addEventListener("click", () => this.transitionToMode("hours")), t.addEventListener("click", () => this.transitionToMode("minutes")), n.addEventListener("click", () => {
			this.state.period = "AM", this.updateUI(!1), this.emitChange();
		}), r.addEventListener("click", () => {
			this.state.period = "PM", this.updateUI(!1), this.emitChange();
		}), i.addEventListener("click", () => {
			this.state.format24 = !this.state.format24, i.textContent = this.state.format24 ? "24H" : "12H", this.updateUI(!1), this.emitChange();
		}), o.addEventListener("click", () => this.setNow()), s.addEventListener("click", () => this.close()), c.addEventListener("click", () => {
			this.syncTargetValue(), typeof this.options.onApply == "function" && this.options.onApply(this.getTime()), this.close();
		});
		let l = !1, u = !1, d = 0, f = 0;
		a.addEventListener("pointerdown", (e) => {
			l = !0, u = !1, d = e.clientX, f = e.clientY, this.animator.cancel(), clearTimeout(this.autoAdvanceTimer), a.setPointerCapture(e.pointerId);
		}), a.addEventListener("pointermove", (e) => {
			if (!l) return;
			let t = Math.hypot(e.clientX - d, e.clientY - f);
			!u && t > 6 && (u = !0, this.state.isDragging = !0), u && this.handlePointerDrag(e);
		});
		let p = (e) => {
			if (l) {
				l = !1;
				try {
					a.releasePointerCapture(e.pointerId);
				} catch {}
				u ? (this.state.isDragging = !1, this.updateUI(!1), this.state.mode === "hours" && this.options.autoAdvance && (clearTimeout(this.autoAdvanceTimer), this.autoAdvanceTimer = setTimeout(() => {
					this.transitionToMode("minutes");
				}, 300))) : this.handleDialTap(e);
			}
		};
		a.addEventListener("pointerup", p), a.addEventListener("pointercancel", p), this.target && this.options.mode !== "inline" && this.target.addEventListener("click", () => this.toggle()), this.options.mode === "dropdown" && document.addEventListener("click", (e) => {
			this.state.isOpen && !this.elements.card.contains(e.target) && e.target !== this.target && this.close();
		}), this.options.mode === "modal" && this.elements.backdrop && this.elements.backdrop.addEventListener("click", (e) => {
			e.target === this.elements.backdrop && this.close();
		}), document.addEventListener("keydown", (e) => {
			e.key === "Escape" && this.state.isOpen && this.close();
		});
	}
	handlePointerDrag(e) {
		let t = this.elements.dialWrapper.getBoundingClientRect(), r = this.options.dialSize || 240, { dist: a, angleDeg: s } = i(e.clientX, e.clientY, t, r);
		if (a < 15) return;
		let c = !1;
		if (this.state.mode === "hours") {
			let e = this.state.format24 && a < r / 2 * .6, t = f(s, this.state.format24, e);
			t !== this.state.hours && (this.state.hours = t, c = !0);
		} else {
			let e = o(s);
			e !== this.state.minutes && (this.state.minutes = e, c = !0);
		}
		c && (this.options.sound && n({ sound: !0 }), this.updateUI(!1), this.emitChange());
	}
	handleDialTap(e) {
		let t = this.elements.dialWrapper.getBoundingClientRect(), n = this.options.dialSize || 240, { dist: r, angleDeg: s } = i(e.clientX, e.clientY, t, n);
		if (!(r < 15)) {
			if (this.state.mode === "hours") {
				let e = this.state.format24 && r < n / 2 * .6, t = f(s, this.state.format24, e), { angle: i, length: a } = l(t, this.state.format24, n);
				this.animator.animateTo({
					targetAngle: i,
					targetLength: a,
					duration: 240,
					clockwiseOnly: !1,
					onComplete: () => {
						this.state.hours = t, this.updateUI(!1), this.emitChange(), this.options.autoAdvance && (clearTimeout(this.autoAdvanceTimer), this.autoAdvanceTimer = setTimeout(() => {
							this.transitionToMode("minutes");
						}, 280));
					}
				});
			} else {
				let e = o(s), { angle: t, length: r } = a(e, n);
				this.animator.animateTo({
					targetAngle: t,
					targetLength: r,
					duration: 220,
					clockwiseOnly: !1,
					onComplete: () => {
						this.state.minutes = e, this.updateUI(!1), this.emitChange();
					}
				});
			}
		}
	}
	transitionToMode(e) {
		if (this.state.mode === e) return;
		this.animator.cancel(), this.state.mode = e;
		let t = this.options.dialSize || 240;
		if (e === "minutes") {
			let { angle: e, length: n } = a(this.state.minutes, t);
			this.updateUI(!0), this.animator.animateTo({
				targetAngle: e,
				targetLength: n,
				duration: 280,
				clockwiseOnly: !0,
				onComplete: () => this.updateUI(!1)
			});
		} else {
			let { angle: e, length: n } = l(this.state.hours, this.state.format24, t);
			this.updateUI(!0), this.animator.animateTo({
				targetAngle: e,
				targetLength: n,
				duration: 280,
				clockwiseOnly: !0,
				onComplete: () => this.updateUI(!1)
			});
		}
	}
	animatePreset(e, t, n) {
		this.animator.cancel(), clearTimeout(this.presetTimer), !this.state.format24 && n && (this.state.period = n);
		let r = this.options.dialSize || 240, i = l(e, this.state.format24, r), o = a(t, r);
		this.state.mode = "hours", this.updateUI(!0), this.animator.animateTo({
			targetAngle: i.angle,
			targetLength: i.length,
			duration: 360,
			clockwiseOnly: !0,
			onComplete: () => {
				this.state.hours = e, this.emitChange(), this.presetTimer = setTimeout(() => {
					this.state.mode = "minutes", this.updateUI(!0), this.animator.animateTo({
						targetAngle: o.angle,
						targetLength: o.length,
						duration: 360,
						clockwiseOnly: !0,
						onComplete: () => {
							this.state.minutes = t, this.updateUI(!1), this.syncTargetValue(), this.emitChange();
						}
					});
				}, 140);
			}
		});
	}
	setNow() {
		let e = /* @__PURE__ */ new Date(), t = e.getHours(), n = e.getMinutes(), r, i;
		this.state.format24 ? (r = t, i = t >= 12 ? "PM" : "AM") : (i = t >= 12 ? "PM" : "AM", r = t % 12, r === 0 && (r = 12)), this.animatePreset(r, n, i);
	}
	updateUI(e = !1) {
		let { hourBtn: t, minuteBtn: n, ampmGroup: r, btnAM: i, btnPM: o, numbersContainer: s, modeText: c, handDot: d } = this.elements, f = this.options.dialSize || 240;
		t.textContent = this.state.hours.toString().padStart(2, "0"), n.textContent = this.state.minutes.toString().padStart(2, "0"), this.state.format24 ? r.classList.add("hidden") : (r.classList.remove("hidden"), this.state.period === "AM" ? (i.className = "text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer", o.className = "text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer") : (o.className = "text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white cursor-pointer", i.className = "text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer")), this.state.mode === "hours" ? (t.className = "text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer transition", n.className = "text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer transition", c.textContent = this.state.format24 ? "Klik atau geser angka jam (00-23)" : "Klik atau geser angka jam (1-12)") : (n.className = "text-2xl px-3 py-1 rounded-xl bg-indigo-600 text-white shadow-sm cursor-pointer transition", t.className = "text-2xl px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer transition", c.textContent = "Klik atau geser angka menit (00-59)");
		let p = this.state.mode === "hours" ? this.state.hours : this.state.minutes;
		if (u(s, this.state.mode, this.state.format24, p, f), !e) {
			if (this.state.mode === "hours") {
				let { angle: e, length: t } = l(this.state.hours, this.state.format24, f);
				this.animator.snapTo(e, t), d && d.classList.add("hidden");
			} else {
				let { angle: e, length: t, isBetween5: n } = a(this.state.minutes, f);
				this.animator.snapTo(e, t), d && (n ? d.classList.remove("hidden") : d.classList.add("hidden"));
			}
		}
	}
	syncTargetValue() {
		if (!this.target) return;
		let e = this.getTime();
		this.target.value = this.state.format24 ? e.time24 : e.time12;
	}
	getTime() {
		return {
			hours: this.state.hours,
			minutes: this.state.minutes,
			period: this.state.period,
			format24: this.state.format24,
			time12: p(this.state.hours, this.state.minutes, this.state.period),
			time24: s(this.state.hours, this.state.minutes, this.state.period, this.state.format24),
			timeIndo: t(this.state.hours, this.state.minutes, this.state.period, this.state.format24)
		};
	}
	open() {
		this.state.isOpen = !0, this.options.mode === "dropdown" ? this.elements.card.classList.remove("hidden") : this.options.mode === "modal" && this.elements.backdrop && (this.elements.backdrop.classList.remove("opacity-0", "pointer-events-none"), this.elements.backdrop.classList.add("opacity-100")), this.updateUI(!1), this.emit("open", this.getTime());
	}
	close() {
		this.state.isOpen = !1, this.options.mode === "dropdown" ? this.elements.card.classList.add("hidden") : this.options.mode === "modal" && this.elements.backdrop && (this.elements.backdrop.classList.remove("opacity-100"), this.elements.backdrop.classList.add("opacity-0", "pointer-events-none")), this.emit("close", this.getTime());
	}
	toggle() {
		this.state.isOpen ? this.close() : this.open();
	}
	emitChange() {
		let e = this.getTime();
		typeof this.options.onChange == "function" && this.options.onChange(e), this.emit("change", e);
	}
	on(e, t) {
		return this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t), this;
	}
	emit(e, t) {
		this.listeners[e] && this.listeners[e].forEach((e) => e(t));
	}
	destroy() {
		this.animator.cancel(), clearTimeout(this.autoAdvanceTimer), clearTimeout(this.presetTimer), this.elements.card && this.elements.card.parentNode && this.elements.card.parentNode.removeChild(this.elements.card), this.elements.backdrop && this.elements.backdrop.parentNode && this.elements.backdrop.parentNode.removeChild(this.elements.backdrop), this.listeners = {};
	}
};
function y(e, t) {
	return new v(e, t);
}
//#endregion
export { m as ClockHandAnimator, v as ClockPicker, c as calculateClockwiseDelta, g as calculateShortestDelta, y as createClockPicker, h as createDialElement, r as easeOutCubic, p as formatTime12, s as formatTime24, i as getDialCoordinates, f as getHourFromAngle, l as getHourParameters, t as getIndonesianTimeWord, o as getMinuteFromAngle, a as getMinuteParameters, e as normalizeAngle, d as parseTimeString, n as playTick, u as renderDialNumbers };
