import { getLogData} from './log.js';
import { query } from './constants.js';
//#####################################################################\\
//####################  VARIABLE DECLARATION  #########################\\
//#####################################################################\\
var data = getLogData(query);
const filteredDataBar = filterDataForBarChart(data);
const cirDiaContainer = document.getElementById('circular-diagram-container');
const barChartContainer = document.getElementById('bar-chart-container');
var total = 0
//#####################################################################\\
//######################  FILTER DATA PART  ###########################\\
//#####################################################################\\
async function filterDataForXPSCircDiag(data) {
  const response = await getLogData(query);
  if (response === "data is empty") {
    return
  }
  const user  = response.user[0];
  const path = "";
  console.log('User:', user);
  const xpsData = user && user.xps;
  console.log('xpsData:', xpsData);

  if (xpsData) {
    return xpsData.filter(xps => {
      return xps.path.startsWith("/rouen/div-01/") 
        && !xps.path.startsWith("/rouen/div-01/checkpoint/") 
        && !xps.path.startsWith("/rouen/div-01/piscine-");
    }).map((xps) => {
      const projectName = xps.path.split('/').pop();
      const amount = parseFloat(xps.amount); // default 0 for NaN
      console.log('Project Name:', projectName)
      console.log('Amount', amount)
      return {amount, projectName };
    });
  } else {
    console.log('No XPS data found');
    return [];
  }
}
// This function takes care of filtering data from the API response and retrieves us counters about projects. Each counter represents achieved exercises from the current user.
async function filterDataForBarChart(data) {
    let galaxyProjects = 0;
    let piscineJSExercises = 0;
    let piscineGOExercises = 0;
    let piscineRustExercises = 0;
    let checkpointExercises = 0;
  
    if (Array.isArray(data.user) && data.user.length > 0 && Array.isArray(data.user[0].xps)) {
      data.user[0].xps.forEach(element => {
        if (element.path.startsWith("/rouen/div-01/") && !element.path.startsWith("/rouen/div-01/checkpoint/") && !element.path.startsWith("/rouen/div-01/piscine-")) {
          galaxyProjects++;
        } else if (element.path.startsWith("/rouen/div-01/checkpoint/")) {
          checkpointExercises++;
        } else if (element.path.startsWith("/rouen/div-01/piscine-js") || element.path.startsWith("rouen/div-01/piscine-rust")) {
          if (element.path.startsWith("/rouen/div-01/piscine-rust/")) {
            piscineRustExercises++;
          } else if (element.path.startsWith("/rouen/div-01/piscine-js/")) {
            piscineJSExercises++;
          }
        } else if (element.path.startsWith("/rouen/piscine-go/quest-")) {
          piscineGOExercises++;
        }
      });
    }
    console.log(galaxyProjects, piscineGOExercises, piscineJSExercises, piscineRustExercises, checkpointExercises)
    return ['Completed Galaxy Projects:', galaxyProjects,
      'Completed Golang Piscine Projects:', piscineGOExercises,
      'Completed Javascript Piscine Projects:', piscineJSExercises,
      'Completed Rust Piscine Projects:', piscineRustExercises,
      'Achieved checkpoints exercises:', checkpointExercises
    ];
  }
  
//#####################################################################\\
//####################  CREATION  CHART PART  #########################\\
//#####################################################################\\
  //This function takes care of creating the bar to the current page when we click on a button 
