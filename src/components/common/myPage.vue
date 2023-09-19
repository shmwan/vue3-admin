<template>
    <div>
      <!-- 
        name(必传)：应用名称
        url(必传)：应用地址，会被自动补全为http://localhost:3000/index.html
        baseroute(可选)：基座应用分配给子应用的基础路由，就是上面的 `/myPage`
       -->
      <micro-app 
        name='app1' 
        url='http://172.16.1.76:8089' 
        baseroute='/myPage'
      ></micro-app>
    </div>
  </template>