import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

import DatePicker from './components/DatePicker';

import { 
  FontAwesome, 
  MaterialIcons, 
  MaterialCommunityIcons 
} from '@expo/vector-icons';

import {
  db, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  orderBy, 
  query, 
  doc 
} from './db/firestore';


export default function App() {

  // hooks utilizados no formulário
  const [date, setDate] = useState('');
  const [fuel, setFuel] = useState('');
  const [km, setKm] = useState(null);
  const [liters, setLiters] = useState(null);
  const [fillingUps, setFillingUps] = useState([]);

  // DropDownPicker
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
      {label: 'Gasolina', value: 'Gasolina'},
      {label: 'Álcool', value: 'Álcool'},
      {label: 'Diesel', value: 'Diesel'},
  ]);

  // Função para converter string de data DD/MM/YYYY para objeto Date
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(num => parseInt(num));
    return new Date(year, month - 1, day);
  };

  // Função para obter os dados do banco
  const getData = async () => {
    // realiza a consulta solicitando a ordenação por data
    const querySnapshot = await getDocs(
      query(
        collection(db, "fillingup"),
        orderBy('date', 'asc')
      )
    )

    // Array para armazenar os itens do banco
    const newFillingUps = [];

    // Para cada item da consulta, constrói o objeto e adiciona na lista
    querySnapshot.forEach((doc) => {
      fillUp = {
        id: doc.id,
        date: doc.data().date,
        fuel: doc.data().fuel,
        km: doc.data().km,
        liters: doc.data().liters,
        autonomy: doc.data().autonomy,
      };
      newFillingUps.push(fillUp);
      // console.log(`${doc.id} - ${doc.data().date} - ${doc.data().fuel} - ${doc.data().km} - ${doc.data().liters} - ${doc.data().autonomy}`);
    });

    newFillingUps.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA - dateB;  // Ordem crescente
      // Para ordem decrescente, use: return dateB - dateA
    });

    // Ao final, adiciona o array no hook
    setFillingUps(newFillingUps);
  }


  // Usado para realizar a primeira consulta, ao abrir o aplicativo
  useEffect(() => {
    getData();
  }, []);


  // coverte a data timestamp para string dd/mm/aaaa
  const dateToString = (fullDate) => {
    const data = new Date(fullDate);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses começam de 0
    const ano = data.getFullYear();
    
    const dataFormatada = `${dia}/${mes}/${ano}`;

    return dataFormatada;
    
  }


  // Função para salvar um novo item no banco
  const saveFillUp = async () => {
    try {
      const newFillUpRef = await addDoc(collection(db, "fillingup"), {
        date: dateToString(date),
        fuel,
        km,
        liters,
        autonomy: (Number(km) / Number(liters)).toFixed(1),
      });

      // Criar um novo objeto com o ID do documento recém-criado
      const newFillUp = {
        id: newFillUpRef.id,
        date: dateToString(date),
        fuel,
        km,
        liters,
        autonomy: (Number(km) / Number(liters)).toFixed(2),
      };



      // Atualizar o estado fillingUps com o novo item
      setFillingUps([...fillingUps, newFillUp].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA - dateB;  // Ordem crescente
        // Para ordem decrescente, use: return dateB - dateA
      }));
      
      // Limpar os campos do formulário
      clearFields();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }


  // Função para limpar os campos do formulário
  const clearFields = () => {
    setDate('');
    setFuel('');
    setKm(null);
    setLiters(null);
  }


  // Função para excluir o item do banco
  const deleteFillUp = (id) => {
    // Emite mensagem de confirmação para a exclusão
    Alert.alert(
      'Excluir item',
      'Você tem certeza que deseja excluir este item?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remover o documento do Firestore
              await deleteDoc(doc(db, "fillingup", id));
  
              // Atualizar o estado fillingUps removendo o item excluído
              setFillingUps(fillingUps.filter((item) => item.id !== id));
            } catch (error) {
              console.error("Erro ao excluir item:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.textTitle}>Controle de Abastecimento</Text>

      <View style={styles.containerInput}>
        <FontAwesome style={styles.icon} name="calendar" size={24} color="#fff" />
        <Text style={styles.textToInput}>Data</Text>
        <DatePicker
          value={date}
          onChange={setDate}
          placeholderText="Selecione a data"
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
        />
      </View>

      <View style={styles.containerInput}>
        <MaterialIcons style={styles.icon} name="local-gas-station" size={24} color="#fff" />
        <Text style={styles.textToInput}>Combustível</Text>
        <DropDownPicker
          style={styles.input}
          open={open}
          value={fuel}
          items={items}
          setOpen={setOpen}
          setValue={setFuel}
          setItems={setItems}
          theme="DARK"
          placeholder={'Selecione o combustível'}
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

      <Text style={styles.textTitle}>Histórico de Abastecimento</Text>


      <FlatList 
        data={fillingUps}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => 
          <View style={styles.listItem}>
            <Text style={styles.itemTextDate}>{item.date}</Text>
            <Text style={styles.itemTextFuel}>{item.fuel}</Text>
            <Text style={styles.itemTextKm}>{Number(item.km).toFixed(1)}</Text>
            <Text style={styles.itemTextLiters}>{Number(item.liters).toFixed(1)}</Text>
            <Text style={styles.itemTextAutonomy}>{Number(item.autonomy).toFixed(1)}</Text>
            <Pressable style={styles.itemIcon} onPress={() => deleteFillUp(item.id)}>
              <FontAwesome name="trash" size={16} color="#fff" />
            </Pressable>
          </View>
        }
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTextDate}>Data</Text>
            <Text style={styles.headerTextFuel}>Combustível</Text>
            <Text style={styles.headerTextKm}>Km</Text>
            <Text style={styles.headerTextLiters}>Litros</Text>
            <Text style={styles.headerTextAutonomy}>Autonomia</Text>
          </View>
        )}
      /> 


    </View>
  );
}

