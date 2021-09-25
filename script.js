document.addEventListener("DOMContentLoaded", () => {
    const clockContainer = document.getElementById("clock-container");
    const daysLabel = document.getElementById("days");
    const hoursLabel = document.getElementById("hours");
    const minutesLabel = document.getElementById("minutes");
    const secondsLabel = document.getElementById("seconds");
    const resetBtn = document.getElementById("reset-btn");
    const refreshBtn = document.getElementById("refresh");

    const API_URL = "https://tranquil-anchorage-05707.herokuapp.com/api";
    let authDetails = localStorage.getItem("auth-details");

    if(!authDetails) {
        setAuth();
    }

    if(!localStorage.getItem("streak-counter-data")) {
        fetch(API_URL)
        .then((rawData) => rawData.json())
        .then((data) => { 
            if(data === null) {
                fetch(API_URL, {
                    method: "POST",
                    headers: {
                        Authorization: "Basic " + authDetails
                    }
                })
                .then((resp) => resp.json())
                .then((data) => {
                    localStorage.setItem("streak-counter-data", JSON.stringify(data));
                    addClock(data.time);
                })
                .catch(err => {
                    renderError("Server Error, refresh or please try later");
                    setAuth();
                });
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

        fetch(API_URL, {
            method: "DELETE",
            headers: {
                Authorization: "Basic " + authDetails
            }
        })
        .then(() => {
            localStorage.removeItem("streak-counter-data");
            window.location = "/streak-counter";
        })
        .catch(err => {
            renderError("Server Error, refresh or please try later");
            setAuth();
        });
    })

    refreshBtn.addEventListener("click", () => {
        fetch(API_URL)
        .then((rawData) => rawData.json())
        .then((data) => {
            if(data){
                localStorage.setItem("streak-counter-data", JSON.stringify(data));
                addClock(data.time);
            }
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

    function setAuth() {
        let data = prompt("Enter username:password");
        authDetails = btoa(data);
        localStorage.setItem("auth-details", authDetails);
    }
});

