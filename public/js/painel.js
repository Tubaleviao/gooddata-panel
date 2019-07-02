$(()=>{
  let error_first = 0;
  let running = 0;
  var socket = io('/painel');
  socket.emit('getData', {servidores: servidores})
  
  setInterval(function(){
    socket.emit('getData', {servidores: servidores})
  }, 1000);
  
  socket.on('schedules', function(data){
    let queueList = [], running = [], error_after = 0
    if(data.schedules){
      data.schedules.items.forEach(function(data){
        if(data.schedule.lastExecution){
          if(data.schedule.lastExecution.execution.status === "RUNNING"){ //OK and RUNNING
            var time = new Date(data.schedule.lastExecution.execution.startTime).getTime();
            time = Math.floor(((new Date()).getTime()-time)/1000);
            running.push({name: data.schedule.name, time: time});
          }else{
            var next, status;
            if(data.schedule.nextExecutionTime){
               next = (new Date(data.schedule.nextExecutionTime)).getTime();
            }else{
              next = 2000000000000; //'after-'+json.schedule.triggerScheduleId;
            }
            if(data.schedule.lastExecution.execution.status === "OK"){
              status = true;
            }else{
              status = data.schedule.lastExecution.execution.status;
            }
            var self_id = data.schedule.links.self.substring(data.schedule.links.self.lastIndexOf("/")+1);
            queueList.push({next: next, name: data.schedule.name, status: status, self: self_id });
          }
        }
      });
    }
    
    $(".gooddata .data").fadeOut(20);
    $(".gooddata .data").empty();
    running.sort(function(a, b){return b.time - a.time});
    running.forEach(function(item){
      $(".gooddata .data").append($('<span>').text(builtify(item.time)+' - '+item.name));
      $(".gooddata .data").append($('<br>'));
    });
    $(".gooddata .data").fadeIn(80);
    queueList.sort((a, b) => {return a.next - b.next;});
    
    queueList.forEach(function(item){
      if(item.status === "ERROR"){
        error_after++
        $(".gooddata .data").append($('<span class="status">').text(item.name+' - '+item.status));
        $(".gooddata .data").append($('<br>'));
      }
    });
  });

})

let builtify = (time) =>{
  let horas = (Math.floor(time/60/60) > 0) ? Math.floor(time/60/60) : false
  let minutos = ((Math.floor(time/60)-Math.floor(time/60/60)*60) > 0) ? (Math.floor(time/60)-Math.floor(time/60/60)*60) : false
  let segundos = ((Math.floor(time)-Math.floor(time/60)*60) > 0) ? (Math.floor(time)-Math.floor(time/60)*60) : 0
  let total = (horas ? horas+':' : '') +(minutos ? ((minutos<10) ? '0'+minutos : minutos)+':' : '00:') + ((segundos < 10) ? '0'+segundos : segundos)
  return total
}


