 //echart Map

 function init_echarts(xx) {
    xx = JSON.parse(xx);

    if( typeof (echarts) === 'undefined'){ return; }
    console.log('init_echarts');


        var theme = {
        color: [
            '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],

        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#408829'
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#408829'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#408829'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#408829'
            },
            controlStyle: {
                normal: {color: '#408829'},
                emphasis: {color: '#408829'}
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
                    }
                }
            }
        },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        textStyle: {
            fontFamily: 'Arial, Verdana, sans-serif'
        }
    };

    if ($('#echart_world_map').length ){ 
                
        var echartMap = echarts.init(document.getElementById('echart_world_map'), theme);
        
        
        echartMap.setOption({
        title: {
            text: 'Global Climate Changes',
            subtext: 'Average Temperature 2013',
            x: 'center',
            y: 'top'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
            var value = (params.value + '').split('.');
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
            return params.seriesName + '<br/>' + params.name + ' : ' + value;
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                title: "Text View",
                lang: [
                "Text View",
                "Close",
                "Refresh",
                ],
                readOnly: false
            },
            restore: {
                show: true,
                title: "Restore"
            },
            saveAsImage: {
                show: true,
                title: "Save Image"
            }
            }
        },
        dataRange: {
            min: 0,
            max: 35,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            color: ['#e74c3c', '#e67e22', '#3498db']
        },
        series: [{
            name: 'Average Temperature',
            type: 'map',
            mapType: 'world',
            roam: false,
            mapLocation: {
            y: 60
            },
            itemStyle: {
            emphasis: {
                label: {
                show: true
                }
            }
            },
            data: xx.world_map_data
                        }]
        });

    }
    function eConsole(param) {
        if (typeof param.seriesIndex != 'undefined') {
             console.log(param.data.name);
             var country_name = param.data.name;
             window.location.href = 'visualisations_data?name='+country_name;
         }            
     }
    echartMap.on('click', eConsole);

 }

 function init_charts() {
		
    console.log('run_charts  typeof [' + typeof (Chart) + ']');

    if( typeof (Chart) === 'undefined'){ return; }
    
    console.log('init_charts');

    
    Chart.defaults.global.legend = {
        enabled: false
    };	
}
 
$(document).ready(function() {
	var xhttp = new XMLHttpRequest();
	var xx = {};
	xhttp.onreadystatechange = function() {
			 if (this.readyState == 4 && this.status == 200) {
					//  alert(this.responseText);
					 console.log(this.responseText);
					 xx = this.responseText;
					 init_echarts(xx);

			 }
	};
	xhttp.open("GET", "http://localhost:3000/users", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send();
	// init_charts();
});	