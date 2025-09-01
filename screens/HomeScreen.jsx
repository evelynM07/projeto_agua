import React from 'react';
import {View, ScrollView, StyleSheet, Image} from 'react-native';
import IMCCalculator from '../components/IMCCalculator';

const HomeScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Image style={styles.img} source={require('../assets/logoGota.png')} />
            <IMCCalculator />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f0f8ff', // cor suave de fundo, pode ajustar
    },
    img: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    }

});

export default HomeScreen;