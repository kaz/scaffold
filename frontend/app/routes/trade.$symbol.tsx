import { Input } from "@base-ui-components/react/input";
import { Select } from "@base-ui-components/react/select";
import { Tabs } from "@base-ui-components/react/tabs";
import { useQuery } from "@connectrpc/connect-query";
import { TradeService } from "@scaffold/schema/gen/trade/v1/trade_pb";
import { useAtom } from "jotai/react";
import { atomWithStorage, RESET } from "jotai/utils";
import { ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { href, useNavigate } from "react-router";
import type { Route } from "./+types/trade.$symbol";

interface Wallet {
	balance: number;
	positions: Record<string, Position>;
}
interface Position {
	size: number;
	avgPrice: number;
}
interface Trade {
	ts: number;
	symbol: string;
	side: "BUY" | "SELL";
	qty: number;
	price: number;
}

const walletAtom = atomWithStorage<Wallet>("wallet", {
	balance: 100_000_000,
	positions: {},
});
const tradesAtom = atomWithStorage<Trade[]>("trades", []);

function formatJPY(n: number) {
	return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(n);
}
function formatNumber(n: number, digits = 6) {
	return new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(n);
}
function formatTime(ts: number) {
	try {
		return new Date(ts).toLocaleString("ja-JP", { hour12: false });
	} catch {
		return String(ts);
	}
}

export default function ({ params: { symbol } }: Route.ComponentProps) {
	const navigate = useNavigate();

	const { data: symbolsData, isLoading: isSymbolsLoading } = useQuery(TradeService.method.getSymbols);
	const { data: priceData } = useQuery(TradeService.method.getPrice, { symbol }, { refetchInterval: 512 });

	const [wallet, setWallet] = useAtom(walletAtom);
	const [trades, setTrades] = useAtom(tradesAtom);

	const pos: Position = wallet.positions[symbol] ?? { size: 0, avgPrice: 0 };

	const [qtyInput, setQtyInput] = useState<string>("");
	const qty = useMemo(() => {
		const v = parseFloat(qtyInput);
		return Number.isFinite(v) && v > 0 ? v : 0;
	}, [qtyInput]);

	const unrealizedPnl = useMemo(() => {
		if (!priceData || pos.size <= 0 || pos.avgPrice <= 0) {
			return 0;
		}
		const mid = (priceData.bid + priceData.ask) / 2;
		return (mid - pos.avgPrice) * pos.size;
	}, [priceData, pos.size, pos.avgPrice]);

	const marketValue = useMemo(() => {
		if (!priceData || pos.size <= 0) {
			return 0;
		}
		const mid = (priceData.bid + priceData.ask) / 2;
		return pos.size * mid;
	}, [priceData, pos.size]);

	function submit(orderSide: "BUY" | "SELL") {
		const orderPrice = orderSide === "BUY" ? (priceData?.ask ?? 0) : (priceData?.bid ?? 0);
		if (!orderPrice || qty <= 0) {
			return;
		}

		const estCost = qty * orderPrice;
		if (orderSide === "BUY") {
			if (estCost > wallet.balance + 1e-9) return;
			const newSize = pos.size + qty;
			const newAvg = pos.size > 0 ? (pos.avgPrice * pos.size + estCost) / newSize : orderPrice;
			setWallet(w => ({
				balance: w.balance - estCost,
				positions: { ...w.positions, [symbol]: { size: newSize, avgPrice: newAvg } },
			}));
			setTrades(prev => [...prev, { ts: Date.now(), symbol, side: "BUY", qty, price: orderPrice }]);
		} else {
			if (qty > pos.size + 1e-12) return;
			const newSize = pos.size - qty;
			const newPos: Position = newSize > 0 ? { size: newSize, avgPrice: pos.avgPrice } : { size: 0, avgPrice: 0 };
			setWallet(w => ({
				balance: w.balance + estCost,
				positions: { ...w.positions, [symbol]: newPos },
			}));
			setTrades(prev => [...prev, { ts: Date.now(), symbol, side: "SELL", qty, price: orderPrice }]);
		}
		setQtyInput("");
	}

	return (
		<div className="min-h-dvh bg-neutral-950 text-neutral-100">
			<div className="mx-auto max-w-6xl px-4 py-6">
				<div className="mb-6 flex items-end justify-between">
					<div className="flex flex-col gap-2">
						<p className="text-sm text-neutral-400">通貨ペア</p>
						<Select.Root value={symbol} onValueChange={symbol => navigate(href("/trade/:symbol", { symbol }))}>
							<Select.Trigger className="-m-2 inline-flex items-center rounded p-2 text-3xl font-medium text-neutral-500 hover:bg-neutral-800">
								<Select.Value className="text-neutral-100" />
								<span>/JPY</span>
								<Select.Icon>
									<ChevronsUpDown />
								</Select.Icon>
							</Select.Trigger>
							<Select.Positioner className="z-50">
								<Select.Popup className="mt-2 min-w-40 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900 p-1 shadow-lg">
									{isSymbolsLoading && (
										<div className="flex items-center justify-center p-2 text-sm text-neutral-400">
											<LoaderCircle className="animate-spin" />
										</div>
									)}
									{(symbolsData?.symbols ?? []).map(symbol => (
										<Select.Item
											key={symbol}
											value={symbol}
											className="flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm text-neutral-200 select-none hover:bg-neutral-800"
										>
											<Select.ItemText>
												{symbol}/JPY{" "}
												<span className="text-neutral-400">
													(
													{formatJPY(
														wallet.positions[symbol]
															? wallet.positions[symbol].avgPrice * wallet.positions[symbol].size
															: 0,
													)}
													)
												</span>
											</Select.ItemText>
											<Select.ItemIndicator className="ml-3 text-emerald-400">✓</Select.ItemIndicator>
										</Select.Item>
									))}
								</Select.Popup>
							</Select.Positioner>
						</Select.Root>
					</div>
					<div className="grid grid-cols-3 gap-4 text-right">
						<div>
							<div className="text-xs text-neutral-400">BID</div>
							<div className="text-xl font-medium text-emerald-400">{priceData ? formatJPY(priceData.bid) : "-"}</div>
						</div>
						<div>
							<div className="text-xs text-neutral-400">ASK</div>
							<div className="text-xl font-medium text-rose-400">{priceData ? formatJPY(priceData.ask) : "-"}</div>
						</div>
						<div>
							<div className="text-xs text-neutral-400">SPREAD</div>
							<div className="text-xl font-medium">
								{priceData ? formatJPY(Math.max(0, priceData.ask - priceData.bid)) : "-"}
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
						<Tabs.Root defaultValue="BUY">
							<Tabs.List className="mb-4 flex gap-1 rounded-md bg-neutral-800 p-1">
								<Tabs.Tab
									value="BUY"
									className={state =>
										"flex-1 rounded px-3 py-2 text-sm font-medium transition " +
										(state.selected ? "bg-emerald-500 text-neutral-900" : "text-neutral-300 hover:bg-neutral-700")
									}
								>
									買い
								</Tabs.Tab>
								<Tabs.Tab
									value="SELL"
									className={state =>
										"flex-1 rounded px-3 py-2 text-sm font-medium transition " +
										(state.selected ? "bg-rose-500 text-neutral-900" : "text-neutral-300 hover:bg-neutral-700")
									}
								>
									売り
								</Tabs.Tab>
							</Tabs.List>

							<Tabs.Panel value="BUY">
								{(() => {
									const price = priceData?.ask ?? 0;
									const estCost = qty * price;
									const insufficientJPY = estCost > wallet.balance + 1e-9;

									return (
										<div className="space-y-3">
											<div>
												<div className="mb-1 text-xs text-neutral-400">数量（{symbol}）</div>
												<Input
													value={qtyInput}
													onChange={e => setQtyInput(e.target.value)}
													onKeyDown={e => e.key === "Enter" && submit("BUY")}
													inputMode="decimal"
													placeholder="例: 0.01"
													className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 ring-emerald-500/40 outline-none placeholder:text-neutral-500 focus:ring-2"
												/>
											</div>

											<div className="grid grid-cols-2 gap-3 text-sm">
												<div className="rounded-md bg-neutral-800 p-3">
													<div className="text-neutral-400">価格</div>
													<div className="mt-1 font-medium text-emerald-300">{price ? formatJPY(price) : "-"}</div>
												</div>
												<div className="rounded-md bg-neutral-800 p-3">
													<div className="text-neutral-400">金額</div>
													<div className="mt-1 font-medium">{price && qty ? formatJPY(estCost) : "-"}</div>
												</div>
											</div>

											<div className="text-xs text-neutral-400">利用可能 JPY: {formatJPY(wallet.balance)}</div>

											<button
												disabled={!price || qty <= 0 || insufficientJPY}
												onClick={() => submit("BUY")}
												className="mt-2 w-full rounded-md bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-neutral-900 transition hover:bg-emerald-400 disabled:opacity-50"
											>
												買いを実行
											</button>

											{insufficientJPY && <div className="text-xs text-rose-400">残高不足のため購入できません</div>}
										</div>
									);
								})()}
							</Tabs.Panel>

							<Tabs.Panel value="SELL">
								{(() => {
									const price = priceData?.bid ?? 0;
									const estCost = qty * price;
									const insufficientQty = qty > pos.size + 1e-12;

									return (
										<div className="space-y-3">
											<div>
												<div className="mb-1 text-xs text-neutral-400">数量（{symbol}）</div>
												<Input
													value={qtyInput}
													onChange={e => setQtyInput(e.target.value)}
													onKeyDown={e => e.key === "Enter" && submit("SELL")}
													inputMode="decimal"
													placeholder="例: 0.01"
													className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 ring-emerald-500/40 outline-none placeholder:text-neutral-500 focus:ring-2"
												/>
											</div>

											<div className="grid grid-cols-2 gap-3 text-sm">
												<div className="rounded-md bg-neutral-800 p-3">
													<div className="text-neutral-400">価格</div>
													<div className="mt-1 font-medium text-rose-300">{price ? formatJPY(price) : "-"}</div>
												</div>
												<div className="rounded-md bg-neutral-800 p-3">
													<div className="text-neutral-400">金額</div>
													<div className="mt-1 font-medium">{price && qty ? formatJPY(estCost) : "-"}</div>
												</div>
											</div>

											<div className="text-xs text-neutral-400">
												保有 {symbol}: {formatNumber(pos.size)}
											</div>

											<button
												disabled={!price || qty <= 0 || insufficientQty}
												onClick={() => submit("SELL")}
												className="mt-2 w-full rounded-md bg-rose-500 px-4 py-2 text-center text-sm font-semibold text-neutral-900 transition hover:bg-rose-400 disabled:opacity-50"
											>
												売りを実行
											</button>

											{insufficientQty && <div className="text-xs text-rose-400">保有数量を超えて売却できません</div>}
										</div>
									);
								})()}
							</Tabs.Panel>
						</Tabs.Root>
					</div>

					<div className="space-y-6 md:col-span-2">
						<div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
							<div className="mb-3 flex items-center justify-between">
								<div className="text-sm text-neutral-400">口座サマリー</div>
								<button
									onClick={() => setWallet(RESET)}
									className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700"
								>
									リセット
								</button>
							</div>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
								<div className="rounded-md bg-neutral-800 p-3">
									<div className="text-xs text-neutral-400">現金残高（JPY）</div>
									<div className="mt-1 text-lg font-semibold">{formatJPY(wallet.balance)}</div>
								</div>
								<div className="rounded-md bg-neutral-800 p-3">
									<div className="text-xs text-neutral-400">保有数量（{symbol}）</div>
									<div className="mt-1 text-lg font-semibold">{formatNumber(pos.size)}</div>
								</div>
								<div className="rounded-md bg-neutral-800 p-3">
									<div className="text-xs text-neutral-400">平均取得単価</div>
									<div className="mt-1 text-lg font-semibold">{pos.size > 0 ? formatJPY(pos.avgPrice) : "-"}</div>
								</div>
								<div className="rounded-md bg-neutral-800 p-3">
									<div className="text-xs text-neutral-400">評価損益（概算）</div>
									<div
										className={
											(unrealizedPnl >= 0 ? "text-emerald-400" : "text-rose-400") + " mt-1 text-lg font-semibold"
										}
									>
										{priceData ? formatJPY(unrealizedPnl) : "-"}
									</div>
								</div>
							</div>
						</div>

						<div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
							<div className="mb-3 text-sm text-neutral-400">評価額</div>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
								<div className="rounded-md bg-neutral-800 p-3">
									<div className="text-xs text-neutral-400">暗号資産 評価額</div>
									<div className="mt-1 text-lg font-semibold">{priceData ? formatJPY(marketValue) : "-"}</div>
								</div>
								<div className="rounded-md bg-neutral-800 p-3">
									<div className="text-xs text-neutral-400">総資産（概算）</div>
									<div className="mt-1 text-lg font-semibold">
										{priceData ? formatJPY(wallet.balance + marketValue) : formatJPY(wallet.balance)}
									</div>
								</div>
								<div className="rounded-md bg-neutral-800 p-3">
									<div className="text-xs text-neutral-400">現在価格（MID）</div>
									<div className="mt-1 text-lg font-semibold">
										{priceData ? formatJPY((priceData.bid + priceData.ask) / 2) : "-"}
									</div>
								</div>
							</div>
						</div>

						<div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
							<div className="mb-3 flex items-center justify-between">
								<div className="text-sm text-neutral-400">約定履歴（{symbol}）</div>
								<button
									onClick={() => setTrades(RESET)}
									className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700"
								>
									履歴をクリア
								</button>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead className="text-neutral-400">
										<tr className="border-b border-neutral-800">
											<th className="py-2 text-left font-normal">時刻</th>
											<th className="py-2 text-left font-normal">サイド</th>
											<th className="py-2 text-right font-normal">価格 (JPY)</th>
											<th className="py-2 text-right font-normal">数量 ({symbol})</th>
											<th className="py-2 text-right font-normal">金額 (JPY)</th>
										</tr>
									</thead>
									<tbody>
										{(() => {
											const rows = trades
												.filter(t => t.symbol === symbol)
												.slice()
												.sort((a, b) => b.ts - a.ts)
												.slice(0, 200);
											if (rows.length === 0) {
												return (
													<tr>
														<td className="py-6 text-center text-neutral-500" colSpan={5}>
															約定はまだありません
														</td>
													</tr>
												);
											}
											return rows.map(t => (
												<tr key={t.ts} className="border-b border-neutral-900/60">
													<td className="py-2 text-neutral-300">{formatTime(t.ts)}</td>
													<td
														className={"py-2 font-medium " + (t.side === "BUY" ? "text-emerald-400" : "text-rose-400")}
													>
														{t.side}
													</td>
													<td className="py-2 text-right">{formatJPY(t.price)}</td>
													<td className="py-2 text-right">{formatNumber(t.qty)}</td>
													<td className="py-2 text-right">{formatJPY(t.qty * t.price)}</td>
												</tr>
											));
										})()}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
