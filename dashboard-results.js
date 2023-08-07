// import Chart from 'chart.js/auto';

// GET DATA
$(document).ready(function() {
    let userQuery = window.location.search.split(/\?userQuery./g)[1].replaceAll("%3D", "=").replaceAll("%26", "&");
    
    // getCategoryName(userQuery);
    getCategoryName2(userQuery);
    getContainerTitle(userQuery);
    getTypeName(userQuery);
    getPublished(userQuery);
    // document.getElementById("categoryNameChartContainer").addEventListener("resize", () => {document.getElementById("categoryNameChart").resize()})
  });


function createStackedBar (chartLocation, chartData, chartLegendLocation) {
  Chart.defaults.font.family = "IBM Plex Mono";
  Chart.defaults.font.size = 8;          
  // function to add colors:

  myColors = [
    "#33b5e5","#8b89ed","#e53594","#ff3b4b","#ff7e00","#ffc900"
  ]

  borderColors = [
    "#33b5e550","#8b89ed50","#e5359450","#ff3b4b50","#ff7e0050","#ffc90050"
  ]

  for (i in dataPairs) {
    dataPairs[i].backgroundColor = myColors[i % myColors.length]
    dataPairs[i].borderColor = borderColors[i % borderColors.length]
  }
  // legend plugin
            const getOrCreateLegendList = (chart, id) => {
                const legendContainer = document.getElementById(id);
                let listContainer = legendContainer.querySelector('ul');
              
                if (!listContainer) {
                  listContainer = document.createElement('ul');
                  listContainer.style.display = 'grid';
                  listContainer.style.gridTemplateColumns = '33% 33% 33%';
                  listContainer.style.margin = 0;
                  listContainer.style.padding = 0;
                  listContainer.style.width = "90%";
                  listContainer.style.columnGap = "5%"
              
                  legendContainer.appendChild(listContainer);
                }
              
                return listContainer;
              };
              
              const htmlLegendPlugin = {
                id: 'htmlLegend',
                afterUpdate(chart, args, options) {
                  const ul = getOrCreateLegendList(chart, options.containerID);
              
                  // Remove old legend items
                  while (ul.firstChild) {
                    ul.firstChild.remove();
                  }
              
                  // Reuse the built-in legendItems generator
                  const items = chart.options.plugins.legend.labels.generateLabels(chart);
              
                  items.forEach(item => {
                    const li = document.createElement('li');
                    li.style.alignItems = 'top';
                    li.style.cursor = 'pointer';
                    li.style.display = 'flex';
                    li.style.flexDirection = 'row';
                    li.style.marginTop = '4px';
                    li.style.width = "100%";
              
                    li.onclick = () => {
                      const {type} = chart.config;
                      if (type === 'pie' || type === 'doughnut') {
                        // Pie and doughnut charts only have a single dataset and visibility is per item
                        chart.toggleDataVisibility(item.index);
                      } else {
                        chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                      }
                      chart.update();
                    };
              
                    // Color box
                    const boxSpan = document.createElement('span');
                    boxSpan.style.background = item.fillStyle;
                    boxSpan.style.borderColor = item.strokeStyle;
                    boxSpan.style.borderWidth = item.lineWidth + 'px';
                    boxSpan.style.display = 'inline-block';
                    boxSpan.style.flexShrink = 0;
                    boxSpan.style.height = '8px';
                    boxSpan.style.marginRight = '1em';
                    boxSpan.style.marginTop = "2px";
                    boxSpan.style.width = '8px';
              
                    // Text
                    const textContainer = document.createElement('p');
                    textContainer.style.color = item.fontColor;
                    textContainer.style.margin = 0;
                    textContainer.style.padding = 0;
                    textContainer.style.fontSize = "8px";
                    textContainer.style.textDecoration = item.hidden ? 'line-through' : '';
                    textContainer.style.textAlign = "top";
              
                    const text = document.createTextNode(item.text);
                    textContainer.appendChild(text);
              
                    li.appendChild(boxSpan);
                    li.appendChild(textContainer);
                    ul.appendChild(li);
                  });
                }
              };
            //create chart
        
            new Chart(chartLocation, {
                type: 'bar',
                data: chartData,
                options: {
                    aspectRatio: 4 / 1,
                    indexAxis: 'y',
                  scales: {
                    y: {
                      beginAtZero: true,
                      stacked: true,
                      display: false,
                    },
                    x: {
                        stacked: true,
                        display: true,
                    }
                  },
                  plugins: {
                    legend: {
                        display: false
                    },
                    htmlLegend: {
                        containerID: chartLegendLocation
                    }
                  },
                  maintainAspectRatio: false,
                },
                plugins: [htmlLegendPlugin],
              });
}


