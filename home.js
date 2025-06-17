document.addEventListener("DOMContentLoaded", function () {
    let myChart = null;
    let pieChart = null; 

    const button = document.getElementById("form-button");
    createChart();
    createPieChart();

    button.addEventListener("click", async function (e) {
        e.preventDefault();
        const countryISO1 = document.getElementById("country-select1").value;
        const countryISO2 = document.getElementById("country-select2").value;

        const response = await fetch('./historical_emissions.json');
        const jsonData = await response.json();

        const totalEmissionsArray = [];
        const countryNames = [];

        for (const item of jsonData) {
            if (item.Country === "World") continue;
            let total = 0;
            for (const key in item) {
                if (!isNaN(key)) {
                    total += parseFloat(item[key]);
                }
            }
            totalEmissionsArray.push(total);
            countryNames.push(item.Country);
        }

        const [min, max, minIndex, maxIndex] = compareValues(totalEmissionsArray);
        const minCountryName = countryNames[minIndex];
        const maxCountryName = countryNames[maxIndex];

        const selectedCountryData1 = jsonData.find(item => item.ISO === countryISO1);
        const selectedCountryData2 = jsonData.find(item => item.ISO === countryISO2);
        const minCountryData = jsonData.find(item => item.Country === minCountryName);
        const maxCountryData = jsonData.find(item => item.Country === maxCountryName);

        if (!selectedCountryData1 || !selectedCountryData2 || !minCountryData || !maxCountryData) {
            alert("Required data not found.");
            return;
        }

        const years = [];
        const selectedValues1 = [];
        const selectedValues2 = [];
        const minValues = [];
        const maxValues = [];

        for (const key in selectedCountryData1) {
            if (selectedCountryData2.hasOwnProperty(key) && !isNaN(key)){
                years.push(key);
                selectedValues1.push(parseFloat(selectedCountryData1[key]));
                selectedValues2.push(parseFloat(selectedCountryData2[key]));
                minValues.push(parseFloat(minCountryData[key]));
                maxValues.push(parseFloat(maxCountryData[key]));
            }
        }

        createChart(years, selectedValues1, selectedValues2, minValues, maxValues, selectedCountryData1.Country, selectedCountryData2.Country, minCountryName, maxCountryName);
        createPieChart();
    });

    function compareValues(array) {
        let min = array[0];
        let max = array[0];
        let minIndex = 0;
        let maxIndex = 0;

        for (let i = 1; i < array.length; i++) {
            if (array[i] < min) {
                min = array[i];
                minIndex = i;
            }
            if (array[i] > max) {
                max = array[i];
                maxIndex = i;
            }
        }

        return [min, max, minIndex, maxIndex];
    }

    function createChart(labels, selected1, selected2, min, max, selectedName1, selectedName2, minName, maxName) {
        const ctx = document.getElementById('myChart').getContext('2d');

        if (myChart) {
            myChart.destroy(); // remove old chart before creating new one
        }

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `${selectedName1} CO₂ Emissions`,
                        data: selected1,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    },
                    {
                        label: `${selectedName2} CO₂ Emissions`,
                        data: selected2,
                        borderColor: 'rgb(124, 192, 42)',
                        tension: 0.1
                    },
                    // {
                    //     label: `Lowest (${minName}) CO₂ Emissions`,
                    //     data: min,
                    //     borderColor: 'blue',
                    //     borderDash: [5, 5],
                    //     tension: 0.1
                    // },
                    // {
                    //     label: `Highest (${maxName}) CO₂ Emissions`,
                    //     data: max,
                    //     borderColor: 'red',
                    //     borderDash: [5, 5],
                    //     tension: 0.1
                    // }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2000, // total animation duration in ms
                    easing: 'easeOutQuart', // smooth easing effect
                    delay: (context) => context.dataIndex * 30 // progressively reveal each point
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'CO₂ Emissions Comparison'
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Emissions (MtCO₂)'
                        },
                        beginAtZero: true
                    }
                }
            }

        });
    }

    function createPieChart() {
        const ctx = document.getElementById('pieChart').getContext('2d');

        if (pieChart) {
            pieChart.destroy();
        }

        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                datasets: [
                    {
                        label: 'Sample Dataset',
                        data: [10, 20, 30, 25, 15], // Use your own data here
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(255, 159, 64, 0.7)',
                            'rgba(255, 205, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(54, 162, 235, 0.7)'
                        ]
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'CO₂ Emissions by Source (Example)'
                    }
                }
            }
        });
    }

});
