import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Menu from './Menu';

let Circular;
try {
    Circular = require('react-native-circular-progress-indicator').default;
} catch (e) {
    Circular = null;
}

/* Utils simples de data */
const todayKey = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`; // YYYY-MM-DD
};
const formatLabel = (iso, nowIso) => {
    const d = new Date(iso);
    const now = new Date(nowIso);
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = Math.floor((new Date(now.toDateString()) - new Date(d.toDateString())) / msPerDay);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    // Retorna dia da semana: Domingo...Sábado
    const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    return dias[d.getDay()];
};
const toLitros = (ml) => `${(ml / 1000).toFixed(1)} L`;

const STORAGE_KEY = '@agua-historico'; // objeto { 'YYYY-MM-DD': ml }

const HydrationProgress = () => {
    const [metaMl] = useState(2300);
    const [historicoMap, setHistoricoMap] = useState({});      // {dateISO: ml}
    const [hojeKey, setHojeKey] = useState(todayKey());
    const insets = useSafeAreaInsets();

    // Carrega do armazenamento
    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                const obj = raw ? JSON.parse(raw) : {};
                // Garante chave do dia atual
                const key = todayKey();
                setHojeKey(key);
                if (obj[key] == null) obj[key] = 0;
                setHistoricoMap(obj);
            } catch (e) {
                Alert.alert('Aviso', 'Não foi possível carregar o histórico.');
            }
        })();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(historicoMap)).catch(() => {});
    }, [historicoMap]);

    const consumoMl = historicoMap[hojeKey] || 0;

    const adicionar = useCallback((ml = 500) => {
        setHistoricoMap((prev) => {
            const key = todayKey();
            const atual = prev[key] || 0;
            return { ...prev, [key]: atual + ml }; // sem limite
        });
    }, []);

    const remover = useCallback((ml = 500) => {
        setHistoricoMap((prev) => {
            const key = todayKey();
            const atual = prev[key] || 0;
            const novo = Math.max(0, atual - ml); // evita negativos
            return { ...prev, [key]: novo };
        });
    }, []);

    // Gera lista para UI: últimos 5 dias, incluindo hoje
    const lista = useMemo(() => {
        const now = todayKey();
        const days = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const iso = `${d.getFullYear()}-${mm}-${dd}`;
            days.push({
                iso,
                label: formatLabel(iso, now),
                valor: historicoMap[iso] || 0,
            });
        }
        return days;
    }, [historicoMap]);

    const pctRaw = (consumoMl / Math.max(1, metaMl)) * 100;
    const pct = Math.min(100, Math.round(pctRaw));
    const faltaMl = Math.max(0, metaMl - consumoMl);
    const metaBatida = consumoMl >= metaMl;

    return (
        <View style={{ flex: 1, backgroundColor: FUNDO }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: 'height' })}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
                    <Text style={styles.titulo}>Seu Progresso</Text>



                    <View style={styles.centro}>
                        {Circular ? (
                            <Circular
                                value={pct}
                                maxValue={100}
                                radius={70}
                                activeStrokeWidth={10}
                                inActiveStrokeWidth={10}
                                inActiveStrokeOpacity={0.15}
                                activeStrokeColor={metaBatida ? '#22C55E' : '#2B7DE9'}
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
                                <Text style={styles.fallbackHint}>{ 'FOCO!'}</Text>
                            </View>
                        )}
                    </View>



                    <View style={styles.botoesLinha}>
                        <TouchableOpacity style={[styles.botao, styles.botaoMais]} onPress={() => adicionar(500)}>
                            <Text style={styles.botaoTexto}>+ 500 ML</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.botao, styles.botaoMenos]} onPress={() => remover(500)} disabled={consumoMl <= 0}>
                            <Text style={styles.botaoTexto}>- 500 ML</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.histCard}>
                        <Text style={styles.histTitulo}>Histórico Diário</Text>
                        <FlatList
                            data={lista}
                            keyExtractor={(item) => item.iso}
                            ItemSeparatorComponent={() => <View style={styles.sep} />}
                            renderItem={({ item }) => (
                                <View style={styles.histLinha}>
                                    <Text style={styles.histDia}>{item.label}</Text>
                                    <Text style={styles.histValor}>{toLitros(item.valor)}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                </ScrollView>

                <View style={{ paddingBottom: insets.bottom, backgroundColor: '#74bde0' }}>
                    <Menu />
                </View>
            </KeyboardAvoidingView>
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

    botoesLinha: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },

    botaoMais: {
        // opcional
    },
    botaoMenos: {
        backgroundColor: '#CDE9FF',
        borderColor: '#1B6FD8',
    },

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
        color: 'green',
        marginTop: 8,
        textAlign: 'center'
    },
});

export default HydrationProgress;