async function createBarChart() {
    const barWidth = 40;
    const barSpacing = 50;
    const chartHeight = 200;
    const barChartContainer = document.getElementById('bar-chart-container');
    // Clear the container
    barChartContainer.innerHTML = '';
  
    // Create an SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '500');
    svg.setAttribute('height', '450');
    // Get the data
    const data = await filterDataForBarChart(await getLogData(query));
  
    // Axis Creation
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', chartHeight);
    xAxis.setAttribute('x2', '100%');
    xAxis.setAttribute('y2', chartHeight);
    xAxis.setAttribute('stroke', 'black');
    svg.appendChild(xAxis);
  
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', chartHeight);
    yAxis.setAttribute('stroke', 'black');
    svg.appendChild(yAxis);
  
    // Scale 
    const scale = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    scale.setAttribute('x', 10);
    scale.setAttribute('y', 20);
    scale.setAttribute('font-size', 14);
    scale.setAttribute('dy', '-1');
    scale.textContent = '1grad = 20';
    scale.setAttribute('fill', 'white');
    svg.appendChild(scale);
  
    // Graduations
    const graduationSpacing = 20;
      for (let i = 0; i <= chartHeight; i += graduationSpacing) {
      const graduation = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      graduation.setAttribute('x1', -5);
      graduation.setAttribute('y1', chartHeight - i);
      graduation.setAttribute('x2', 5);
      graduation.setAttribute('y2', chartHeight - i);
      graduation.setAttribute('stroke', 'black');
      svg.appendChild(graduation);
  
      const graduationLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      graduationLabel.setAttribute('x', -20);
      graduationLabel.setAttribute('y', chartHeight - i);
      graduationLabel.setAttribute('font-size', 12);
      graduationLabel.textContent = (i / graduationSpacing).toString();
      svg.appendChild(graduationLabel);
    }
    
    // Loop through the data
    for (let i = 0; i < data.length; i += 2) {
      const label = data[i];
      const value = data[i + 1];
      
      // Create bar
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', (barWidth + barSpacing) * (i / 2) + barSpacing);
      bar.setAttribute('y', chartHeight - (value / Math.max(...data.filter((_, index) => index % 2 === 1))) * chartHeight);
      bar.setAttribute('width', barWidth);
      bar.setAttribute('height', (value / Math.max(...data.filter((_, index) => index % 2 === 1))) * chartHeight);
      bar.setAttribute('fill', '#FFF');
      svg.appendChild(bar);

      // Create a label for the bar
      const labelElement = document.createElementNS('http://www.w3.org/2000/svg','text')
      
      labelElement.setAttribute('x', (barWidth + barSpacing) * (i / 2) + barSpacing + barWidth / 2);
      labelElement.setAttribute('y', chartHeight - (value / Math.max(...data.filter((_, index) => index % 2 === 1))) * chartHeight + ((value / Math.max(...data.filter((_, index) => index % 2 === 1))) * chartHeight / 2));
      labelElement.setAttribute('font-size', 12);
      labelElement.setAttribute('text-anchor', 'middle');
      labelElement.setAttribute('fill', '#000000'); // White text color
      labelElement.setAttribute('dominant-baseline', 'middle'); // Center the text vertically
      labelElement.textContent = value.toString();
      svg.appendChild(labelElement)

      // Create the label below the bar
      const belowLabelElement = document.createElementNS('http://www.w3.org/2000/svg','text')

      belowLabelElement.setAttribute('x', (barWidth + barSpacing) * (i / 2) + barSpacing + barWidth / 2 - 100 );
      belowLabelElement.setAttribute('y', chartHeight + 20); // Position below the bar
      belowLabelElement.setAttribute('font-size', 12);
      belowLabelElement.setAttribute('text-anchor', 'middle');
      belowLabelElement.setAttribute('fill', '#000000'); // Black text color
      belowLabelElement.setAttribute('transform', `rotate(-90, ${(barWidth + barSpacing) * (i / 2) + barSpacing + barWidth / 2}, ${chartHeight + 20})`); // Rotate the text by 90 degrees
      belowLabelElement.textContent = label.toString();
      svg.appendChild(belowLabelElement)
    }
  // Append the SVG element to the container
  barChartContainer.appendChild(svg);
  document.getElementById('barChartButton').style.display="none"
}


  /**
   * This function takes care of creating a circular diagram of the user's completed exercises divided by projects.
   * It first filters the data and then creates SVG elements to draw each part of the diagram.
   * The data is then displayed in the circular-diagram-container div.
   */
async function createCircularDiagram() {
  const circData = await filterDataForXPSCircDiag(data);
  if (circData) {
    const total = circData.reduce((acc, current) => acc + current.amount, 0);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '600');
    svg.setAttribute('height', '650');

    let startAngle = 0;
    circData.forEach((xps, index) => {
      const angle = (xps.amount / total) * 360;
      const endAngle = startAngle + angle;
      const largeArcFlag = angle <= 180 ? '0' : '1';
      const radius = 200;
      const x1 = 250 + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = 250 + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = 250 + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = 250 + radius * Math.sin((endAngle * Math.PI) / 180);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L 250 250 Z`);
      path.setAttribute('fill', `hsl(${index * 60}, 70%, 70%)`);
      svg.appendChild(path);
      path.addEventListener(
        "mouseenter", ()=>{
          const percent = (xps.amount / total * 100).toFixed(2);
          const test = document.getElementById("test")
          test.textContent = `${xps.projectName} (${percent}%)`;
        }
      )

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', 250 + radius * Math.cos(((startAngle + endAngle) / 2) * Math.PI / 180));
      text.setAttribute('y', 250 + radius * Math.sin(((startAngle + endAngle) / 2) * Math.PI / 180));
      text.setAttribute('dy', '-20');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('text-anchor', 'middle');
      svg.appendChild(text);

      startAngle = endAngle;
    });
    cirDiaContainer.appendChild(svg);
    document.getElementById('circularButton').style.display="none"
  } else {
    console.log("No data to display")
  }
}

document.getElementById('circularButton').addEventListener('click', createCircularDiagram);
document.getElementById('barChartButton').addEventListener('click', createBarChart);

/* 
bug du logout 
mettre les boutons dans l'index html et les mettre en display none
avant le chargement du innerhtml
 */
