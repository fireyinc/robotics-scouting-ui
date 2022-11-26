<template>
  <div id="app">
    <div class="content">
      <div class="sidebar">
      </div>
      <div class="maincontainer">
        <!-- <div class="datasect" v-for="i in teamstats" :key="i.teamnumber">
          <p>Team Number: {{i.teamnumber}}</p>
          <p>Average Score: {{i.teamavgscore}}</p>
        </div> -->
        <router-link :to="teamURL(i.teamnumber)" tag="div" class="datasect" v-for="i in teamstats" :key="i.teamnumber">
          <div class="onelookperf">
            Excellent
          </div>
          <div class="datasectdata">

            <span style="font-weight: bold;">Team {{i.teamnumber}}: {{i.teamname}}</span>
            <table style="font-size: 10pt; color: #6b6b6b;">
              <tr>
                <td>Avg Score: {{i.teamavgscore}}</td>
                <td>Reliability: {{i.reliability}}%</td>
                <td>Most Reached Bar: {{i.bar}}</td>
                <td>Avg Climb Time: {{i.teamavgclimbtime}} secs</td>
                
              </tr>
              <tr>
                <td>Avg Cycle Time: {{i.teamavgcycle}} secs</td>
                <td>Cooperation: {{i.cooperation}}</td>
                <td>Avg Penalties: {{i.penalties}}</td>
                <td>Match Strategy: {{i.strat}}</td>
              </tr>
            </table>

          </div>
        </router-link>
      </div>
    </div>
    
    
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'App',

  
  
  data() {
    return{
      csvData: [],
      correspondingTeamNames: [],
      teamstats: []
    }
   
  },

  methods: {
    teamURL(teamnumber) {
      var num = "/about/" + teamnumber
      return num
    },

    mostFrequent(arr){
      return Object.entries(
        arr.reduce((a, v) => {
          a[v] = a[v] ? a[v] + 1 : 1;
          return a;
        }, {})
      ).reduce((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0];
    },

    getteamdata() {
      var teams = []
      this.csvData.forEach(item => {
        teams.push(item.tnumber)
        // console.log(item)
      })
      

      teams = [...new Set(teams)]


      var teamdata = []

      teams.forEach(item => {

        var reliabillity = 0
        var avgcoop = 0
        var penalties = 0
        var avgcycle = 0
        var avgclimbtime = 0
        var avgpoints = 0
        var teamentries = 0
        var bar = []
        var offdef = []

        console.log(item)
        this.csvData.filter(entry => entry.tnumber == item).forEach((part) => {
          
          avgpoints += (parseInt(part.taxipts) || 0) + (parseInt(part.lowget) || 0) + ((parseInt(part.highget) || 0) * 2) + ((parseInt(part.autoget) || 0) * 2)
          switch (part.climbget){
            case "Traversal Bar":
              avgpoints += 15
          
              break;

            case "High Bar":
              avgpoints += 10
         
              break;

            case "Mid Bar":
              avgpoints += 6

              break;

            case "Low Bar":
              avgpoints += 4
        
              break;
            
            default:
              avgpoints += 0
             
              
          }

          penalties += (parseInt(part.penaltycommit) || 0)

          avgcycle += (parseInt(part.cyclesecs) || 0)

          avgclimbtime += (parseInt(part.climbsecs) || 0)

          avgcoop += (parseInt(part.cooprating) || 0)

          if (part.broken.includes("No")){
            reliabillity = reliabillity + 1
          }
          


          bar.push(part.climbget)
          offdef.push(part.matchstrat)
          teamentries++


          
        })
        
        axios.get(`https://www.thebluealliance.com/api/v3/team/frc${item}/simple`).then(response => {
          // console.log(response.data)
          teamdata.push({teamname: response.data.nickname, teamnumber: item, teamavgscore: Math.round(avgpoints/teamentries), teamavgcycle: Math.round(avgcycle/teamentries), reliability: Math.round((reliabillity/teamentries)*100), cooperation: Math.round(avgcoop/teamentries), bar: (this.mostFrequent(bar) != "No Climb") ? this.mostFrequent(bar).slice(0, -4) : "No Climb", strat: this.mostFrequent(offdef), penalties: Math.round(penalties/teamentries), teamavgclimbtime: Math.round(avgclimbtime/teamentries)})
        })


        
      })

      // console.log(teamdata)

      // teamdata.sort((a, b) => parseInt(a.teamnumber) - parseInt(b.teamnumber))
      teamdata.forEach(team => console.log(team))
      this.teamstats = teamdata
      // return teamdata
    }
  },

  computed: {
    // teamstats() {
      
      
    // }
  },

  async mounted() {

    axios.defaults.headers.common['X-TBA-Auth-Key'] = "fbkgBWLltUBDHgZLy1P2OAnKWX4VfSHjEJDYNH9Jz9vXqpjxkUJpxXKJg4HYImIn";

    fetch("/../scouting.tsv").then(response => response.text()).then(data => {
      var fieldnames = ["date", "name", "tnumber", "tmatch", "dstation", "autonposit", "taxipts", "autoshot", "autoget", "matchstrat", "lowshot", "lowget", "highshot", "highget", "cyclesecs", "shootpoint", "offenserating", "oppcargoshot", "oppcargoget", "defenserating", "climbtried", "climbget", "climbsecs", "broken", "penaltycommit", "penaltydrawn", "allscore", "problems", "cooprating", "notes", "opponentscore", "cargorp", "climberrp"]
      var scouts = data.slice(data.indexOf("\r\n") + 1).split("\n")
      // console.log(scouts)
      
      const arr = scouts.map(function (row) {
        const values = row.split("\t");
        const el = fieldnames.reduce(function (object, header, index) {
          object[header] = values[index];
          return object;
        }, {});
        return el;
      });

      this.csvData = arr
      this.csvData.shift()
      this.getteamdata()
    })    

    // axios.get("https://www.thebluealliance.com/api/v3/team/frc1885/simple").then(response => {console.log(response.data)})

    
  }

}
</script>

