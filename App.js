import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { 
  FontAwesome, 
  MaterialIcons, 
  MaterialCommunityIcons 
} from '@expo/vector-icons';

export default function App() {

  const data = [
    {
      id: 'oHGUWHcjAVAgm5UaHgF1',
      date: '11/11/2024',
      fuel: 'Gasolina',
      km: '185',
      liters: '16',
      autonomy: '11.56',
    },
    {
      id: 'O94aERXvK0wD3kR5xodL',
      date: '08/11/2024',
      fuel: 'Álcool',
      km: '215',
      liters: '18',
      autonomy: '11.94',
    },
  ]

  const [date, setDate] = useState('');
  const [fuel, setFuel] = useState('');
  const [km, setKm] = useState(null);
  const [liters, setLiters] = useState(null);
  const [fillingUps, setFillingUps] = useState(data);

  const saveFillUp = () => {
    fillUp = {
      date,
      fuel,
      km,
      liters,
      autonomy: (Number(km) / Number(liters)).toFixed(2),
    };

    data.push(fillUp);
    setFillingUps(data);

    clearFields();
  }

  const clearFields = () => {
    setDate('');
    setFuel('');
    setKm(null);
    setLiters(null);
  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.textTitle}>Controle de Abastecimento</Text>

      <View style={styles.containerInput}>
        <FontAwesome style={styles.icon} name="calendar" size={24} color="#fff" />
        <Text style={styles.textToInput}>Data</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder='dd/mm/aaaa'
          keyboardType='default'
          value={date}
          onChangeText={(v) => setDate(v)}
        />
      </View>

      <View style={styles.containerInput}>
        <MaterialIcons style={styles.icon} name="local-gas-station" size={24} color="#fff" />
        <Text style={styles.textToInput}>Combustível</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder='Gasolina ou Álcool'
          keyboardType='default'
          value={fuel}
          onChangeText={(v) => setFuel(v)}
        />
      </View>

      <View style={styles.containerInput}>
        <FontAwesome style={styles.icon} name="road" size={24} color="#fff" />
        <Text style={styles.textToInput}>Km</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder='Km'
          keyboardType='decimal-pad'
          value={km}
          onChangeText={(v) => setKm(v)}
        />
      </View>

      <View style={styles.containerInput}>
        <MaterialCommunityIcons style={styles.icon} name="hydraulic-oil-level" size={24} color="#fff" />
        <Text style={styles.textToInput}>Litros</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder='Litros'
          keyboardType='decimal-pad'
          value={liters}
          onChangeText={(v) => setLiters(v)}
        />
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => saveFillUp()}
      >
        <FontAwesome style={styles.icon} name="save" size={24} color="#000" />
        <Text style={styles.textButton}>Salvar</Text>
      </TouchableOpacity>

      <Text style={styles.textTitle}>Histórico de Apastecimento</Text>

      <FlatList 
        data={fillingUps}
        renderItem={({item}) => 
          <View style={styles.listItem}>
            <Text style={styles.item}>
              {item.date} - 
              {item.fuel} - 
              {Number(item.km).toFixed(2)} - 
              {Number(item.liters).toFixed(2)} - 
              {Number(item.autonomy).toFixed(2)}
            </Text>
          </View>
        }
        keyExtractor={(item) => item.id}
      />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
    padding: 8,
    paddingTop: 24,
  },
  textTitle: {
    fontSize: 24,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 20,
    color: '#fff',
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    paddingRight: 4,
  },
  textToInput: {
    width: 110,
    fontSize: 18,
    color: '#fff',
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 4,
    width: 220,
    fontSize: 18,
    color: '#fff',
  },
  button: {
    alignSelf:'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 16,
  },
  textButton: {
    fontSize: 18,
  },
  item: {
    color: '#fff',
  }
});
