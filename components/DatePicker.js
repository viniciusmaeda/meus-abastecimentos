import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ 
  label,
  value, 
  onChange,
  placeholderText = "Selecionar data",
  mode = "date",
  minimumDate,
  maximumDate,
  errorMessage,
}) => {
  const [show, setShow] = useState(false);

  const onDateChange = (event, selectedDate) => {
    // Fecha o picker no Android
    if (Platform.OS === 'android') {
      setShow(false);
    }

    // Se uma data foi selecionada, chama o callback onChange
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Renderiza o picker adequado para cada plataforma
  const renderDatePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.iosPickerContainer}>
          <DateTimePicker
            value={value || new Date()}
            mode={mode}
            display="spinner"
            onChange={onDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            locale="pt-BR"
            style={styles.iosPicker}
          />
          <TouchableOpacity 
            onPress={() => setShow(false)}
            style={styles.iosButton}
          >
            <Text style={styles.iosButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <DateTimePicker
        value={value || new Date()}
        mode={mode}
        display="default"
        onChange={onDateChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    );
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        onPress={() => setShow(true)} 
        style={[
          styles.input,
          errorMessage && styles.inputError
        ]}
      >
        <Text style={[
          styles.inputText,
          !value && styles.placeholder
        ]}>
          {value ? formatDate(value) : placeholderText}
        </Text>
      </TouchableOpacity>

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {show && renderDatePicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '60%',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#292d3e',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  inputText: {
    fontSize: 16,
    color: '#fff',
  },
  placeholder: {
    color: '#999',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  iosPickerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iosPicker: {
    height: 200,
  },
  iosButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  iosButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DatePicker;