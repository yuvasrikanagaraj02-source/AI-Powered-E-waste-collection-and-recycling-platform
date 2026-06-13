import React from 'react';
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const isDesktop = width > 900;

export default function WorkerOverflowDashboardScreen({ navigation }: any) {
return (
<ScrollView
style={styles.container}
showsVerticalScrollIndicator={false}
>

{/* HEADER */}

<View style={styles.header}>
<View>
<TouchableOpacity onPress={() => navigation?.goBack?.()}>
<Text style={styles.logo}>← Back</Text>
</TouchableOpacity>
</View>

<View style={styles.headerRight}>
<TouchableOpacity style={styles.portalBtn}>
<Text style={styles.portalText}>⚙ WORKER PORTAL</Text>
</TouchableOpacity>

<View style={styles.avatar}>
<Text style={styles.avatarText}>RK</Text>
</View>

<TouchableOpacity style={styles.logoutBtn}>
<Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>
</View>
</View>

{/* ALERT */}

<View style={styles.alertBar}>
<Text style={styles.alertText}>
🚨 CRITICAL
</Text>

<Text style={styles.alertMessage}>
Machine A — Battery Bin is at 98% capacity.
Immediate collection required.
</Text>

<TouchableOpacity style={styles.dispatchNow}>
<Text style={styles.dispatchNowText}>
Dispatch Now
</Text>
</TouchableOpacity>
</View>

{/* TITLE */}

<View style={styles.titleWrap}>
<Text style={styles.title}>
Worker Overflow Dashboard
</Text>

<Text style={styles.subtitle}>
Monitor bin fill levels, manage pickup requests,
and respond to overflow alerts in real-time.
</Text>
</View>

{/* STATS */}

<View style={styles.statsGrid}>
<CardStat icon="🚨" value="2" label="OVERFLOW BINS" />
<CardStat icon="⏳" value="7" label="PENDING PICKUPS" />
<CardStat icon="✅" value="23" label="COLLECTED TODAY" />
<CardStat icon="⚡" value="4" label="ACTIVE MACHINES" />
</View>

<Text style={styles.sectionTitle}>
BIN FILL LEVELS — REAL-TIME
</Text>

<View style={styles.binGrid}>

<OverflowCard
title="Battery Bin"
percent={98}
slots="49/50 slots"
status="OVERFLOW"
/>

<OverflowCard
title="PCB / Electronics"
percent={93}
slots="37/40 slots"
status="OVERFLOW"
/>

<WarningCard
title="Charger / Cable"
percent={74}
slots="37/50 slots"
/>

<NormalCard
title="Mixed E-Waste"
percent={32}
slots="16/50 slots"
/>

</View>

</ScrollView>
);
}

const CardStat = ({ icon, value, label }: any) => (
<View style={styles.statCard}>
<Text style={styles.statIcon}>{icon}</Text>

<View>
<Text style={styles.statValue}>{value}</Text>
<Text style={styles.statLabel}>{label}</Text>
</View>
</View>
);

const OverflowCard = ({ title, percent, slots, status }: any) => (
<View style={styles.overflowCard}>
<View style={styles.cardTop}>
<Text style={styles.cardTitle}>🔋 {title}</Text>

<View style={styles.redBadge}>
<Text style={styles.redBadgeText}>{status}</Text>
</View>
</View>

<Text style={styles.percent}>
{percent}% <Text style={styles.small}>full • {slots}</Text>
</Text>

<View style={styles.progressBackground}>
<View
style={[
styles.progressDanger,
{ width: `${percent}%` },
]}
/>
</View>

<View style={styles.scale}>
<Text>0%</Text>
<Text>{percent}%</Text>
<Text>100%</Text>
</View>

<TouchableOpacity style={styles.dispatchBtn}>
<Text style={styles.dispatchBtnText}>
🚨 Dispatch Worker
</Text>
</TouchableOpacity>
</View>
);

const WarningCard = ({ title, percent, slots }: any) => (
<View style={styles.warningCard}>
<View style={styles.cardTop}>
<Text style={styles.cardTitle}>🔌 {title}</Text>

<View style={styles.yellowBadge}>
<Text style={styles.yellowBadgeText}>
WARNING
</Text>
</View>
</View>

<Text style={styles.percent}>
{percent}% <Text style={styles.small}>full • {slots}</Text>
</Text>

<View style={styles.progressBackground}>
<View
style={[
styles.progressWarning,
{ width: `${percent}%` },
]}
/>
</View>

<View style={styles.scale}>
<Text>0%</Text>
<Text>{percent}%</Text>
<Text>100%</Text>
</View>

<TouchableOpacity style={styles.scheduleBtn}>
<Text style={styles.scheduleText}>
📋 Schedule Pickup
</Text>
</TouchableOpacity>
</View>
);

const NormalCard = ({ title, percent, slots }: any) => (
<View style={styles.normalCard}>
<View style={styles.cardTop}>
<Text style={styles.cardTitle}>📦 {title}</Text>

<View style={styles.greenBadge}>
<Text style={styles.greenBadgeText}>
NORMAL
</Text>
</View>
</View>

<Text style={styles.percent}>
{percent}% <Text style={styles.small}>full • {slots}</Text>
</Text>

<View style={styles.progressBackground}>
<View
style={[
styles.progressSuccess,
{ width: `${percent}%` },
]}
/>
</View>

<View style={styles.scale}>
<Text>0%</Text>
<Text>{percent}%</Text>
<Text>100%</Text>
</View>

<TouchableOpacity style={styles.normalBtn}>
<Text style={styles.normalBtnText}>
✅ No Action Needed
</Text>
</TouchableOpacity>
</View>
);

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:'#EDF6E7',
},

