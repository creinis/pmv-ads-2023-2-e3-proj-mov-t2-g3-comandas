import { BASE_URL, API_KEY, ADMIN_TOKEN } from '@env';
import COLORS from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';

import axios from 'axios';

function OrderList() {
    const [items, setItems] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        // Função para buscar itens da API
        const fetchItemsFromAPI = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}customer/${user.id}/order`,
                    {
                        headers: {
                            'x-api-key': API_KEY,
                            Authorization: ADMIN_TOKEN,
                        },
                    },
                );

                if (Array.isArray(response.data) && response.data.length > 0) {
                    // Check if the response data is an array with elements
                    setItems(response.data);
                } else {
                    // Handle the case where no data is returned or the data is an empty array
                    console.log('No data received from the API.');
                }
            } catch (error) {
                if (error?.response?.status === 404) {
                    console.log('Sem items');
                } else {
                    console.error('Erro ao buscar itens da API', error);
                }
            }
        };

        fetchItemsFromAPI();
    }, []);

    if (items.length === 0) {
        return (
            <View>
                <Text>Usuario nao possue items comprados</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Lista de items que o usuario comprou:</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Text>
                        {item.total} {item.note}
                    </Text>
                )}
            />
        </View>
    );
}

export default OrderList;

// function PedidosAcompanhamento() {
//     const { user } = useUser();
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View>
//       <Text  style={styles.profileName}>Pedidos - {user.name}  </Text>
//         <Text style={styles.profileName}>Dashboard de Compras do Usuário</Text>
//       </View>
//       <View>
//         <Text style={styles.profileText}>
//           Página destinada ao acompanhamento do status do pedido de compra do
//           usuário.
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// export default PedidosAcompanhamento;

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1, // Permite que o ScrollView cresça para preencher o espaço disponível
    },
    container: {
        paddingVertical: 20,
        flexGrow: 1,
    },
    profile: {
        backgroundColor: COLORS.white,
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: -20,
    },
    profileName: {
        marginTop: 20,
        marginHorizontal: 24,
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.linkTextGreen,
        textAlign: 'center',
    },
    profileText: {
        marginTop: 20,
        marginHorizontal: 24,
        fontSize: 17,
        fontWeight: '400',
        color: COLORS.placeholderText,
        textAlign: 'center',
    },
});