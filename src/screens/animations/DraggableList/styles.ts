import { StyleSheet } from 'react-native'


const styles = StyleSheet.create({
    btnsContainer: {
        position: 'absolute',
        bottom: 0,
        height: 100,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    btn: {
        height: 40,
        width: 110
    },
    labelText: { fontSize: 14, textAlign: 'center' }
})

export default styles
