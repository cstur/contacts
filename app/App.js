'use strict';

import React,{Component} from 'react'
import {
  StyleSheet,
  Image,
  ListView,
  Text,
  Button,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import codePush from "react-native-code-push";

var API_URL = "http://7xr387.com1.z0.glb.clouddn.com/users_data.json";

class App extends Component{
  constructor(){
    super();
    let getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    }

    let getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[sectionID + ':' + rowID];
    }

    this.state= {
      loaded: false,
      dataSource: new ListView.DataSource({
        getSectionData           : getSectionData,
        getRowData               : getRowData,
        rowHasChanged            : (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged  : (s1, s2) => s1 !== s2
      })
    }
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData() {
    fetch(API_URL)
      .then((response) => response.json())
      .then((responseData) => {
        var organizations = responseData.results,
            length = organizations.length,
            dataBlob = {},
            sectionIDs = [],
            rowIDs = [],
            organization,
            users,
            userLength,
            user,
            i,
            j;

        console.log(organizations)

        for(i=0; i<length; i++) {
          organization = organizations[i];

          // Add Section to Section ID Array
          sectionIDs.push(organization.id);

          // Set Value for Section ID that will be retrieved by getSectionData
          dataBlob[organization.id] = organization.organization;

          users = organization.users;
          userLength = users.length;

          // Initialize Empty RowID Array for Section Index
          rowIDs[i] = [];

          for(j = 0; j < userLength; j++) {
            user = users[j].user;

            // Add Unique Row ID to RowID Array for Section
            rowIDs[i].push(user.md5);

            // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
            dataBlob[organization.id + ':' + user.md5] = user;
          }
        }

        // set state
        this.setState({
          dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
          loaded     : true
        });
      }).done();
  }

  render () {
    if(!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderListView();
  }

  renderLoadingView() {
     return (
       <View style={styles.header}>

         <View>
            <Text style={styles.headerText}>通讯录</Text>
         </View>
         <View style={styles.container}>
           <ActivityIndicator
             animating={!this.state.loaded}
             style={[styles.activityIndicator, {height: 80}]}
             size="large" />
         </View>
       </View>
     )
   }

   renderListView() {
     const checkUpdate=()=>{
       codePush.checkForUpdate('dWDusPo2NpV3Du_cl6q_QtgGeHU-4kVfymAPG').then((update)=>{
           if(!update){
               Alert.alert("提示","已是最新版本--",[
                   {text:"Ok", onPress:()=>{
                       console.log("点了OK");
                   }}
               ]);
           }
           else{
               codePush.sync({
                   deploymentKey: 'dWDusPo2NpV3Du_cl6q_QtgGeHU-4kVfymAPG',
                   updateDialog: {
                       optionalIgnoreButtonLabel: '稍后',
                       optionalInstallButtonLabel: '后台更新',
                       optionalUpdateMessage: '有新版本了，是否更新？',
                       title: '更新提示'
                   },
                   installMode: codePush.InstallMode.IMMEDIATE
               });
           }
       });
     }

     return (
       <View style={styles.container}>
         <View style={styles.header}>
           <Text style={styles.headerText}>大象2</Text>
           <Image source={require('./img/i.jpg')} style={{width: 40, height: 40}}/>
           <Button title="检查更新" style={styles.rightbutton} onPress={checkUpdate} />
         </View>
         <ListView
           dataSource = {this.state.dataSource}
           style      = {styles.listview}
           renderRow  = {this.renderRow.bind(this)}
           renderSectionHeader = {this.renderSectionHeader} />
       </View>
     )
   }

   renderSectionHeader(sectionData, sectionID) {
     return (
       <View style={styles.section}>
         <Text style={styles.text,{color: '#000',paddingLeft: 10}}>{sectionData}</Text>
       </View>
     );
   }

   renderRow(rowData, sectionID, rowID) {
     return (
       <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
         <View style={styles.rowStyle}>
           <Image
             style={styles.userAvatar}
             source={{uri: rowData.avatar}} />
           <View style={styles.userName}>
             <Text style={styles.rowText}>{rowData.username} </Text>
           </View>
         </View>
       </TouchableOpacity>
     );
   }

   onPressRow(rowData, sectionID) {
     Alert.alert(
       'Email',
       rowData.email,
       [
         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
         {text: 'OK', onPress: () => console.log('OK Pressed')},
       ],
       { cancelable: false }
     )
   }
}

var styles = StyleSheet.create({
 container: {
    flex: 1
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 25
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'cornflowerblue'
  },
  rightbutton:{
    fontSize: 20
  },
  text: {
    color: '#fff',
    paddingHorizontal: 8,
    fontSize: 16
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingLeft: 10,
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
    borderBottomColor: '#E0E0E0',
    borderWidth: 1
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    flex: 1,
    justifyContent: "center",
  },
  rowText: {
    color: '#212121',
    fontSize: 16,
    padding: 16,
  },
  subText: {
    fontSize: 14,
    color: '#757575'
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: '#eee',
  }
});

let MyApp=App;
if (!__DEV__) {
  MyApp = codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.ON_NEXT_RESUME })(App);
}
export default MyApp;
