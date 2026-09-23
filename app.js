const boroughs = { M: 'Manhattan', Bk: 'Brooklyn', Q: 'Queens', Bx: 'The Bronx', SI: 'Staten Island' };
const ada = { '0': 'Not accessible', '1': 'Fully accessible', '2': 'Partially accessible' };

window.addEventListener('load', function() {
    console.log('Window loaded');

    fetch('https://data.ny.gov/resource/39hk-dx4f.json')
        .then(response => response.json())
        .then(stations => {
            const pick = stations[Math.floor(Math.random() * stations.length)];
            
            document.getElementById('stationName').textContent = pick.stop_name;
            document.getElementById('details').textContent =
                `${boroughs[pick.borough]} · ${pick.daytime_routes} trains · ${pick.structure} · ${ada[pick.ada]}`;
        })
            // console.log(data.results);
            // let nameElement = document.getElementById('stationName');
            // nameElement.innerHTML = data.results[0].name;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
