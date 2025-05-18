import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Overview from "./Overview";

const PieChartDetail = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = document.getElementById("progressPie").getContext("2d");
        
        chartRef.current = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Completed", "In Progress", "Not Started"],
                datasets: [
                    {
                        data: [60, 25, 15],
                        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b"],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, []);

    return (
        <div className="bg-white p-4 rounded shadow" style={{ height: '100%' }}>
            <h2 className="text-lg font-semibold mb-2">Student Progress</h2>
            <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                <canvas id="progressPie"></canvas>
            </div>
            <Overview stats={[
                { label: "Students", value: 120 },
                { label: "Lessons", value: 4 },
                { label: "Quiz", value: 1 }
            ]} />
        </div>
    );
};

export default PieChart;