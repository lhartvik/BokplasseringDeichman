import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  useColorScheme,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import {sok} from '../util/deichmanSok';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useAsyncStorage} from '../util/useAsyncStorage';
const Bokliste = () => {
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');

  const isDarkMode = useColorScheme() === 'dark';
  const [bookstore, saveBooks, clearBooks] = useAsyncStorage('books');

  const fetchData = async () => {
    if (searchText === '') return;
    if (bookstore.map(b => b.key).includes(searchText)) {
      setError('Boken er allerede i listen');
      return;
    }
    try {
      // Make an asynchronous call to retrieve the data
      const data = await sok(Number(searchText));
      if (!data) throw Error('Fant ikke boken på Bjørvika');
      if (data.available === 0)
        throw Error(
          'Ingen bøker er tilgjengelig' +
            (data.status ? ': ' + data.status : ''),
        );
      else {
        await saveBooks([...bookstore, data]);
      }
    } catch (e) {
      setError('Feilmelding : ' + e.message);
    }
  };

  const handleDelete = key =>
    bookstore.length === 1
      ? clearBooks()
      : saveBooks(() => bookstore.filter(book => book.key !== key));

  const renderItem = item => (
    <View
      key={item.key}
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        borderBottomColor: !isDarkMode ? Colors.black : Colors.white,
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}>
      <Text style={styles.bookTitle}>{item.tittel}</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Text>{item.locLabel + ' ' + item.shelfmark}</Text>
        </View>
        <Button title={'Slett'} onPress={() => handleDelete(item.key)} />
      </View>
    </View>
  );

  return (
    <View>
      <TextInput
        keyboardType={'numeric'}
        value={searchText}
        onBlur={fetchData}
        onChangeText={text => setSearchText(text)}
        placeholder="Skriv inn Tittelnummer"
      />
      <Button title="Search" onPress={fetchData} />
      <ScrollView>{bookstore && bookstore.map(renderItem)}</ScrollView>
      <Modal visible={error !== ''} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View
            style={{
              padding: 20,
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: isDarkMode ? Colors.white : Colors.black,
              }}>
              Feil
            </Text>
            <Text>{error}</Text>
            <View style={{marginTop: 20}}>
              <Button
                onPress={() => {
                  setError('');
                }}
                style={{marginTop: 20}}
                title={'Ok'}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  bookContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  bookDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
export default Bokliste;
