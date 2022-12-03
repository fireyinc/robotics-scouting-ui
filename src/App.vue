<template>
  <div id="app">
    <div id="mainbar">
      <p>1885 & Derivative Scouting User Interface</p>
    </div>
    <router-view/>
  </div>
</template>


<style>

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


</style>
