const max = Math.round(Math.max(...histogram_data))
const  min = Math.round(Math.min(...histogram_data))
const n = histogram_data.length
const k = Math.sqrt((n))

console.log(min +" " +max)

let freq = {}
for(let i=0;i<n;i++){
    freq[Math.floor(histogram_data[i])] = (freq[Math.floor(histogram_data[i])] || 0) +1
}
console.log(freq)
var x_label = min;
function drawHist(svg){
    for (let i = 0; i < (max-min+1); i += 1) {
        drawLine(svg, {x1: 40 + 30 * i, y1: 20, x2: 40 + 30 * i, y2: 380, stroke: '#ccc'});

        drawLine(svg, {x1: 40 + 30 * i, y1: 380, x2: 40 + 30 * i, y2: 384});
        drawLine(svg, {x1: 36, y1: 20 + 30 * (i - 1), x2: 40, y2: 20 + 30 * (i - 1)});

        drawText(svg, {x: 35 + 30 * i, y: 400, text: x_label++});
        drawText(svg, {x: 20, y: 25 + 30 * (i - 1), text: 5*(13-i)});
        drawRectangle(svg, {
            x: 40+ (30*i),
            y: 380-(freq[i+34] *5) ,
            width: 30,
            height: freq[i+34]*5,
            fill: 'blue',
        });

    }

    drawLine(svg, {x1: 40, y1: 380, x2: 400, y2: 380});

    drawLine(svg, {x1: 40, y1: 20, x2: 40, y2: 380});


}

