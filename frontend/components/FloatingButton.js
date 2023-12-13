import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FloatingButton ({ onPress }) {
    return (
        <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
            <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
    },
    buttonText: {
        fontSize: 24,
        color: 'white',
    },
});