var fetch = require ('node-fetch');
const login = 'teste@totvs.com.br'
const pass = 'senha'
const host = 'https://analytics.totvs.com.br'
const project_id = 'hb5xz9fl9h5w9m9z63kxd5j39twedh3t'
let biscoito = {}

module.exports = {

  schedules: async () => {
    try{
      const url = host+"/gdc/projects/"+project_id+"/schedules?offset=0&limit=100"
      const options = {method: 'GET',
                    headers: {'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'User-Agent': 'Node.js',
                            'Cookie': biscoito}}
      let res = await fetch(url, options)
      if(res.status == 200){
        return await res.json()
      }else{
        //console.log(res.status)
        await refreshCookie()
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }
  }
}

const refreshCookie = async ()=>{
  try{
    const options = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Node.js',
      }, body: JSON.stringify({"postUserLogin":{"login":login,"password":pass,"remember":1,"verify_level":0}})
    }
    const res = await fetch(host+'/gdc/account/login', options)
    const cookie = await res.headers.get('set-cookie')
    biscoito = cookie
  }catch(err){
    console.log(err)
  }
}