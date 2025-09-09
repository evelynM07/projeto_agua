import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Menu from './Menu';

const IMCCalculator = () => {
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [imc, setImc] = useState(null);
    const [categoria, setCategoria] = useState('');
    const [metaAgua, setMetaAgua] = useState(null);
    const insets = useSafeAreaInsets();

    const calcularIMC = () => {
        if (!peso || !altura) {
            alert('Informe peso e altura.');
            return;
        }
        const alturaMetros = parseFloat(altura) / 100;
        const valorIMC = (parseFloat(peso) / (alturaMetros * alturaMetros)).toFixed(2);
        setImc(valorIMC);
        setCategoria(classificarIMC(parseFloat(valorIMC)));
        setMetaAgua((parseFloat(peso) * 35).toFixed(0));
    };

    const classificarIMC = (valor) => {
        if (valor < 18.5) return 'Abaixo do peso';
        if (valor < 24.9) return 'Peso normal';
        if (valor < 29.9) return 'Sobrepeso';
        return 'Obesidade';
    };

    return (
        <View style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.select({ ios: 'padding', android: 'height' })}
            >
                <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 16 }]}>
                    <Text style={styles.title}>Seus Dados</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Peso (kg)"
                        placeholderTextColor="#888888"
                        keyboardType="numeric"
                        value={peso}
                        onChangeText={setPeso}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Altura (cm)"
                        placeholderTextColor="#888888"
                        keyboardType="numeric"
                        value={altura}
                        onChangeText={setAltura}
                    />

                    <TouchableOpacity style={styles.btn} onPress={calcularIMC}>
                        <Text style={styles.btnText}>CALCULAR</Text>
                    </TouchableOpacity>

                    {(imc && metaAgua) && (
                        <View style={styles.cardShadow}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Resultados</Text>
                                <View style={styles.row}>
                                    <Text style={styles.label}>IMC</Text>
                                    <Text style={styles.value}>{imc}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Categoria</Text>
                                    <Text style={styles.value}>{categoria}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Meta de água</Text>
                                    <Text style={styles.value}>{metaAgua} ml/dia</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View style={{ paddingBottom: insets.bottom, backgroundColor: '#74bde0' }}>

                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const CARD_BG = '#FFFFFF';
const CARD_BORDER = '#E6EEF4';
const TEXT_PRIMARY = '#1F2D3D';
const TEXT_SECONDARY = '#5C6B7A';
const ACCENT = '#91D5E0';

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    flex: { flex: 1 },
    content: { padding: 20, paddingTop: 20 },
    title: {
        fontSize: 22,
        marginBottom: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        color: TEXT_PRIMARY,
    },
    input: {
        borderWidth: 1,
        backgroundColor: '#F4F8FB',
        borderColor: '#D9E6F2',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
        color: '#3A4B5C',
    },
    btn: {
        backgroundColor: ACCENT,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 12,
        borderColor: '#74BDE0',
        borderWidth: 2,
        marginTop: 6,
        marginBottom: 8,
    },
    btnText: { color: '#0C1B2A', fontWeight: 'bold', fontSize: 16 },
    cardShadow: {
        borderRadius: 14,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12 },
            android: { elevation: 6 },
        }),
    },
    card: {
        backgroundColor: CARD_BG,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: CARD_BORDER,
        padding: 16,
    },
    cardTitle: { fontSize: 18, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 8, textAlign: 'center' },
    row: {
        marginTop: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#FAFDFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EEF5FA',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: { color: TEXT_SECONDARY, fontSize: 14 },
    value: { color: TEXT_PRIMARY, fontSize: 16, fontWeight: '700' },
});

export default function ScreenWrapper() {
    return (
        <SafeAreaProvider>
            <IMCCalculator />
        </SafeAreaProvider>
    );
}
