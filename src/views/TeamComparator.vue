<template>
  <div id="app">
    <div class="topbar">
      <router-link to="/#/" custom v-slot="{navigate}">
        <button class="return" @click="navigate">
          <i class="far fa-chevron-left" style="font-size: 14pt; margin-right: 5px;"></i>Team List
        </button>
      </router-link>
      <span>Team Comparator</span>
      
    </div>
    <div class="content">
      <div class="maincontainer">
        <div id="comparatordrops">
          <select @change="onChangeSelect($event, 1)">
            <option value="0000">No team selected</option>
            <option v-for="i in teamentries" :value="i.teamnumber" :key="i.teamnumber">Team {{i.teamnumber}}: {{i.teamname}}</option>
          </select>
          <span>vs.</span>
          <select @change="onChangeSelect($event, 2)">
            <option value="0000">No team selected</option>
            <option v-for="i in teamentries" :value="i.teamnumber" :key="i.teamnumber">Team {{i.teamnumber}}: {{i.teamname}}</option>
          </select>
        </div>

        <div class="maindatacont">
          <div class="teamtable">
            <span style="font-size: 20pt; font-weight: bold;">Team 1 Stats</span>
            <div class="scoringdatas">
                <p>Avg Score: {{team1stats.teamavgscore}}</p>
                <p>Reliability: {{team1stats.reliability}}%</p>
                <p>Most Reached Bar: {{team1stats.bar}}</p>
                <p>Avg Climb Time: {{team1stats.teamavgclimbtime}} secs</p>
                

                <p>Avg Cycle Time: {{team1stats.teamavgcycle}} secs</p>
                <p>Cooperation: {{team1stats.cooperation}}/10</p>
                <p>Avg Penalties: {{team1stats.penalties}}</p>
                <p>Match Strategy: {{team1stats.strat}}</p>


                <p>Auton Accuracy: {{team1stats.autonacc}}%</p>
                <p>Low Goal Acc.: {{team1stats.lowacc}}%</p>
                <p>High Goal Acc.: {{team1stats.highacc}}%</p>
                <p>Gets Cargo RP: {{team1stats.cargorp}}</p>
                <p>Gets Climb RP: {{team1stats.climbrp}}</p>
                <p>Shoots From: {{team1stats.shootpt}}</p>
                <p>Climb OPR: {{team1stats.climbavg}}</p>
            </div>

          </div>
          <div class="teamtable">
            <span style="font-size: 20pt; font-weight: bold;">Team 2 Stats</span>
            <div class="scoringdatas">
                <p>Avg Score: {{team2stats.teamavgscore}}</p>
                <p>Reliability: {{team2stats.reliability}}%</p>
                <p>Most Reached Bar: {{team2stats.bar}}</p>
                <p>Avg Climb Time: {{team2stats.teamavgclimbtime}} secs</p>
                

                <p>Avg Cycle Time: {{team2stats.teamavgcycle}} secs</p>
                <p>Cooperation: {{team2stats.cooperation}}/10</p>
                <p>Avg Penalties: {{team2stats.penalties}}</p>
                <p>Match Strategy: {{team2stats.strat}}</p>


                <p>Auton Accuracy: {{team2stats.autonacc}}%</p>
                <p>Low Goal Acc.: {{team2stats.lowacc}}%</p>
                <p>High Goal Acc.: {{team2stats.highacc}}%</p>
                <p>Gets Cargo RP: {{team2stats.cargorp}}</p>
                <p>Gets Climb RP: {{team2stats.climbrp}}</p>
                <p>Shoots From: {{team2stats.shootpt}}</p>
                <p>Climb OPR: {{team2stats.climbavg}}</p>
            </div>

          </div>
        </div>

        <div class="maindatacont">
          <div class="graphcarousel">

            <div class="graphcarousel"> 
              <div class="carouseldiv">
                <canvas ref="chartone"></canvas>
              </div>

              <div class="carouseldiv">
                <canvas ref="charttwo"></canvas>
              </div>

              <div class="carouseldiv">
                <canvas ref="chartthree"></canvas>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
    
    
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import Chart from 'chart.js/auto';


