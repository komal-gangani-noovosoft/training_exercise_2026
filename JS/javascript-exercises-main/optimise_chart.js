import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";


//region Variable declaration

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tempRef = ref(db, 'data/temperature');
const voltRef = ref(db, 'data/voltage')

const svg4= document.getElementById("svg4")
const avg_temperature = document.getElementById("avg_temperature")
const avg_voltage = document.getElementById("avg_voltage")

const CHART_CONFIG = {

    BLOCK_SPACE_Y:30,
    BLOCK_SPACE_X:30,

    Y_AXIS_BOTTOM:380,
    Y_AXIS_TOP:10,
    X_AXIS_LEFT:40,
    X_AXIS_RIGHT:1440,

    Y_MIN_DATA:34,
    Y_MAX_DATA:46,
    AVG_TIME_WINDOW:3*60*1000
}
let temperature = []
let voltage = []
let timestamps = []
let avgTempArray = null , avgVoltArray = null

let currentTempStart = null , currentTempCount=0 ,currentTempSum = 0
let currentVoltStart = null , currentVoltCount = 0, currentVoltSum =0
//endregion

//region Data fetching
onValue(tempRef, (snapshot) => {
    const data = snapshot.val();
    temperature = Object.values(data)
    timestamps = Object.keys(data)
    let newVal = temperature.at(-1)
    let newTimestamp = timestamps.at(-1)
    if(avgTempArray===null){
        avgTempArray=getAverage(temperature)
    }
    if(currentTempStart === null){
        currentTempStart = newTimestamp
    }

    if(newTimestamp - currentTempStart >= 180000){
        avgTempArray.push(currentTempSum/currentTempCount)
        currentTempStart = newTimestamp
        currentTempSum = 0
        currentTempCount = 0
    }
    currentTempSum += newVal
    currentTempCount++
    drawLiveChart(svg4)
    drawAvgChart(avg_temperature , avgTempArray.slice(-40))
}, (error) => {

    console.error("Error reading data:", error);
});


onValue(voltRef, (snapshot) => {
    const data = snapshot.val();
    voltage = Object.values(data)
    let newVal = voltage.at(-1)
    let newTimestamp = Object.keys(data).at(-1)
    if(avgVoltArray===null){
        avgVoltArray=getAverage(voltage)
    }
    if(currentVoltStart === null){
        currentVoltStart = newTimestamp
    }

    if(newTimestamp - currentVoltStart >= 180000){
        avgVoltArray.push(currentVoltSum/currentVoltCount)
        currentVoltStart = newTimestamp
        currentVoltSum = 0
        currentVoltCount = 0
    }
    currentVoltSum += newVal
    currentVoltCount++
    drawLiveChart(svg4)
    drawAvgChart(avg_voltage , avgVoltArray.slice(-40))
}, (error) => {
    console.error("Error reading data:", error);
});
//endregion

function getAverage(arr){
    let currRange = Number(timestamps[0]) + 180000
    let avgArray = []
    let sum = arr[0]
    let cnt = 1
    for(let i=1;i<arr.length;i++){
        if(Number(timestamps[i])<=currRange){
            sum += arr[i]
            cnt++
        }else{
            avgArray.push(sum/cnt)
            sum = arr[i]
            cnt = 1
            currRange = Number(timestamps[i]) + 180000
        }
    }
    avgArray.push(sum/cnt)
    return avgArray
}



function staticChart(svg) {
    svg.innerHTML = '';

    for(let i=0; i<=12; i++){
        drawLine(svg, {x1: CHART_CONFIG.X_AXIS_LEFT-4, y1: 20 + CHART_CONFIG.BLOCK_SPACE_Y * i, x2: CHART_CONFIG.X_AXIS_LEFT, y2: 20 + CHART_CONFIG.BLOCK_SPACE_Y * i});
        drawText(svg, {x: 20, y: 25 + CHART_CONFIG.BLOCK_SPACE_Y * i, text: CHART_CONFIG.Y_MAX_DATA - i});
    }

    drawLine(svg, {x1: CHART_CONFIG.X_AXIS_LEFT, y1: CHART_CONFIG.Y_AXIS_BOTTOM, x2: CHART_CONFIG.X_AXIS_RIGHT, y2: CHART_CONFIG.Y_AXIS_BOTTOM});
    drawLine(svg, {x1: CHART_CONFIG.X_AXIS_LEFT, y1: CHART_CONFIG.Y_AXIS_TOP,  x2: CHART_CONFIG.X_AXIS_LEFT,   y2: CHART_CONFIG.Y_AXIS_BOTTOM});

}

