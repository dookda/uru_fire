import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as Highcharts from 'highcharts';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public map: L.Map;
  public center: any;
  public zoom: any;

  public grod: any;
  public gter: any;
  public ghyb: any;
  public mbox: any;

  public hp_pl = 0;
  public hp_pr = 0;
  public hp_st = 0;
  public hp_ud = 0;

  public time: any;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.time = Date();
    this.loadMap();
  }

  async loadMap() {
    this.map = new L.Map('map', {
      center: [17.73, 100.55],
      zoom: 9
    });

    const mbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy;',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY3NrZWxseSIsImEiOiJjamV1NTd1eXIwMTh2MzN1bDBhN3AyamxoIn0.Z2euk6_og32zgG6nQrbFLw'
    });

    const grod = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('http://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const gter = L.tileLayer('http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    // overlay map
    const mapUrl = 'http://map.nu.ac.th/geoserver-hgis/ows?';
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';
    const w3Url = 'http://www3.cgistln.nu.ac.th/geoserver/gistdata/ows?';
    const firms = 'https://firms.modaps.eosdis.nasa.gov/wms?';


    const pro = L.tileLayer.wms(cgiUrl, {
      layers: 'th:province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53 OR pro_code=54 OR pro_code=65 OR pro_code=64'
    });

    const amp = L.tileLayer.wms(cgiUrl, {
      layers: '	th:amphoe_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53 OR pro_code=54 OR pro_code=65 OR pro_code=64'
    });

    const tam = L.tileLayer.wms(cgiUrl, {
      layers: 'th:tambon_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53 OR pro_code=54 OR pro_code=65 OR pro_code=64'
    });

    const rainInterp = L.tileLayer.wms(w3Url, {
      layers: 'gistdata:geotiff_coverage',
      format: 'image/png',
      transparent: true,
      zIndex: 1
    });

    // const fires_viirs_24 = L.tileLayer.wms(firms, {
    //   layers: 'fires_viirs_24',
    //   MAP_KEY: 'a50889d1d6e0c8418614b0fff49dd54f',
    //   format: 'image/png',
    //   transparent: true,
    //   zIndex: 1
    // });

    // const fires_modis_24 = L.tileLayer.wms(firms, {
    //   layers: 'fires_modis_24',
    //   MAP_KEY: 'a50889d1d6e0c8418614b0fff49dd54f',
    //   format: 'image/png',
    //   transparent: true,
    //   zIndex: 1
    // });

    const baseLayers = {
      'map box': mbox,
      'แผนที่ถนน': grod,
      'แผนที่ภาพดาวเทียม': ghyb,
      'แผนที่ภูมิประเทศ': gter.addTo(this.map),
    };

    const overlayLayers = {
      // 'ไฟ modis 24': fires_modis_24.addTo(this.map),
      // 'ไฟ viirs 24': fires_viirs_24.addTo(this.map),
      // 'ปริมาณน้ำฝน': rainInterp.addTo(this.map),
      'ขอบเขตตำบล': tam.addTo(this.map),
      'ขอบเขตอำเภอ': amp.addTo(this.map),
      'ขอบเขตจังหวัด': pro.addTo(this.map)
    };
    new L.Control.Layers(baseLayers, overlayLayers).addTo(this.map);

    const geojsonMarkerOptions = {
      radius: 8,
      fillColor: '#ff0000',
      color: '#5b0000',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    };

    const iconfire = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBjbGFzcz0iIj48Zz48cGF0aCBzdHlsZT0iZmlsbDojRkY2NTM2OyIgZD0iTTU0LjIxMSwyNDkuN2MwLDAsMjAuMjI4LDI5LjcxNyw2Mi42MjQsNTQuODcxYzAsMC0zMC43MDUtMjU5LjUwMiwxNjkuMzU4LTMwNC41NzEgIGMtNTEuMjU3LDE4OC4xMjEsNjUuMiwyNDEuMTc0LDEwNy42NTEsMTQxLjc4NmM3MC44OTMsOTQuNjUxLDE3LjA2NiwxNzcuMjI5LDE3LjA2NiwxNzcuMjI5ICBjMjkuMDY5LDQuMTg4LDUzLjQ4Ny0yNy41Nyw1My40ODctMjcuNTdjMC4yMTgsMy45MTIsMC4zNCw3Ljg1MSwwLjM0LDExLjgxOEM0NjQuNzM4LDQxOC41NDUsMzcxLjI4Myw1MTIsMjU2LDUxMiAgUzQ3LjI2Miw0MTguNTQ1LDQ3LjI2MiwzMDMuMjYyQzQ3LjI2MiwyODQuNzQ0LDQ5LjY4NiwyNjYuNzk0LDU0LjIxMSwyNDkuN3oiIGRhdGEtb3JpZ2luYWw9IiNGRjY1MzYiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBzdHlsZT0iZmlsbDojRkY0MjFEOyIgZD0iTTQ2NC4zOTgsMjkxLjQ0NWMwLDAtMjQuNDE4LDMxLjc1OC01My40ODcsMjcuNTdjMCwwLDUzLjgyNy04Mi41NzgtMTcuMDY2LTE3Ny4yMjkgIEMzNTEuMzk0LDI0MS4xNzQsMjM0LjkzNywxODguMTIxLDI4Ni4xOTQsMEMyNzUuNDc5LDIuNDE0LDI2NS40MzEsNS40NDcsMjU2LDkuMDE4VjUxMmMxMTUuMjgzLDAsMjA4LjczOC05My40NTUsMjA4LjczOC0yMDguNzM4ICBDNDY0LjczOCwyOTkuMjk1LDQ2NC42MTYsMjk1LjM1Nyw0NjQuMzk4LDI5MS40NDV6IiBkYXRhLW9yaWdpbmFsPSIjRkY0MjFEIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggc3R5bGU9ImZpbGw6I0ZCQkYwMDsiIGQ9Ik0xNjQuNDU2LDQyMC40NTZDMTY0LjQ1Niw0NzEuMDE0LDIwNS40NDIsNTEyLDI1Niw1MTJzOTEuNTQ0LTQwLjk4Niw5MS41NDQtOTEuNTQ0ICBjMC0yNy4wNjEtMTEuNzQxLTUxLjM3OS0zMC40MDgtNjguMTM4Yy0zNS4zOTQsNDguMDg1LTg1LjgzMi0yNC44NTYtNDYuNTI0LTc4LjEyMiAgQzI3MC42MTIsMjc0LjE5NiwxNjQuNDU2LDI4Ny40OTksMTY0LjQ1Niw0MjAuNDU2eiIgZGF0YS1vcmlnaW5hbD0iI0ZCQkYwMCIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHN0eWxlPSJmaWxsOiNGRkE5MDAiIGQ9Ik0zNDcuNTQ0LDQyMC40NTZjMC0yNy4wNjEtMTEuNzQxLTUxLjM3OS0zMC40MDgtNjguMTM4Yy0zNS4zOTQsNDguMDg1LTg1LjgzMi0yNC44NTYtNDYuNTI0LTc4LjEyMiAgYzAsMC01Ljc2OCwwLjcyNS0xNC42MTIsMy41MTZWNTEyQzMwNi41NTgsNTEyLDM0Ny41NDQsNDcxLjAxNCwzNDcuNTQ0LDQyMC40NTZ6IiBkYXRhLW9yaWdpbmFsPSIjRkZBOTAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiPjwvcGF0aD48L2c+IDwvc3ZnPg==`;

    const hp = L.icon({
      iconUrl: iconfire,
      iconSize: [32, 37],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });


    this.dataService.getAirquality().then((res: any) => {
      // console.log(res);

      let aqiTxt, ic;
      if (res.LastUpdate.AQI.aqi > 200) {
        aqiTxt = 'มีผบกระทบต่อสุขภาพ';
        ic = L.icon({
          iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi5.png',
          iconSize: [32, 37],
          iconAnchor: [12, 37],
          popupAnchor: [5, -36]
        });
      } else if (res.LastUpdate.AQI.aqi > 101) {
        aqiTxt = 'เริ่มมีผลกระทบต่อสุขภาพ';
        ic = L.icon({
          iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi4.png',
          iconSize: [32, 37],
          iconAnchor: [12, 37],
          popupAnchor: [5, -36]
        });
      } else if (res.LastUpdate.AQI.aqi > 51) {
        aqiTxt = 'ปานกลาง';
        ic = L.icon({
          iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi3.png',
          iconSize: [32, 37],
          iconAnchor: [12, 37],
          popupAnchor: [5, -36]
        });
      } else if (res.LastUpdate.AQI.aqi > 26) {
        aqiTxt = 'ดี';
        ic = L.icon({
          iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi2.png',
          iconSize: [32, 37],
          iconAnchor: [12, 37],
          popupAnchor: [5, -36]
        });
      } else {
        aqiTxt = 'ดีมาก';
        ic = L.icon({
          iconUrl: 'http://cgi.uru.ac.th/fire_assets/img/aqi1.png',
          iconSize: [32, 37],
          iconAnchor: [12, 37],
          popupAnchor: [5, -36]
        });
      }

      L.marker([Number(res.lat), Number(res.long)], {
        icon: ic
      }).addTo(this.map).bindPopup('<h5>สถานีตรวจวัดคุณภาพอากาศ ' + res.nameTH + '</h5>' +
        '<br/><span >สถานที่:</span>' + res.areaTH +
        '<br/><span >ค่า AQI:</span>' + res.LastUpdate.AQI.aqi +
        '<br/><span >ระดับคุณภาพอากาศ (AQI):</span>' + aqiTxt +
        '<br/><span >CO:</span>' + res.LastUpdate.CO.value +
        '<br/><span >NO2:</span>' + res.LastUpdate.NO2.value +
        ' <br/><span >O3:</span>' + res.LastUpdate.O3.value +
        '<br/><span >PM10:</span>' + res.LastUpdate.PM10.value +
        '<br/><span >PM25:</span>' + res.LastUpdate.PM25.value +
        '<br/><span >SO2:</span>' + res.LastUpdate.SO2.value +
        ' <br/>ที่มา: กรมควบคุมมลพิษ <br/>http://air4thai.pcd.go.th'
      );
    });

    await this.dataService.getModis().then((res: any) => {
      this.hp_pl += res.pl;
      this.hp_pr += res.pr;
      this.hp_st += res.st;
      this.hp_ud += res.ud;

      L.geoJSON(res.data, {
        pointToLayer: function (feature: any, latlng: any) {
          return L.marker(latlng, {
            icon: hp,
            properties: feature.properties.latitude,
            iconName: 'da'
          });
        },
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            const time = feature.properties.acq_time;
            const hr = Number(time.slice(0, 2));
            const mn = Number(time.slice(2, 4));

            // console.log(time);

            layer.bindPopup(
              'lat: ' + feature.properties.latitude +
              '<br/>lon: ' + feature.properties.longitude +
              '<br/>satellite: ' + feature.properties.satellite +
              '<br/>วันที่: ' + feature.properties.acq_date +
              '<br/>เวลา: ' + hr + ':' + mn
            );
          }
        }
      }).addTo(this.map);
    });

    await this.dataService.getViirs().then((res: any) => {
      this.hp_pl += res.pl;
      this.hp_pr += res.pr;
      this.hp_st += res.st;
      this.hp_ud += res.ud;

      this.getChart();

      L.geoJSON(res.data, {
        pointToLayer: function (feature: any, latlng: any) {
          return L.marker(latlng, {
            icon: hp,
            iconName: 'da'
          });
        },
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            const time = feature.properties.acq_time;
            const hr = time.slice(0, 2);
            const mn = time.slice(2, 4);

            // console.log(time);

            layer.bindPopup(
              'lat: ' + feature.properties.latitude +
              '<br/>lon: ' + feature.properties.longitude +
              '<br/>satellite: ' + feature.properties.satellite +
              '<br/>วันที่: ' + feature.properties.acq_date +
              '<br/>เวลา: ' + hr + ':' + mn + ' น.'
            );
          }
        }
      }).addTo(this.map);
    });
  }

  getChart() {
    Highcharts.chart('chart', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Monthly Average Rainfall',
        style: {
          display: 'none'
        }
      },
      subtitle: {
        text: 'Source: WorldClimate.com',
        style: {
          display: 'none'
        }
      },
      xAxis: {
        categories: [
          'แพร่',
          'อุตรดิตถ์',
          'พิษณุโลก',
          'สุโขทัย',
        ],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'hotspot (จุด)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.0f} จุด</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'hotspot',
        data: [this.hp_pr, this.hp_ud, this.hp_pl, this.hp_st]

      }]
    });
  }


}
