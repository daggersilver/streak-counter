document.addEventListener("DOMContentLoaded", () => {
    const clockContainer = document.getElementById("clock-container");
    const daysLabel = document.getElementById("days");
    const hoursLabel = document.getElementById("hours");
    const minutesLabel = document.getElementById("minutes");
    const secondsLabel = document.getElementById("seconds");
    const resetBtn = document.getElementById("reset-btn");

    const API_URL = "http://localhost:3000/api";

    if(!localStorage.getItem("streak-counter-data")) {
        fetch(API_URL)
        .then((rawData) => rawData.json())
        .then((data) => { 
            if(data === null) {
                fetch(API_URL, {method: "POST"})
                .then((resp) => resp.json())
                .then((data) => {
                    localStorage.setItem("streak-counter-data", JSON.stringify(data));
                    addClock(data.time);
                })
                .catch(err => {renderError("Server Error, refresh or please try later")});
            }
            else {
                localStorage.setItem("streak-counter-data", JSON.stringify(data));
                addClock(data.time);
            }
        })
        .catch(err => {renderError("Server Error, refresh or please try later")});
    }
    else {
        let timeElasped = JSON.parse(localStorage.getItem("streak-counter-data")).time;
        addClock(timeElasped);
    }

    resetBtn.addEventListener("click", () => {
        let confirmDelete = confirm("Are you sure to reset streak ?");

        if(!confirmDelete) 
            return;

        fetch(API_URL, {method: "DELETE"})
        .then(() => {
            localStorage.removeItem("streak-counter-data");
            window.location = "/";
        })
    })

    function addClock(refTime) {
        setClock(refTime);
        clockContainer.style.display = "flex"; 
        runClock(refTime);     
    }

    function runClock(refTime) {
        let timer = setInterval(()=>{
            setClock(refTime);
        }, 50);
    }

    function setClock(refTime) {
        const timeElasped = Date.now() - parseInt(refTime);
        let { days, hours, minutes, seconds } = getTimeDivisions(timeElasped);

        daysLabel.innerText = days;
        hoursLabel.innerText = hours;
        minutesLabel.innerText = minutes;
        secondsLabel.innerText = seconds;
    }

    function getTimeDivisions(time) {
        let days = parseInt(time / (1000 * 60 * 60 * 24));
        let hours = parseInt(time / (1000 * 60 * 60)) % 24;
        let minutes = parseInt(time / (1000 * 60)) % 60;
        let seconds = parseInt(time / (1000)) % 60;

        return {days, hours, minutes, seconds};
    }
    
    function renderError(err) {
        alert(err);
    }
});