export default {
  name: 'App',

  
  
  data() {
    return{
      csvData: [],
      correspondingTeamNames: [],
      team1stats: {},
      team2stats: {},
      teamentries: [],
      val1: 0,
      val2: 0,

      labels4graph2: [],

      defaultnames: ["Match 1", "Match 2", "Match 3", "Match 4", "Match 5", "Match 6", "Match 7", "Match 8", "Match 9", "Match 10", "Match 11", "Match 12"],
      
      climbopr: [],
      maxcycletime: 0,
      mincycletime: 0,
      maxclimbtime: 0,
      minclimbtime: 0,
      maxpts: 0,
      minpts: 0,

      chart1: undefined,
      chart2: undefined,
      chart3: undefined,

    }
   
  },

  methods: {
    onChangeSelect(event, dropdownnumber){
    
      
      if (dropdownnumber == 1){
        this.val1 = event.target.value
        this.team1stats = this.selectteam(event.target.value)


        var datach1A = [
          Math.round(Math.abs(this.team1stats.teamavgscore-this.minpts)/Math.abs(this.maxpts-this.minpts)*100),
          this.team1stats.autonacc, 
          this.team1stats.highacc, 
          this.team1stats.lowacc, 
          this.team1stats.reliability, 
          this.team1stats.cooperation*10,
          100-Math.round(Math.abs(this.team1stats.teamavgcycle-this.mincycletime)/Math.abs(this.maxcycletime-this.mincycletime)*100), 
          100-Math.round(Math.abs(this.team1stats.teamavgclimbtime/this.team1stats.climbavg-this.minclimbtime)/Math.abs(this.maxclimbtime-this.minclimbtime)*100),
          Math.round(Math.abs(this.team1stats.climbavg-this.climbopr[1])/Math.abs(this.climbopr[0]-this.climbopr[1])*100),
        ]


        this.chart1.data.datasets[0].data = datach1A





        this.chart1.update()


        this.chart2.data.datasets[0].data = this.perMatchData(event.target.value)[0]
        this.chart2.data.labels = this.perMatchData(event.target.value)[5]
        this.chart2.update()


        this.chart3.data.datasets[0].data = this.perMatchData(event.target.value)[4]
        this.chart3.data.datasets[1].data = this.perMatchData(event.target.value)[3]
        this.chart3.data.labels = this.perMatchData(event.target.value)[5]
        this.chart3.update()


      }




      if (dropdownnumber == 2){
        this.val2 = event.target.value
        this.team2stats = this.selectteam(event.target.value)
        this.val1 = event.target.value
        this.team1stats = this.selectteam(event.target.value)

        var datach1B = [
          Math.round(Math.abs(this.team2stats.teamavgscore-this.minpts)/Math.abs(this.maxpts-this.minpts)*100),
          this.team2stats.autonacc, 
          this.team2stats.highacc, 
          this.team2stats.lowacc, 
          this.team2stats.reliability, 
          this.team2stats.cooperation*10,
          100-Math.round(Math.abs(this.team2stats.teamavgcycle-this.mincycletime)/Math.abs(this.maxcycletime-this.mincycletime)*100), 
          100-Math.round(Math.abs(this.team2stats.teamavgclimbtime/this.team2stats.climbavg-this.minclimbtime)/Math.abs(this.maxclimbtime-this.minclimbtime)*100),
          Math.round(Math.abs(this.team2stats.climbavg-this.climbopr[1])/Math.abs(this.climbopr[0]-this.climbopr[1])*100),
        ]

        // var datach2B = [
        //   Math.round(Math.abs(this.team2stats.teamavgscore-this.minpts)/Math.abs(this.maxpts-this.minpts)*100),
        //   this.team2stats.autonacc, 
        //   this.team2stats.highacc, 
        //   this.team2stats.lowacc, 
        //   this.team2stats.reliability, 
        //   this.team2stats.cooperation*10,
        //   100-Math.round(Math.abs(this.team2stats.teamavgcycle-this.mincycletime)/Math.abs(this.maxcycletime-this.mincycletime)*100), 
        //   100-Math.round(Math.abs(this.team2stats.teamavgclimbtime/this.team2stats.climbavg-this.minclimbtime)/Math.abs(this.maxclimbtime-this.minclimbtime)*100),
        //   Math.round(Math.abs(this.team2stats.climbavg-this.climbopr[1])/Math.abs(this.climbopr[0]-this.climbopr[1])*100),
        // ]


        this.chart1.data.datasets[1].data = datach1B
        this.chart1.update()

        this.chart2.data.datasets[1].data = this.perMatchData(event.target.value)[0]
        this.chart2.update()


        this.chart3.data.datasets[2].data = this.perMatchData(event.target.value)[4]
        this.chart3.data.datasets[3].data = this.perMatchData(event.target.value)[3]
        this.chart3.update()
      }

      

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
        teams.push(item.team)
      })
      

      teams = [...new Set(teams)]

      var cycletimes = []
      var climbtimes = []
      var pointdata = []

      var climberavg = []


      var teamdata = []

      teams.forEach(item => {

        var reliabillity = 0
        var avgcoop = 0
        var penalties = 0
        var avgcycle = 0
        var avgclimbtime = 0
        var avgpoints = 0
        var teamentries = 0


        var autonaccuracy = 0;
        var lowaccuracy = 0;
        var highaccuracy = 0;
        var climberavgs = 0;
        

        var bar = []
        var offdef = []
        var carp = []
        var clrp = []
        var shtpt = []
        var matches = []
        
        this.csvData.filter(entry => entry.team == item).forEach((part) => {
          
          avgpoints += (parseInt(part.taxipts) || 0) + (parseInt(part.lowget) || 0) + ((parseInt(part.highget) || 0) * 2) + ((parseInt(part.autoget) || 0) * 2)
          switch (part.climbget){
            case "Traversal Bar":
              avgpoints += 15
              climberavgs += 15
              break;

            case "High Bar":
              avgpoints += 10
              climberavgs += 10
              break;

            case "Mid Bar":
              avgpoints += 6
              climberavgs += 6
              break;

            case "Low Bar":
              avgpoints += 4
              climberavgs += 4
              break;
            
            default:
              avgpoints += 0
              climberavgs += 0
              
          }

          penalties += (parseInt(part.commpenalties) || 0)

          avgcycle += (parseInt(part.cycletime) || 0)

          avgclimbtime += (parseInt(part.timetoclimb) || 0)

          avgcoop += (parseInt(part.cooprating) || 0)

          if (part.broken.includes("No")){
            reliabillity = reliabillity + 1
          }
          
          autonaccuracy += ((parseInt(part.autonget) || 0)/(parseInt(part.autonshot) || 0))*100 || 0
          lowaccuracy += ((parseInt(part.lowget) || 0)/(parseInt(part.lowshot) || 0))*100 || 0
          highaccuracy += ((parseInt(part.highget) || 0)/(parseInt(part.highshot) || 0))*100 || 0

          bar.push(part.climbget)
          offdef.push(part.matchstrat)

          carp.push(part.cargorp)
          clrp.push(part.climbrp)
          shtpt.push(part.shotlocation)
          teamentries++
          matches.push(`Match ${teamentries}`)


        
          
        })
        
        cycletimes.push(Math.round(avgcycle/teamentries))
        climbtimes.push(Math.round(avgclimbtime/teamentries))
        pointdata.push(Math.round(avgpoints/teamentries))
        climberavg.push((climberavgs/teamentries).toFixed(2))


        axios.get(`https://www.thebluealliance.com/api/v3/team/frc${item}/simple`).then(response => {
          teamdata.push({
            teamname: response.data.nickname, 
            teamnumber: item, 
            teamavgscore: Math.round(avgpoints/teamentries), 
            teamavgcycle: Math.round(avgcycle/teamentries), 
            reliability: Math.round((reliabillity/teamentries)*100), 
            cooperation: Math.round(avgcoop/teamentries), 
            bar: (this.mostFrequent(bar) != "No Climb") ? this.mostFrequent(bar).slice(0, -4) : "No Climb", 
            strat: this.mostFrequent(offdef), 
            penalties: Math.round(penalties/teamentries), 
            teamavgclimbtime: Math.round(avgclimbtime/teamentries),
            autonacc: Math.round(autonaccuracy/teamentries), 
            lowacc: Math.round(lowaccuracy/teamentries), 
            highacc: Math.round(highaccuracy/teamentries),
            cargorp: this.mostFrequent(carp),
            climbrp: this.mostFrequent(clrp),
            shootpt: this.mostFrequent(shtpt),
            climbavg: (climberavgs/teamentries).toFixed(2)
          })
        })


        
      })


      this.teamentries = teamdata

      cycletimes = cycletimes.sort((a, b) => {return a - b})
      climbtimes = climbtimes.sort((a, b) => {return a - b})
      pointdata = pointdata.sort((a, b) => {return a - b})
      climberavg = climberavg.sort((a, b) => {return a - b})

      this.maxcycletime = cycletimes.at(-1)
      this.mincycletime = climbtimes[0]
      this.maxclimbtime = climbtimes.at(-1)
      this.minclimbtime = climbtimes[0]
      this.maxpts = pointdata.at(-1)
      this.minpts = pointdata[0]

      this.climbopr = [climberavg.at(-1), climberavg[0]]
      this.setupChartOne()
      this.setupChartTwo(this.defaultnames)
      this.setupChartThree(this.defaultnames)
    },

    selectteam(teamnumber) {
      var teamd = this.teamentries.filter(entry => entry.teamnumber == teamnumber)
      return teamd[0]
    },

    setupChartOne() {
      var ctx = this.$refs.chartone.getContext('2d')

      Chart.defaults.borderColor = '#6b6b6b';
      // Chart.maintainAspectRatio = false
      this.chart1 = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Average Score', 'Auton Accuracy', 'High Goal Accuracy', 'Low Goal Accuracy', 'Reliability', 'Cooperation', 'Cycle Speed', 'Climb Points Per Second', 'Climb OPR'],
          datasets: [
            {
              label: `Team 1`,
              data: 
              [
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0,
                0,
                0,
              ],
              borderWidth: 2,
              borderColor: "rgb(255, 0, 55)",
              backgroundColor: "rgb(255, 0, 55, 0.25)"
            },
            {
              label: `Team 2`,
              data: 
              [
                0, 
                0, 
                0, 
                0, 
                0, 
                0, 
                0,
                0,
                0,
              ],
              borderWidth: 2,
              borderColor: "rgb(55, 0, 255)",
              backgroundColor: "rgb(22, 0, 255, 0.25)"
            }
          ]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              ticks: {
                  display: false,
                  backdropColor: "rgb(48, 48, 48)"
              }
            }
            
          },
          maintainAspectRatio: false,
        }
      })
    },

    setupChartTwo(names) {
      var ctx = this.$refs.charttwo.getContext('2d')

      Chart.defaults.borderColor = '#6b6b6b';
      // Chart.maintainAspectRatio = false
      this.chart2 = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: names,
          datasets: [
            {
              label: `Team 1 Points`,
              data: 0,
              borderWidth: 2,
              borderColor: "rgb(255, 0, 55)",
              backgroundColor: "rgb(255, 0, 55, 0.25)"
            },
            {
              label: `Team 2 Points`,
              data: 0,
              borderWidth: 2,
              borderColor: "rgb(55, 0, 255)",
              backgroundColor: "rgb(55, 0, 255, 0.25)"
            },
        ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Points Scored per Match",
              font: {
                size: 24,
                weight: "normal"
              },
              // color: "white",
              
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          },
          maintainAspectRatio: false,
        }
      })
    },

    setupChartThree(names) {
      var ctx = this.$refs.chartthree.getContext('2d')

      Chart.defaults.borderColor = '#6b6b6b';
      // Chart.maintainAspectRatio = false
      this.chart3 = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: names,
          datasets: [
            {
              label: `Team 1 High Balls Shot`,
              data: 0,
              borderWidth: 2,
              borderColor: "rgb(255, 0, 55)",
              backgroundColor: "rgba(255, 0, 55, 0.25)",
            },
            {
              label: `Team 1 High Balls Made`,
              data: 0,
              borderWidth: 2,
              borderColor: "rgb(255, 0, 166)",
              backgroundColor: "rgba(255, 0, 166, 0.25)",
            },
            {
              label: `Team 2 High Balls Shot`,
              data: 0,
              borderWidth: 2,
              borderColor: "rgb(55, 0, 255)",
              backgroundColor: "rgba(55, 0, 255, 0.25)",
            },
            {
              label: `Team 2 High Balls Made`,
              data: 0,
              borderWidth: 2,
              borderColor: "rgb(170, 0, 255)",
              backgroundColor: "rgba(170, 0, 255, 0.25)",
            },
        ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Balls Shot vs. Balls Made",
              font: {
                size: 24,
                weight: "normal"
              },
              // color: "white",
              
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }, 
            r: {
              ticks: {
                  display: false,
                  backdropColor: "rgb(48, 48, 48)"
              }
            }
          },
          maintainAspectRatio: false,
        }
      })
    },

    perMatchData(teamnumber){
      var pointsarray = []
      var lowballsget = []
      var lowballsshot = []
      var highballsget = []
      var highballsshot = []
      var names = []
      var count = 0

      var entries = this.csvData.filter(entry => entry.team == teamnumber)
      

      entries.forEach((entry) => {

        var avgpoints = 0;
        avgpoints += (parseInt(entry.taxipts) || 0) + (parseInt(entry.lowget) || 0) + ((parseInt(entry.highget) || 0) * 2) + ((parseInt(entry.autoget) || 0) * 2)
        switch (entry.climbget){
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
        pointsarray.push(avgpoints)

        lowballsget.push(entry.lowget)
        lowballsshot.push(entry.lowshot)
        highballsget.push(entry.highget)
        highballsshot.push(entry.highshot)

        count++
        names.push(`Match ${count}`)

      })


      return [pointsarray, lowballsget, lowballsshot, highballsget, highballsshot, names]
    },



 
  },

  computed: {
    // teamstats() {
      
      
    // }
  },

  async mounted() {

    axios.defaults.headers.common['X-TBA-Auth-Key'] = "fbkgBWLltUBDHgZLy1P2OAnKWX4VfSHjEJDYNH9Jz9vXqpjxkUJpxXKJg4HYImIn";

    const firebasesetup = {
      databaseURL: "https://frcscoutsheet-default-rtdb.firebaseio.com",
    }

    const app = initializeApp(firebasesetup)


    const db = getDatabase(app)


    const refer = ref(db)

    onValue(refer, (event) => {
      this.csvData = event.val()
      this.getteamdata()
      // this.getallteamdata()
    })

    this.team1stats = {
            teamname: 0, 
            teamnumber: 0, 
            teamavgscore: 0, 
            teamavgcycle: 0, 
            reliability:  0, 
            cooperation:  0, 
            bar:  0, 
            strat:  0, 
            penalties:  0, 
            teamavgclimbtime: 0,
            autonacc: 0, 
            lowacc: 0, 
            highacc:  0,
            cargorp:  0,
            climbrp:  0,
            shootpt:  0,
            climbavg: 0
    }

    this.team2stats = {
            teamname: 0, 
            teamnumber: 0, 
            teamavgscore: 0, 
            teamavgcycle: 0, 
            reliability: 0, 
            cooperation: 0, 
            bar: 0, 
            strat: 0, 
            penalties: 0, 
            teamavgclimbtime: 0,
            autonacc: 0, 
            lowacc: 0, 
            highacc: 0,
            cargorp: 0,
            climbrp: 0,
            shootpt: 0,
            climbavg: 0
    }
    
    
  },

  created() {
    
  },


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

  hr{
    border: solid 0.5px #6b6b6b;
    border-bottom: none;
  }

 
  #comparatordrops{
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    background-color: transparent;
    display: flex;
    flex-direction: column;

  }

  #comparatordrops > select {
    height: 50px;
    flex-grow: 1;
    background-color: transparent;
    border-radius: 5px; 
    color: #6b6b6b;
    font-weight: bold;
    font-family: roboto;
    font-size: 14pt;
    outline: none;
  }

  #comparatordrops > option {
    background-color: black;
  }

  #comparatordrops > span {
    margin: 0px 10px;
    height: 50px;
    line-height: 50px;
    flex-grow: 1;
   /* background-color: orange; */
    box-sizing: border-box;
    text-align: center;
  }

  .dptgriditem {
    font-size: 10pt;
    color: #6b6b6b;
    margin: 0 0;
    padding: 0 0;
  }

  .gridcontainer{
    display: grid;
    grid-template-columns: auto auto;
    /* grid-template-columns: auto; */
  }
  .maindatacont{
      /* height: 500px; */
      width: 100%;
      /* background: green; */
      /* background-color: orange; */
      display: flex;
      flex-direction: column;
  }

  .scoringdatas{
    display: grid;
    grid-template-columns: auto auto;
    font-size: 12pt;
  }

  h1{
    font-size: 5vw;
  }

  .graphcarousel > .carouseldiv {
    scroll-snap-align: start;

    height: 400px;
    width: 100%;
    flex-shrink: 0;
    box-sizing: border-box;

    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border-width: 5px;
    border-color: red;


  }

  @media (hover: hover) and (pointer: fine) and (min-width: 700px){
    .maindatacont{
      height: 500px;
      width: 100%;
      display: flex;
      flex-direction: row;
    }

    h1{
      font-size: 2vw
    }

    .gridcontainer{
      display: grid;
      grid-template-columns: auto auto auto auto;
      /* grid-template-columns: auto; */
    }
    .graphcarousel > .carouseldiv {
      scroll-snap-align: start;

      height: 100%;
      width: 100%;
      flex-shrink: 0;
      box-sizing: border-box;
      border-width: 5px;
      border-color: red;
      

    }
    #comparatordrops{
      box-sizing: border-box;
      padding: 10px;
      width: 100%;
      background-color: transparent;
      display: flex;
      flex-direction: row;

    }

    #comparatordrops > select {
      height: 50px;
      flex-grow: 1;
      background-color: transparent;
      border-radius: 5px; 
      color: #6b6b6b;
      font-weight: bold;
      font-family: roboto;
      font-size: 14pt
    }

    #comparatordrops > option {
      background-color: black;
    }

    #comparatordrops > span {
      margin: 0px 10px;
      height: 50px;
      line-height: 50px;
    }

  }

  .teamtable{
    min-height: 500px;
    /* background-color: orange; */
    flex: 0 0 50%;
    
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  .graphcarousel{
    /* height: 100%; */
    height: 500px;
    width: 100%;
    overflow-x: auto;
    display: flex;
    
    flex-direction: row;
    /* overscroll-behavior: contain; */
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
  }

  .return {
    border: none;
    background-color: transparent;
    color: rgb(40, 36, 255);
    height: 100%;
    width: 108px;
    font-family: "Roboto";
    font-size: 14pt;
    /* background-color: orange; */
  }

  .topbar > span{
    color: white;
    /* background-color: orange; */
    height: 100%;
    padding: 10px;
    margin-left: auto;
    text-align: center;
    
  
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

  .topbar{
    height: 40px;
    background-color: #181818;
    display: flex;
    flex-direction: row;
    /* justify-content: space-evenly; */
    box-sizing: border-box;
    padding-left: 10px;
    
    
    
  }

  .content{
    display: flex;
    flex-direction: row;
  }

  .maincontainer{
    padding: 5vw;
    height: calc(100vh - 100px);
    flex-grow: 1;
    width: 100vw;
    background-color: rgb(48, 48, 48);
    box-sizing: border-box;
    overflow: auto;
  }

  .maincontainer > h1{
    margin: 0 0;
    padding: 0 0;
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


  /* .datasectdata > table, td {
    border: solid red;
  } */

  table{
    width: 100%;
  }

</style>
