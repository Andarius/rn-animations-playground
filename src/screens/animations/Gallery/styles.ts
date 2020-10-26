import { StyleSheet } from 'react-native'
import { Colors } from '@src/theme'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center'
        
    },
    imagesContainer: {
        marginTop: 100,
    },
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

export { styles }