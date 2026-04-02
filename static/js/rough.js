{device_id:3Phase862733079332931:
Voltage1:
Current1:
Power1:
Energy1:
Frequency1:
PowerFactor1:
Voltage2:
Current2:
Power2:
Energy2:
Frequency2:
PowerFactor2:
Voltage3:
Current3:
Power3:
Energy3:
Frequency3:
PowerFactor3}



 const toggle = document.getElementById("deviceToggle");
        const toggleText = document.getElementById("toggleText");

        const select = document.getElementById("metricSelect");

        const sections = {
            current: document.getElementById("currentSection"),
            voltage: document.getElementById("voltageSection"),
            power: document.getElementById("powerSection"),
            energy: document.getElementById("energySection"),
            frequency: document.getElementById("frequencySection"),
            pf: document.getElementById("pfSection")
        };

        // 🔹 PAGE LOAD pe default sirf CURRENT dikhana
        function showSection(name) {
            Object.values(sections).forEach(sec => {
                sec.style.display = "none";
            });
            sections[name].style.display = "block";
        }

        // default load
        showSection("current");

        // dropdown change
        select.addEventListener("change", () => {
            showSection(select.value);
        });

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

        function downloadExcel() {
            // Trigger file download
            window.location.href = '/download_excel';
        }


        document.getElementById("pumpToggle").addEventListener("change", function () {
            const status = document.getElementById("runStatus");
            if (this.checked) {
                status.innerText = "ONLINE";
                status.classList.add("online");
            } else {
                status.innerText = "OFFLINE";
                status.classList.remove("online");
            }
        });

        /* ---------- PARAMETER SWITCHER ---------- */