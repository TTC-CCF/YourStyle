import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo, MaterialIcons } from '@expo/vector-icons';


export default function ThreeDot({ onPress, onClose, modalVisible, actions }) {
    return (
        
        <>
            <TouchableOpacity onPress={onPress}>
                <Entypo name="dots-three-horizontal" size={24} color="black" />
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.close} onPress={onClose}>
                        <MaterialIcons name="close" color="black" size={22} />
                    </TouchableOpacity>
                    {actions.map((action, index) => (
                        <TouchableOpacity style={styles.actionContainer} key={index}>
                            <Text style={styles.actionText}>{action}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
            </Modal>
        </>
        
    );
}

const styles = StyleSheet.create({
    modalContent: {
        height: '20%',
        width: '100%',
        backgroundColor: '#eee',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
    },
    close: {
        alignItems: 'flex-end',
        padding: 10,
    },
    actionContainer: {
        alignItems: 'center',
        padding: 10,
    },
    actionText: {
        fontSize: 20,
    }
});
