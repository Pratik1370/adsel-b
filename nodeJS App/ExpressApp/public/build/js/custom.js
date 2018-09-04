/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function($,sr){
	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;

			return function debounced () {
					var obj = this, args = arguments;
					function delayed () {
							if (!execAsap)
									func.apply(obj, args); 
							timeout = null; 
					}

					if (timeout)
							clearTimeout(timeout);
					else if (execAsap)
							func.apply(obj, args);

					timeout = setTimeout(delayed, threshold || 100); 
			};
	};

	// smartresize 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
/**
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
*/

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
	$BODY = $('body'),
	$MENU_TOGGLE = $('#menu_toggle'),
	$SIDEBAR_MENU = $('#sidebar-menu'),
	$SIDEBAR_FOOTER = $('.sidebar-footer'),
	$LEFT_COL = $('.left_col'),
	$RIGHT_COL = $('.right_col'),
	$NAV_MENU = $('.nav_menu'),
	$FOOTER = $('footer');


// /Sidebar

var randNum = function() {
	return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
};


// Panel toolbox
$(document).ready(function() {
	$('.collapse-link').on('click', function() {
			var $BOX_PANEL = $(this).closest('.x_panel'),
					$ICON = $(this).find('i'),
					$BOX_CONTENT = $BOX_PANEL.find('.x_content');
			
			// fix for some div with hardcoded fix class
			if ($BOX_PANEL.attr('style')) {
					$BOX_CONTENT.slideToggle(200, function(){
							$BOX_PANEL.removeAttr('style');
					});
			} else {
					$BOX_CONTENT.slideToggle(200); 
					$BOX_PANEL.css('height', 'auto');  
			}

			$ICON.toggleClass('fa-chevron-up fa-chevron-down');
	});

	$('.close-link').click(function () {
			var $BOX_PANEL = $(this).closest('.x_panel');

			$BOX_PANEL.remove();
	});
});
// /Panel toolbox

// Tooltip
$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip({
			container: 'body'
	});
});
// /Tooltip

// Progressbar
if ($(".progress .progress-bar")[0]) {
	$('.progress .progress-bar').progressbar();
}
// /Progressbar

// Switchery
$(document).ready(function() {
	if ($(".js-switch")[0]) {
			var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
			elems.forEach(function (html) {
					var switchery = new Switchery(html, {
							color: '#26B99A'
					});
			});
	}
});
// /Switchery


// iCheck
$(document).ready(function() {
	if ($("input.flat")[0]) {
			$(document).ready(function () {
					$('input.flat').iCheck({
							checkboxClass: 'icheckbox_flat-green',
							radioClass: 'iradio_flat-green'
					});
			});
	}
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
	checkState = '';
	$(this).parent().parent().parent().addClass('selected');
	countChecked();
});
$('table input').on('ifUnchecked', function () {
	checkState = '';
	$(this).parent().parent().parent().removeClass('selected');
	countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
	checkState = '';
	$(this).parent().parent().parent().addClass('selected');
	countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
	checkState = '';
	$(this).parent().parent().parent().removeClass('selected');
	countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
	checkState = 'all';
	countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
	checkState = 'none';
	countChecked();
});

function countChecked() {
	if (checkState === 'all') {
			$(".bulk_action input[name='table_records']").iCheck('check');
	}
	if (checkState === 'none') {
			$(".bulk_action input[name='table_records']").iCheck('uncheck');
	}

	var checkCount = $(".bulk_action input[name='table_records']:checked").length;

	if (checkCount) {
			$('.column-title').hide();
			$('.bulk-actions').show();
			$('.action-cnt').html(checkCount + ' Records Selected');
	} else {
			$('.column-title').show();
			$('.bulk-actions').hide();
	}
}



// Accordion
$(document).ready(function() {
	$(".expand").on("click", function () {
			$(this).next().slideToggle(200);
			$expand = $(this).find(">:first-child");

			if ($expand.text() == "+") {
					$expand.text("-");
			} else {
					$expand.text("+");
			}
	});
});

// NProgress
if (typeof NProgress != 'undefined') {
	$(document).ready(function () {
			NProgress.start();
	});

	$(window).load(function () {
			NProgress.done();
	});
}


	//hover and retain popover when on popover content
			var originalLeave = $.fn.popover.Constructor.prototype.leave;
			$.fn.popover.Constructor.prototype.leave = function(obj) {
				var self = obj instanceof this.constructor ?
					obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
				var container, timeout;

				originalLeave.call(this, obj);

				if (obj.currentTarget) {
					container = $(obj.currentTarget).siblings('.popover');
					timeout = self.timeout;
					container.one('mouseenter', function() {
						//We entered the actual popover – call off the dogs
						clearTimeout(timeout);
						//Let's monitor popover content instead
						container.one('mouseleave', function() {
							$.fn.popover.Constructor.prototype.leave.call(self, self);
						});
					});
				}
			};

			$('body').popover({
				selector: '[data-popover]',
				trigger: 'click hover',
				delay: {
					show: 50,
					hide: 400
				}
			});