// obtém a largura a tela para ajustar as colunas
const screenWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292d3e',
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
    width:'100%',
  },
  icon: {
    paddingRight: 4,
  },
  textToInput: {
    width: '30%',
    fontSize: 18,
    color: '#fff',
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 4,
    width: '60%',
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
  listItem: {
    flexDirection: 'row',
  },
  itemTextDate: {
    color: '#fff',
    width: screenWidth*0.18,
    textAlign: 'center',
    paddingTop: 8,
    fontSize: 12,
  },
  itemTextFuel: {
    color: '#fff',
    width: screenWidth*0.25,
    textAlign: 'center',
    paddingTop: 8,
    fontSize: 12,
  },
  itemTextKm: {
    color: '#fff',
    width: screenWidth*0.10,
    textAlign: 'right',
    paddingTop: 8,
    fontSize: 12,
  },
  itemTextLiters: {
    color: '#fff',
    width: screenWidth*0.13,
    textAlign: 'right',
    paddingTop: 8,
    fontSize: 12,
  },
  itemTextAutonomy: {
    color: '#fff',
    width: screenWidth*0.18,
    textAlign: 'right',
    paddingTop: 8,
    marginRight: 25,
    fontSize: 12,
  },
  itemIcon: {
    paddingTop: 8,
  },



  headerContainer: {
    flexDirection: 'row'
  },
  headerTextDate: {
    color: '#fff',
    width: screenWidth*0.18,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
  },
  headerTextFuel: {
    color: '#fff',
    width: screenWidth*0.25,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
  },
  headerTextKm: {
    color: '#fff',
    width: screenWidth*0.10,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
  },
  headerTextLiters: {
    color: '#fff',
    width: screenWidth*0.18,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
  },
  headerTextAutonomy: {
    color: '#fff',
    width: screenWidth*0.17,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
  },
});