function getChartPoint(index, value) {
    const {
        X_AXIS_LEFT, BLOCK_SPACE_X, Y_AXIS_BOTTOM, Y_MIN_DATA, BLOCK_SPACE_Y
    } = CHART_CONFIG;

    const x = X_AXIS_LEFT + (BLOCK_SPACE_X * index);
    const y = Y_AXIS_BOTTOM - ((value - Y_MIN_DATA) * BLOCK_SPACE_Y);


    return { x, y };
}

function drawLiveChart(svg){

    const dynamic =  document.querySelectorAll('.dynamic')
    dynamic.forEach(ele => ele.remove() )

    const currTimestmaps = timestamps.slice(-40)
    const currTemperature = temperature.slice(-40)
    const currVoltage = voltage.slice(-40)


    for(let i=1;i<=currTimestmaps.length;i++){
        drawLine(svg, {x1: CHART_CONFIG.X_AXIS_LEFT + CHART_CONFIG.BLOCK_SPACE_X * i, y1: CHART_CONFIG.Y_AXIS_BOTTOM, x2: CHART_CONFIG.X_AXIS_LEFT + CHART_CONFIG.BLOCK_SPACE_X * i, y2: CHART_CONFIG.Y_AXIS_BOTTOM+4, className:'dynamic'});
        drawText(svg, {x: CHART_CONFIG.X_AXIS_LEFT + CHART_CONFIG.BLOCK_SPACE_X * i, y: CHART_CONFIG.Y_AXIS_BOTTOM+20, text: currTimestmaps[i-1],vertical:true, className:'dynamic'});

    }

    let prevTempX = null, prevTempY = null;
    let prevVoltX = null, prevVoltY = null;

    for(let i=1;i<=currTimestmaps.length;i++){
        const { x:xTemp, y:yTemp } = getChartPoint(i, currTemperature[i-1]);

        if(prevTempX!==null){
            drawLine(svg , {x1:prevTempX , y1:prevTempY , x2:xTemp , y2:yTemp , stroke:'lightgreen' , strokeType:'solid', className:'dynamic'})
        }
        prevTempX =xTemp
        prevTempY = yTemp
        drawCircle(svg, {cx: xTemp, cy: yTemp, r: 2, fill: 'green', className:'dynamic'});

        if(currVoltage[i-1]!==undefined){
            const { x:xVolt, y:yVolt } = getChartPoint(i, currVoltage[i-1]);
            if(prevVoltX!==null && currVoltage[i-1]!==undefined){
                drawLine(svg , {x1:prevVoltX , y1:prevVoltY , x2:xVolt , y2:yVolt , stroke:'lightblue' , strokeType:'solid', className:'dynamic'})
            }
            prevVoltX = xVolt
            prevVoltY = yVolt

            drawCircle(svg, {cx: xVolt, cy: yVolt, r: 2, fill: 'blue', className:'dynamic'});
        }

    }

}

function drawAvgChart(svg , arr){
    const dynamic =  svg.querySelectorAll('.dynamic-avg')
    dynamic.forEach(ele => ele.remove() )


    for(let i=1;i<=arr.length;i++){
        drawLine(svg, {x1: CHART_CONFIG.X_AXIS_LEFT + CHART_CONFIG.BLOCK_SPACE_X * i, y1: CHART_CONFIG.Y_AXIS_BOTTOM, x2: CHART_CONFIG.X_AXIS_LEFT + CHART_CONFIG.BLOCK_SPACE_X * i, y2: CHART_CONFIG.Y_AXIS_BOTTOM+4, className:'dynamic-avg'});
        drawText(svg, {x: CHART_CONFIG.X_AXIS_LEFT + CHART_CONFIG.BLOCK_SPACE_X * i, y: CHART_CONFIG.Y_AXIS_BOTTOM+20, text: [i-1], className:'dynamic-avg'});
    }


    for(let i=1;i<=arr.length;i++){
        drawCircle(svg, {cx: CHART_CONFIG.X_AXIS_LEFT + CHART_CONFIG.BLOCK_SPACE_X*(i), cy: CHART_CONFIG.Y_AXIS_BOTTOM-((arr[i-1]-CHART_CONFIG.Y_MIN_DATA)*CHART_CONFIG.BLOCK_SPACE_Y), r: 2, fill: 'blue', className:'dynamic-avg'});
    }

}


staticChart(svg4)
staticChart(avg_voltage)
staticChart(avg_temperature)