header:{
backgroundColor:'#2E7D32',
paddingHorizontal:24,
paddingVertical:18,
flexDirection:'row',
justifyContent:'space-between',
alignItems:'center',
},

logo:{
fontSize:34,
fontWeight:'800',
color:'#fff',
},

headerRight:{
flexDirection:'row',
alignItems:'center',
},

portalBtn:{
backgroundColor:'#3F8E43',
paddingHorizontal:18,
paddingVertical:12,
borderRadius:12,
marginRight:10,
},

portalText:{
color:'#fff',
fontWeight:'700',
},

avatar:{
width:45,
height:45,
borderRadius:25,
backgroundColor:'#4CAF50',
justifyContent:'center',
alignItems:'center',
marginRight:10,
},

avatarText:{
fontWeight:'800',
color:'#fff',
},

logoutBtn:{
borderWidth:1,
borderColor:'#7BC67E',
paddingHorizontal:15,
paddingVertical:10,
borderRadius:10,
},

logoutText:{
color:'#fff',
fontWeight:'700',
},

alertBar:{
backgroundColor:'#9E1C16',
padding:18,
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',
},

alertText:{
color:'#fff',
fontWeight:'900',
fontSize:16,
},

alertMessage:{
flex:1,
marginHorizontal:15,
color:'#fff',
fontSize:15,
fontWeight:'600',
},

dispatchNow:{
backgroundColor:'#fff',
paddingHorizontal:18,
paddingVertical:10,
borderRadius:10,
},

dispatchNowText:{
color:'#C62828',
fontWeight:'800',
},

titleWrap:{
padding:24,
},

title:{
fontSize:42,
fontWeight:'900',
color:'#1B5E20',
},

subtitle:{
fontSize:18,
color:'#456',
marginTop:8,
},

statsGrid:{
flexDirection:isDesktop ? 'row':'row',
flexWrap:'wrap',
justifyContent:'space-between',
paddingHorizontal:24,
},

statCard:{
width:isDesktop ? '24%' : '48%',
backgroundColor:'#fff',
padding:20,
borderRadius:16,
marginBottom:18,
flexDirection:'row',
alignItems:'center',
shadowColor:'#000',
shadowOpacity:0.08,
shadowRadius:10,
elevation:4,
},

statIcon:{
fontSize:30,
marginRight:15,
},

statValue:{
fontSize:34,
fontWeight:'900',
},

statLabel:{
fontSize:13,
letterSpacing:1,
color:'#607D8B',
},

sectionTitle:{
paddingHorizontal:24,
marginTop:10,
marginBottom:15,
fontSize:20,
fontWeight:'800',
color:'#6D8A73',
letterSpacing:1,
},

binGrid:{
flexDirection:'row',
flexWrap:'wrap',
justifyContent:'space-between',
paddingHorizontal:24,
paddingBottom:40,
},

overflowCard:{
width:isDesktop ? '48%' : '100%',
backgroundColor:'#fff',
borderWidth:1,
borderColor:'#FF9E9E',
borderRadius:18,
padding:18,
marginBottom:20,
},

warningCard:{
width:isDesktop ? '48%' : '100%',
backgroundColor:'#fffdf3',
borderWidth:1,
borderColor:'#F0C64A',
borderRadius:18,
padding:18,
marginBottom:20,
},

normalCard:{
width:isDesktop ? '48%' : '100%',
backgroundColor:'#fff',
borderWidth:1,
borderColor:'#B7D7B9',
borderRadius:18,
padding:18,
marginBottom:20,
},

cardTop:{
flexDirection:'row',
justifyContent:'space-between',
marginBottom:12,
},

cardTitle:{
fontWeight:'800',
fontSize:22,
},

redBadge:{
backgroundColor:'#FFE5E5',
paddingHorizontal:12,
paddingVertical:6,
borderRadius:30,
},

redBadgeText:{
color:'#E53935',
fontWeight:'800',
},

yellowBadge:{
backgroundColor:'#FFF1CC',
paddingHorizontal:12,
paddingVertical:6,
borderRadius:30,
},

yellowBadgeText:{
color:'#B26A00',
fontWeight:'800',
},

greenBadge:{
backgroundColor:'#EAF7EA',
paddingHorizontal:12,
paddingVertical:6,
borderRadius:30,
},

greenBadgeText:{
color:'#2E7D32',
fontWeight:'800',
},

percent:{
fontSize:32,
fontWeight:'900',
marginBottom:15,
},

small:{
fontSize:18,
fontWeight:'400',
},

progressBackground:{
height:10,
backgroundColor:'#E5E7EB',
borderRadius:10,
overflow:'hidden',
},

progressDanger:{
height:'100%',
backgroundColor:'#E53935',
},

progressWarning:{
height:'100%',
backgroundColor:'#E69A00',
},

progressSuccess:{
height:'100%',
backgroundColor:'#43A047',
},

scale:{
flexDirection:'row',
justifyContent:'space-between',
marginTop:10,
},

dispatchBtn:{
backgroundColor:'#E52525',
padding:14,
borderRadius:12,
marginTop:18,
alignItems:'center',
},

dispatchBtnText:{
color:'#fff',
fontWeight:'800',
},

scheduleBtn:{
backgroundColor:'#FFF0C7',
padding:14,
borderRadius:12,
marginTop:18,
alignItems:'center',
},

scheduleText:{
fontWeight:'800',
color:'#9A5B00',
},

normalBtn:{
backgroundColor:'#E7F5E7',
padding:14,
borderRadius:12,
marginTop:18,
alignItems:'center',
},

normalBtnText:{
fontWeight:'800',
color:'#2E7D32',
},

});
