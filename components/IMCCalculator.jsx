import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';

const IMCCalculator = () => {
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [imc, setImc] = useState(null);
    const [categoria, setCategoria] = useState('');

    const calcularIMC = () => {
        if (!peso || !altura) {
            alert('Informe peso e altura.');
            return;
        }
        const alturaMetros = parseFloat(altura) / 100;
        const valorIMC = (parseFloat(peso) / (alturaMetros * alturaMetros)).toFixed(2);
        setImc(valorIMC);
        setCategoria(classificarIMC(valorIMC));
    };

    const classificarIMC = (valorIMC) => {
        if (valorIMC < 18.5) {
            return 'Abaixo do peso';
        } else if (valorIMC < 24.9) {
            return 'Peso normal';
        } else if (valorIMC < 29.9) {
            return 'Sobrepeso';
        } else {
            return 'Obesidade';
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calculadora de IMC</Text>
            <TextInput
                style={styles.input}
                placeholder="Peso (kg)"
                placeholderTextColor="#888888" // cor do placeholder
                keyboardType="numeric"
                value={peso}
                onChangeText={setPeso}
            />
            <TextInput
                style={styles.input}
                placeholder="Altura (cm)"
                placeholderTextColor="#888888" // cor do placeholder
                keyboardType="numeric"
                value={altura}
                onChangeText={setAltura}
            />
            <TouchableOpacity style={styles.btn} onPress={calcularIMC}>
                <Text style={styles.btnText}>CALCULAR META</Text>
            </TouchableOpacity>

            {imc && (
                <Text style={styles.result}>Seu IMC é: {imc}</Text>
            )}

                <View style={styles.result}>
                    <Text>Seu IMC: {imc}</Text>
                    <Text>Categoria: {categoria}</Text>
                </View>
            )
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 22,
        marginBottom: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        backgroundColor: '#dee9f3',
        borderColor: '#dee9f3',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: '#555555',
    },
    result: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: 'bold',
    },
    btn: {
        backgroundColor: '#289efd',
        alignItems: 'center',
        justifyContent: 'center',
        width: '170',
        height: 50,
        fontWeight: 'bold',
        borderRadius: 10,
        borderColor: '#035aa6',
        borderWidth: 2,
        marginLeft: '25%',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default IMCCalculator;