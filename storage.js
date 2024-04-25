const APP = {
    keybase: 'Weightloss-App-Data-',
    keys: [],
    init() {
        //start the app and load functions
        document.getElementById('btnSave').addEventListener('click', APP.saveentry);
        document.getElementById('btnview').addEventListener('click', APP.loadview);
        document.getElementById('openbtn').addEventListener('click', APP.openpanel);
        document.getElementById('btncal').addEventListener('click', APP.opencal);
        document.getElementById('calculator').addEventListener('click', APP.calculatebmr);
    },
    saveentry(ev) {//saves entry to local storage
        ev.preventDefault();
        console.log("Save button clicked!");
        //value of input fields are collected
        let indate = document.getElementById("date").value.trim();
        let inweight = document.getElementById("weight").value.trim();
        let inwork = document.getElementById("workout").value.trim();
        let indiet = document.getElementById("diet").value.trim();
        console.log("Diet:", indiet); 

        if (indate.length == 0 || inweight.length == 0 || inwork.length == 0 || indiet.length == 0) {
            alert("Please fill in all required fields.");
        }
        
            var record = {
                "date": indate,
                "weight": inweight,
                "workoutRoutine": inwork,
                "diet": indiet
            }

            let key = APP.keybase + indate.toLowerCase();
            let storage = localStorage.getItem(key);
            let records = [];
            if (storage) {
                records = JSON.parse(storage);
            }

            records.push(record);
            localStorage.setItem(key, JSON.stringify(records));
            APP.popuplateappkey();

    },
    popuplateappkey() {

        let num = localStorage.length;
        if (num) {
            APP.keys = []; //reset the keys array
            for (let i = 0; i < num; i++) {
                let key = localStorage.key(i).trim();
                if (key.startsWith(APP.keybase)) {
                    APP.keys.push(key);
                }
            }
        }
    },
    loadview() { 
        APP.popuplateappkey();
        document.getElementById("viewsidebar").style.width = "250px";
        let viewside = document.getElementById("viewsidebar");
        viewside.innerHTML = ''; // Clear existing content

            // Loop through keys and display dates as clickable elements
        APP.keys.forEach((key) => {
                let storageKey = key;
                let data = localStorage.getItem(storageKey); // Retrieve data from localStorage
                if (data) {
                    let parsedData = JSON.parse(data); // Parse data from string to object

                    // Creates clickable element for each date
                    let dateElement = document.createElement('span');
                    dateElement.textContent = key.replace(APP.keybase, '');
                    dateElement.classList.add('date-link');

                    // Add click event listener to compile data on click
                    dateElement.addEventListener('click', () => {
                        // Example: Compile data into a file
                        let filename = `data_${key}.txt`;
                        let content = JSON.stringify(parsedData, null, 2); // Convert data to JSON string
                        let blob = new Blob([content], { type: 'text/plain' });
                        let url = URL.createObjectURL(blob);

                        // Create a download link 
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    });

                    // 
                    viewside.appendChild(dateElement);

                    viewside.appendChild(document.createElement('br'));
                }
        });
        
    },
    openpanel() {
        //opens sidebar for mealplan
        document.getElementById("sidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    },

    opencal() {
        //opens sidebar for calculator
        document.getElementById("calcbar").style.width = "300px";

    },
    calculatebmr() {
        const gender = document.querySelector('input[name="gender"]:checked');
        const height = parseFloat(document.getElementById("height").value);
        const weight = parseFloat(document.getElementById("calweight").value);
        const age = parseInt(document.getElementById("age").value);
        const activityLevel = parseFloat(document.getElementById("activityLevel").value);

        // Calculate BMR (Basal Metabolic Rate)
        let bmr;
        if (gender && height && weight && age) {
            if (gender.id === "male") {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else if (gender.id === "female") {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }

            // Calculate calorie intake based on activity level
            const calorieIntake = Math.round(bmr * activityLevel);
            alert("Your estimated calorie intake per day: " + calorieIntake);
        } else {
            alert("Please fill in all required fields.");
        }
    }
}

APP.init();
