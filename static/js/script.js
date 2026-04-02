const toggle = document.getElementById("deviceToggle");
const toggleText = document.getElementById("toggleText");

const select = document.getElementById("metricSelect");

const sections = {
    current: document.getElementById("currentSection"),
    voltage: document.getElementById("voltageSection"),
    power: document.getElementById("powerSection"),
    energy: document.getElementById("energySection"),
    frequency: document.getElementById("frequencySection"),
    power_factor: document.getElementById("powerFactorSection")
};



const singleMasterSwitch = document.getElementById("singleMasterSwitch");




// PAGE LOAD default CURRENT
function showSection(name) {
    Object.values(sections).forEach(sec => {
        sec.style.display = "none";
    });

    if (sections[name]) {
        sections[name].style.display = "block";
    }
}

showSection("current");

// dropdown change
select.addEventListener("change", () => {
    showSection(select.value);
});


/* CURRENT CHART TYPE */
const chartTypeSelect = document.getElementById("chartType");
const lineChartCanvas = document.getElementById("currentChart");
const pieChartCanvas = document.getElementById("currentPieChart");

chartTypeSelect.addEventListener("change", function () {
    if (this.value === "pie") {
        lineChartCanvas.style.display = "none";
        pieChartCanvas.style.display = "block";
    } else {
        lineChartCanvas.style.display = "block";
        pieChartCanvas.style.display = "none";
    }
});


/* POWER CHART TYPE */
const powerChartType = document.getElementById("powerChartType");
const powerLineChart = document.getElementById("powerChart");
const powerPieChart = document.getElementById("powerPieChart");

powerChartType.addEventListener("change", function () {
    if (this.value === "pie") {
        powerLineChart.style.display = "none";
        powerPieChart.style.display = "block";
    } else {
        powerLineChart.style.display = "block";
        powerPieChart.style.display = "none";
    }
});


/* VOLTAGE CHART TYPE */
const voltageChartType = document.getElementById("voltageChartType");
const voltageLineChart = document.getElementById("voltageChart");
const voltagePieChart = document.getElementById("voltagePieChart");

voltageChartType.addEventListener("change", function () {
    if (this.value === "pie") {
        voltageLineChart.style.display = "none";
        voltagePieChart.style.display = "block";
    } else {
        voltageLineChart.style.display = "block";
        voltagePieChart.style.display = "none";
    }
});


/* ENERGY CHART TYPE */
const energyChartType = document.getElementById("energyChartType");
const energyLineChart = document.getElementById("energyChart");
const energyPieChart = document.getElementById("energyPieChart");

energyChartType.addEventListener("change", function () {
    if (this.value === "pie") {
        energyLineChart.style.display = "none";
        energyPieChart.style.display = "block";
    } else {
        energyLineChart.style.display = "block";
        energyPieChart.style.display = "none";
    }
});


/* FREQUENCY CHART TYPE */
const frequencyChartType = document.getElementById("frequencyChartType");
const frequencyLineChart = document.getElementById("frequencyChart");
const frequencyPieChart = document.getElementById("frequencyPieChart");

frequencyChartType.addEventListener("change", function () {
    if (this.value === "pie") {
        frequencyLineChart.style.display = "none";
        frequencyPieChart.style.display = "block";
    } else {
        frequencyLineChart.style.display = "block";
        frequencyPieChart.style.display = "none";
    }
});


/* POWER FACTOR CHART TYPE */
const pfChartType = document.getElementById("pfChartType");
const pfChart = document.getElementById("pfChart");
const pfPieChart = document.getElementById("pfPieChart");

pfChartType.addEventListener("change", function () {
    if (this.value === "pie") {
        pfChart.style.display = "none";
        pfPieChart.style.display = "block";
    } else {
        pfChart.style.display = "block";
        pfPieChart.style.display = "none";
    }
});



// fetch IP and connect socket start pranav code


