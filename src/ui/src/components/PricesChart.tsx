import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PricePoint } from "../types";

export default function PriceChart({ date, data }: { date: Date; data: PricePoint[] }) {
	const [filteredData, setFilteredData] = useState(data);
	const [constraints, setConstraints] = useState<[number, number]>([0, 0]);
	const [currentPrice, setCurrentPrice] = useState(0);

	useEffect(() => {
		const filteredData = data.filter((d) => d.date.toDateString() === date.toDateString());
		if (filteredData.length === 0) return;

		setCurrentPrice(filteredData.at(-1)!.price);
		setFilteredData(filteredData);
		setConstraints(getZoomedDomain(filteredData));
	}, [data, date]);

	if (filteredData.length === 0) return null;

	return (
		<div style={{ height: 250, marginBottom: 100 }} className="flex-grow-1">
			<div className="fw-semibold mb-2">
				Price history for {date.toDateString()} (current price: {currentPrice}€)
			</div>

			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={filteredData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="date"
						tickFormatter={(v, i) =>
							new Date(filteredData[i].createdAt).toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
							})
						}
						interval="preserveStartEnd"
						height={60}
					/>
					<YAxis domain={constraints} allowDecimals={false} tickFormatter={(v) => `${v}€`} />
					<Tooltip
						labelFormatter={(value) =>
							new Date(value).toLocaleDateString(undefined, {
								weekday: "short",
								month: "short",
								day: "numeric",
								year: "numeric",
							})
						}
						formatter={(value) => `${value}€`}
					/>
					<Line
						type="monotone"
						dataKey="price"
						strokeWidth={2}
						dot={false}
						isAnimationActive={true}
						animationDuration={400}
						animationEasing="ease-out"
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

function getZoomedDomain(data: { price: number }[]): [number, number] {
	if (data.length === 0) return [0, 0];

	const prices = data.map((d) => d.price);
	const min = Math.min(...prices);
	const max = Math.max(...prices);

	if (min === max) {
		return [min - 1, max + 1];
	}

	const offset = Math.ceil((max - min) * 0.1);

	return [min - offset, max + offset];
}
