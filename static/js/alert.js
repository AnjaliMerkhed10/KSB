fetch('static/js/ip.json')
    .then(res => res.json())
    .then(data => {
        const socket = io.connect(data.ip);

        socket.on('connect', () => {
            console.log("Connected to server");
        });

        // socket.on("live_current", data => {
        //     console.log("Received:", data);
        //     document.getElementById("cur1").innerText = (data.cur1 ?? "-") + " A";
        //     document.getElementById("cur2").innerText = (data.cur2 ?? "-") + " A";
        //     document.getElementById("cur3").innerText = (data.cur3 ?? "-") + " A";
        // });

        socket.on("live_current", (data) => {
            console.log("📡 live_current received:", data);

            const cur1El = document.getElementById("cur1");
            const cur2El = document.getElementById("cur2");
            const cur3El = document.getElementById("cur3");

            // If backend sent null → show --
            if (data.cur1 === null || data.cur2 === null || data.cur3 === null) {
                cur1El.innerText = "-- A";
                cur2El.innerText = "-- A";
                cur3El.innerText = "-- A";

                // Optional: grey effect
                cur1El.classList.add("stale");
                cur2El.classList.add("stale");
                cur3El.classList.add("stale");

                console.log("⚠ Stale data → showing --");
                return;
            }

            // Fresh data
            cur1El.innerText = data.cur1 + " A";
            cur2El.innerText = data.cur2 + " A";
            cur3El.innerText = data.cur3 + " A";

            cur1El.classList.remove("stale");
            cur2El.classList.remove("stale");
            cur3El.classList.remove("stale");
        });

        socket.on("device_status", (data) => {
            console.log("⚡ Device status received from backend:", data); // <- Add this line
            if (data.device_id !== "862733079361476") return;

            const statusDiv = document.getElementById("deviceStatus");

            if (data.status === "online") {
                statusDiv.innerText = "ONLINE";
                statusDiv.classList.remove("offline");
                statusDiv.classList.add("online");
            } else {
                statusDiv.innerText = "OFFLINE";
                statusDiv.classList.remove("online");
                statusDiv.classList.add("offline");
            }
        });

        //     socket.on("alert", (data) => {
        //         console.log("⚠ Alert received:", data);

        //         const mainAlertDiv = document.querySelector(".main_alert_div");

        //         // Use backend timestamp
        //         const timestamp = data.timestamp || "--";

        //         const alertEl = document.createElement("div");
        //         alertEl.classList.add("alert");

        //         // store alert_id
        //         alertEl.dataset.alertId = data.alert_id;

        //         alertEl.innerHTML = `
        //     <img src="../static/img/close.png" class="close" alt="close">
        //     <div class="alert_div">
        //         <img src="../static/img/alert.png" alt="alert">
        //         <span>${data.message} | ${timestamp}</span>
        //     </div>
        // `;

        //         mainAlertDiv.prepend(alertEl);

        //         // 🔴 Close button → backend emit
        //         const closeBtn = alertEl.querySelector(".close");
        //         closeBtn.addEventListener("click", () => {
        //             const alertId = alertEl.dataset.alertId;

        //             socket.emit("delete_alert", {
        //                 alert_id: alertId
        //             });

        //             alertEl.remove(); // UI se remove
        //         });
        //     });

        socket.on("alert", (data) => {
            console.log("⚠ Alert received:", data);

            console.log("Alert data:", data);

            const mainAlertDiv = document.querySelector(".main_alert_div");

            // 🔹 Format timestamp
            let formattedTime = "--";
            if (data.timestamp) {
                const d = new Date(data.timestamp.replace(" ", "T"));
                formattedTime = d.toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                });
            }

            const alertEl = document.createElement("div");
            alertEl.classList.add("alert");
            alertEl.dataset.alertId = data.alert_id;

            console.log("Alert timestamp:", data.alert_id,alertEl.dataset.alertId );

            alertEl.innerHTML = `
        <img src="../static/img/close.png" class="close" alt="close">

        <div class="alert_div">
            <img src="../static/img/alert.png" class="alert_icon" alt="alert">
            <div class="alert_text">
                <span class="alert_msg">${data.message}</span>
                <span class="alert_time">${formattedTime}</span>
            </div>
        </div>
    `;

            mainAlertDiv.prepend(alertEl);

            alertEl.querySelector(".close").addEventListener("click", () => {
                socket.emit("delete_alert", { alert_id: alertEl.dataset.alertId });
                alertEl.remove();
            });
        });

    })
    .catch(err => console.error("Fetch error:", err));
