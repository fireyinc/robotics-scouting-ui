<template>
  <div id="app">
    <div class="topbar">
      <router-link to="/" tag="button" class="return">
        <i class="far fa-chevron-left" style="font-size: 14pt; margin-right: 5px;"></i>Team List
      </router-link>
      <span>Information about Team {{ $route.params.teamid }}</span>
      
    </div>
    <div class="content">
      <div class="maincontainer">
        <h1>Team {{ $route.params.teamid }}: {{this.teamstats.teamname}}</h1>
        <br/>
        <br/>
        <div class="maindatacont">
          <div class="teamtable">
            <span style="font-size: 20pt; font-weight: bold;">Robot Stats</span>

            <div class="scoringdatas">
                <p>Avg Score: {{teamstats.teamavgscore}}</p>
                <p>Reliability: {{teamstats.reliability}}%</p>
                <p>Most Reached Bar: {{teamstats.bar}}</p>
                <p>Avg Climb Time: {{teamstats.teamavgclimbtime}} secs</p>
                

                <p>Avg Cycle Time: {{teamstats.teamavgcycle}} secs</p>
                <p>Cooperation: {{teamstats.cooperation}}/10</p>
                <p>Avg Penalties: {{teamstats.penalties}}</p>
                <p>Match Strategy: {{teamstats.strat}}</p>


                <p>Auton Accuracy: {{teamstats.autonacc}}%</p>
                <p>Low Goal Acc.: {{teamstats.lowacc}}%</p>
                <p>High Goal Acc.: {{teamstats.highacc}}%</p>
                <p>Gets Cargo RP: {{teamstats.cargorp}}</p>
                <p>Gets Climb RP: {{teamstats.climbrp}}</p>
                <p>Shoots From: {{teamstats.shootpt}}</p>
            </div>


          </div>
          <div class="graphcarousel"> 
            <div class="carouseldiv">
              <canvas ref="chartone"></canvas>
            </div>

            <div class="carouseldiv">
            </div>

            <div class="carouseldiv">

            </div>

            <div class="carouseldiv">

            </div>
            

          </div>
        </div>
        <br/>
        <hr/>
        <br/>

        <h1>All Entries (for team)</h1>
        <div class="datasect" v-for="i in teamentries" :key="i.match">
          <div class="datasectdata" >

            <span style="font-weight: bold;">{{dateCompiler(i.date)}}</span>

            <div class="gridcontainer">
              <p class="dptgriditem">Scouter Name: {{i.name}}</p>
              <p class="dptgriditem">Broken?: {{i.broken}}</p>
              <p class="dptgriditem">Reached Bar: {{i.climbget}}</p>
              <p class="dptgriditem">Climb Time: {{i.timetoclimb}} secs</p>
              <p class="dptgriditem">Cycle Time: {{i.cycletime}} secs</p>
              <p class="dptgriditem">Cooperation: {{i.cooprating}}/10</p>
              <p class="dptgriditem">Penalties: {{i.drawnpenalties}}</p>
              <p class="dptgriditem">Match Strategy: {{i.matchstrat}}</p>
              <p class="dptgriditem">Shot Location(s): {{i.shotlocation}}</p>
              <p class="dptgriditem">Cargo RP Made: {{i.cargorp}}</p>
              <p class="dptgriditem">Climber RP Made: {{i.climbrp}}</p>
              <p class="dptgriditem">Alliance Score: {{i.totalscore}} pts</p>
              <p class="dptgriditem">Balls Shot (Low): {{i.lowshot}} balls</p>
              <p class="dptgriditem">Balls Made (Low): {{i.lowget}} balls</p>
              <p class="dptgriditem">Balls Made (High): {{i.highshot}} balls</p>
              <p class="dptgriditem">Balls Made (High): {{i.highget}} balls</p>
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
      teamstats: {},
      teamentries: [],

      maxcycletime: 0,
      mincycletime: 0,
      maxclimbtime: 0,
      minclimbtime: 0,
      maxpts: 0,
      minpts: 0,
    }
   
  },

  methods: {
    setupChartOne() {
      console.log(this.teamstats)
      var ctx = this.$refs.chartone.getContext('2d')

      Chart.defaults.borderColor = '#6b6b6b';
      // Chart.maintainAspectRatio = false
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Average Score', 'Auton Accuracy', 'High Goal Accuracy', 'Low Goal Accuracy', 'Reliability', 'Cooperation', 'Cycle Speed', 'Climb Speed'],
          datasets: [{
            label: `Team ${this.$route.params.teamid}`,
            data: 
            [
              Math.round(Math.abs(this.teamstats.teamavgscore-this.minpts)/Math.abs(this.maxpts-this.minpts)*100), 
              this.teamstats.autonacc, 
              this.teamstats.highacc, 
              this.teamstats.lowacc, 
              this.teamstats.reliability, 
              this.teamstats.cooperation*10, 
              100-Math.round(Math.abs(this.teamstats.teamavgcycle-this.mincycletime)/Math.abs(this.maxcycletime-this.mincycletime)*100), 
              100-Math.round(Math.abs(this.teamstats.teamavgclimbtime-this.minclimbtime)/Math.abs(this.maxclimbtime-this.minclimbtime)*100)
            ],
            borderWidth: 2,
            borderColor: "rgb(255, 0, 55)",
            backgroundColor: "rgb(255, 0, 55, 0.25)"
          }]
        },
        options: {
          scales: {
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

    dateCompiler(dstring){
      var date = new Date(dstring)
      return date.toLocaleDateString(navigator.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
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

      // var teamdata = {}

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
      

      var bar = []
      var offdef = []
      var carp = []
      var clrp = []
      var shtpt = []

      console.log(this.$route.params.teamid)
      this.teamentries = this.csvData.filter(entry => entry.team == this.$route.params.teamid)
      console.log(this.teamentries)
      this.csvData.filter(entry => entry.team == this.$route.params.teamid).forEach((part) => {
        
        // console.log(this.teamentries)
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

        // console.log(autonaccuracy)
        
          
        })

        axios.get(`https://www.thebluealliance.com/api/v3/team/frc${this.$route.params.teamid}/simple`).then(response => {
          // console.log(response.data)
          this.teamstats = 
          {
            teamname: response.data.nickname, 
            teamnumber: this.$route.params.teamid, 
            teamavgscore: Math.round(avgpoints/teamentries), 
            teamavgcycle: Math.round(avgcycle/teamentries), 
            reliability: Math.round((reliabillity/teamentries)*100), 
            cooperation: Math.round(avgcoop/teamentries), 
            bar: (this.mostFrequent(bar) != "No Climb") ? this.mostFrequent(bar).slice(0, -4) : "No Climb", 
            strat: this.mostFrequent(offdef), penalties: Math.round(penalties/teamentries), 
            teamavgclimbtime: Math.round(avgclimbtime/teamentries), 
            autonacc: Math.round(autonaccuracy/teamentries), 
            lowacc: Math.round(lowaccuracy/teamentries), 
            highacc: Math.round(highaccuracy/teamentries),
            cargorp: this.mostFrequent(carp),
            climbrp: this.mostFrequent(clrp),
            shootpt: this.mostFrequent(shtpt)

          }

          this.setupChartOne()
          console.log(Math.round(Math.abs(this.teamstats.teamavgcycle-this.mincycletime)/Math.abs(this.maxcycletime-this.mincycletime)*100))
          // this.teamstats = teamdata
        })

      // teamdata.sort((a, b) => parseInt(a.teamnumber) - parseInt(b.teamnumber))
      
      // teamdata.forEach(team => console.log(team))

      // return teamdata
    },

    getallteamdata() {
      var teams = []
      this.csvData.forEach(item => {
        teams.push(item.team)
      })
      

      teams = [...new Set(teams)]

      console.log(teams)

      var cycletimes = []
      var climbtimes = []
      var pointdata = []



      teams.forEach(team => {
        var avgcycle = 0
        var avgpoints = 0
        var avgclimbtime = 0
        var totalentries = 0
        
        this.csvData.filter(entry => entry.team == team).forEach((part) => {
          avgcycle += (parseInt(part.cycletime) || 0)

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


          avgclimbtime += (parseInt(part.timetoclimb) || 0)
          totalentries ++
        })
        avgpoints /= totalentries
        avgclimbtime /= totalentries
        avgcycle /= totalentries

        cycletimes.push(Math.round(avgcycle))
        climbtimes.push(Math.round(avgclimbtime))
        pointdata.push(Math.round(avgpoints))



      })

      //min to max
      cycletimes = cycletimes.sort((a, b) => {return a - b})

      climbtimes = climbtimes.sort((a, b) => {return a - b})

      pointdata = pointdata.sort((a, b) => {return a - b})

      console.log(pointdata.at(-1))

      

      this.maxcycletime = cycletimes.at(-1)
      this.mincycletime = climbtimes[0]
      this.maxclimbtime = climbtimes.at(-1)
      this.minclimbtime = climbtimes[0]
      this.maxpts = pointdata.at(-1)
      this.minpts = pointdata[0]

      console.log(this.maxcycletime - this.mincycletime)



    }
  },

  computed: {
    // teamstats() {
      
      
    // }
  },

  async mounted() {

    axios.defaults.headers.common['X-TBA-Auth-Key'] = "fbkgBWLltUBDHgZLy1P2OAnKWX4VfSHjEJDYNH9Jz9vXqpjxkUJpxXKJg4HYImIn";

    // fetch("/../scouting.tsv").then(response => response.text()).then(data => {
    //   var fieldnames = ["date", "name", "tnumber", "tmatch", "dstation", "autonposit", "taxipts", "autoshot", "autoget", "matchstrat", "lowshot", "lowget", "highshot", "highget", "cyclesecs", "shootpoint", "offenserating", "oppcargoshot", "oppcargoget", "defenserating", "climbtried", "climbget", "climbsecs", "broken", "penaltycommit", "penaltydrawn", "allscore", "problems", "cooprating", "notes", "opponentscore", "cargorp", "climberrp"]
    //   var scouts = data.slice(data.indexOf("\r\n") + 1).split("\n")
    //   // console.log(scouts)
      
    //   const arr = scouts.map(function (row) {
    //     const values = row.split("\t");
    //     const el = fieldnames.reduce(function (object, header, index) {
    //       object[header] = values[index];
    //       return object;
    //     }, {});
    //     return el;
    //   });

    //   this.csvData = arr
    //   this.csvData.shift()
    //   this.getteamdata()
    // })    

    const firebasesetup = {
      databaseURL: "https://frcscoutsheet-default-rtdb.firebaseio.com",
    }

    const app = initializeApp(firebasesetup)

    // console.log(app)

    const db = getDatabase(app)

    // console.log(db)

    const refer = ref(db)

    onValue(refer, (event) => {
      this.csvData = event.val()
      this.getteamdata()
      this.getallteamdata()
    })
    


    // axios.get("https://www.thebluealliance.com/api/v3/team/frc1885/simple").then(response => {console.log(response.data)})

    
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


  }

  @media (hover: hover) and (pointer: fine) and (min-width: 700px){
    .maindatacont{
      height: 500px;
      width: 100%;
      /* background: green; */
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

    }
  }


  

  

  .teamtable{
    height: 500px;
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

    flex: 0 0 50%;
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