fetch('static/js/ip.json')
    .then(res => res.json())
    .then(data => {

        deviceId = "3Phase862733079332931"; // ✅ global device ID for commands

        console.log("📡 Connecting to server at:", data.ip);

        const socket = io.connect(data.ip);
        // CURRENT
        const cur1El = document.getElementById("cur1");
        const cur2El = document.getElementById("cur2");
        const cur3El = document.getElementById("cur3");

        // VOLTAGE
        const vol1El = document.getElementById("vol1");
        const vol2El = document.getElementById("vol2");
        const vol3El = document.getElementById("vol3");

        // POWER
        const pow1El = document.getElementById("pow1");
        const pow2El = document.getElementById("pow2");
        const pow3El = document.getElementById("pow3");

        // ENERGY
        const energy1El = document.getElementById("energy1");
        const energy2El = document.getElementById("energy2");
        const energy3El = document.getElementById("energy3");

        // FREQUENCY
        const freq1El = document.getElementById("frequency1");
        const freq2El = document.getElementById("frequency2");
        const freq3El = document.getElementById("frequency3");

        // POWER FACTOR
        const pf1El = document.getElementById("pf1");
        const pf2El = document.getElementById("pf2");
        const pf3El = document.getElementById("pf3");

        const dateRangeSelect = document.getElementById("dateRange");
        const customPicker = document.getElementById("customDatePicker");
        const applyBtn = document.getElementById("applyBtn");


        const startDateInput = document.getElementById("startDate");
        const endDateInput = document.getElementById("endDate");

        // Start date change hote hi end date same set
        startDateInput.addEventListener("change", () => {
            endDateInput.value = startDateInput.value;
        });


        applyBtn.addEventListener("click", () => {
            const date = startDateInput.value;

            if (!date) {
                alert("Please select a date");
                return;
            }

            // Start & End SAME
            socket.emit("get_custom_graph", {
                start: date,
                end: date
            });
        });


        // Set default today date
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("startDate").value = today;
        document.getElementById("endDate").value = today;

        function getCurrentHourRange() {
            const now = new Date();

            const hour = String(now.getHours()).padStart(2, "0");

            return {
                min: `${hour}:00`,
                max: `${hour}:59`
            };
        }

        const hourRange = getCurrentHourRange();


        /* ---------------- CHART ---------------- */
        function createLineChart({ canvasId, yLabel, datasetLabels, colors }) {
            const ctx = document.getElementById(canvasId).getContext("2d");

            const datasets = datasetLabels.map((label, i) => ({
                label: label,
                data: [],
                borderWidth: 2,
                borderColor: colors[i],      // line color
                backgroundColor: colors[i],  // legend box color
                tension: 0.3,
            }));

            return new Chart(ctx, {
                type: "line",
                data: { labels: [], datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: true,
                    scales: {
                        x: {
                            title: { display: true, text: "Time" },
                            min: hourRange.min,
                            max: hourRange.max
                        },
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: yLabel }
                        }
                    },
                    plugins: {
                        zoom: {
                            pan: { enabled: true, mode: "xy" },
                            zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "xy" },
                            limits: { y: { min: 0 } }
                        }
                    }
                }
            });
        }

        // ---------------- CREATE CHARTS ----------------
        const currentChart = createLineChart({
            canvasId: "currentChart",
            yLabel: "Current (A)",
            datasetLabels: ["Current R", "Current Y", "Current B"],
            colors: ["rgba(255, 99, 132, 0.85)", "rgba(255, 206, 86, 0.85)", "rgba(54, 162, 235, 0.85)"]
        });

        const powerChart = createLineChart({
            canvasId: "powerChart",
            yLabel: "Power (W)",
            datasetLabels: ["Power R", "Power Y", "Power B"],
            colors: ["rgba(255, 99, 132, 0.85)", "rgba(255, 206, 86, 0.85)", "rgba(54, 162, 235, 0.85)"]
        });

        const voltageChart = createLineChart({
            canvasId: "voltageChart",
            yLabel: "Voltage (V)",
            datasetLabels: ["Voltage R", "Voltage Y", "Voltage B"],
            colors: ["rgba(255, 99, 132, 0.85)", "rgba(255, 206, 86, 0.85)", "rgba(54, 162, 235, 0.85)"]
        });
        const energyChart = createLineChart({
            canvasId: "energyChart",
            yLabel: "Energy (kWh)",
            datasetLabels: ["Energy R", "Energy Y", "Energy B"],
            colors: ["rgba(255, 99, 132, 0.85)", "rgba(255, 206, 86, 0.85)", "rgba(54, 162, 235, 0.85)"]
        });

        const frequencyChart = createLineChart({
            canvasId: "frequencyChart",
            yLabel: "Frequency (Hz)",
            datasetLabels: ["Frequency R", "Frequency Y", "Frequency B"],
            colors: ["rgba(255, 99, 132, 0.85)", "rgba(255, 206, 86, 0.85)", "rgba(54, 162, 235, 0.85)"]
        });

        const pfChart = createLineChart({
            canvasId: "pfChart",
            yLabel: "Power Factor",
            datasetLabels: ["PF R", "PF Y", "PF B"],
            colors: ["rgba(255, 99, 132, 0.85)", "rgba(255, 206, 86, 0.85)", "rgba(54, 162, 235, 0.85)"]
        });


        let currentPieChart, voltagePieChart, powerPieChart;
        let energyPieChart, frequencyPieChart, pfPieChart;
        let lastUpdateTime = 0;

        /* ------------------ CENTER TEXT PLUGIN ------------------ */
        const centerTextPlugin = {
            id: 'centerText',
            afterDraw(chart) {
                const { ctx } = chart;
                const data = chart.data.datasets[0].data;
                const total = data.reduce((a, b) => a + b, 0);

                ctx.save();
                ctx.font = 'bold 16px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    total.toFixed(2) + ' ' + chart.options.unit,
                    chart.width / 2,
                    chart.height / 2
                );
            }
        };

        /* ------------------ CREATE PIE (ONCE) ------------------ */
        function createPieChart(canvasId, title, unit) {
            const ctx = document.getElementById(canvasId);

            return new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['R Phase', 'Y Phase', 'B Phase'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.85)',
                            'rgba(255, 206, 86, 0.85)',
                            'rgba(54, 162, 235, 0.85)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '0%',
                    chartName: title,   // 🔥 important
                    unit: unit,         // 🔥 important
                    animation: {
                        duration: 800,
                        easing: 'easeOutQuart'
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            // labels: { color: '#fff' }
                        },
                        title: {
                            display: true,
                            text: title + ' Distribution',
                            color: '#291f1f',
                            font: { size: 16, weight: 'bold' }
                        },
                        tooltip: {
                            callbacks: {
                                label(ctx) {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const value = ctx.parsed;
                                    const percent = total ? ((value / total) * 100).toFixed(1) : 0;

                                    const chartName = ctx.chart.options.chartName;
                                    const unit = ctx.chart.options.unit;

                                    return `${chartName} ${ctx.label}: ${value.toFixed(2)} ${unit} (${percent}%)`;
                                }
                            }
                        }
                    }
                },
                // plugins: [centerTextPlugin]
            });
        }

        /* ------------------ INIT CHARTS ------------------ */
        currentPieChart = createPieChart('currentPieChart', 'Current', 'A');
        voltagePieChart = createPieChart('voltagePieChart', 'Voltage', 'V');
        powerPieChart = createPieChart('powerPieChart', 'Power', 'W');
        energyPieChart = createPieChart(
            'energyPieChart',
            'Energy',
            'kWh'
        );

        frequencyPieChart = createPieChart(
            'frequencyPieChart',
            'Frequency',
            'Hz'
        );

        pfPieChart = createPieChart(
            'pfPieChart',
            'Power Factor',
            ''
        );

        /* ------------------ SAFE UPDATE FUNCTION ------------------ */
        function updateChart(chart, values) {
            if (!values || values.every(v => v === 0)) {
                chart.data.datasets[0].data = [0, 0, 0];
            } else {
                chart.data.datasets[0].data = values;
            }
            chart.update();
        }

        const alertBuffer = {};
        const alertContainer = document.getElementById("alerts");

        socket.on("alert", (data) => {

            console.log("🔥 Live Alert:", data);

            const key = data.deviceID + "_" + data.alert_type + "_" + data.timestamp;

            const phase = data.message.split(":")[0];

            let limitType = "other";
            const msg = data.message.toLowerCase();

            if (msg.includes("max")) {
                limitType = "max";
            } else if (msg.includes("min")) {
                limitType = "min";
            }

            if (!alertBuffer[key]) {

                alertBuffer[key] = {
                    device: data.deviceID,
                    type: data.alert_type,
                    time: data.timestamp,
                    phases: [],
                    limit_type: limitType
                };

                setTimeout(() => {
                    showMergedAlert(key);
                }, 3000); // 3 sec wait for phase merge
            }

            alertBuffer[key].phases.push(phase);

        });

        function showMergedAlert(key) {

            const alert = alertBuffer[key];
            if (!alert) return;

            let message = "";

            if (alert.limit_type === "min") {
                message = `${alert.type} Under Detected Alert`;
            } else if (alert.limit_type === "max") {
                message = `${alert.type} Over Detected Alert`;
            } else {
                message = `${alert.type} Threshold Crossed`;
            }

            const phasesHTML = alert.phases.map(p =>
                `<div class="meta-chip">${p}</div>`
            ).join("");

            const cardID = "card-live-" + Date.now();

            const cardHTML = `
        <div class="alert-card" id="${cardID}">

            <div class="alert-header">

                <div class="alert-icon">⚡</div>

                <div class="alert-title-block">
                    <p class="alert-type">${alert.type} Alert</p>
                    <p class="alert-device">Device: ${alert.device}</p>
                </div>

                <button class="close-btn" onclick="dismissAlert('${cardID}')">
                    ✕
                </button>

            </div>

            <div class="alert-body">

                <p class="alert-message">
                    ${message}
                </p>

                <div class="alert-meta">
                    ${phasesHTML}
                    <div class="meta-chip">${alert.time}</div>
                </div>

            </div>

        </div>
    `;

            alertContainer.insertAdjacentHTML("afterbegin", cardHTML);

            delete alertBuffer[key];
        }


        // Toggle event → send to server
        singleMasterSwitch.addEventListener("change", function () {
            const isOn = this.checked;
            const intensity = isOn ? 100 : 0;
            const deviceId = this.dataset.device;   // reads data-device attribute

            console.log("Master Switch Toggled:", deviceId, intensity);
            socket.emit("handle_on_off", { device: deviceId, intensity });
        });

        // ----================== Toggle on of =================

        // Server confirmation → update UI if needed
        socket.on("on_off_response", function (data) {
            console.log("Server confirmed:", data.message, "| load_status:", data.load_status);

            // Sync switch in case server corrected the state
            singleMasterSwitch.checked = data.load_status === 1;
        });

        // Handle errors
        socket.on("error", function (data) {
            console.error("Server error:", data.message);
            // Revert the toggle visually
            singleMasterSwitch.checked = !singleMasterSwitch.checked;
        });
        // ==================================================




        // Scheduling daya and date Time Socket code 
        // ── Modal open/close ───────────────────────────────────────────────────────



        // ── Scheduling toggle — show/hide fields ───────────────────────────────────



        // ── SET TIME & DATE ────────────────────────────────────────────────────────
        document.getElementById("btnSetTime").addEventListener("click", function () {
            const hour = getInt("td_hour", 0, 23, "Hour");
            const minute = getInt("td_minute", 0, 59, "Minute");
            const day = getInt("td_day", 1, 31, "Day");
            const month = getInt("td_month", 1, 12, "Month");
            const year = getInt("td_year", 2000, 2099, "Year");

            if (hour === null || minute === null ||
                day === null || month === null || year === null) return;

            this.disabled = true;
            this.textContent = "⏳ Sending…";

            socket.emit("set_time_date", {
                device: deviceId,
                hour, minute, day, month, year
            });
        });

        socket.on("set_time_response", function (data) {
            showToast("✅ " + data.message, "success");

            document.getElementById("timeLastSet").textContent =
                `Last set: ${pad(data.hour)}:${pad(data.minute)}` +
                `  ${pad(data.day)}/${pad(data.month)}/${data.year}`;

            const btn = document.getElementById("btnSetTime");
            btn.disabled = false;
            btn.textContent = "Set Time & Date";
        });

        socket.on("set_time_error", function (data) {
            showToast("❌ " + data.message, "error");
            const btn = document.getElementById("btnSetTime");
            btn.disabled = false;
            btn.textContent = "Set Time & Date";
        });

        // ── SCHEDULING ─────────────────────────────────────────────────────────────

        // ── ELEMENTS ─────────────────────────────────────────────
        const schedToggle = document.getElementById("schedToggle");
        const schedFields = document.getElementById("schedFields");
        // const btnSetSchedule = document.getElementById("btnSetSchedule");


        // ── INIT (page load pe correct state set) ────────────────
        function updateSchedUI() {
            const isEnabled = schedToggle.checked;
            schedFields.style.display = isEnabled ? "block" : "none";
        }
        updateSchedUI();


        // ── TOGGLE CHANGE (🔥 MOST IMPORTANT) ─────────────────────
        schedToggle.addEventListener("change", function () {
            const isEnabled = this.checked ? 1 : 0;

            console.log("🔘 Toggle changed:", isEnabled);

            // UI update
            schedFields.style.display = isEnabled ? "block" : "none";

            // ✅ If OFF → immediately send command
            if (isEnabled === 0) {
                socket.emit("set_scheduling", {
                    device: deviceId,
                    is_enabled: 0
                });

                showToast("Scheduling turned OFF", "info");
            }
        });


        document.getElementById("btnSetSchedule").addEventListener("click", function () {

            const isEnabled = schedToggle.checked ? 1 : 0;

            // ❌ Prevent wrong use
            if (isEnabled === 0) {
                showToast("Scheduling already OFF", "info");
                return;
            }

            const on_hour = getInt("on_hour", 0, 23, "ON Hour");
            const on_minute = getInt("on_minute", 0, 59, "ON Minute");
            const off_hour = getInt("off_hour", 0, 23, "OFF Hour");
            const off_minute = getInt("off_minute", 0, 59, "OFF Minute");

            if (on_hour === null || on_minute === null ||
                off_hour === null || off_minute === null) return;

            const payload = {
                device: deviceId,
                is_enabled: 1,
                on_hour,
                on_minute,
                off_hour,
                off_minute
            };

            console.log("📤 Sending Scheduling:", payload);

            this.disabled = true;
            this.textContent = "⏳ Sending…";

            socket.emit("set_scheduling", payload);
        });


        socket.on("scheduling_response", function (data) {
            console.log("✅ Response:", data);
            showToast("✅ " + data.message, "success");

            const last = document.getElementById("schedLastSet");
            if (data.is_enabled) {
                last.textContent =
                    `ON ${pad(data.on_hour)}:${pad(data.on_minute)}` +
                    `  →  OFF ${pad(data.off_hour)}:${pad(data.off_minute)}`;
            } else {
                last.textContent = "Scheduling disabled";
            }

            const btn = document.getElementById("btnSetSchedule");
            btn.disabled = false;
            btn.textContent = "Save Scheduling";
        });

        socket.on("scheduling_error", function (data) {
            showToast("❌ " + data.message, "error");
            const btn = document.getElementById("btnSetSchedule");
            btn.disabled = false;
            btn.textContent = "Save Scheduling";
        });

        // ── Scheduling toggle — show/hide fields ───────────────────────────────────


        /* ------------------ SOCKET LISTENER ------------------ */
        socket.on("today_graph_data", data => {

            console.log("📊 Pie chart update received:", data);
            // 🔒 10 sec throttle
            const now = Date.now();
            if (now - lastUpdateTime < 10000) return;
            lastUpdateTime = now;

            updateChart(currentPieChart, [
                data.pie.current.r,
                data.pie.current.y,
                data.pie.current.b
            ]);

            updateChart(voltagePieChart, [
                data.pie.voltage.r,
                data.pie.voltage.y,
                data.pie.voltage.b
            ]);

            updateChart(powerPieChart, [
                data.pie.power.r,
                data.pie.power.y,
                data.pie.power.b
            ]);

            /* -------- ENERGY -------- */
            updateChart(energyPieChart, [
                data.pie.energy.r,
                data.pie.energy.y,
                data.pie.energy.b
            ]);

            /* -------- FREQUENCY -------- */
            updateChart(frequencyPieChart, [
                data.pie.frequency.r,
                data.pie.frequency.y,
                data.pie.frequency.b
            ]);

            /* -------- POWER FACTOR -------- */
            updateChart(pfPieChart, [
                data.pie.pf.r,
                data.pie.pf.y,
                data.pie.pf.b
            ]);
        });


        // Request initial data
        socket.emit("get_today_graph");



        /* ---------------- SOCKET CONNECTION ---------------- */
        socket.on('connect', () => {
            console.log("✅ Connected to server");
            socket.emit("get_today_graph");
        });

        /* =========================
           RUN HOUR VARIABLES
           ========================= */

        let machineRunning = false;
        let lastOnTimestamp = null;

        // Load stored values
        let totalRunMs = parseInt(localStorage.getItem("totalRunMs")) || 0;
        let storedDate = localStorage.getItem("runDate");

        // Today date (YYYY-MM-DD)
        const todayDate = new Date().toISOString().split("T")[0];

        // Reset if new day
        if (storedDate !== todayDate) {
            totalRunMs = 0;
            localStorage.setItem("totalRunMs", 0);
            localStorage.setItem("runDate", todayDate);
        }


        /* ---------------- LIVE CURRENT ---------------- */
        socket.on("live_current", (data) => {
            console.log("📡 live_current received:", data);
            const toggle = document.getElementById("deviceToggle");
            if (toggle) {
                toggle.checked = true;
                toggle.dispatchEvent(new Event("change"));
            }
            if (data.cur1 === null || data.cur2 === null || data.cur3 === null) return;

            // Add new point function
            function addPoint(chart, values, time) {
                const timeIndex = chart.data.labels.indexOf(time);
                if (timeIndex !== -1) {
                    chart.data.datasets.forEach((ds, i) => ds.data[timeIndex] = values[i]);
                } else {
                    chart.data.labels.push(time);
                    chart.data.datasets.forEach((ds, i) => ds.data.push(values[i]));

                    if (chart.data.labels.length > 1440) { // keep last 24h
                        chart.data.labels.shift();
                        chart.data.datasets.forEach(ds => ds.data.shift());
                    }
                }
                chart.update();
            }

            const time = data.time; // "HH:MM"

            // Update current chart
            addPoint(currentChart, [data.cur1, data.cur2, data.cur3], time);

            // Update power chart
            addPoint(powerChart, [data.pow1, data.pow2, data.pow3], time);

            // Update voltage chart
            addPoint(voltageChart, [data.vol1, data.vol2, data.vol3], time);

            /* -------- ENERGY CHART -------- */
            addPoint(energyChart, [
                data.energy1,
                data.energy2,
                data.energy3
            ], time);

            /* -------- FREQUENCY CHART -------- */
            addPoint(frequencyChart, [
                data.frequency1,
                data.frequency2,
                data.frequency3
            ], time);

            /* -------- POWER FACTOR CHART -------- */
            addPoint(pfChart, [
                data.pf1,
                data.pf2,
                data.pf3
            ], time);

            updateChart(currentPieChart, [data.cur1, data.cur2, data.cur3]);
            updateChart(voltagePieChart, [data.vol1, data.vol2, data.vol3]);
            updateChart(powerPieChart, [data.pow1, data.pow2, data.pow3]);

            updateChart(energyPieChart, [
                data.energy1,
                data.energy2,
                data.energy3
            ]);

            updateChart(frequencyPieChart, [
                data.frequency1,
                data.frequency2,
                data.frequency3
            ]);

            updateChart(pfPieChart, [
                data.pf1,
                data.pf2,
                data.pf3
            ]);

            // Optional: update DOM elements
            cur1El.innerText = data.cur1 + " A";
            cur2El.innerText = data.cur2 + " A";
            cur3El.innerText = data.cur3 + " A";

            // Voltage
            vol1El.innerText = data.vol1 + " V";
            vol2El.innerText = data.vol2 + " V";
            vol3El.innerText = data.vol3 + " V";

            // Active Power (phase-wise)
            pow1El.innerText = data.pow1.toFixed(0) + " W";
            pow2El.innerText = data.pow2.toFixed(0) + " W";
            pow3El.innerText = data.pow3.toFixed(0) + " W";

            // ENERGY
            energy1El.innerText = data.energy1 + " kWh";
            energy2El.innerText = data.energy2 + " kWh";
            energy3El.innerText = data.energy3 + " kWh";

            // FREQUENCY
            freq1El.innerText = data.frequency1 + " Hz";
            freq2El.innerText = data.frequency2 + " Hz";
            freq3El.innerText = data.frequency3 + " Hz";


            // POWER FACTOR
            pf1El.innerText = (data.power_factor1 ?? 0).toFixed(2);
            pf2El.innerText = (data.power_factor2 ?? 0).toFixed(2);
            pf3El.innerText = (data.power_factor3 ?? 0).toFixed(2);


            /* =========================
               APPARENT POWER (VA)
               ========================= */

            // Phase-wise Apparent Power
            const Sr = data.vol1 * data.cur1;
            const Sy = data.vol2 * data.cur2;
            const Sb = data.vol3 * data.cur3;

            // Total Apparent Power
            const S_total = Sr + Sy + Sb;

            // UI update
            document.getElementById("apparentPower").innerText =
                Math.round(S_total);


            /* =========================
               ACTIVE POWER (W)
               ========================= */

            const P_total = data.pow1 + data.pow2 + data.pow3;
            const P_total_kW = P_total / 1000;
            document.getElementById("activePower").innerText =
                P_total_kW.toFixed(2);

            /* =========================
               REACTIVE POWER (VAR)
               ========================= */

            let Q_total = 0;

            // Numerical safety check
            if (S_total > 0 && P_total >= 0 && S_total >= P_total) {
                Q_total = Math.sqrt(
                    (S_total * S_total) - (P_total * P_total)
                );
            }

            // UI update
            document.getElementById("reactivePower").innerText =
                Math.round(Q_total);

            // Apparent Energy

            const time_hours = 1 / 60;
            let apparentEnergy = 0;

            // keep cumulative value
            apparentEnergy += S_total * (1 / 60); // if data every 1 min

            document.getElementById("apparentEnergy").innerText =
                apparentEnergy.toFixed(2) ;
                
            /* =========================
               POWER FACTOR (unitless)
               ========================= */

            let PF = 0;
            if (S_total > 0) {
                PF = P_total / S_total;
            }

            // Clamp PF between 0–1
            PF = Math.max(0, Math.min(PF, 1));

            const pfEl = document.getElementById("powerFactor");
            if (pfEl) {
                pfEl.innerText = PF.toFixed(2);

                // Optional color logic
                if (PF < 0.8) pfEl.style.color = "red";
                else if (PF < 0.9) pfEl.style.color = "orange";
                else pfEl.style.color = "green";
            }



            if (data.cur1 === null || data.cur2 === null || data.cur3 === null) return;

            /* =========================
            RUN HOUR CALCULATION
            ========================= */

            // Machine ON condition (threshold)
            const RUN_CURRENT_THRESHOLD = 0.2;

            const isRunningNow =
                data.cur1 > RUN_CURRENT_THRESHOLD ||
                data.cur2 > RUN_CURRENT_THRESHOLD ||
                data.cur3 > RUN_CURRENT_THRESHOLD;

            const now = Date.now();

            // Machine JUST STARTED
            if (isRunningNow && !machineRunning) {
                machineRunning = true;
                lastOnTimestamp = now;
            }

            // Machine JUST STOPPED
            if (!isRunningNow && machineRunning) {
                machineRunning = false;
                totalRunMs += now - lastOnTimestamp;
                lastOnTimestamp = null;

                localStorage.setItem("totalRunMs", totalRunMs);
            }

            // Machine STILL RUNNING → live update
            let displayRunMs = totalRunMs;
            if (machineRunning && lastOnTimestamp) {
                displayRunMs += now - lastOnTimestamp;
            }

            // Convert ms → hours
            const runHours = displayRunMs / (1000 * 60 * 60);

            // Update UI
            const runHourEl = document.getElementById("runHour");
            if (runHourEl) {
                runHourEl.innerText = runHours.toFixed(2) + " HR";
            }


        });

        /* ---------------- LIVE CURRENT ---------------- */
        socket.on("live_meter", (data) => {
            console.log("📡 live_current received:", data);
            const toggle = document.getElementById("deviceToggle");
            if (toggle) {
                toggle.checked = true;
                toggle.dispatchEvent(new Event("change"));
            }
            if (data.cur1 === null || data.cur2 === null || data.cur3 === null) return;

            // Add new point function
            function addPoint(chart, values, time) {
                const timeIndex = chart.data.labels.indexOf(time);
                if (timeIndex !== -1) {
                    chart.data.datasets.forEach((ds, i) => ds.data[timeIndex] = values[i]);
                } else {
                    chart.data.labels.push(time);
                    chart.data.datasets.forEach((ds, i) => ds.data.push(values[i]));

                    if (chart.data.labels.length > 1440) { // keep last 24h
                        chart.data.labels.shift();
                        chart.data.datasets.forEach(ds => ds.data.shift());
                    }
                }
                chart.update();
            }

            const time = data.time; // "HH:MM"

            // Update current chart
            addPoint(currentChart, [data.cur1, data.cur2, data.cur3], time);

            // Update power chart
            addPoint(powerChart, [data.pow1, data.pow2, data.pow3], time);

            // Update voltage chart
            addPoint(voltageChart, [data.vol1, data.vol2, data.vol3], time);

            /* -------- ENERGY CHART -------- */
            addPoint(energyChart, [
                data.energy1,
                data.energy2,
                data.energy3
            ], time);

            /* -------- FREQUENCY CHART -------- */
            addPoint(frequencyChart, [
                data.frequency1,
                data.frequency2,
                data.frequency3
            ], time);

            /* -------- POWER FACTOR CHART -------- */
            addPoint(pfChart, [
                data.pf1,
                data.pf2,
                data.pf3
            ], time);

            updateChart(currentPieChart, [data.cur1, data.cur2, data.cur3]);
            updateChart(voltagePieChart, [data.vol1, data.vol2, data.vol3]);
            updateChart(powerPieChart, [data.pow1, data.pow2, data.pow3]);

            updateChart(energyPieChart, [
                data.energy1,
                data.energy2,
                data.energy3
            ]);

            updateChart(frequencyPieChart, [
                data.frequency1,
                data.frequency2,
                data.frequency3
            ]);

            updateChart(pfPieChart, [
                data.pf1,
                data.pf2,
                data.pf3
            ]);

            // Optional: update DOM elements
            cur1El.innerText = data.cur1 + " A";
            cur2El.innerText = data.cur2 + " A";
            cur3El.innerText = data.cur3 + " A";

            // Voltage
            vol1El.innerText = data.vol1 + " V";
            vol2El.innerText = data.vol2 + " V";
            vol3El.innerText = data.vol3 + " V";

            // Active Power (phase-wise)
            pow1El.innerText = data.pow1.toFixed(0) + " W";
            pow2El.innerText = data.pow2.toFixed(0) + " W";
            pow3El.innerText = data.pow3.toFixed(0) + " W";

            // ENERGY
            energy1El.innerText = data.energy1 + " kWh";
            energy2El.innerText = data.energy2 + " kWh";
            energy3El.innerText = data.energy3 + " kWh";

            // FREQUENCY
            freq1El.innerText = data.freq1 + " Hz";
            freq2El.innerText = data.freq2 + " Hz";
            freq3El.innerText = data.freq3 + " Hz";


            // POWER FACTOR
            pf1El.innerText = data.pf1;
            pf2El.innerText = data.pf2;
            pf3El.innerText = data.pf3;


            /* =========================
               APPARENT POWER (VA)
               ========================= */

            // Phase-wise Apparent Power
            const Sr = data.vol1 * data.cur1;
            const Sy = data.vol2 * data.cur2;
            const Sb = data.vol3 * data.cur3;

            // Total Apparent Power
            const S_total = Sr + Sy + Sb;

            // UI update
            document.getElementById("apparentPower").innerText =
                Math.round(S_total);


            /* =========================
               ACTIVE POWER (W)
               ========================= */

            const P_total = data.pow1 + data.pow2 + data.pow3;


            /* =========================
               REACTIVE POWER (VAR)
               ========================= */

            let Q_total = 0;

            // Numerical safety check
            if (S_total > 0 && P_total >= 0 && S_total >= P_total) {
                Q_total = Math.sqrt(
                    (S_total * S_total) - (P_total * P_total)
                );
            }

            // UI update
            document.getElementById("reactivePower").innerText =
                Math.round(Q_total);


            /* =========================
               POWER FACTOR (unitless)
               ========================= */

            let PF = 0;
            if (S_total > 0) {
                PF = P_total / S_total;
            }

            // Clamp PF between 0–1
            PF = Math.max(0, Math.min(PF, 1));

            const pfEl = document.getElementById("powerFactor");
            if (pfEl) {
                pfEl.innerText = PF.toFixed(2);

                // Optional color logic
                if (PF < 0.8) pfEl.style.color = "red";
                else if (PF < 0.9) pfEl.style.color = "orange";
                else pfEl.style.color = "green";
            }



            if (data.cur1 === null || data.cur2 === null || data.cur3 === null) return;

            /* =========================
            RUN HOUR CALCULATION
            ========================= */

            // Machine ON condition (threshold)
            const RUN_CURRENT_THRESHOLD = 0.2;

            const isRunningNow =
                data.cur1 > RUN_CURRENT_THRESHOLD ||
                data.cur2 > RUN_CURRENT_THRESHOLD ||
                data.cur3 > RUN_CURRENT_THRESHOLD;

            const now = Date.now();

            // Machine JUST STARTED
            if (isRunningNow && !machineRunning) {
                machineRunning = true;
                lastOnTimestamp = now;
            }

            // Machine JUST STOPPED
            if (!isRunningNow && machineRunning) {
                machineRunning = false;
                totalRunMs += now - lastOnTimestamp;
                lastOnTimestamp = null;

                localStorage.setItem("totalRunMs", totalRunMs);
            }

            // Machine STILL RUNNING → live update
            let displayRunMs = totalRunMs;
            if (machineRunning && lastOnTimestamp) {
                displayRunMs += now - lastOnTimestamp;
            }

            // Convert ms → hours
            const runHours = displayRunMs / (1000 * 60 * 60);

            // Update UI
            const runHourEl = document.getElementById("runHour");
            if (runHourEl) {
                runHourEl.innerText = runHours.toFixed(2) + " HR";
            }


        });


        /* ---------------- DEVICE STATUS ---------------- */

        const statusDiv = document.getElementById("runStatus");
        const wifiIcon = document.getElementById("wifiIcon"); // Assuming the WiFi icon is the only image in the card
        /* ---------------- DEVICE STATUS ---------------- */
        socket.on("device_status", (data) => {
            console.log("⚡ Device status:", data);

            if (data.device_id !== "3Phase862733079332931") return;

            if (data.status === "online") {
                statusDiv.innerText = "ONLINE";
                wifiIcon.src = "../static/img/wifiiii.png";   // online image
                statusDiv.classList.add("online");
                statusDiv.classList.remove("offline");
            } else {
                statusDiv.innerText = "OFFLINE";
                wifiIcon.src = "../static/img/wifi_off.png";   // offline image
                statusDiv.classList.add("offline");
                statusDiv.classList.remove("online");
            }
        });


        socket.on("runtime_update", function (data) {

            let time = data.runtime;   // example "03:15"

            let parts = time.split(":");
            let hr = parts[0];
            let min = parts[1];

            document.getElementById("runtime").innerText = hr + " Hr " + min + " Min";

        });

        /* ---------------- DATE RANGE SELECT ---------------- */
        dateRangeSelect.addEventListener("change", () => {
            if (dateRangeSelect.value === "custom") {
                customPicker.style.display = "flex";
                console.log("Set Range selected → calendar visible");
            } else if (dateRangeSelect.value === "today") {
                customPicker.style.display = "none";
                console.log("Today selected → fetching today's graph");
                socket.emit("get_today_graph");
            }
        });

        applyBtn.addEventListener("click", () => {
            const start = document.getElementById("startDate").value;
            const end = document.getElementById("endDate").value;
            console.log("Custom range applied:", start, "to", end);
            socket.emit("get_custom_graph", { start, end });
        });


        /* ---------------- TODAY GRAPH DATA ---------------- */
        socket.on("today_graph_data", (data) => {
            console.log("📈 Today graph data received:-----------", data);
            const normalized = normalize24HourData(data);

            // Current
            currentChart.data.labels = normalized.labels;
            currentChart.data.datasets[0].data = normalized.cur1;
            currentChart.data.datasets[1].data = normalized.cur2;
            currentChart.data.datasets[2].data = normalized.cur3;
            currentChart.update();

            // Power
            powerChart.data.labels = normalized.labels;
            powerChart.data.datasets[0].data = normalized.pow1;
            powerChart.data.datasets[1].data = normalized.pow2;
            powerChart.data.datasets[2].data = normalized.pow3;
            powerChart.update();

            // Voltage
            voltageChart.data.labels = normalized.labels;
            voltageChart.data.datasets[0].data = normalized.vol1;
            voltageChart.data.datasets[1].data = normalized.vol2;
            voltageChart.data.datasets[2].data = normalized.vol3;
            voltageChart.update();

            // Energy
            energyChart.data.labels = normalized.labels;
            energyChart.data.datasets[0].data = normalized.energy1;
            energyChart.data.datasets[1].data = normalized.energy2;
            energyChart.data.datasets[2].data = normalized.energy3;
            energyChart.update();

            // Frequency
            frequencyChart.data.labels = normalized.labels;
            frequencyChart.data.datasets[0].data = normalized.freq1;
            frequencyChart.data.datasets[1].data = normalized.freq2;
            frequencyChart.data.datasets[2].data = normalized.freq3;
            frequencyChart.update();

            // Power Factor
            pfChart.data.labels = normalized.labels;
            pfChart.data.datasets[0].data = normalized.pf1;
            pfChart.data.datasets[1].data = normalized.pf2;
            pfChart.data.datasets[2].data = normalized.pf3;
            pfChart.update();
        });

        /* ---------------- CUSTOM GRAPH DATA ---------------- */
        socket.on("custom_graph_data", (data) => {
            console.log("📈 Set range graph data received:", data);
            const normalized = normalize24HourData(data);
            console.log("📊 Normalized data:", normalized);

            // Current
            currentChart.data.labels = normalized.labels;
            currentChart.data.datasets[0].data = normalized.cur1;
            currentChart.data.datasets[1].data = normalized.cur2;
            currentChart.data.datasets[2].data = normalized.cur3;
            currentChart.update();

            // Power
            powerChart.data.labels = normalized.labels;
            powerChart.data.datasets[0].data = normalized.pow1;
            powerChart.data.datasets[1].data = normalized.pow2;
            powerChart.data.datasets[2].data = normalized.pow3;
            powerChart.update();

            // Voltage
            voltageChart.data.labels = normalized.labels;
            voltageChart.data.datasets[0].data = normalized.vol1;
            voltageChart.data.datasets[1].data = normalized.vol2;
            voltageChart.data.datasets[2].data = normalized.vol3;
            voltageChart.update();

            // Energy
            energyChart.data.labels = normalized.labels;
            energyChart.data.datasets[0].data = normalized.energy1;
            energyChart.data.datasets[1].data = normalized.energy2;
            energyChart.data.datasets[2].data = normalized.energy3;
            energyChart.update();

            // Frequency
            frequencyChart.data.labels = normalized.labels;
            frequencyChart.data.datasets[0].data = normalized.freq1;
            frequencyChart.data.datasets[1].data = normalized.freq2;
            frequencyChart.data.datasets[2].data = normalized.freq3;
            frequencyChart.update();

            // Power Factor
            pfChart.data.labels = normalized.labels;
            pfChart.data.datasets[0].data = normalized.pf1;
            pfChart.data.datasets[1].data = normalized.pf2;
            pfChart.data.datasets[2].data = normalized.pf3;
            pfChart.update();
        });

        /* ---------------- NORMALIZE 24H DATA ---------------- */
        function normalize24HourData(apiData) {
            const fullLabels = [];
            const cur1 = [], cur2 = [], cur3 = [];
            const vol1 = [], vol2 = [], vol3 = [];
            const pow1 = [], pow2 = [], pow3 = [];

            const energy1 = [], energy2 = [], energy3 = [];
            const freq1 = [], freq2 = [], freq3 = [];
            const pf1 = [], pf2 = [], pf3 = [];

            // 🔹 Create lookup map from backend data
            const dataMap = {};
            (apiData.labels || []).forEach((time, index) => {
                dataMap[time] = {
                    c1: (apiData.cur1 && apiData.cur1[index] != undefined) ? apiData.cur1[index] : null,
                    c2: (apiData.cur2 && apiData.cur2[index] != undefined) ? apiData.cur2[index] : null,
                    c3: (apiData.cur3 && apiData.cur3[index] != undefined) ? apiData.cur3[index] : null,

                    v1: (apiData.vol1 && apiData.vol1[index] != undefined) ? apiData.vol1[index] : null,
                    v2: (apiData.vol2 && apiData.vol2[index] != undefined) ? apiData.vol2[index] : null,
                    v3: (apiData.vol3 && apiData.vol3[index] != undefined) ? apiData.vol3[index] : null,

                    p1: (apiData.pow1 && apiData.pow1[index] != undefined) ? apiData.pow1[index] : null,
                    p2: (apiData.pow2 && apiData.pow2[index] != undefined) ? apiData.pow2[index] : null,
                    p3: (apiData.pow3 && apiData.pow3[index] != undefined) ? apiData.pow3[index] : null,

                    // ENERGY
                    e1: (apiData.energy1 && apiData.energy1[index] != undefined) ? apiData.energy1[index] : null,
                    e2: (apiData.energy2 && apiData.energy2[index] != undefined) ? apiData.energy2[index] : null,
                    e3: (apiData.energy3 && apiData.energy3[index] != undefined) ? apiData.energy3[index] : null,

                    // FREQUENCY
                    f1: (apiData.freq1 && apiData.freq1[index] != undefined) ? apiData.freq1[index] : null,
                    f2: (apiData.freq2 && apiData.freq2[index] != undefined) ? apiData.freq2[index] : null,
                    f3: (apiData.freq3 && apiData.freq3[index] != undefined) ? apiData.freq3[index] : null,

                    // POWER FACTOR
                    pf1: (apiData.pf1 && apiData.pf1[index] != undefined) ? apiData.pf1[index] : null,
                    pf2: (apiData.pf2 && apiData.pf2[index] != undefined) ? apiData.pf2[index] : null,
                    pf3: (apiData.pf3 && apiData.pf3[index] != undefined) ? apiData.pf3[index] : null
                };
            });


            // 🔹 Generate 24 hours (1440 minutes)
            for (let h = 0; h < 24; h++) {
                for (let m = 0; m < 60; m++) {
                    const time =
                        String(h).padStart(2, "0") + ":" +
                        String(m).padStart(2, "0");

                    fullLabels.push(time);

                    if (dataMap[time]) {
                        cur1.push(dataMap[time].c1);
                        cur2.push(dataMap[time].c2);
                        cur3.push(dataMap[time].c3);

                        vol1.push(dataMap[time].v1);
                        vol2.push(dataMap[time].v2);
                        vol3.push(dataMap[time].v3);

                        pow1.push(dataMap[time].p1);
                        pow2.push(dataMap[time].p2);
                        pow3.push(dataMap[time].p3);

                        energy1.push(dataMap[time].e1);
                        energy2.push(dataMap[time].e2);
                        energy3.push(dataMap[time].e3);

                        freq1.push(dataMap[time].f1);
                        freq2.push(dataMap[time].f2);
                        freq3.push(dataMap[time].f3);

                        pf1.push(dataMap[time].pf1);
                        pf2.push(dataMap[time].pf2);
                        pf3.push(dataMap[time].pf3);
                    } else {
                        cur1.push(null); cur2.push(null); cur3.push(null);
                        vol1.push(null); vol2.push(null); vol3.push(null);
                        pow1.push(null); pow2.push(null); pow3.push(null);
                        energy1.push(null); energy2.push(null); energy3.push(null);
                        freq1.push(null); freq2.push(null); freq3.push(null);
                        pf1.push(null); pf2.push(null); pf3.push(null);
                    }
                }
            }

            return {
                labels: fullLabels,
                cur1, cur2, cur3,
                vol1, vol2, vol3,
                pow1, pow2, pow3,
                energy1, energy2, energy3,
                freq1, freq2, freq3,
                pf1, pf2, pf3
            };
        }



    })
    .catch(err => console.error("Fetch error:", err));


//download the function here

function toggleDropdown() {

    const dropdown = document.getElementById("downloadOptions");

    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }

}


// Today direct download
function downloadToday() {
    // close dropdown
    document.getElementById("downloadOptions").style.display = "none";

    window.location.href = "/download_excel";

}


// Selected date download
function downloadSelectedDate() {

    const dateInput = document.getElementById("selectedDate");
    const date = dateInput.value;

    if (!date) return;
    // close dropdown
    document.getElementById("downloadOptions").style.display = "none";

    window.location.href = "/download_excel?date=" + date;

    // clear date after download
    dateInput.value = "";

}

if (window.innerWidth <= 450) {
    const canvas = document.getElementById("voltageChart");
    canvas.width = 500;
    canvas.height = 340;
}


function dismissAlert(id) {

    const card = document.getElementById(id)

    const device = card.dataset.device
    const type = card.dataset.type
    const time = card.dataset.time

    // send delete request
    fetch("/delete_alert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            device: device,
            type: type,
            time: time
        })
    })

    card.style.opacity = "0"
    card.style.transform = "translateX(20px)"

    setTimeout(() => {
        card.remove()
    }, 300)

}