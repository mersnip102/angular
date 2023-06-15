// "Production" enabled environment

export const environment = {
    production: true,
    hmr: false,
    appConfig: 'appconfig.production.json',
    //baseUrlMedia: "http://localhost:8090/",
    baseUrlMedia: "http://file.pakntest.phananhkiennghi.com/",
    firebaseConfig: {
        apiKey: "AIzaSyAL2Zs_pg21735X-UHeby9pNcdLooWEdHU",
        authDomain: "pakn-2c4e7.firebaseapp.com",
        projectId: "pakn-2c4e7",
        storageBucket: "pakn-2c4e7.appspot.com",
        messagingSenderId: "60666926146",
        appId: "1:60666926146:web:39d2ff53b609ca18a5c9db",
        measurementId: "G-ZQ5FS1G3SD"
      },
      //geoserverUrl: "http://10.151.130.126:8081/geoserver/dinte/wms", // on dev,
      geoserverUrl: "http://103.9.86.37:8081/geoserver/dinte/wms", // when reseale",
     //paknMapLayer: "dinte:pakn_dev" // on dev
      paknMapLayer: "dinte:pakn_geom" //when reseale
};
