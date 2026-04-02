fetch('static/js/ip.json')
    .then(res => res.json())
    .then(data => {
        const socket = io(data.ip);
       
        /* ---------- SOCKET DATA ---------- */


        socket.on("live_meter", (data) => {

            console.log("Received data:", data); // Debugging log

            /* CURRENT */
            document.getElementById("cur1").innerText = data.cur1 + " A";
            document.getElementById("cur2").innerText = data.cur2 + " A";
            document.getElementById("cur3").innerText = data.cur3 + " A";

            /* VOLTAGE */
            document.getElementById("vol1").innerText = data.vol1 + " V";
            document.getElementById("vol2").innerText = data.vol2 + " V";
            document.getElementById("vol3").innerText = data.vol3 + " V";

            /* POWER */
            document.getElementById("pow1").innerText = data.pow1.toFixed(0) + " W";
            document.getElementById("pow2").innerText = data.pow2.toFixed(0) + " W";
            document.getElementById("pow3").innerText = data.pow3.toFixed(0) + " W";

            /* ENERGY */
            if (data.energy1)
                document.getElementById("energy1").innerText = data.energy1.toFixed(2) + " kWh";

            if (data.energy2)
                document.getElementById("energy2").innerText = data.energy2.toFixed(2) + " kWh";

            if (data.energy3)
                document.getElementById("energy3").innerText = data.energy3.toFixed(2) + " kWh";

            /* FREQUENCY */
            if (data.freq1)
                document.getElementById("freq1").innerText = data.freq1.toFixed(2) + " Hz";

            if (data.freq2)
                document.getElementById("freq2").innerText = data.freq2.toFixed(2) + " Hz";

            if (data.freq3)
                document.getElementById("freq3").innerText = data.freq3.toFixed(2) + " Hz";

            /* POWER FACTOR */

            if (data.pf1)
                document.getElementById("pf1").innerText = data.pf1.toFixed(2);

            if (data.pf2)
                document.getElementById("pf2").innerText = data.pf2.toFixed(2);

            if (data.pf3)
                document.getElementById("pf3").innerText = data.pf3.toFixed(2);

        });


        
        const alertColors = {
            "VOLTAGE": { bg: "#fff3cd", border: "#ffc107", icon: "⚡", label: "VOLTAGE" },
            "CURRENT": { bg: "#fde8e8", border: "#f44336", icon: "🔌", label: "CURRENT" }
        };

        function showAlertCard(data) {
            const container = document.getElementById("alertContainer");

            // Duplicate check — same message same timestamp toh skip
            const existing = [...container.querySelectorAll(".alert-card")];
            for (let c of existing) {
                if (c.dataset.msg === data.message) return;
            }

            const style = alertColors[data.alert_type] ||
                { bg: "#e8f4fd", border: "#2196F3", icon: "⚠️", label: data.alert_type };

            const phaseNames = { 1: "R", 2: "Y", 3: "B" };
            const phaseName = phaseNames[data.phase] || data.phase;

            const card = document.createElement("div");
            card.className = "alert-card";
            card.dataset.msg = data.message;
            card.style.cssText = `
        background: ${style.bg};
        border-left: 4px solid ${style.border};
        border-radius: 10px;
        padding: 12px 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        position: relative;
        font-family: 'DM Sans', sans-serif;
    `;

            card.innerHTML = `
        <button onclick="dismissAlert(this)" style="
            position: absolute;
            top: 8px; right: 10px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #888;
            line-height: 1;
        ">✕</button>

        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span style="font-size:18px;">${style.icon}</span>
            <strong style="font-size:13px; color:#333;">${style.label} ALERT — Phase ${phaseName}</strong>
        </div>

        <div style="font-size:12px; color:#555; line-height:1.5;">
            ${data.message}
        </div>

        <div style="font-size:11px; color:#999; margin-top:6px;">
            🕐 ${data.timestamp}
        </div>
    `;

            container.prepend(card);  // Naya card upar aaye
        }

        function dismissAlert(btn) {
            const card = btn.closest(".alert-card");
            card.style.animation = "slideOut 0.25s ease forwards";
            setTimeout(() => card.remove(), 250);
        }

        // ── Socket listeners ─────────────────────────────────────────────────────
        socket.on("alert", function (data) {
            console.log("🚨 Alert received:", data);
            showAlertCard(data);
        });

    })
    .catch(err => console.error("Fetch error:", err));