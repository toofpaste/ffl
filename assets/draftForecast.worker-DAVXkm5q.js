(function() {
	const e = [
		"QB",
		"RB",
		"REC",
		"K",
		"DST"
	], t = (e) => [
		"WR",
		"TE",
		"REC"
	].includes(e.toUpperCase()) ? "REC" : e.toUpperCase().replace("D/ST", "DST").replace("DEF", "DST"), r = (e, t, r) => Math.min(r, Math.max(t, e));
	function n(e) {
		let t = 1 / 0, r = -1 / 0;
		for (const n of e) null != n && Number.isFinite(n) && (n < t && (t = n), n > r && (r = n));
		return {
			low: t,
			high: r,
			valid: Number.isFinite(t) && Number.isFinite(r)
		};
	}
	function i(e, t, r = !1) {
		if (null == e || !t.valid) return 0;
		if (t.high === t.low) return .5;
		const n = (e - t.low) / (t.high - t.low);
		return r ? 1 - n : n;
	}
	const o = new class {
		version = "draft-strategy-v4-lineup-capital";
		predict(o) {
			const s = n(o.candidates.map((e) => e.projection)), a = n(o.candidates.map((e) => e.riskAdjustedVorp)), l = n(o.candidates.map((e) => e.marketRank)), c = Object.fromEntries(e.map((e) => [e, n(o.candidates.filter((r) => t(r.position) === e).map((e) => e.projection))])), p = Object.fromEntries(e.map((e) => [e, n(o.candidates.filter((r) => t(r.position) === e).map((e) => e.riskAdjustedVorp))])), u = Object.fromEntries(e.map((e) => [e, o.roster.filter((r) => r.position && t(r.position) === e).length])), d = Object.fromEntries(e.map((e) => [e, Math.max(0, Number(o.starterRequirements[e] ?? 0) - u[e])])), m = e.reduce((e, t) => e + d[t], 0), f = Math.max(0, o.remainingUsableSelections ?? o.benchRemaining - o.consumedSlots - (o.reservedSelections ?? 0) - (o.potentialTrumpConsumption ?? 0)), h = m > 0 && m >= f, y = m <= f, b = Math.max(1, o.roster.length + f), g = r(o.roster.length / b, 0, 1), v = Object.fromEntries(e.map((e) => [e, o.candidates.filter((r) => t(r.position) === e).length])), k = h ? new Set(e.filter((e) => d[e] > 0)) : null, S = o.candidates.map((e) => {
				const n = t(e.position), y = u[n] ?? 0, b = o.starterRequirements[n] ?? 0, k = r(o.needs[n] ?? 0, 0, 1), S = "K" === n || "DST" === n, R = d[n] > 0, x = e.potentialTrumpForFranchiseId === o.franchiseId, I = x ? "wait_for_trump_trigger" : e.potentialTrumpForOther ? "trigger_potential_trump" : "normal_pick", M = [
					"QB",
					"RB",
					"REC"
				].includes(n), T = i(e.projection, s), w = i(e.riskAdjustedVorp, a), P = c[n] ?? s, j = p[n] ?? a, B = M && P.high !== P.low ? .35 * T + .65 * i(e.projection, P) : T, V = M && j.high !== j.low ? .5 * w + .5 * i(e.riskAdjustedVorp, j) : w, C = i(e.marketRank, l, !0), E = r(o.positionTierDrops?.[n] ?? .35 * e.scarcity, 0, 1), D = o.recentPositionSequence.filter((e) => "QB" === t(e)).length, U = "QB" === n && R && D >= 2 ? Math.min(14, 4 + 2.5 * D) : 0, O = o.roster.filter((e) => e.position && t(e.position) === n), N = [...O].sort((e, t) => Number(t.projection ?? 0) - Number(e.projection ?? 0)).slice(0, b), $ = N.length >= b && b > 0 ? Math.min(...N.map((e) => Number(e.projection ?? 0))) : 0, F = !R && $ > 0 ? r((Number(e.projection ?? 0) - $) / $, 0, 1) : 0, A = Math.max(0, y - b), q = R ? 1 : F > 0 ? r(.45 + F, .45, 1) : 0 === A ? r(b / 17, .06, .22) : .03, W = Math.max(O.filter((e) => "keeper" === e.selectionType).length, o.keeperPositions.filter((e) => t(e) === n).length), Q = N.map((e) => e.byeWeek).filter((e) => null != e), _ = !R && null != e.byeWeek && Q.includes(e.byeWeek), K = !R && 0 === A && null != e.byeWeek && Q.length > 0 && !_, z = ("RB" === n || "REC" === n) && !R, G = "QB" === n && !R && !o.twoQuarterback && !o.superflex, L = W > 0 && !R ? o.round <= 3 ? -32 : o.round <= 5 ? -20 : 0 : 0, H = !R && o.round <= 4 ? 0 === A ? -18 : -30 : !R && A > 0 ? -12 : 0, J = Math.pow(g, 2.15), X = o.verifiedCustomScoringVorp ? 22 * V : 0, Y = S ? 24 * r((4 - f) / 3, 0, 1) : 0, Z = S && !o.verifiedCustomScoringVorp ? -27 * (1 - J) : 0, ee = {
					projectedStarterValue: 0,
					flexValue: 0,
					benchValue: 0,
					upsideValue: 0,
					injuryProtection: 0,
					playerVorp: 0,
					riskAdjustedVorp: 0,
					tierUrgency: 0,
					scarcity: 0,
					market: 0,
					survival: 0,
					tendency: 0,
					roundTendency: 0,
					vacancy: 0,
					immediateUrgency: 0,
					construction: 0,
					replacementAvailability: 0,
					specialistTiming: 0,
					feasibility: 0,
					keeperTrump: 0,
					byeWeek: 0,
					risk: 0,
					randomness: 0,
					playerValue: 0,
					rosterNeed: 0,
					starterNeed: 0,
					tendencyFit: 0,
					roundPositionFit: 0,
					positionalScarcity: 0,
					marketValue: 0,
					survivalPressure: 0,
					keeperAdjustment: 0,
					trumpAdjustment: 0,
					rosterConstruction: 0,
					riskAdjustment: 0,
					controlledRandomness: 0
				};
				ee.projectedStarterValue = R ? 12 * B : 10 * F + 2 * B * q, ee.flexValue = 0, ee.benchValue = z ? 7 * (.55 * V + .45 * B) * (0 === A ? 1 : .2) : G ? -7 : 0, ee.upsideValue = "RB" === n || "REC" === n ? 7 * r(e.upside ?? e.ceiling ?? .6 * B + .4 * V, 0, 1) * (R ? 1 : 0 === A ? .45 : .12) : 0, ee.injuryProtection = z ? (0 === A ? 4 : 1) * r(e.injuryAwayValue ?? e.handcuffValue ?? (null == e.expectedStarts ? .35 : 1 - e.expectedStarts / 17), 0, 1) : 0, ee.playerVorp = 9 * V * q, ee.riskAdjustedVorp = 10 * V * q, ee.tierUrgency = null == e.tier ? 0 : r(9 - 1.5 * e.tier, 0, 8) + 8 * E, ee.scarcity = 9 * r(e.scarcity, 0, 1), ee.market = 7 * C, ee.survival = 12 * (1 - r(e.survivalProbability, 0, 1)), ee.tendency = 10 * (o.tendencyByPosition[n] ?? .2) * (R ? 1 : .25) + U, ee.roundTendency = 9 * (o.roundTendencyByPosition[n] ?? .2) * (R ? 1 : .25), ee.vacancy = R ? S ? 5 : 11 : 0, ee.immediateUrgency = 15 * k * (S ? .12 + .88 * J : 1), ee.construction = !R || "RB" !== n && "REC" !== n ? G ? o.round <= 6 ? -24 : -10 : z ? H + L : 0 : 4, ee.replacementAvailability = S ? -Math.min(9, 2.5 * Math.log2(Math.max(1, v[n]))) + 10 * E : 3 * r(e.scarcity, 0, 1), ee.specialistTiming = Z + Y + X, ee.feasibility = h && R ? 38 : h ? -100 : m === f - 1 && R ? 10 : 0, ee.keeperTrump = (W > 0 ? R ? -3 : -10 : 0) + (o.exercisedTrumpPositions.includes(n) && !R ? -5 : 0) + (x ? -45 : e.potentialTrumpForOther ? -4 : 0), ee.byeWeek = _ ? -5 : K ? 2 : 0, ee.risk = 8 * (r((e.expectedGames ?? 12) / 17, 0, 1) - .5) + 4 * (r((e.expectedStarts ?? e.expectedGames ?? 8) / 17, 0, 1) - .5), ee.randomness = 2 * (function(e, t) {
					let r = (e ^ Math.imul(t, 73244475)) >>> 0;
					return r = Math.imul(r ^ r >>> 16, 73244475) >>> 0, r = Math.imul(r ^ r >>> 16, 73244475) >>> 0, ((r ^ r >>> 16) >>> 0) / 4294967295;
				}(o.seed, e.playerId) - .5) * r(o.randomness ?? 1, 0, 1);
				const te = (re = Object.values(ee).reduce((e, t) => e + t, 0), Math.round(100 * re) / 100);
				var re;
				const ne = [
					h && R ? `${n} is required now to preserve a legal roster` : null,
					U > 0 ? `${D} recent quarterback selections create measured run pressure while the starter slot remains open` : null,
					S && Z < 0 ? `Comparable ${n} options are expected later; the empty slot is not yet urgent` : null,
					S && Y > 0 ? `${n} urgency rose because few usable selections remain` : null,
					S && o.verifiedCustomScoringVorp && X > 0 ? `Verified custom-scoring ${n} VORP supports earlier timing` : null,
					L < 0 ? `A keeper plus an existing ${n} already fill the weekly starter limit, so another early ${n} must clear a major opportunity-cost penalty` : null,
					z && 0 === A ? `This ${n} is valued only for lineup upgrades, bye coverage, and first-reserve depth` : null,
					z && A > 0 ? `Additional ${n} depth has sharply reduced value because the weekly starter limit is already filled` : null,
					_ ? `Bye week ${e.byeWeek} overlaps a current ${n} starter` : null,
					K ? `Bye week ${e.byeWeek} can complement the current ${n} starters` : null,
					G ? "Backup QB value is deferred after the starter is filled" : null,
					k >= .65 && !S ? `Strong ${n} immediate roster need` : null,
					e.survivalProbability < .35 ? "Unlikely to survive to the next selection" : null,
					E >= .7 ? `Major ${n} tier drop increases urgency` : null,
					x ? "Wait for another franchise to trigger this potential trump" : null,
					e.potentialTrumpForOther ? "Selection may trigger another franchise's trump" : null
				].filter((e) => Boolean(e));
				return {
					...e,
					score: te,
					probability: 0,
					components: ee,
					reasons: ne.length ? ne : [`Best combined ${n} value, construction, tendency, and timing score`],
					action: I,
					remainingPickFeasibility: {
						openRequiredSlots: m,
						remainingUsableSelections: f,
						guardActive: h,
						legalAfterSelection: m - (R ? 1 : 0) <= Math.max(0, f - 1)
					}
				};
			}).filter((e) => "wait_for_trump_trigger" !== e.action && (!k || k.has(t(e.position)))), R = Math.max(...S.map((e) => e.score), 0), x = S.map((e) => Math.exp((e.score - R) / 12)), I = x.reduce((e, t) => e + t, 0) || 1;
			S.forEach((e, t) => {
				e.probability = x[t] / I;
			});
			const M = /* @__PURE__ */ new Map();
			for (const e of S) M.set(t(e.position), (M.get(t(e.position)) ?? 0) + e.probability);
			const T = [...M].map(([e, t]) => ({
				position: e,
				probability: t
			})).sort((e, t) => t.probability - e.probability), w = [...S].sort((e, t) => t.probability - e.probability || t.score - e.score), P = w.slice(0, 5), j = (P[0]?.probability ?? 0) - (P[1]?.probability ?? 0), B = o.candidates.length < 5 ? "low" : j >= .18 ? "high" : j >= .07 ? "moderate" : "low", V = y ? null : `${m} required starter slots remain but only ${f} usable selections remain.`;
			return {
				version: this.version,
				strategyVersion: this.version,
				seed: o.seed,
				generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				franchiseId: o.franchiseId,
				franchise: o.franchise,
				overallPick: o.overallPick,
				round: o.round,
				nextSelection: o.nextSelection,
				predictedPosition: T[0]?.position ?? null,
				positionProbabilities: T,
				likelyPlayers: P,
				alternativesConsidered: w.slice(0, 12),
				confidence: B,
				mainReasons: P[0]?.reasons ?? [V ?? "No draftable candidates are available."],
				rosterStateBefore: {
					counts: u,
					starterRequirements: o.starterRequirements,
					openRequiredSlots: m,
					remainingUsableSelections: f,
					benchRemaining: o.benchRemaining,
					consumedSlots: o.consumedSlots
				},
				historicalTendencyUsed: {
					positionWeights: o.tendencyByPosition,
					roundPositionWeights: o.roundTendencyByPosition,
					reachRate: o.historicalReachRate,
					recentPositionSequence: o.recentPositionSequence
				},
				feasibility: {
					openRequiredSlots: m,
					remainingUsableSelections: f,
					guardActive: h,
					feasible: y,
					conflict: V
				}
			};
		}
	}(), s = [
		"QB",
		"RB",
		"REC",
		"K",
		"DST"
	], a = (e) => {
		const t = e?.toUpperCase().replace("D/ST", "DST").replace("DEF", "DST");
		return "WR" === t || "TE" === t || "REC" === t ? "REC" : s.includes(t) ? t : null;
	};
	function l(e, t, r) {
		if (!e.length) return null;
		const n = e.reduce((e, t) => e + Math.max(1e-5, t.probability), 0);
		let i = ((e, t) => {
			let r = (e ^ Math.imul(t, 73244475)) >>> 0;
			return r = Math.imul(r ^ r >>> 16, 73244475) >>> 0, r / 4294967295;
		})(t, r) * n;
		for (const o of e) if (i -= Math.max(1e-5, o.probability), i <= 0) return o;
		return e.at(-1);
	}
	self.onmessage = (e) => {
		const t = performance.now(), r = e.data, n = r.currentOverall;
		if (null == n) return void self.postMessage({
			type: "result",
			fingerprint: r.fingerprint,
			result: {
				fingerprint: r.fingerprint,
				engineVersion: o.version,
				rollouts: r.rollouts,
				elapsedMs: 0,
				nextUserOverall: null,
				nextUserRound: null,
				nextUserPickInRound: null,
				interveningPicks: [],
				teams: r.rosters.map((e) => ({
					franchiseId: e.franchiseId,
					franchise: e.franchise,
					pickNumbers: [],
					selectionCount: 0,
					currentNeeds: e.needs,
					nextPickDistribution: s.map((e) => ({
						position: e,
						probability: 0
					})),
					atLeastOnce: s.map((e) => ({
						position: e,
						probability: 0
					})),
					expectedSelections: s.map((e) => ({
						position: e,
						probability: 0
					})),
					topPlayers: [],
					confidence: "not applicable",
					factors: ["No pick before yours"],
					sampleSize: r.rollouts
				})),
				playerSurvival: [],
				tierDepletion: []
			}
		});
		const i = function(e, t, r) {
			if (null == t) return {
				nextUserOverall: null,
				intervening: []
			};
			const n = e.filter((e) => e.overall >= t && ["available", "unresolved"].includes(e.status)).sort((e, t) => e.overall - t.overall), i = n.find((e) => e.franchiseId === r) ?? null;
			return {
				nextUserOverall: i?.overall ?? null,
				intervening: n.filter((e) => e.overall < (i?.overall ?? 1 / 0))
			};
		}(r.slots, n, r.userFranchiseId), c = r.slots.find((e) => e.overall === i.nextUserOverall), p = r.slots.filter((e) => i.intervening.some((t) => t.overall === e.overall)), u = r.rosters.map((e) => e.franchiseId), d = new Set(r.slots.filter((e) => null != e.playerId).map((e) => e.playerId)), m = r.candidates.filter((e) => !d.has(e.playerId)).sort((e, t) => (e.marketRank ?? 9999) - (t.marketRank ?? 9999) || (t.projection ?? 0) - (e.projection ?? 0)).slice(0, 16), f = /* @__PURE__ */ new Map();
		for (const o of u) f.set(o, {
			next: {
				QB: 0,
				RB: 0,
				REC: 0,
				K: 0,
				DST: 0
			},
			once: {
				QB: 0,
				RB: 0,
				REC: 0,
				K: 0,
				DST: 0
			},
			expected: {
				QB: 0,
				RB: 0,
				REC: 0,
				K: 0,
				DST: 0
			},
			players: /* @__PURE__ */ new Map(),
			reasons: /* @__PURE__ */ new Map()
		});
		const h = new Map(m.map((e) => [e.playerId, 0])), y = /* @__PURE__ */ new Map();
		for (let g = 0; g < r.rollouts; g++) {
			const e = new Set(d), t = /* @__PURE__ */ new Map();
			for (const o of r.rosters) t.set(o.franchiseId, o.players.map((e) => ({
				position: e.position,
				selectionType: e.selectionType ?? "ordinary"
			})));
			const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
			for (const c of p) {
				const p = r.rosters.find((e) => e.franchiseId === c.franchiseId);
				if (!p) continue;
				const u = t.get(c.franchiseId) ?? [], d = p.required ?? {
					QB: 1,
					RB: 2,
					REC: 3,
					K: 1,
					DST: 1
				}, m = Object.fromEntries(s.map((e) => [e, u.filter((t) => a(t.position) === e).length])), h = Math.max(1, p.picksRemaining ?? r.slots.filter((e) => e.franchiseId === c.franchiseId && e.overall >= c.overall && ["available", "unresolved"].includes(e.status)).length), y = Object.fromEntries(s.map((e) => {
					const t = Math.max(0, Number(d[e] ?? 0) - m[e]) / Math.max(1, Number(d[e] ?? 1)), r = u.length / Math.max(1, u.length + h);
					return [e, "K" === e || "DST" === e ? t * (.08 + .92 * Math.pow(r, 2.25)) : Math.max(p.needs.find((t) => t.position === e)?.score ?? 0, .75 * t)];
				})), b = r.tendencies[String(c.franchiseId)]?.overall ?? {}, v = c.round <= 3 ? `Round ${c.round}` : c.round <= 6 ? "Rounds 4–6" : c.round <= 10 ? "Rounds 7–10" : "Round 11+", k = r.tendencies[String(c.franchiseId)]?.rounds[v] ?? b, S = r.candidates.filter((t) => !e.has(t.playerId)).map((e) => ({
					...e,
					survivalProbability: Math.max(.03, Math.min(.97, Number(e.marketRank ?? 50) / (Number(e.marketRank ?? 50) + 12))),
					potentialTrumpForFranchiseId: e.potentialTrumpForFranchiseId ?? null,
					potentialTrumpForOther: e.potentialTrumpForOther ?? !1
				})), R = l(o.predict({
					seed: r.seed + 104729 * g + 1009 * c.overall,
					overallPick: c.overall,
					round: c.round,
					franchiseId: c.franchiseId,
					franchise: c.franchise,
					nextSelection: null,
					roster: u,
					starterRequirements: d,
					benchRemaining: h,
					remainingUsableSelections: h,
					needs: y,
					keeperPositions: u.filter((e) => "keeper" === e.selectionType).map((e) => a(e.position) ?? ""),
					exercisedTrumpPositions: u.filter((e) => "trump" === e.selectionType).map((e) => a(e.position) ?? ""),
					potentialTrumpPlayerIds: [],
					consumedSlots: p.consumedSlots,
					tendencyByPosition: b,
					roundTendencyByPosition: k,
					recentPositionSequence: [],
					historicalReachRate: null,
					candidates: S,
					randomness: r.randomness
				}).alternativesConsidered, r.seed + g, c.overall);
				if (!R) continue;
				e.add(R.playerId), u.push({
					position: R.position,
					selectionType: "forecast"
				}), t.set(c.franchiseId, u);
				const x = a(R.position);
				if (!x) continue;
				const I = f.get(c.franchiseId);
				I.expected[x]++, i.has(c.franchiseId) || (I.next[x]++, i.add(c.franchiseId));
				const M = n.get(c.franchiseId) ?? /* @__PURE__ */ new Set();
				M.add(x), n.set(c.franchiseId, M), I.players.set(R.playerId, (I.players.get(R.playerId) ?? 0) + 1);
				for (const e of R.reasons.slice(0, 3)) I.reasons.set(e, (I.reasons.get(e) ?? 0) + 1);
			}
			for (const [r, o] of n) for (const e of o) f.get(r).once[e]++;
			for (const r of m) e.has(r.playerId) || h.set(r.playerId, (h.get(r.playerId) ?? 0) + 1);
			for (const o of s) {
				const t = [...new Set(r.candidates.filter((e) => a(e.position) === o && null != e.tier).map((e) => e.tier))].sort((e, t) => e - t).slice(0, 2);
				for (const n of t) {
					const t = `${o}|${n}`;
					r.candidates.filter((e) => a(e.position) === o && e.tier === n).every((t) => e.has(t.playerId)) && y.set(t, (y.get(t) ?? 0) + 1);
				}
			}
			g % 10 == 0 && self.postMessage({
				type: "progress",
				fingerprint: r.fingerprint,
				progress: Math.round((g + 1) / r.rollouts * 100)
			});
		}
		const b = u.map((e) => {
			const t = f.get(e), n = p.filter((t) => t.franchiseId === e), i = r.rosters.find((t) => t.franchiseId === e), o = (e) => s.map((t) => ({
				position: t,
				probability: e[t] / r.rollouts
			})), a = [...t.players].sort((e, t) => t[1] - e[1]).slice(0, 5).map(([e, t]) => ({
				playerId: e,
				name: r.candidates.find((t) => t.playerId === e)?.name ?? "Unresolved player record",
				probability: t / r.rollouts
			})), l = [...t.reasons].sort((e, t) => t[1] - e[1]).slice(0, 3).map(([e]) => e);
			return {
				franchiseId: e,
				franchise: i?.franchise ?? n[0]?.franchise,
				pickNumbers: n.map((e) => e.overall),
				selectionCount: n.length,
				currentNeeds: i?.needs ?? [],
				nextPickDistribution: o(t.next),
				atLeastOnce: o(t.once),
				expectedSelections: o(t.expected),
				topPlayers: a,
				confidence: 0 === n.length ? "not applicable" : r.rollouts >= 150 ? "moderate" : "low",
				factors: n.length ? l.length ? l : [
					"DraftDecisionEngine value, roster construction, and feasibility",
					"Historical franchise and round tendency",
					"Specialist timing and available-player value"
				] : ["No pick before yours"],
				sampleSize: r.rollouts
			};
		});
		self.postMessage({
			type: "result",
			fingerprint: r.fingerprint,
			result: {
				fingerprint: r.fingerprint,
				engineVersion: o.version,
				rollouts: r.rollouts,
				elapsedMs: Math.round(performance.now() - t),
				nextUserOverall: c?.overall ?? null,
				nextUserRound: c?.round ?? null,
				nextUserPickInRound: null == c ? null : (c.orderIndex ?? (c.overall - 1) % Math.max(1, r.rosters.length)) + 1,
				interveningPicks: p.map((e) => ({
					overall: e.overall,
					franchiseId: e.franchiseId,
					franchise: e.franchise
				})),
				teams: b,
				playerSurvival: m.map((e) => ({
					playerId: e.playerId,
					name: e.name,
					position: a(e.position),
					probability: (h.get(e.playerId) ?? 0) / r.rollouts
				})),
				tierDepletion: [...y].map(([e, t]) => {
					const [n, i] = e.split("|");
					return {
						position: n,
						tier: Number(i),
						probability: t / r.rollouts
					};
				})
			}
		});
	};
})();
