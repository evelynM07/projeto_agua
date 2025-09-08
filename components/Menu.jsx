import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Menu() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Home")}>
                <Image style={styles.img} source={require('../assets/dados.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Progress")}>
                <Image style={styles.img} source={require('../assets/progress.png')} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center', // centraliza os botões
        alignItems: 'center',
        backgroundColor: '#74bde0',
        width: '100%',
        paddingVertical: 10,
    },
    img: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    btn: {
        marginHorizontal: 45, // controla a distância entre os botões
    }
});