<style scoped>

  @import url("https://fonts.googleapis.com/css?family=Roboto");

  html,body {
    color: white;
    margin: 0 0;
    padding: 0 0;
    font-family: 'Roboto';
  }

  #app{
    display: flex;
    flex-direction: column;
  }

  #mainbar{
    height: 60px;
    background-color: rgb(31, 31, 31);
    /* box-shadow: 0 0 5px 0px #000000; */
    z-index: 100;
    
  }

  #mainbar > p {
    height: 60px;
    line-height: 30px;
    margin-left: 5px;
    
  }



  .content{
    display: flex;
    flex-direction: row;
  }

  .maincontainer{
    /* padding: 10px; */
    height: calc(100vh - 60px);
    flex-grow: 1;
    width: 85vw;
    background-color: rgb(48, 48, 48);
    box-sizing: border-box;
    overflow: auto;
  }

  .datasect{
    display: flex;
    flex-direction: row;
    min-height: 60px;
    border-width: 5px;
    border-style: none;
    border-radius: 5px;
    background-color: rgb(27, 27, 27);
    box-sizing: border-box;
    margin: 10px;
    box-shadow: 0 0 5px 0px #000000;
  }

  .onelookperf {
    height: inherit;
    background-color: green;
    width: 20px; 
    border-radius: 5px 0 0 5px;
    writing-mode: vertical-rl;
    padding: 5px 0;
    padding-left: 5px;
    /* box-sizing: border-box; */
  }

  .datasectdata{
    height: inherit;
    padding: 10px 10px;
    /* padding-left: 10px; */
    box-sizing: border-box;
    width: 100%;
    /* background-color: orange; */
    /* background */
  }



  .datasect > p{
    margin: 0 0;
    /* margin-bottom: 10px; */
    
    padding: 0 0;
  }


  .sidebar {
    width: 15vw;
    padding: 10px;
    height: calc(100vh - 60px);
    background-color: rgb(75, 75, 75);
    overflow: auto;
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #424242; 
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888; 
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }


  .datasectdata > table, td {
    table-layout: fixed;
    width: 100%;
    margin: 0 0;
  }

  /* .datasectdata > table{
    width: 100%;
  } */

</style>
