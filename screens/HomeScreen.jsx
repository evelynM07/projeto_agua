import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import IMCCalculator from '../components/IMCCalculator';
import Menu from '../components/Menu';

const HomeScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image style={styles.img} source={require('../assets/logoGota.png')} />
            <IMCCalculator />
            <Menu />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f8ff',
    },
    img: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    }
});

export default HomeScreen;
