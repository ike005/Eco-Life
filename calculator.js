document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("carbon-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting

        const driveMiles = parseFloat(document.getElementById("drive-miles").value);
        const transport = document.getElementById("transport").value;
        const electricityBill = parseFloat(document.getElementById("electricity-bill").value);
        const usesGas = document.getElementById("gas-therms").value;
        const diet = document.getElementById("diet").value;
        const recycle = document.getElementById("recycle").value;

        // Calculate carbon footprint
        let totalEmition = 0;

        const carEmission = driveMiles * 0.27;
        totalEmition += carEmission;

        const KWH = electricityBill / 0.14;
        const electricityEmission = KWH * 0.42;
        totalEmition += electricityEmission;

        let gasEmission = 0;
        if (usesGas === "yes") {
            const therms = 30;
            gasEmission = therms * 2.1;
            totalEmition += gasEmission;
        }

        let dietEmission = 0;
        if (diet === "high_meat") {
            dietEmission = 3.3;
        } else if (diet === "mixed") {
            dietEmission = 2.5;
        } else if (diet === "vegetarian") {
            dietEmission = 1.5;
        } else if (diet === "vegan") {
            dietEmission = 1.5;
        }
        totalEmition += dietEmission;

        if (recycle === "no") {
            totalEmition += 200;
        }


        //Display in bar chart
        const yourData = [carEmission, electricityEmission, gasEmission, dietEmission * 1000, recycle === 'no' ? 200 : 0];
        const avgData = [300, 450, 250, 2200, 150];

        const ctx = document.getElementById("myChart").getContext("2d");

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Driving', 'Electricity', 'Gas', 'Diet', 'Recycling'],
                datasets: [{
                    label: 'Emissions (kg CO₂)',
                    data: yourData,
                    backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#f44336']
                },
                {
                    label: 'Average Emissions (kg CO₂)',
                    data: avgData,
                    backgroundColor: ['#c8e6c9', '#bbdefb', '#ffe0b2', '#e1bee7', '#ffcdd2']
                }]
                
            },
            options: {
                scales: {
                  y: {
                    beginAtZero: true
                    
                  }
                }
              }
        });

        const tipBox = document.getElementById("tip-box");
        tipBox.style.display = "block";

        const tips = [];

        if (carEmission > 50) {
            tips.push("Consider using public transport or carpooling to reduce your driving emissions.");
        }
        if (electricityEmission > 150) {
            tips.push("Switch to energy-efficient appliances or consider renewable energy sources.");
        }
        if (gasEmission === "no") {
            tips.push("Consider using electric heating or renewable energy sources for your home heating.");
        }
        if (diet === "high_meat") {
            tips.push("Consider reducing your meat consumption or switching to a more plant-based diet.");
        }
        if (recycle === "no") {
            tips.push("Start recycling to reduce waste and lower your carbon footprint.");
        }

        const list = document.getElementById("tip-list");
        list.innerHTML = ""; 
        tips.forEach(tip => {
            const li = document.createElement("li");
            li.textContent = tip;
            list.appendChild(li);
    });
    });
});
