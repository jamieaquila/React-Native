let globalVals = {
    ws:null,
    chatSocket:null,
    notificationSocket:null,
    badgeSocket:null,
    client:null,
    platform:null,
    language:"en",
    appVersion:"1.0",
    propertis:{
        apiBaseUrl: 'http://api.deskero.com/',
        authURL: 'https://socket.deskero.com:3000/',
        socketURL: 'wss://socket.deskero.com:3000/',
        clientId: null,
        domain: null	
    },
    currentTicket:{},
    badges:{},
    chatRetry:0,
    chatBadges:{},
    customersDetail:[],
    ticketDetails:[],
    user:{
        authenticated:false,
        name:null,
        id:null,
        profilePhoto:null,
        role:null,
    },
    userDetails:{},
    forceDataRefresh:false,
    dataKeyId:null,
    permissions:null,
    agentFound: false,
    customerFound: false,
    currentPage: null
}
  
 export default globalVals