getCategoryName = (userQuery) => {
    $.ajax({
        url: `https://api.Crossref.org/works?${userQuery}&facet=category-name:*`,
        success: function (data) {
            window.queryResult;
            queryResult = data // caches query as queryResult

            window.categoryNameLabels;
            categoryNameLabels = Object.keys(queryResult["message"]["facets"]["category-name"]['values'])
            
            window.categoryNameData;
            categoryNameData = Object.values(queryResult["message"]["facets"]["category-name"]['values'])

            // legend plugin
            legendPlugin()
            
            //create chart

            const ctx = document.getElementById('categoryNameChart');
      
            new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryNameLabels,
                datasets: [{
                label: '# of results in this category',
                data: categoryNameData,
                borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Query Results Distributed Across Subject Areas",
                        color: "0,0,0"
                    },
                    htmlLegend: {
                        containerID: 'categoryNameChartLegend'
                    },
                    legend: {
                        position: 'right',
                        display: false
                    }
                },
            },
            plugins: [htmlLegendPlugin]     
            });
        
            

        }})
}

getCategoryName2 = (userQuery) => {
    $.ajax({
        url: `https://api.Crossref.org/works?${userQuery}&facet=category-name:*`,
        success: function (data) {
            queryResult = data // caches query as queryResult

            dataPairs = Object.entries(queryResult["message"]["facets"]["category-name"]['values']).map(([key, value]) => {
                return {
                    data: [value],
                    label:  (value < 2) ? `${key} (${value} result)` : `${key} (${value} results)`,
                    borderWidth: 1
                };
            });

            const chartLocation = document.getElementById('categoryNameChart');
            const chartData = {
              labels: ["Subject Area: # of Query Results"],
              datasets: dataPairs
            };
            const chartLegendLocation = 'categoryNameChartLegend'
            
            createStackedBar(chartLocation, chartData, chartLegendLocation);
        }})
}


getContainerTitle = (userQuery) => {
    $.ajax({
        url: `https://api.Crossref.org/works?${userQuery}&facet=container-title:*`,
        success: function (data) {
            queryResult = data // caches query as queryResult

            dataPairs = Object.entries(queryResult["message"]["facets"]["container-title"]['values']).map(([key, value]) => {
                return {
                    data: [value],
                    label:  (value < 2) ? `${key} (${value} result)` : `${key} (${value} results)`,
                    borderWidth: 1
                };
            });
            
            const chartLocation = document.getElementById('containerTitleChart');
            const chartData = {
              labels: ["Publication: # of Query Results"],
              datasets: dataPairs
            };
            const chartLegendLocation = 'containerTitleChartLegend'

            createStackedBar(chartLocation, chartData, chartLegendLocation);
        }})
}

getTypeName = (userQuery) => {
    $.ajax({
        url: `https://api.Crossref.org/works?${userQuery}&facet=type-name:*`,
        success: function (data) {
            queryResult = data // caches query as queryResult

            dataPairs = Object.entries(queryResult["message"]["facets"]["type-name"]['values']).map(([key, value]) => {
                return {
                    data: [value],
                    label:  (value < 2) ? `${key} (${value} result)` : `${key} (${value} results)`,
                    borderWidth: 1
                };
            });

            const chartLocation = document.getElementById('typeNameChart');
            const chartData = {
              labels: ["Publication Type: # of Query Results"],
              datasets: dataPairs
            };
            const chartLegendLocation = 'typeNameChartLegend'

            createStackedBar(chartLocation, chartData, chartLegendLocation);
            
        }})
}

getPublished = (userQuery) => {
    $.ajax({
        url: `https://api.Crossref.org/works?${userQuery}&facet=published:*`,
        success: function (data) {
            window.queryResult;
            queryResult = data // caches query as queryResult

            window.categoryNameLabels;
            categoryNameLabels = Object.keys(queryResult["message"]["facets"]["published"]['values'])
            
            window.categoryNameData;
            categoryNameData = Object.values(queryResult["message"]["facets"]["published"]['values'])

            window.categoryNamePairs;
            categoryNamePairs = Object.entries(queryResult["message"]["facets"]["published"]['values']).map(([key, value]) => {
                return {
                    data: [value],
                    label:  (value < 2) ? `${key} (${value} result)` : `${key} (${value} results)`,
                    borderWidth: 1
                };
            });
            
            //create chart

            const ctx = document.getElementById('PublishedChart');
        

            const labels = categoryNameLabels;
            const chartData = {
            labels: labels,
            datasets: [{
                label: "# of Query Results",
                data: categoryNameData,
                backgroundColor: ["#33b5e5","#8b89ed","#e53594","#ff3b4b","#ff7e00","#ffc900"]
            }]
            };
        
            new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                  aspectRatio: 4 / 6,
                  maintainAspectRatio: false,
                }
              });
        }})
}