function gd(year, month, day) {
	return new Date(year, month - 1, day).getTime();
}


		/* INPUTS */
		
		function onAddTag(tag) {
			alert("Added a tag: " + tag);
			}

			function onRemoveTag(tag) {
			alert("Removed a tag: " + tag);
			}

			function onChangeTag(input, tag) {
			alert("Changed a tag: " + tag);
		 }

	
	function init_charts() {
		
			console.log('run_charts  typeof [' + typeof (Chart) + ']');
		
			if( typeof (Chart) === 'undefined'){ return; }
			
			console.log('init_charts');
		
			
			Chart.defaults.global.legend = {
				enabled: false
			};	
	}
	
	/* ECHRTS */

	
	function init_echarts(xx) {
		xx = JSON.parse(xx);
	console.log(xx.single_country_Unc_temp);
	// console.log(typeof JSON.parse(xx));
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

			
			//echart Bar
			
		if ($('#mainb').length ){
					
						
				 
						var echartBar = echarts.init(document.getElementById('mainb'), theme);

								echartBar.setOption({
								title: {
									text: 'Temperature of Australia',
									subtext: '2010'
								},
								tooltip: {
									trigger: 'axis'
								},
								legend: {
									data: ['Uncertain AVG Temp','AVG Temp']
								},
								toolbox: {
									show: false
								},
								calculable: false,
								xAxis: [{
									type: 'category',
									data: []
									// data: ['1?', '2?', '3?', '4?', '5?', '6?', '7?', '8?', '9?', '10?', '11?', '12?']
								}],
								yAxis: [{
									type: 'value'
								}],
								series: [{
									name: 'AVG Temp',
									type: 'bar',
									data: xx.single_country_temp,
									// data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
									markPoint: {
									data: [{
										type: 'max',
										name: '???'
									}, {
										type: 'min',
										name: '???'
									}]
									},
									markLine: {
									data: [{
										type: 'average',
										name: '???'
									}]
									}
								}, {
									name: 'AVG Uncertain Temp',
									type: 'bar',
									// data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
									data: xx.single_country_Unc_temp,
									markPoint: {
									data: [{
										name: 'sales',
										value: 182.2,
										xAxis: 7,
										yAxis: 183,
									}, {
										name: 'purchases',
										value: 2.3,
										xAxis: 11,
										yAxis: 3
									}]
									},
									markLine: {
									data: [{
										type: 'average',
										name: '???'
									}]
									}
								}]
				});

		}
		
			 //echart Line
			
		if ($('#echart_line').length ){ 
			
			var echartLine = echarts.init(document.getElementById('echart_line'), theme);
			var data = [];
			for(key in xx.cities){
				console.log(xx.cities[key]);
						var obj_data = {
							name: key,
							type: 'line',
							smooth: true,
							itemStyle: {
								normal: {
									areaStyle: {
									type: 'default'
									}
								}
							},
							data: xx.cities[key]
						}
						data.push(obj_data);
			}

			console.log(Object.keys(xx.cities));
			echartLine.setOption({
			title: {
				text: 'Cities in Australia',
				subtext: 'Avg Temperature'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				x: 220,
				y: 40,
				data: Object.keys(xx.cities)
			},
			toolbox: {
				show: true,
				feature: {
				magicType: {
					show: true,
					title: {
					line: 'Line',
					bar: 'Bar',
					stack: 'Stack',
					tiled: 'Tiled'
					},
					type: ['line', 'bar', 'stack', 'tiled']
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
			calculable: true,
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: []
			}],
			yAxis: [{
				type: 'value'
			}],
			series: data

			});
console.log(xx.cities);
		} 
			
			 //echart Scatter
			
		if ($('#echart_scatter').length ){ 
			
			var echartScatter = echarts.init(document.getElementById('echart_scatter'), theme);

			var data = [];
			for(key in xx.scatter_years){
				console.log(xx.scatter_years[key]);
						var obj_data = {
							name: key,
							type: 'scatter',
							tooltip: {
							trigger: 'item',
							},
							data: xx.scatter_years[key]
						}
						data.push(obj_data);
			}

			echartScatter.setOption({
			title: {
				text: 'Canada and Australia',
				subtext: 'From 2011'
			},
			tooltip: {
				trigger: 'axis',
				showDelay: 0,
				axisPointer: {
				type: 'cross',
				lineStyle: {
					type: 'dashed',
					width: 1
				}
				}
			},
			legend: {
				data: Object.keys(xx.scatter_years).reverse()
			},
			toolbox: {
				show: true,
				feature: {
				saveAsImage: {
					show: true,
					title: "Save Image"
				}
				}
			},
			xAxis: [{
				type: 'value',
				scale: true,
				axisLabel: {
				// formatter: '{value} cm'
				}
			}],
			yAxis: [{
				type: 'value',
				scale: true,
				axisLabel: {
				// formatter: '{value} kg'
				}
			}],
			series: data
			});

		} 
			
			 //echart Bar Horizontal
			
		if ($('#echart_bar_horizontal').length ){ 
			
			var echartBar = echarts.init(document.getElementById('echart_bar_horizontal'), theme);
			var data = [];
			for(key in xx.six_month_temp){
				console.log(xx.six_month_temp[key]);
						var obj_data = {
								name: key,
								type: 'bar',
								data: xx.six_month_temp[key]
						}
						data.push(obj_data);
			}
			echartBar.setOption({
			title: {
				text: 'Australia',
				subtext: '2012-2013'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				x: 100,
				data: Object.keys(xx.six_month_temp)
			},
			toolbox: {
				show: true,
				feature: {
				saveAsImage: {
					show: true,
					title: "Save Image"
				}
				}
			},
			calculable: true,
			xAxis: [{
				type: 'value',
				boundaryGap: [0, 0.01]
			}],
			yAxis: [{
				type: 'category',
				data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
			}],
			series: data
			});

		} 


		function init_JQVmap(){
			//console.log('check init_JQVmap [' + typeof (VectorCanvas) + '][' + typeof (jQuery.fn.vectorMap) + ']' );	
		 
		 if(typeof (jQuery.fn.vectorMap) === 'undefined'){ return; }
		 
		 console.log('init_JQVmap');
				
			 if ($('#world-map-gdp').length ){
			
				 $('#world-map-gdp').vectorMap({
					 map: 'world_en',
					 backgroundColor: null,
					 color: '#ffffff',
					 hoverOpacity: 0.7,
					 selectedColor: '#666666',
					 enableZoom: true,
					 showTooltip: true,
					 values: sample_data,
					 scaleColors: ['#E6F2F0', '#149B7E'],
					 normalizeFunction: 'polynomial'
				 });
			 
			 }
			 
			 if ($('#usa_map').length ){
			 
				 $('#usa_map').vectorMap({
					 map: 'usa_en',
					 backgroundColor: null,
					 color: '#ffffff',
					 hoverOpacity: 0.7,
					 selectedColor: '#666666',
					 enableZoom: true,
					 showTooltip: true,
					 values: sample_data,
					 scaleColors: ['#E6F2F0', '#149B7E'],
					 normalizeFunction: 'polynomial'
				 });
			 
			 }
			 
	 };
			 
			 
	 function init_skycons(){
				 
			 if( typeof (Skycons) === 'undefined'){ return; }
			 console.log('init_skycons');
		 
			 var icons = new Skycons({
				 "color": "#73879C"
				 }),
				 list = [
				 "clear-day", "clear-night", "partly-cloudy-day",
				 "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
				 "fog"
				 ],
				 i;
				for (i = list.length; i--;)
				 icons.set(list[i], list[i]);
				icons.play();
	 
	 }  
		
		 //echart Map
			  
		 if ($('#echart_world_map').length ){ 
			  
			var echartMap = echarts.init(document.getElementById('echart_world_map'), theme);
			
			 
			echartMap.setOption({
			title: {
				text: 'Global Climate Changes',
				subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
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
				color: ['#087E65', '#26B99A', '#CBEAE3']
			},
			series: [{
				name: 'Average Temperature(2013)',
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
	 
	}  
	 
	 
$(document).ready(function() {
	var xhttp = new XMLHttpRequest();
	var xx = {};
	xhttp.onreadystatechange = function() {
			 if (this.readyState == 4 && this.status == 200) {
					//  alert(this.responseText);
					//  console.log(this.responseText);
					 xx = this.responseText;
					 init_echarts(xx);

			 }
	};
	xhttp.open("GET", "http://localhost:3000/users", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send();
	// init_sparklines();
	// init_flot_chart();
	// init_sidebar();
	// init_wysiwyg();
	// init_InputMask();
	// init_JQVmap();
	// init_cropper();
	// init_knob();
	// init_IonRangeSlider();
	// init_ColorPicker();
	// init_TagsInput();
	// init_parsley();
	// init_daterangepicker();
	// init_daterangepicker_right();
	// init_daterangepicker_single_call();
	// init_daterangepicker_reservation();
	// init_SmartWizard();
	// init_EasyPieChart();
	init_charts();
	// init_echarts();
	// init_morris_charts();
	// init_skycons();
	// init_select2();
	// init_validator();
	// init_DataTables();
	// init_chart_doughnut();
	// init_gauge();
	// init_PNotify();
	// init_starrr();
	// init_calendar();
	// init_compose();
	// init_CustomNotification();
	// init_autosize();
	// init_autocomplete();
			
});	

