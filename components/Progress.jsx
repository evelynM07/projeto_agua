import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

let Circular;
try {
    Circular = require('react-native-circular-progress-indicator').default;
} catch (e) {
    Circular = null;
}

const HydrationProgress = () => {
    const [metaMl] = useState(2300);        // 2,3 L
    const [consumoMl, setConsumoMl] = useState(1500); // 1,5 L inicial

    const { pct, faltaMl } = useMemo(() => {
        const meta = Math.max(1, Number(metaMl) || 1);
        const consumo = Math.max(0, Number(consumoMl) || 0);
        return {
            pct: Math.min(100, Math.round((consumo / meta) * 100)),
            faltaMl: Math.max(0, meta - consumo),
        };
    }, [metaMl, consumoMl]);

    const adicionar = (ml = 500) =>
        setConsumoMl((prev) => Math.min(Number(metaMl) || prev, prev + ml));

    const historico = [
        { dia: 'Hoje', valor: 2500 },
        { dia: 'Ontem', valor: 2000 },
        { dia: 'Segunda', valor: 2400 },
        { dia: 'Domingo', valor: 3000 },
        { dia: 'Sábado', valor: 2800 },
    ];

    const toLitros = (ml) => `${(ml / 1000).toFixed(1)} L`;

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Seu Progresso</Text>

            <Text style={styles.metaLinha}>
                Sua meta hoje: <Text style={styles.metaStrong}>{toLitros(metaMl)}</Text>
            </Text>

            <View style={styles.centro}>
                {Circular ? (
                    <Circular
                        value={pct}
                        maxValue={100}
                        radius={70}
                        activeStrokeWidth={10}
                        inActiveStrokeWidth={10}
                        inActiveStrokeOpacity={0.15}
                        activeStrokeColor="#2B7DE9"
                        inActiveStrokeColor="#2B7DE9"
                        progressValueStyle={{ fontSize: 22, fontWeight: '800', color: '#1F2D3D' }}
                        valueSuffix="%"
                        title={`${toLitros(consumoMl)}\n de ${toLitros(metaMl)}`}
                        titleColor="#65758B"
                        titleStyle={{ fontSize: 12, lineHeight: 16, textAlign: 'center', marginTop: 6 }}
                        duration={800}
                    />
                ) : (
                    <View style={styles.fallbackCard}>
                        <Text style={styles.fallbackBig}>{toLitros(consumoMl)}</Text>
                        <Text style={styles.fallbackSmall}>de {toLitros(metaMl)} • {pct}%</Text>
                        <Text style={styles.fallbackHint}>
                            FOCO!
                        </Text>
                    </View>
                )}
            </View>

            <Text style={styles.mensagem}>Continue! Falta só {toLitros(faltaMl)}</Text>

            <TouchableOpacity style={styles.botao} onPress={() => adicionar(500)}>
                <Text style={styles.botaoTexto}>+ 500 ML</Text>
            </TouchableOpacity>

            <View style={styles.histCard}>
                <Text style={styles.histTitulo}>Histórico Diário</Text>
                <FlatList
                    data={historico}
                    keyExtractor={(item, idx) => `${item.dia}-${idx}`}
                    ItemSeparatorComponent={() => <View style={styles.sep} />}
                    renderItem={({ item }) => (
                        <View style={styles.histLinha}>
                            <Text style={styles.histDia}>{item.dia}</Text>
                            <Text style={styles.histValor}>{toLitros(item.valor)}</Text>
                        </View>
                    )}
                    scrollEnabled={false}
                />
            </View>
        </View>
    );
};

const AZUL = '#2B7DE9';
const FUNDO = '#F7FAFD';
const CARD_BG = '#FFFFFF';
const CARD_BORDER = '#E6EEF4';
const TEXTO = '#1F2D3D';
const TEXTO_2 = '#65758B';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: FUNDO,
        paddingHorizontal: 20,
        paddingTop: 16,

    },
    titulo: {
        fontSize: 24,
        fontWeight: '800',
        color: TEXTO,
        marginBottom: 12
    },
    metaLinha: {
        color: TEXTO_2,
        marginBottom: 8
    },
    metaStrong: {
        color: TEXTO,
        fontWeight: '700'
    },
    centro: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14
    },

    mensagem: {
        textAlign: 'center',
        color: TEXTO_2,
        marginTop: 6,
        marginBottom: 12
    },

    botao: {
        alignSelf: 'center',
        backgroundColor: '#5AB5FF',
        borderColor: AZUL,
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 22,
        minWidth: 140,
    },
    botaoTexto: {
        color: '#0C1B2A',
        fontWeight: '800',
        fontSize: 16,
        textAlign: 'center'
    },

    histCard: {
        backgroundColor: CARD_BG,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: CARD_BORDER,
        padding: 14,
        marginTop: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    histTitulo: {
        fontSize: 18,
        fontWeight: '800',
        color: TEXTO,
        marginBottom: 10
    },
    histLinha: {
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    histDia: {
        color: TEXTO,
        fontSize: 15
    },
    histValor: {
        color: TEXTO,
        fontWeight: '700',
        fontSize: 15
    },
    sep: {
        height: 1,
        backgroundColor: '#EEF5FA'
    },

    fallbackCard: {
        width: 180,
        height: 180,
        borderRadius: 100,
        borderWidth: 10,
        borderColor: 'rgba(43,125,233,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFDFF',
    },
    fallbackBig: {
        fontSize: 24,
        fontWeight: '800',
        color: TEXTO
    },
    fallbackSmall: {
        fontSize: 12,
        color: TEXTO_2,
        marginTop: 6
    },
    fallbackHint: {
        fontSize: 10,
        color: TEXTO_2,
        marginTop: 8,
        textAlign: 'center'
    },
});

export default HydrationProgress;
